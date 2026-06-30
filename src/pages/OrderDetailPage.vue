<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { ArrowLeft, CheckCircle2, CreditCard, PackageCheck, ReceiptText, RotateCcw, Trash2, XCircle } from '@lucide/vue'
import {
  cancelUserOrder,
  confirmReceiveOrder,
  deleteUserOrder,
  fetchOrderDetail
} from '@/api/order'
import { useAuthStore } from '@/stores/auth'
import type { OrderDetail, OrderItem } from '@/types/api'
import { extractData, price } from '@/utils/api-data'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const order = ref<OrderDetail | null>(null)
const loading = ref(false)
const actionBusy = ref(false)
const error = ref('')

const orderId = computed(() => String(route.params.id || ''))
const status = computed(() => Number(order.value?.status ?? -1))
const canCancel = computed(() => status.value === 0)
const canPay = computed(() => status.value === 0)
const canRefund = computed(() => [1, 2, 3].includes(status.value))
const canConfirm = computed(() => status.value === 2)
const canDelete = computed(() => status.value === 3 || status.value === 4)
const addressLine = computed(() => {
  if (!order.value) return '-'
  return [
    order.value.receiverCountry,
    order.value.receiverProvince,
    order.value.receiverCity,
    order.value.receiverRegion,
    order.value.receiverDetailAddress
  ]
    .filter(Boolean)
    .join(' ')
})

function statusText(value: unknown) {
  const map: Record<string, string> = {
    '0': 'Pending Payment',
    '1': 'Awaiting Shipment',
    '2': 'Shipped',
    '3': 'Completed',
    '4': 'Closed',
    '5': 'Invalid'
  }

  return map[String(value)] || 'Processing'
}

function payTypeText(value: unknown) {
  const map: Record<string, string> = {
    '0': 'Unpaid',
    '1': 'Alipay',
    '2': 'WeChat Pay',
    '3': 'Stripe Checkout',
    '99': 'Test Payment'
  }

  return map[String(value)] || 'Other'
}

function formatDate(value: unknown) {
  return value ? dayjs(String(value)).format('YYYY-MM-DD HH:mm') : '-'
}

function formatProductAttr(value: unknown) {
  if (!value || value === 'null' || value === '0') {
    return ''
  }

  try {
    const parsed = JSON.parse(String(value)) as Array<{ key?: string; value?: string }>
    return parsed
      .filter(item => item.key && item.value)
      .map(item => `${item.key}: ${item.value}`)
      .join(' / ')
  } catch {
    return String(value)
  }
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
  } catch {
    error.value = 'Order details failed to load'
    order.value = null
  } finally {
    loading.value = false
  }
}

async function runAction(kind: 'cancel' | 'confirm' | 'delete') {
  if (!order.value || actionBusy.value) {
    return
  }

  const prompts = {
    cancel: 'Cancel this order?',
    confirm: 'Confirm that you received the items?',
    delete: 'Delete this order?'
  }

  if (!window.confirm(prompts[kind])) {
    return
  }

  actionBusy.value = true
  error.value = ''

  try {
    if (kind === 'cancel') {
      await cancelUserOrder(order.value.id)
      await load()
    } else if (kind === 'confirm') {
      await confirmReceiveOrder(order.value.id)
      await load()
    } else {
      await deleteUserOrder(order.value.id)
      await router.push('/orders')
    }
  } catch {
    error.value = 'Action failed. Refresh and try again.'
  } finally {
    actionBusy.value = false
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <section class="order-detail-page">
    <div class="page-heading">
      <div>
        <p>Order</p>
        <h1>Order Details</h1>
      </div>
      <RouterLink class="text-button" to="/orders">
        <ArrowLeft :size="18" />
        Back to Orders
      </RouterLink>
    </div>

    <div v-if="!auth.isLoggedIn" class="simple-empty">
      <ReceiptText :size="36" />
      <strong>Please sign in first</strong>
      <button class="primary-button" @click="router.push('/auth')">Sign In</button>
    </div>
    <div v-else-if="loading" class="loading-line">Loading...</div>
    <div v-else-if="error" class="loading-line">{{ error }}</div>
    <div v-else-if="!order" class="simple-empty">
      <PackageCheck :size="36" />
      <strong>Order not found</strong>
    </div>
    <template v-else>
      <section class="order-status-panel">
        <div>
          <span>Order Status</span>
          <strong>{{ statusText(order.status) }}</strong>
          <small>{{ order.orderSn || order.id }}</small>
        </div>
        <b>¥{{ price(order.payAmount ?? order.totalAmount).toFixed(2) }}</b>
      </section>

      <section class="order-detail-grid">
        <article class="order-info-panel">
          <h2>Shipping Information</h2>
          <dl>
            <div>
              <dt>Recipient</dt>
              <dd>{{ order.receiverName || '-' }}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{{ order.receiverPhone || '-' }}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{{ addressLine }}</dd>
            </div>
            <div>
              <dt>Postcode</dt>
              <dd>{{ order.receiverPostCode || '-' }}</dd>
            </div>
          </dl>
        </article>

        <article class="order-info-panel">
          <h2>Order Information</h2>
          <dl>
            <div>
              <dt>Order Time</dt>
              <dd>{{ formatDate(order.createTime) }}</dd>
            </div>
            <div>
              <dt>Payment Method</dt>
              <dd>{{ payTypeText(order.payType) }}</dd>
            </div>
            <div>
              <dt>Payment Time</dt>
              <dd>{{ formatDate(order.paymentTime) }}</dd>
            </div>
            <div>
              <dt>Note</dt>
              <dd>{{ order.note || '-' }}</dd>
            </div>
          </dl>
        </article>
      </section>

      <section class="order-info-panel">
        <h2>Items</h2>
        <div class="order-item-list">
          <RouterLink
            v-for="item in order.orderItemList || []"
            :key="item.id || item.productId"
            class="order-detail-item"
            :to="item.productId ? `/products/${item.productId}` : '#'"
          >
            <img :src="item.productPic || ''" :alt="item.productName || 'Product'" />
            <div>
              <strong>{{ item.productName || '-' }}</strong>
              <span v-if="formatProductAttr(item.productAttr)">{{ formatProductAttr(item.productAttr) }}</span>
              <span v-if="item.productBrand">{{ item.productBrand }}</span>
            </div>
            <em>¥{{ price(item.productPrice).toFixed(2) }} x {{ item.productQuantity || 0 }}</em>
          </RouterLink>
        </div>
      </section>

      <section class="order-detail-grid">
        <article class="order-info-panel">
          <h2>Amount Details</h2>
          <dl>
            <div>
              <dt>Items</dt>
              <dd>¥{{ price(order.totalAmount).toFixed(2) }}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>¥{{ price(order.freightAmount).toFixed(2) }}</dd>
            </div>
            <div>
              <dt>Promotion</dt>
              <dd>-¥{{ price(order.promotionAmount).toFixed(2) }}</dd>
            </div>
            <div>
              <dt>Coupon</dt>
              <dd>-¥{{ price(order.couponAmount).toFixed(2) }}</dd>
            </div>
            <div class="total-row">
              <dt>Paid</dt>
              <dd>¥{{ price(order.payAmount).toFixed(2) }}</dd>
            </div>
          </dl>
        </article>

        <article v-if="order.deliveryCompany || order.deliverySn" class="order-info-panel">
          <h2>Logistics</h2>
          <dl>
            <div>
              <dt>Carrier</dt>
              <dd>{{ order.deliveryCompany || '-' }}</dd>
            </div>
            <div>
              <dt>Tracking No.</dt>
              <dd>{{ order.deliverySn || '-' }}</dd>
            </div>
            <div>
              <dt>Shipped At</dt>
              <dd>{{ formatDate(order.deliveryTime) }}</dd>
            </div>
            <div>
              <dt>Received At</dt>
              <dd>{{ formatDate(order.receiveTime) }}</dd>
            </div>
          </dl>
        </article>
      </section>

      <div v-if="canPay || canCancel || canRefund || canConfirm || canDelete" class="order-action-bar">
        <RouterLink v-if="canPay" class="primary-button" :to="`/orders/${order.id}/pay`">
          <CreditCard :size="18" />
          Pay Now
        </RouterLink>
        <RouterLink v-if="canRefund" class="secondary-button" :to="`/orders/${order.id}/refund`">
          <RotateCcw :size="18" />
          Request Refund
        </RouterLink>
        <button v-if="canCancel" class="secondary-button" :disabled="actionBusy" @click="runAction('cancel')">
          <XCircle :size="18" />
          Cancel Order
        </button>
        <button v-if="canConfirm" class="primary-button" :disabled="actionBusy" @click="runAction('confirm')">
          <CheckCircle2 :size="18" />
          Confirm Receipt
        </button>
        <button v-if="canDelete" class="secondary-button danger-button" :disabled="actionBusy" @click="runAction('delete')">
          <Trash2 :size="18" />
          Delete Order
        </button>
      </div>
    </template>
  </section>
</template>
