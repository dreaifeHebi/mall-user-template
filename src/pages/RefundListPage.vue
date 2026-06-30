<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { ArrowRight, ReceiptText, RefreshCw, RotateCcw, XCircle } from '@lucide/vue'
import { cancelRefund, fetchRefundList } from '@/api/refund'
import { useAuthStore } from '@/stores/auth'
import type { RefundRequest } from '@/types/api'
import { extractData, normalizeList, price } from '@/utils/api-data'

const router = useRouter()
const auth = useAuthStore()

const refunds = ref<RefundRequest[]>([])
const activeStatus = ref('')
const pageNum = ref(1)
const pageSize = 10
const hasMore = ref(false)
const loading = ref(false)
const actionBusyId = ref<string | number | null>(null)
const error = ref('')

const tabs = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'PENDING_AUDIT' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Succeeded', value: 'SUCCESS' },
  { label: 'Closed', value: 'CANCELLED' }
]

const emptyText = computed(() => {
  const current = tabs.find(item => item.value === activeStatus.value)
  return current?.value ? `No ${current.label.toLowerCase()} refunds` : 'No refund records'
})

function statusText(value: unknown) {
  const map: Record<string, string> = {
    PENDING_AUDIT: 'Pending Review',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    PROCESSING: 'Processing',
    SUCCESS: 'Refunded',
    FAILED: 'Failed',
    CANCELLED: 'Cancelled'
  }

  return map[String(value)] || 'Processing'
}

function statusClass(value: unknown) {
  return `refund-status-${String(value || 'UNKNOWN').toLowerCase()}`
}

function formatDate(value: unknown) {
  return value ? dayjs(String(value)).format('YYYY-MM-DD HH:mm') : '-'
}

async function load(reset = false) {
  if (!auth.isLoggedIn || loading.value) {
    return
  }

  if (reset) {
    pageNum.value = 1
    refunds.value = []
  }

  loading.value = true
  error.value = ''

  try {
    const result = await fetchRefundList({
      status: activeStatus.value || undefined,
      pageNum: pageNum.value,
      pageSize
    })
    const list = normalizeList<RefundRequest>(result)
    const data = extractData<Record<string, unknown>>(result)
    refunds.value = reset ? list : [...refunds.value, ...list]
    const total = Number(data?.total ?? refunds.value.length)
    hasMore.value = refunds.value.length < total || list.length === pageSize
    pageNum.value += 1
  } catch {
    error.value = 'Refund list failed to load'
  } finally {
    loading.value = false
  }
}

function setStatus(value: string) {
  activeStatus.value = value
  void load(true)
}

async function cancel(id: number | string | undefined) {
  if (!id || actionBusyId.value) {
    return
  }

  if (!window.confirm('Cancel this refund request?')) {
    return
  }

  actionBusyId.value = id
  error.value = ''

  try {
    await cancelRefund(id)
    await load(true)
  } catch {
    error.value = 'Refund cancellation failed'
  } finally {
    actionBusyId.value = null
  }
}

onMounted(() => {
  void load(true)
})
</script>

<template>
  <section class="refund-page">
    <div class="page-heading">
      <div>
        <p>Refunds</p>
        <h1>Refunds</h1>
      </div>
      <RouterLink class="text-button" to="/account">
        <ArrowRight :size="18" />
        Account
      </RouterLink>
    </div>

    <div v-if="!auth.isLoggedIn" class="simple-empty">
      <ReceiptText :size="36" />
      <strong>Please sign in first</strong>
      <button class="primary-button" @click="router.push('/auth')">Sign In</button>
    </div>
    <template v-else>
      <div class="refund-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          :class="{ active: activeStatus === tab.value }"
          @click="setStatus(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="loading && !refunds.length" class="loading-line">Loading...</div>
      <div v-else-if="error" class="loading-line">{{ error }}</div>
      <div v-else-if="!refunds.length" class="simple-empty">
        <RotateCcw :size="36" />
        <strong>{{ emptyText }}</strong>
        <RouterLink class="primary-link" to="/orders">View Orders</RouterLink>
      </div>

      <div v-else class="refund-list">
        <article v-for="item in refunds" :key="item.id" class="refund-card">
          <RouterLink class="refund-card-main" :to="`/refunds/${item.id}`">
            <div>
              <strong>{{ item.refundSn || item.id }}</strong>
              <span>{{ item.orderSn }}</span>
            </div>
            <b>¥{{ price(item.refundAmount).toFixed(2) }}</b>
            <em :class="statusClass(item.status)">{{ statusText(item.status) }}</em>
            <small>{{ formatDate(item.applyTime || item.createTime) }}</small>
          </RouterLink>
          <button
            v-if="item.status === 'PENDING_AUDIT'"
            class="secondary-button danger-button refund-card-action"
            :disabled="actionBusyId === item.id"
            @click="cancel(item.id)"
          >
            <XCircle :size="16" />
            Cancel
          </button>
        </article>
      </div>

      <button v-if="hasMore && refunds.length" class="secondary-button load-more-button" :disabled="loading" @click="load(false)">
        <RefreshCw :size="16" />
        {{ loading ? 'Loading...' : 'Load More' }}
      </button>
    </template>
  </section>
</template>
