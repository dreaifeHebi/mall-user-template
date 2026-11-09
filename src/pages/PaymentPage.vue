<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ArrowLeft, CheckCircle2, CreditCard, ExternalLink, RefreshCw, WalletCards, XCircle } from '@lucide/vue'
import { fetchOrderDetail } from '@/api/order'
import { cancelH5Payment, createH5Payment, fetchPaymentMethods, queryPaymentStatus } from '@/api/payment'
import { useAuthStore } from '@/stores/auth'
import type { H5PaymentResponse, OrderDetail, PaymentMethod, PaymentRecord } from '@/types/api'
import { extractData, normalizeList, price } from '@/utils/api-data'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const order = ref<OrderDetail | null>(null)
const methods = ref<PaymentMethod[]>([])
const selectedChannel = ref('')
const payment = ref<H5PaymentResponse | null>(null)
const paymentRecord = ref<PaymentRecord | null>(null)
const loading = ref(false)
const creating = ref(false)
const statusLoading = ref(false)
const cancelLoading = ref(false)
const error = ref('')
const info = ref('')
let pollTimer: number | undefined

const orderId = computed(() => String(route.params.id || ''))
const methodPriority: Record<string, number> = {
  STRIPE_CHECKOUT: 0,
  CREDIT_CARD: 1,
  ALIPAY_H5: 2,
  WECHAT_H5: 3
}
const enabledMethods = computed(() =>
  [...methods.value]
    .filter(item => item.status === 1)
    .sort((left, right) => {
      const leftPriority = methodPriority[left.methodCode] ?? 99
      const rightPriority = methodPriority[right.methodCode] ?? 99
      return leftPriority - rightPriority
    })
)
const canCreatePayment = computed(() => order.value && Number(order.value.status) === 0 && selectedChannel.value)
const paymentStatus = computed(() => paymentRecord.value?.paymentStatus || '')

function paymentStatusText(value: unknown) {
  const map: Record<string, string> = {
    PENDING: 'Pending',
    SUCCESS: 'Paid',
    FAILED: 'Failed',
    CANCELLED: 'Cancelled',
    REFUNDED: 'Refunded'
  }

  return map[String(value)] || 'Not Created'
}

function methodIcon(method: PaymentMethod) {
  return method.methodCode === 'ALIPAY_H5' || method.methodCode === 'WECHAT_H5' ? WalletCards : CreditCard
}

function methodName(method: PaymentMethod) {
  const map: Record<string, string> = {
    STRIPE_CHECKOUT: 'Stripe Checkout',
    CREDIT_CARD: 'Credit Card',
    ALIPAY_H5: 'Alipay H5',
    WECHAT_H5: 'WeChat H5'
  }

  return map[method.methodCode] || method.methodName
}

function stopPolling() {
  if (pollTimer) {
    window.clearInterval(pollTimer)
    pollTimer = undefined
  }
}

async function load() {
  if (!auth.isLoggedIn) {
    return
  }

  loading.value = true
  error.value = ''

  try {
    const [orderResult, methodResult] = await Promise.all([
      fetchOrderDetail(orderId.value),
      fetchPaymentMethods()
    ])
    order.value = extractData<OrderDetail>(orderResult)
    methods.value = normalizeList<PaymentMethod>(methodResult)
    selectedChannel.value = enabledMethods.value[0]?.methodCode || ''
  } catch {
    error.value = 'Payment information failed to load'
  } finally {
    loading.value = false
  }
}

async function refreshStatus() {
  const orderSn = payment.value?.orderSn || order.value?.orderSn
  const channel = payment.value?.paymentChannel || selectedChannel.value
  if (!orderSn || !channel) {
    return
  }

  statusLoading.value = true

  try {
    const result = await queryPaymentStatus(String(orderSn), String(channel))
    paymentRecord.value = extractData<PaymentRecord>(result)
    if (paymentRecord.value.paymentStatus === 'SUCCESS') {
      await handlePaid()
    } else if (paymentRecord.value.paymentStatus && paymentRecord.value.paymentStatus !== 'PENDING') {
      stopPolling()
    }
  } finally {
    statusLoading.value = false
  }
}

async function handlePaid() {
  stopPolling()
  info.value = 'Payment completed. Redirecting to order details...'
  try {
    const result = await fetchOrderDetail(orderId.value)
    order.value = extractData<OrderDetail>(result)
  } finally {
    window.setTimeout(() => {
      void router.replace(`/orders/${orderId.value}`)
    }, 900)
  }
}

function startPolling() {
  stopPolling()
  pollTimer = window.setInterval(() => {
    void refreshStatus()
  }, 5000)
}

async function createPayment() {
  if (!order.value || !canCreatePayment.value) {
    return
  }

  creating.value = true
  error.value = ''
  info.value = ''

  try {
    const result = await createH5Payment({
      orderId: order.value.id,
      orderSn: String(order.value.orderSn || ''),
      totalAmount: order.value.payAmount || order.value.totalAmount || 0,
      currency: 'JPY',
      paymentChannel: selectedChannel.value,
      subject: `${order.value.receiverName || 'Mall'} order`
    })
    payment.value = extractData<H5PaymentResponse>(result)

    if (payment.value?.success) {
      await refreshStatus()
      if (paymentRecord.value?.paymentStatus === 'SUCCESS' || payment.value.paymentStatus === 'SUCCESS') {
        await handlePaid()
      } else if (payment.value.redirectRequired && payment.value.paymentUrl) {
        startPolling()
        info.value = 'Payment order created. Continue on the provider page.'
      } else {
        startPolling()
        info.value = 'Payment record created. Waiting for confirmation.'
      }
    } else {
      error.value = payment.value?.errorMessage || 'Payment order creation failed'
    }
  } catch (err) {
    const payload = err as { message?: string }
    error.value = payload.message || 'Payment order creation failed'
  } finally {
    creating.value = false
  }
}

async function cancelPayment() {
  const orderSn = payment.value?.orderSn || order.value?.orderSn
  const channel = payment.value?.paymentChannel || selectedChannel.value
  if (!orderSn || !channel) {
    return
  }

  cancelLoading.value = true

  try {
    await cancelH5Payment(String(orderSn), String(channel))
    await refreshStatus()
    stopPolling()
    info.value = 'Payment cancelled'
  } finally {
    cancelLoading.value = false
  }
}

function openPaymentUrl() {
  if (payment.value?.paymentUrl) {
    window.location.href = payment.value.paymentUrl
  }
}

onMounted(() => {
  void load()
})

onUnmounted(() => {
  stopPolling()
})
</script>

<template>
  <section class="payment-page">
    <div class="page-heading">
      <div>
        <p>Payment</p>
        <h1>Payment</h1>
      </div>
      <RouterLink class="text-button" :to="`/orders/${orderId}`">
        <ArrowLeft :size="18" />
        Back to Order
      </RouterLink>
    </div>

    <div v-if="!auth.isLoggedIn" class="simple-empty">
      <CreditCard :size="36" />
      <strong>Please sign in first</strong>
      <button class="primary-button" @click="router.push('/auth')">Sign In</button>
    </div>
    <div v-else-if="loading" class="loading-line">Loading...</div>
    <div v-else-if="error && !order" class="loading-line">{{ error }}</div>
    <template v-else-if="order">
      <section class="payment-summary">
        <div>
          <span>Order No.</span>
          <strong>{{ order.orderSn }}</strong>
          <small>{{ Number(order.status) === 0 ? 'Awaiting payment' : 'This order cannot be paid' }}</small>
        </div>
        <b>¥{{ price(order.payAmount ?? order.totalAmount).toFixed(2) }} JPY</b>
      </section>

      <section class="payment-layout">
        <article class="payment-panel">
          <div class="section-title">
            <div>
              <p>Method</p>
              <h2>Payment Method</h2>
            </div>
          </div>

          <div v-if="!enabledMethods.length" class="loading-line">No payment methods available</div>
          <div v-else class="payment-method-list">
            <button
              v-for="method in enabledMethods"
              :key="method.methodCode"
              :class="{ active: selectedChannel === method.methodCode }"
              @click="selectedChannel = method.methodCode"
            >
              <component :is="methodIcon(method)" :size="20" />
              <span>
                <strong>{{ methodName(method) }}</strong>
                <small>{{ method.supportedCurrency || 'JPY' }}</small>
              </span>
            </button>
          </div>

          <button class="primary-button payment-submit" :disabled="!canCreatePayment || creating" @click="createPayment">
            <CreditCard :size="18" />
            {{ creating ? 'Creating...' : 'Create Payment Order' }}
          </button>
        </article>

        <aside class="payment-panel">
          <div class="section-title">
            <div>
              <p>Status</p>
              <h2>Payment Status</h2>
            </div>
          </div>

          <div class="payment-status-box" :class="paymentStatus">
            <CheckCircle2 v-if="paymentStatus === 'SUCCESS'" :size="28" />
            <XCircle v-else-if="paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED'" :size="28" />
            <RefreshCw v-else :size="28" />
            <strong>{{ paymentStatusText(paymentStatus) }}</strong>
            <span v-if="paymentRecord?.failureReason">{{ paymentRecord.failureReason }}</span>
            <span v-else-if="info">{{ info }}</span>
          </div>

          <button
            v-if="payment?.paymentUrl"
            class="primary-button payment-submit"
            @click="openPaymentUrl"
          >
            <ExternalLink :size="18" />
            Open Payment Page
          </button>
          <button class="secondary-button payment-submit" :disabled="statusLoading || !payment" @click="refreshStatus">
            <RefreshCw :size="18" />
            {{ statusLoading ? 'Checking...' : 'Check Payment Status' }}
          </button>
          <button
            v-if="paymentStatus === 'PENDING'"
            class="secondary-button danger-button payment-submit"
            :disabled="cancelLoading"
            @click="cancelPayment"
          >
            <XCircle :size="18" />
            {{ cancelLoading ? 'Cancelling...' : 'Cancel Payment' }}
          </button>
        </aside>
      </section>
    </template>
  </section>
</template>
