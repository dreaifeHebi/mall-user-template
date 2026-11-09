<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Heart, Minus, Plus, ShoppingCart } from '@lucide/vue'
import {
  createProductCollection,
  deleteProductCollection,
  productCollectionDetail
} from '@/api/memberProductCollection'
import { createReadHistory } from '@/api/memberReadHistory'
import { fetchProductDetail } from '@/api/product'
import { fallbackProducts } from '@/data/fallback'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import type { Brand, MemberProductInteraction, Product, ProductDetailPayload } from '@/types/api'
import { extractData, normalizeProduct, price } from '@/utils/api-data'
import { addSessionReadHistory } from '@/utils/session-history'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const auth = useAuthStore()
const product = ref<Product>(fallbackProducts[0])
const brand = ref<Brand | null>(null)
const quantity = ref(1)
const loading = ref(false)
const collected = ref(false)
const collectionBusy = ref(false)

const gallery = computed(() => {
  const pics = String(product.value.albumPics || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)

  return [product.value.pic, ...pics].filter(Boolean) as string[]
})

const categoryLabel = computed(() => product.value.productCategoryName || 'Category')
const brandLabel = computed(() => product.value.brandName || brand.value?.name || 'Brand')

const detailParagraphs = computed(() => {
  const candidates = [
    product.value.detailDesc,
    product.value.description,
    product.value.subTitle,
    htmlToText(product.value.detailHtml),
    htmlToText(product.value.detailMobileHtml)
  ]
    .map(value => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean)

  return [...new Set(candidates)]
})

function htmlToText(value: unknown) {
  if (typeof value !== 'string') {
    return ''
  }

  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function load() {
  loading.value = true

  try {
    const result = await fetchProductDetail(String(route.params.id))
    const data = extractData<ProductDetailPayload | Product>(result)
    const detailProduct = data && typeof data === 'object' && 'product' in data
      ? (data as ProductDetailPayload).product
      : data
    brand.value = data && typeof data === 'object' && 'brand' in data
      ? ((data as ProductDetailPayload).brand || null)
      : null
    const normalized = normalizeProduct(detailProduct)
    product.value = normalized || fallbackProducts[0]

    if (brand.value) {
      product.value = {
        ...product.value,
        brandId: product.value.brandId || brand.value.id,
        brandName: product.value.brandName || brand.value.name
      }
    }
  } catch {
    product.value =
      fallbackProducts.find(item => String(item.id) === String(route.params.id)) || fallbackProducts[0]
    brand.value = null
  } finally {
    loading.value = false
  }

  if (!auth.isLoggedIn) {
    addSessionReadHistory(product.value)
  }
  void syncMemberInteractions()
}

function addToCart() {
  cart.addProduct(product.value, quantity.value)
}

function interactionPayload(): MemberProductInteraction {
  return {
    productId: product.value.id,
    productName: product.value.name,
    productPic: product.value.pic,
    productSubTitle: product.value.subTitle,
    productPrice: product.value.price
  }
}

async function syncMemberInteractions() {
  if (!auth.isLoggedIn || !product.value.id) {
    collected.value = false
    return
  }

  await Promise.allSettled([
    createReadHistory(interactionPayload()),
    loadCollectionState()
  ])
}

async function loadCollectionState() {
  try {
    const result = await productCollectionDetail(product.value.id)
    collected.value = Boolean(result.data)
  } catch {
    collected.value = false
  }
}

async function toggleCollection() {
  if (!auth.isLoggedIn) {
    await router.push('/auth')
    return
  }

  collectionBusy.value = true

  try {
    if (collected.value) {
      await deleteProductCollection(product.value.id)
      collected.value = false
    } else {
      await createProductCollection(interactionPayload())
      collected.value = true
    }
  } finally {
    collectionBusy.value = false
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <section class="detail-page">
    <div class="detail-gallery">
      <img :src="gallery[0]" :alt="product.name" />
      <div class="gallery-strip">
        <img v-for="item in gallery.slice(0, 4)" :key="item" :src="item" :alt="product.name" />
      </div>
    </div>

    <div class="detail-info">
      <div class="detail-breadcrumb">
        <RouterLink
          v-if="product.productCategoryId"
          class="detail-breadcrumb-link"
          :to="{ path: '/products', query: { categoryId: product.productCategoryId } }"
        >
          {{ categoryLabel }}
        </RouterLink>
        <span v-else>{{ categoryLabel }}</span>
        <span>&gt;</span>
        <RouterLink
          v-if="product.brandId"
          class="detail-breadcrumb-link"
          :to="`/brands/${product.brandId}`"
        >
          {{ brandLabel }}
        </RouterLink>
        <span v-else>{{ brandLabel }}</span>
      </div>
      <h1>{{ product.name }}</h1>
      <p class="detail-subtitle">{{ product.subTitle || product.description }}</p>
      <strong class="detail-price">¥{{ price(product.price).toFixed(2) }}</strong>
      <div class="stock-row">
        <span>Stock {{ product.stock ?? '-' }}</span>
        <span>Sold {{ product.sale ?? 0 }}</span>
        <span v-if="loading">Updating</span>
      </div>

      <div class="quantity-control">
        <button class="icon-button" @click="quantity = Math.max(1, quantity - 1)">
          <Minus :size="18" />
        </button>
        <span>{{ quantity }}</span>
        <button class="icon-button" @click="quantity += 1">
          <Plus :size="18" />
        </button>
      </div>

      <button class="primary-button detail-action" @click="addToCart">
        <ShoppingCart :size="18" />
        Add to Cart
      </button>
      <button class="secondary-button detail-action" :disabled="collectionBusy" @click="toggleCollection">
        <Heart :size="18" :fill="collected ? 'currentColor' : 'none'" />
        {{ collected ? 'Favorited' : 'Favorite Product' }}
      </button>
    </div>

    <section class="detail-extra">
      <p class="eyebrow">Details</p>
      <h2>Product Notes</h2>
      <p v-for="paragraph in detailParagraphs" :key="paragraph">{{ paragraph }}</p>
      <p v-if="!detailParagraphs.length">
        This product uses template-ready catalog data with local imagery, category links, and brand links.
      </p>
    </section>
  </section>
</template>
