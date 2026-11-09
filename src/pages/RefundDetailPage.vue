<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { ArrowLeft, CheckCircle2, ReceiptText, RefreshCw, RotateCcw, XCircle } from '@lucide/vue'
import { cancelRefund, fetchRefundDetail, queryRefundStatus } from '@/api/refund'
import { useAuthStore } from '@/stores/auth'
import type { RefundRequest } from '@/types/api'
import { extractData, price } from '@/utils/api-data'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const refund = ref<RefundRequest | null>(null)
const loading = ref(false)
const actionBusy = ref(false)
const error = ref('')

const refundId = computed(() => String(route.params.id || ''))
const canCancel = computed(() => refund.value?.status === 'PENDING_AUDIT')

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

function statusDesc(value: unknown) {
  const map: Record<string, string> = {
    PENDING_AUDIT: 'The refund request is waiting for admin review.',
    APPROVED: 'The refund request has been approved and is waiting for processing.',
    REJECTED: 'The refund request was rejected. Check the review note.',
    PROCESSING: 'The refund is being processed.',
    SUCCESS: 'The refund has been completed.',
    FAILED: 'Refund processing failed. Check the note or contact support.',
    CANCELLED: 'The refund request was cancelled.'
  }

  return map[String(value)] || 'Status is being processed.'
}

function formatDate(value: unknown) {
  return value ? dayjs(String(value)).format('YYYY-MM-DD HH:mm') : '-'
}

async function load(useStatus = false) {
  if (!auth.isLoggedIn) {
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = useStatus ? await queryRefundStatus(refundId.value) : await fetchRefundDetail(refundId.value)
    refund.value = extractData<RefundRequest>(result)
  } catch {
    error.value = 'Refund details failed to load'
  } finally {
    loading.value = false
  }
}

async function cancel() {
  if (!refund.value?.id || actionBusy.value || !canCancel.value) {
    return
  }

  if (!window.confirm('Cancel this refund request?')) {
    return
  }

  actionBusy.value = true
  error.value = ''

  try {
    await cancelRefund(refund.value.id)
    await load()
  } catch {
    error.value = 'Refund cancellation failed'
  } finally {
    actionBusy.value = false
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <section class="refund-page">
    <div class="page-heading">
      <div>
        <p>Refund</p>
        <h1>Refund Details</h1>
      </div>
      <RouterLink class="text-button" to="/refunds">
        <ArrowLeft :size="18" />
        Back to Refunds
      </RouterLink>
    </div>

    <div v-if="!auth.isLoggedIn" class="simple-empty">
      <ReceiptText :size="36" />
      <strong>Please sign in first</strong>
      <button class="primary-button" @click="router.push('/auth')">Sign In</button>
    </div>
    <div v-else-if="loading && !refund" class="loading-line">Loading...</div>
    <div v-else-if="error && !refund" class="loading-line">{{ error }}</div>
    <div v-else-if="!refund" class="simple-empty">
      <RotateCcw :size="36" />
      <strong>Refund request not found</strong>
    </div>
    <template v-else>
      <section class="refund-status-panel" :class="`refund-status-${String(refund.status || '').toLowerCase()}`">
        <CheckCircle2 v-if="refund.status === 'SUCCESS' || refund.status === 'APPROVED'" :size="34" />
        <XCircle v-else-if="refund.status === 'FAILED' || refund.status === 'REJECTED' || refund.status === 'CANCELLED'" :size="34" />
        <RefreshCw v-else :size="34" />
        <div>
          <span>Current Status</span>
          <strong>{{ statusText(refund.status) }}</strong>
          <small>{{ statusDesc(refund.status) }}</small>
        </div>
      </section>

      <section class="refund-layout">
        <article class="refund-panel">
          <h2>Refund Information</h2>
          <dl class="refund-info-list">
            <div>
              <dt>Refund No.</dt>
              <dd>{{ refund.refundSn || '-' }}</dd>
            </div>
            <div>
              <dt>Refund Amount</dt>
              <dd>¥{{ price(refund.refundAmount).toFixed(2) }}</dd>
            </div>
            <div>
              <dt>Refund Reason</dt>
              <dd>{{ refund.refundReason || '-' }}</dd>
            </div>
            <div>
              <dt>Applied At</dt>
              <dd>{{ formatDate(refund.applyTime || refund.createTime) }}</dd>
            </div>
            <div v-if="refund.auditTime">
              <dt>Reviewed At</dt>
              <dd>{{ formatDate(refund.auditTime) }}</dd>
            </div>
            <div v-if="refund.auditNote">
              <dt>Review Note</dt>
              <dd>{{ refund.auditNote }}</dd>
            </div>
            <div v-if="refund.refundTime">
              <dt>Refunded At</dt>
              <dd>{{ formatDate(refund.refundTime) }}</dd>
            </div>
          </dl>
        </article>

        <aside class="refund-panel">
          <h2>Related Order</h2>
          <dl class="refund-info-list">
            <div>
              <dt>Order No.</dt>
              <dd>{{ refund.orderSn || '-' }}</dd>
            </div>
            <div>
              <dt>Order ID</dt>
              <dd>{{ refund.orderId || '-' }}</dd>
            </div>
          </dl>
          <RouterLink v-if="refund.orderId" class="primary-link" :to="`/orders/${refund.orderId}`">View Order</RouterLink>
        </aside>
      </section>

      <div class="order-action-bar">
        <button class="secondary-button" :disabled="loading" @click="load(true)">
          <RefreshCw :size="18" />
          {{ loading ? 'Refreshing...' : 'Refresh Status' }}
        </button>
        <button v-if="canCancel" class="secondary-button danger-button" :disabled="actionBusy" @click="cancel">
          <XCircle :size="18" />
          {{ actionBusy ? 'Cancelling...' : 'Cancel Request' }}
        </button>
      </div>
    </template>
  </section>
</template>
