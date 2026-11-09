<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, PackageSearch, Star, Store } from '@lucide/vue'
import { fetchBrandDetail, fetchBrandProductList } from '@/api/brand'
import {
  brandAttentionDetail,
  createBrandAttention,
  deleteBrandAttention
} from '@/api/memberBrandAttention'
import ProductCard from '@/components/ProductCard.vue'
import { useAuthStore } from '@/stores/auth'
import type { Brand, MemberBrandAttention, Product } from '@/types/api'
import { extractData, normalizeList } from '@/utils/api-data'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const brand = ref<Brand | null>(null)
const products = ref<Product[]>([])
const loading = ref(false)
const productLoading = ref(false)
const error = ref('')
const pageNum = ref(1)
const pageSize = 8
const hasMore = ref(false)
const followed = ref(false)
const followBusy = ref(false)

const brandId = computed(() => String(route.params.id || ''))
const heroImage = computed(() => brand.value?.bigPic || brand.value?.logo || '')
const brandTitle = computed(() => brand.value?.name || 'Brand Details')

function brandPayload(): MemberBrandAttention | null {
  if (!brand.value) {
    return null
  }

  return {
    brandId: brand.value.id,
    brandName: brand.value.name,
    brandLogo: brand.value.logo,
    brandCity: brand.value.subTitle || ''
  }
}

async function loadBrand() {
  if (!brandId.value) {
    error.value = 'Brand not found'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await fetchBrandDetail(brandId.value)
    const data = extractData<Brand | null>(result)
    if (!data || !data.id) {
      error.value = 'Brand not found'
      brand.value = null
      return
    }
    brand.value = data
  } catch {
    error.value = 'Brand failed to load'
    brand.value = null
  } finally {
    loading.value = false
  }
}

async function loadProducts(refresh = false) {
  if (!brandId.value) {
    return
  }

  if (refresh) {
    pageNum.value = 1
    products.value = []
    hasMore.value = false
  }

  productLoading.value = true

  try {
    const result = await fetchBrandProductList({
      brandId: brandId.value,
      pageNum: pageNum.value,
      pageSize
    })
    const list = normalizeList<Product>(result)
    products.value = refresh ? list : products.value.concat(list)
    hasMore.value = list.length === pageSize
  } catch {
    hasMore.value = false
  } finally {
    productLoading.value = false
  }
}

async function loadFollowState() {
  if (!auth.isLoggedIn || !brandId.value) {
    followed.value = false
    return
  }

  try {
    const result = await brandAttentionDetail(brandId.value)
    followed.value = Boolean(result.data)
  } catch {
    followed.value = false
  }
}

async function toggleFollow() {
  if (!auth.isLoggedIn) {
    await router.push('/auth')
    return
  }

  const payload = brandPayload()
  if (!payload) {
    return
  }

  followBusy.value = true

  try {
    if (followed.value) {
      await deleteBrandAttention(payload.brandId)
      followed.value = false
    } else {
      await createBrandAttention(payload)
      followed.value = true
    }
  } finally {
    followBusy.value = false
  }
}

async function loadMore() {
  if (productLoading.value || !hasMore.value) {
    return
  }
  pageNum.value += 1
  await loadProducts(false)
}

async function loadAll() {
  await loadBrand()
  await Promise.allSettled([loadProducts(true), loadFollowState()])
}

watch(brandId, () => {
  void loadAll()
})

onMounted(() => {
  void loadAll()
})
</script>

<template>
  <section class="brand-detail-page">
    <button class="text-button" @click="router.back()">
      <ArrowLeft :size="18" />
      Back
    </button>

    <div v-if="error" class="simple-empty">
      <Store :size="38" />
      <strong>{{ error }}</strong>
      <RouterLink class="primary-link" to="/products">View Products</RouterLink>
    </div>

    <template v-else>
      <section class="brand-hero" :style="heroImage ? { backgroundImage: `url(${heroImage})` } : undefined">
        <div class="brand-hero-content">
          <img v-if="brand?.logo" class="brand-logo" :src="brand.logo" :alt="brandTitle" />
          <div>
            <p>Brand</p>
            <h1>{{ brandTitle }}</h1>
            <span v-if="brand?.firstLetter">Brand initial {{ brand.firstLetter }}</span>
          </div>
        </div>
      </section>

      <section class="brand-overview">
        <div class="brand-story-panel">
          <div class="section-title">
            <div>
              <p>Story</p>
              <h2>Brand Story</h2>
            </div>
          </div>
          <p>{{ brand?.brandStory || brand?.subTitle || 'No brand description yet' }}</p>
        </div>

        <aside class="brand-action-panel">
          <strong>{{ brandTitle }}</strong>
          <span>{{ brand?.subTitle || 'Featured Brand' }}</span>
          <button class="secondary-button" :disabled="followBusy || loading" @click="toggleFollow">
            <Star :size="18" :fill="followed ? 'currentColor' : 'none'" />
            {{ followed ? 'Following Brand' : 'Follow Brand' }}
          </button>
          <RouterLink class="primary-link" :to="{ path: '/products', query: { brandId } }">
            View All Products
            <ArrowRight :size="18" />
          </RouterLink>
        </aside>
      </section>

      <section class="section-block">
        <div class="section-title">
          <div>
            <p>Products</p>
            <h2>Related Products</h2>
          </div>
          <span v-if="productLoading" class="muted">Loading...</span>
        </div>

        <div v-if="!products.length && !productLoading" class="simple-empty">
          <PackageSearch :size="38" />
          <strong>No related products</strong>
        </div>
        <div v-else class="product-grid">
          <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>

        <button v-if="hasMore" class="primary-button load-more-button" :disabled="productLoading" @click="loadMore">
          {{ productLoading ? 'Loading...' : 'Load More' }}
        </button>
      </section>
    </template>
  </section>
</template>
