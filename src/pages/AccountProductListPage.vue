<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { Heart, History, ShoppingBag, Star, Trash2 } from '@lucide/vue'
import {
  clearBrandAttention,
  deleteBrandAttention,
  fetchBrandAttentionList
} from '@/api/memberBrandAttention'
import {
  clearProductCollection,
  deleteProductCollection,
  fetchProductCollectionList
} from '@/api/memberProductCollection'
import { clearReadHistory, deleteReadHistory, fetchReadHistoryList } from '@/api/memberReadHistory'
import { useAuthStore } from '@/stores/auth'
import type { MemberBrandAttention, MemberProductInteraction } from '@/types/api'
import { normalizeList, price } from '@/utils/api-data'
import {
  clearSessionReadHistory,
  listSessionReadHistory,
  removeSessionReadHistory
} from '@/utils/session-history'

type AccountListMode = 'collections' | 'history' | 'brands'
type AccountListRow = MemberProductInteraction | MemberBrandAttention

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const rows = ref<AccountListRow[]>([])
const pageNum = ref(1)
const pageSize = 12
const loading = ref(false)
const hasMore = ref(true)
const error = ref('')

const mode = computed<AccountListMode>(() => {
  if (route.name === 'read-history') return 'history'
  if (route.name === 'brand-attentions') return 'brands'
  return 'collections'
})
const title = computed(() => {
  if (mode.value === 'history') return 'History'
  if (mode.value === 'brands') return 'Following'
  return 'Favorites'
})
const eyebrow = computed(() => {
  if (mode.value === 'history') return 'History'
  if (mode.value === 'brands') return 'Brands'
  return 'Favorites'
})
const emptyText = computed(() => {
  if (mode.value === 'history') return 'No browsing history yet'
  if (mode.value === 'brands') return 'No followed brands yet'
  return 'No favorite products yet'
})

function isBrandRow(item: AccountListRow): item is MemberBrandAttention {
  return 'brandId' in item
}

async function load(reset = false) {
  if (!auth.isLoggedIn) {
    if (mode.value === 'history') {
      rows.value = listSessionReadHistory()
      hasMore.value = false
    }
    return
  }

  if (reset) {
    pageNum.value = 1
    rows.value = []
    hasMore.value = true
  }

  if (!hasMore.value || loading.value) {
    return
  }

  loading.value = true
  error.value = ''

  try {
    const params = { pageNum: pageNum.value, pageSize }
    let result

    if (mode.value === 'history') {
      result = await fetchReadHistoryList(params)
    } else if (mode.value === 'brands') {
      result = await fetchBrandAttentionList(params)
    } else {
      result = await fetchProductCollectionList(params)
    }

    const list = normalizeList<AccountListRow>(result)
    rows.value = rows.value.concat(list)
    hasMore.value = list.length >= pageSize
    pageNum.value += 1
  } catch {
    error.value = 'List failed to load'
  } finally {
    loading.value = false
  }
}

async function clearAll() {
  if (!rows.value.length || !window.confirm(`Clear ${title.value}?`)) {
    return
  }

  if (!auth.isLoggedIn && mode.value === 'history') {
    clearSessionReadHistory()
  } else if (mode.value === 'history') {
    await clearReadHistory()
  } else if (mode.value === 'brands') {
    await clearBrandAttention()
  } else {
    await clearProductCollection()
  }

  await load(true)
}

async function removeItem(item: AccountListRow) {
  if (!window.confirm(mode.value === 'brands' ? 'Unfollow this brand?' : 'Remove this product?')) {
    return
  }

  if (!auth.isLoggedIn && mode.value === 'history' && !isBrandRow(item)) {
    removeSessionReadHistory(item.productId)
  } else if (mode.value === 'history') {
    if (!item.id) return
    await deleteReadHistory([item.id])
  } else if (isBrandRow(item)) {
    await deleteBrandAttention(item.brandId)
  } else {
    await deleteProductCollection(item.productId)
  }

  rows.value = rows.value.filter(row => row !== item)
}

watch(mode, () => {
  void load(true)
})

onMounted(() => {
  void load(true)
})
</script>

<template>
  <section class="account-product-page">
    <div class="page-heading">
      <div>
        <p>{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
      </div>
      <button v-if="rows.length && (auth.isLoggedIn || mode === 'history')" class="text-button" @click="clearAll">
        <Trash2 :size="18" />
        Clear
      </button>
    </div>

    <div v-if="!auth.isLoggedIn && mode !== 'history'" class="simple-empty">
      <ShoppingBag :size="36" />
      <strong>Please sign in first</strong>
      <button class="primary-button" @click="router.push('/auth')">Sign In</button>
    </div>
    <div v-else-if="error" class="loading-line">{{ error }}</div>
    <div v-else-if="!rows.length && !loading" class="simple-empty">
      <History v-if="mode === 'history'" :size="36" />
      <Star v-else-if="mode === 'brands'" :size="36" />
      <Heart v-else :size="36" />
      <strong>{{ emptyText }}</strong>
      <RouterLink class="primary-link" to="/products">Browse Products</RouterLink>
    </div>
    <div v-else class="account-product-list">
      <article
        v-for="item in rows"
        :key="`${item.id || (isBrandRow(item) ? item.brandId : item.productId)}`"
        class="account-product-card"
      >
        <RouterLink
          v-if="isBrandRow(item)"
          class="list-product-media"
          :to="`/brands/${item.brandId}`"
        >
          <img :src="item.brandLogo || ''" :alt="item.brandName" />
        </RouterLink>
        <RouterLink v-else class="list-product-media" :to="`/products/${item.productId}`">
          <img :src="item.productPic || ''" :alt="item.productName" />
        </RouterLink>

        <div class="list-product-body">
          <RouterLink
            v-if="isBrandRow(item)"
            class="product-name"
            :to="`/brands/${item.brandId}`"
          >
            {{ item.brandName }}
          </RouterLink>
          <RouterLink v-else class="product-name" :to="`/products/${item.productId}`">
            {{ item.productName }}
          </RouterLink>
          <p>{{ isBrandRow(item) ? item.brandCity || 'Followed brand' : item.productSubTitle || 'Featured product' }}</p>
          <div class="product-row">
            <strong v-if="isBrandRow(item)">Brand</strong>
            <strong v-else>¥{{ price(item.productPrice).toFixed(2) }}</strong>
            <span v-if="item.createTime" class="muted">
              {{ dayjs(item.createTime).format('YYYY-MM-DD HH:mm') }}
            </span>
          </div>
        </div>

        <button class="icon-button danger-action" title="Remove" @click="removeItem(item)">
          <Trash2 :size="17" />
        </button>
      </article>

      <button v-if="hasMore" class="primary-button load-more-button" :disabled="loading" @click="load()">
        {{ loading ? 'Loading...' : 'Load More' }}
      </button>
      <div v-else class="loading-line">No more items</div>
    </div>
  </section>
</template>
