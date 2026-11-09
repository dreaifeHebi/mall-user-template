<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, Building2 } from '@lucide/vue'
import { fetchBrandInfoList, fetchBrandRecommendList } from '@/api/brand'
import type { Brand } from '@/types/api'
import { normalizeList } from '@/utils/api-data'

const brands = ref<Brand[]>([])
const loading = ref(false)
const error = ref('')

function brandImage(brand: Brand) {
  const logoUrl = typeof brand.logoUrl === 'string' ? brand.logoUrl : ''
  return brand.logo || brand.bigPic || logoUrl
}

async function load() {
  loading.value = true
  error.value = ''

  try {
    const infoResult = await fetchBrandInfoList()
    let list = normalizeList<Brand>(infoResult)

    if (!list.length) {
      const recommendResult = await fetchBrandRecommendList({ pageNum: 1, pageSize: 30 })
      list = normalizeList<Brand>(recommendResult)
    }

    brands.value = list
  } catch {
    brands.value = []
    error.value = 'Brands failed to load'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <section class="brand-list-page">
    <div class="page-heading">
      <div>
        <p>Brands</p>
        <h1>All Brands</h1>
      </div>
    </div>

    <div v-if="loading" class="loading-line">Loading...</div>
    <div v-else-if="error" class="loading-line">{{ error }}</div>
    <div v-else-if="!brands.length" class="simple-empty">
      <Building2 :size="36" />
      <strong>No brands yet</strong>
      <RouterLink class="primary-link" to="/products">View Products</RouterLink>
    </div>
    <div v-else class="brand-list-grid">
      <RouterLink v-for="brand in brands" :key="brand.id" class="brand-list-card" :to="`/brands/${brand.id}`">
        <img :src="brandImage(brand)" :alt="brand.name" />
        <div>
          <strong>{{ brand.name }}</strong>
          <span>{{ brand.subTitle || brand.brandStory || `${brand.productCount || 0} products` }}</span>
        </div>
        <ArrowRight :size="18" />
      </RouterLink>
    </div>
  </section>
</template>
