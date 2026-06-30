<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { CreditCard, PackageCheck, ReceiptText } from '@lucide/vue'
import { fetchOrderList } from '@/api/order'
import { useAuthStore } from '@/stores/auth'
import type { OrderDetail } from '@/types/api'
import { normalizeList, price } from '@/utils/api-data'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const orders = ref<OrderDetail[]>([])
const loading = ref(false)
const error = ref('')

const tabs = [
  { label: 'All', value: -1 },
  { label: 'Pending Payment', value: 0 },
  { label: 'Awaiting Shipment', value: 1 },
  { label: 'Shipped', value: 2 },
  { label: 'Completed', value: 3 },
  { label: 'Closed', value: 4 }
]

function statusFromQuery(value: unknown) {
  const rawValue = Array.isArray(value) ? value[0] : value
  const parsed = Number(rawValue)
  return tabs.some(tab => tab.value === parsed) ? parsed : -1
}

const activeStatus = ref(statusFromQuery(route.query.state))

const emptyText = computed(() => {
  const current = tabs.find(item => item.value === activeStatus.value)
  return current?.value === -1 ? 'No orders yet' : `No ${current?.label || ''} orders`
})

function statusText(status: unknown) {
  const map: Record<string, string> = {
    '0': 'Pending Payment',
    '1': 'Awaiting Shipment',
    '2': 'Shipped',
    '3': 'Completed',
    '4': 'Closed',
    '5': 'Invalid'
  }

  return map[String(status)] || 'Processing'
}

function statusClass(status: unknown) {
  const map: Record<string, string> = {
    '0': 'pending',
    '1': 'processing',
    '2': 'shipped',
    '3': 'completed',
    '4': 'closed',
    '5': 'closed'
  }

  return map[String(status)] || 'processing'
}

function itemSummary(order: OrderDetail) {
  const list = order.orderItemList || []
  if (!list.length) return 'No item details'
  const first = list[0]
  const suffix = list.length > 1 ? ` and ${list.length - 1} more item${list.length > 2 ? 's' : ''}` : ''
  return `${first.productName || 'Product'}${suffix}`
}

function previewItems(order: OrderDetail) {
  return (order.orderItemList || []).slice(0, 4)
}

async function load() {
  if (!auth.isLoggedIn) {
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await fetchOrderList({
      status: activeStatus.value,
      pageNum: 1,
      pageSize: 20
    })
    orders.value = normalizeList<OrderDetail>(result)
  } catch {
    orders.value = []
    error.value = 'Orders failed to load'
  } finally {
    loading.value = false
  }
}

function setStatus(value: number) {
  activeStatus.value = value
  void load()
}

onMounted(() => {
  void load()
})

watch(
  () => route.query.state,
  value => {
    activeStatus.value = statusFromQuery(value)
    void load()
  }
)
</script>

<template>
  <section class="orders-page">
    <div class="page-heading">
      <div>
        <p>Orders</p>
        <h1>Orders</h1>
      </div>
    </div>

    <div v-if="!auth.isLoggedIn" class="simple-empty">
      <ReceiptText :size="36" />
      <strong>Please sign in first</strong>
      <button class="primary-button" @click="router.push('/auth')">Sign In</button>
    </div>
    <template v-else>
      <div class="order-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          :class="{ active: activeStatus === tab.value }"
          @click="setStatus(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="loading" class="loading-line">Loading...</div>
      <div v-else-if="error" class="loading-line">{{ error }}</div>
      <div v-else-if="!orders.length" class="simple-empty">
        <PackageCheck :size="36" />
        <strong>{{ emptyText }}</strong>
        <RouterLink class="primary-link" to="/products">Browse Products</RouterLink>
      </div>
      <div v-else class="order-list">
        <article v-for="order in orders" :key="order.id" class="order-card">
          <RouterLink class="order-thumbnails" :to="`/orders/${order.id}`" aria-label="View order items">
            <span
              v-for="item in previewItems(order)"
              :key="item.id || item.productId"
              class="order-thumbnail"
            >
              <img :src="item.productPic || ''" :alt="item.productName || 'Product'" />
              <b>x{{ item.productQuantity || 0 }}</b>
            </span>
          </RouterLink>
          <RouterLink class="order-card-main" :to="`/orders/${order.id}`">
            <strong>{{ order.orderSn || order.id }}</strong>
            <span>{{ itemSummary(order) }}</span>
            <span>{{ order.createTime ? dayjs(order.createTime).format('YYYY-MM-DD HH:mm') : '-' }}</span>
          </RouterLink>
          <em class="order-status-badge" :class="statusClass(order.status)">{{ statusText(order.status) }}</em>
          <b>¥{{ price(order.payAmount ?? order.totalAmount).toFixed(2) }}</b>
          <RouterLink v-if="Number(order.status) === 0" class="primary-link order-card-action" :to="`/orders/${order.id}/pay`">
            <CreditCard :size="16" />
            Pay
          </RouterLink>
        </article>
      </div>
    </template>
  </section>
</template>
