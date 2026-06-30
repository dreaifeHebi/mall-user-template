<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SlidersHorizontal } from '@lucide/vue'
import { fetchProductList, searchProductList } from '@/api/product'
import ProductCard from '@/components/ProductCard.vue'
import { fallbackProducts } from '@/data/fallback'
import type { Product } from '@/types/api'
import { normalizeList } from '@/utils/api-data'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const products = ref<Product[]>([])
const sort = ref('sale')
const order = ref('desc')

const routeMode = computed(() => String(route.meta.productMode || 'catalog'))
const keyword = computed(() => String(route.query.keyword || ''))
const categoryId = computed(() => String(route.query.categoryId || ''))
const brandId = computed(() => String(route.query.brandId || ''))
const heading = computed(() => {
  if (routeMode.value === 'new') return { eyebrow: 'New', title: 'New Arrivals' }
  if (routeMode.value === 'hot') return { eyebrow: 'Hot', title: 'Popular Picks' }
  return { eyebrow: 'Catalog', title: 'Products' }
})
const isEmpty = computed(() => !loading.value && !products.value.length)

function fallbackList() {
  const keywordValue = keyword.value.toLowerCase()

  return fallbackProducts.filter(product => {
    const matchesKeyword = !keywordValue || product.name.toLowerCase().includes(keywordValue)
    const matchesCategory = !categoryId.value || String(product.productCategoryId) === categoryId.value
    const matchesBrand = !brandId.value || String(product.brandId) === brandId.value

    return matchesKeyword && matchesCategory && matchesBrand
  })
}

function resetSortForMode() {
  if (routeMode.value === 'new') {
    sort.value = 'create_time'
    order.value = 'desc'
    return
  }

  if (routeMode.value === 'hot') {
    sort.value = 'sale'
    order.value = 'desc'
  }
}

async function load() {
  loading.value = true

  try {
    const params = {
      pageNum: 1,
      pageSize: 24,
      keyword: keyword.value || undefined,
      productCategoryId: categoryId.value || undefined,
      brandId: brandId.value || undefined,
      sort: sort.value,
      order: order.value
    }
    const result = keyword.value ? await searchProductList(params) : await fetchProductList(params)
    const list = normalizeList<Product>(result)
    products.value = list
  } catch {
    products.value = fallbackList()
  } finally {
    loading.value = false
  }
}

function setSort(value: string) {
  sort.value = value
  order.value = value === 'price' ? 'asc' : 'desc'
  void load()
}

function clearFilter() {
  router.push('/products')
}

watch([keyword, categoryId, brandId, routeMode], () => {
  resetSortForMode()
  void load()
})

onMounted(() => {
  resetSortForMode()
  void load()
})
</script>

<template>
  <section class="catalog-page">
    <div class="page-heading">
      <div>
        <p>{{ heading.eyebrow }}</p>
        <h1>{{ heading.title }}</h1>
      </div>
      <button v-if="keyword || categoryId || brandId" class="text-button" @click="clearFilter">
        Clear Filters
      </button>
    </div>

    <div class="catalog-toolbar">
      <span><SlidersHorizontal :size="18" /> Sort</span>
      <button :class="{ active: sort === 'sale' }" @click="setSort('sale')">Sales</button>
      <button :class="{ active: sort === 'price' }" @click="setSort('price')">Price</button>
      <button :class="{ active: sort === 'create_time' }" @click="setSort('create_time')">New</button>
    </div>

    <div v-if="loading" class="loading-line">Loading...</div>
    <div v-else-if="isEmpty" class="simple-empty catalog-empty">
      <strong>No products found</strong>
      <span>Try a different category, brand, or search keyword.</span>
    </div>
    <div v-else class="product-grid">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </section>
</template>
