<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchCategoryTreeList } from '@/api/product'
import { fallbackCategories } from '@/data/fallback'
import type { Category } from '@/types/api'
import { normalizeList } from '@/utils/api-data'

const categories = ref<Category[]>(fallbackCategories)

async function load() {
  try {
    const result = await fetchCategoryTreeList()
    const list = normalizeList<Category>(result)
    categories.value = list.length ? list : fallbackCategories
  } catch {
    categories.value = fallbackCategories
  }
}

function imageOf(category: Category) {
  return category.imageUrl || category.icon || ''
}

onMounted(() => {
  void load()
})
</script>

<template>
  <section class="category-page">
    <div class="page-heading">
      <div>
        <p>Category</p>
        <h1>Product Categories</h1>
      </div>
    </div>

    <div class="category-list">
      <RouterLink
        v-for="category in categories"
        :key="category.id"
        class="category-row"
        :to="{ path: '/products', query: { categoryId: category.id } }"
      >
        <img :src="imageOf(category)" :alt="category.name" />
        <div>
          <strong>{{ category.name }}</strong>
          <span>{{ category.productCount || 0 }} products</span>
        </div>
      </RouterLink>
    </div>
  </section>
</template>
