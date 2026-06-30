<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowRight, Sparkles } from '@lucide/vue'
import { fetchHomeContent, fetchProductCateList } from '@/api/home'
import { fetchProductList } from '@/api/product'
import ProductCard from '@/components/ProductCard.vue'
import { fallbackBanners, fallbackCategories, fallbackProducts } from '@/data/fallback'
import type { Banner, Brand, Category, Product } from '@/types/api'
import { extractData, normalizeList } from '@/utils/api-data'

const banners = ref<Banner[]>(fallbackBanners)
const categories = ref<Category[]>(fallbackCategories)
const brands = ref<Brand[]>([])
const products = ref<Product[]>(fallbackProducts)
const loading = ref(false)

function imageOf(item: Banner | Category) {
  const image = 'pic' in item ? item.pic : item.imageUrl || item.icon
  return typeof image === 'string' ? image : ''
}

function brandImage(item: Brand) {
  return item.logo || item.bigPic || ''
}

function totalFromProductResult(result: unknown) {
  const data = extractData<Record<string, unknown> | Product[]>(result)

  if (Array.isArray(data)) {
    return data.length
  }

  if (!data || typeof data !== 'object') {
    return 0
  }

  const total = Number(data.total ?? data.totalElements ?? data.totalCount)
  if (Number.isFinite(total)) {
    return total
  }

  return normalizeList<Product>(result).length
}

async function withLiveCategoryCounts(items: Category[]) {
  return Promise.all(
    items.map(async category => {
      try {
        const result = await fetchProductList({
          pageNum: 1,
          pageSize: 1,
          productCategoryId: category.id,
          sort: 'sale',
          order: 'desc'
        })

        return {
          ...category,
          productCount: totalFromProductResult(result)
        }
      } catch {
        return category
      }
    })
  )
}

async function load() {
  loading.value = true

  try {
    const result = await fetchHomeContent()
    const content = extractData<Record<string, unknown>>(result)
    banners.value = ((content.advertiseList || content.bannerList) as Banner[]) || fallbackBanners
    brands.value = (content.brandList as Brand[]) || []
    products.value =
      ((content.recommendProductList || content.hotProductList || content.newProductList) as Product[]) ||
      fallbackProducts

    const categoryResult = await fetchProductCateList(0)
    const categoryList = normalizeList<Category>(categoryResult)
    const loadedCategories = categoryList.length
      ? categoryList
      : ((content.productCateList as Category[]) || fallbackCategories)
    categories.value = await withLiveCategoryCounts(loadedCategories)
  } catch {
    banners.value = fallbackBanners
    categories.value = await withLiveCategoryCounts(fallbackCategories)
    brands.value = []
    products.value = fallbackProducts
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <section class="home-page">
    <div class="hero" :style="{ backgroundImage: `url(${imageOf(banners[0])})` }">
      <div class="hero-content">
        <span><Sparkles :size="16" /> New Collection</span>
        <h1>{{ banners[0]?.name || banners[0]?.title || 'Mall Storefront' }}</h1>
        <RouterLink class="primary-link" to="/products">
          Shop Now
          <ArrowRight :size="18" />
        </RouterLink>
      </div>
    </div>

    <section class="section-block">
      <div class="section-title">
        <div>
          <p>Category</p>
          <h2>Popular Categories</h2>
        </div>
        <RouterLink to="/categories">View All</RouterLink>
      </div>

      <div class="category-grid">
        <RouterLink
          v-for="category in categories"
          :key="category.id"
          class="category-tile"
          :to="{ path: '/products', query: { categoryId: category.id } }"
        >
          <img :src="imageOf(category)" :alt="category.name" />
          <strong>{{ category.name }}</strong>
          <span>{{ category.productCount || 0 }} products</span>
        </RouterLink>
      </div>
    </section>

    <section v-if="brands.length" class="section-block">
      <div class="section-title">
        <div>
          <p>Brand</p>
          <h2>Recommended Brands</h2>
        </div>
        <RouterLink to="/brands">View All</RouterLink>
      </div>

      <div class="home-brand-grid">
        <RouterLink v-for="brand in brands" :key="brand.id" class="home-brand-card" to="/brands">
          <img :src="brandImage(brand)" :alt="brand.name" />
          <strong>{{ brand.name }}</strong>
          <span>{{ brand.subTitle || `${brand.productCount || 0} products` }}</span>
        </RouterLink>
      </div>
    </section>

    <section class="section-block">
      <div class="section-title">
        <div>
          <p>Products</p>
          <h2>Featured Products</h2>
        </div>
        <span v-if="loading" class="muted">Loading...</span>
        <RouterLink v-else to="/products/hot">More Products</RouterLink>
      </div>

      <div class="product-grid">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
    </section>
  </section>
</template>
