<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ReceiptText, RotateCcw } from '@lucide/vue'
import { fetchOrderDetail } from '@/api/order'
import { applyRefund } from '@/api/refund'
import { useAuthStore } from '@/stores/auth'
import type { OrderDetail, RefundRequest } from '@/types/api'
import { extractData, price } from '@/utils/api-data'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const order = ref<OrderDetail | null>(null)
const refundAmount = ref('')
const reason = ref('Product quality issue')
const detail = ref('')
const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const info = ref('')
const createdRefund = ref<RefundRequest | null>(null)

const orderId = computed(() => String(route.params.id || ''))
const maxAmount = computed(() => price(order.value?.payAmount ?? order.value?.totalAmount))
const amountValue = computed(() => price(refundAmount.value))
const canApply = computed(() => order.value && [1, 2, 3].includes(Number(order.value.status)))
const canSubmit = computed(() => canApply.value && amountValue.value > 0 && amountValue.value <= maxAmount.value && reason.value)

const reasons = [
  'Product quality issue',
  'Product does not match the description',
  'Delivery issue',
  'Changed my mind',
  'Duplicate order',
  'Other reason'
]

function refundReason() {
  const extra = detail.value.trim()
  return extra ? `${reason.value}: ${extra}`.slice(0, 500) : reason.value
}

async function load() {
  if (!auth.isLoggedIn) {
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await fetchOrderDetail(orderId.value)
    order.value = extractData<OrderDetail>(result)
    refundAmount.value = maxAmount.value.toFixed(2)
  } catch {
    error.value = 'Order details failed to load'
  } finally {
    loading.value = false
  }
}

async function submit() {
  if (!order.value || !canSubmit.value || submitting.value) {
    return
  }

  submitting.value = true
  error.value = ''
  info.value = `Submitting refund request for ¥${amountValue.value.toFixed(2)} JPY...`

  try {
    const result = await applyRefund({
      orderId: order.value.id,
      refundAmount: amountValue.value.toFixed(2),
      refundReason: refundReason()
    })
    createdRefund.value = extractData<RefundRequest>(result)
    info.value = ''
  } catch (err) {
    const payload = err as { message?: string }
    error.value = payload.message || 'Refund request failed'
    info.value = ''
  } finally {
    submitting.value = false
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
        <h1>Request Refund</h1>
      </div>
      <RouterLink class="text-button" :to="`/orders/${orderId}`">
        <ArrowLeft :size="18" />
        Back to Order
      </RouterLink>
    </div>

    <div v-if="!auth.isLoggedIn" class="simple-empty">
      <ReceiptText :size="36" />
      <strong>Please sign in first</strong>
      <button class="primary-button" @click="router.push('/auth')">Sign In</button>
    </div>
    <div v-else-if="loading" class="loading-line">Loading...</div>
    <div v-else-if="error && !order" class="loading-line">{{ error }}</div>
    <div v-else-if="createdRefund" class="simple-empty">
      <RotateCcw :size="36" />
      <strong>Refund request submitted</strong>
      <span>{{ createdRefund.refundSn }}</span>
      <RouterLink class="primary-link" :to="`/refunds/${createdRefund.id}`">View Progress</RouterLink>
    </div>
    <template v-else-if="order">
      <section class="refund-summary">
        <div>
          <span>Order No.</span>
          <strong>{{ order.orderSn }}</strong>
          <small>{{ canApply ? 'Refund available' : 'This order status cannot be refunded' }}</small>
        </div>
        <b>¥{{ maxAmount.toFixed(2) }} JPY</b>
      </section>

      <section class="refund-layout">
        <article class="refund-panel">
          <div class="section-title">
            <div>
              <p>Form</p>
              <h2>Refund Details</h2>
            </div>
          </div>

          <label class="form-field">
            <span>Refund Amount</span>
            <input v-model="refundAmount" type="number" min="0" step="0.01" :max="maxAmount" />
            <small>Maximum refundable amount: ¥{{ maxAmount.toFixed(2) }} JPY</small>
          </label>

          <label class="form-field">
            <span>Refund Reason</span>
            <select v-model="reason">
              <option v-for="item in reasons" :key="item" :value="item">{{ item }}</option>
            </select>
          </label>

          <label class="form-field">
            <span>Details</span>
            <textarea v-model="detail" maxlength="420" rows="5" placeholder="Add product, delivery, or order details"></textarea>
            <small>{{ detail.length }}/420</small>
          </label>

          <p v-if="error" class="form-error">{{ error }}</p>
          <p v-else-if="info" class="form-info">{{ info }}</p>
          <button class="primary-button refund-submit" :disabled="!canSubmit || submitting" @click="submit">
            <RotateCcw :size="18" />
            {{ submitting ? 'Submitting...' : 'Submit Refund Request' }}
          </button>
        </article>

        <aside class="refund-panel">
          <div class="section-title">
            <div>
              <p>Notice</p>
              <h2>Refund Notes</h2>
            </div>
          </div>
          <ul class="refund-notice-list">
            <li>Submitted requests enter pending review and can be cancelled before review.</li>
            <li>The refund amount cannot exceed the paid order amount.</li>
            <li>This template records refund requests locally; real refunds require payment provider configuration.</li>
          </ul>
        </aside>
      </section>
    </template>
  </section>
</template>
