<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ArrowLeft, MapPin, PackageCheck, ShoppingBag } from '@lucide/vue'
import { addCartItem, clearCartList, fetchCartList } from '@/api/cart'
import { generateConfirmOrder, generateOrder } from '@/api/order'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import type { CartPromotionItem, ConfirmOrderResult, ReceiveAddress } from '@/types/api'
import { extractData, normalizeList, price } from '@/utils/api-data'

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()

const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const note = ref('')
const confirmOrder = ref<ConfirmOrderResult | null>(null)
const cartIds = ref<Array<number | string>>([])
const selectedAddressId = ref('')
const checkedLocalIds = ref<string[]>([])

const addresses = computed(() => confirmOrder.value?.memberReceiveAddressList || [])
const items = computed(() => confirmOrder.value?.cartPromotionItemList || [])
const amount = computed(() => confirmOrder.value?.calcAmount || {})
const selectedAddress = computed(() =>
  addresses.value.find(address => String(address.id || '') === selectedAddressId.value)
)
const payableAmount = computed(() => {
  const current = amount.value as Record<string, unknown>
  const computedTotal =
    price(current.totalAmount) +
    price(current.freightAmount) -
    price(current.promotionAmount) -
    price(current.couponAmount)

  return computedTotal > 0 ? computedTotal : price(current.payAmount)
})
const canSubmit = computed(() =>
  Boolean(auth.isLoggedIn && selectedAddressId.value && cartIds.value.length && !submitting.value)
)

function normalizeId(id: number | string) {
  const parsed = Number(id)
  return Number.isFinite(parsed) ? parsed : id
}

function fullAddress(address: ReceiveAddress) {
  return [
    address.prefixAddress,
    !address.prefixAddress ? address.province : '',
    !address.prefixAddress ? address.city : '',
    !address.prefixAddress ? address.region : '',
    address.detailAddress
  ]
    .filter(Boolean)
    .join(' ')
}

function formattedPhone(address: ReceiveAddress) {
  return `${address.countryCode || '+1'} ${address.phoneNumber || ''}`.trim()
}

function promotionText(message: unknown) {
  const text = String(message || '').trim()

  if (!text || text === '\u65e0\u4f18\u60e0') {
    return ''
  }

  return text
}

function readError(err: unknown, fallback: string) {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: unknown }).message || fallback)
  }

  return fallback
}

function isBusinessPayload(err: unknown) {
  return Boolean(err && typeof err === 'object' && 'code' in err)
}

async function clearRemoteCart() {
  try {
    await clearCartList()
  } catch (err) {
    if (!isBusinessPayload(err)) {
      throw err
    }
  }
}

async function syncCheckedCart() {
  const selectedItems = [...cart.checkedItems]

  if (!selectedItems.length) {
    throw new Error('Please select products to checkout')
  }

  checkedLocalIds.value = selectedItems.map(item => item.id)
  await clearRemoteCart()
  await Promise.all(
    selectedItems.map(item =>
      addCartItem({
        productId: item.productId,
        productName: item.productName,
        productPic: item.productPic,
        price: item.price,
        quantity: item.quantity
      })
    )
  )

  const remoteCart = normalizeList<CartPromotionItem>(await fetchCartList())
  const selectedProductIds = new Set(selectedItems.map(item => String(item.productId)))
  const selectedRemoteIds = remoteCart
    .filter(item => selectedProductIds.has(String(item.productId)))
    .map(item => item.id)
    .filter((id): id is number | string => id !== undefined && id !== null)

  if (!selectedRemoteIds.length) {
    throw new Error('Cart sync failed')
  }

  cartIds.value = selectedRemoteIds.map(normalizeId)
}

function selectDefaultAddress(list: ReceiveAddress[]) {
  const address = list.find(item => item.defaultStatus === 1) || list[0]
  selectedAddressId.value = address?.id ? String(address.id) : ''
}

async function loadCheckout() {
  if (!auth.isLoggedIn) {
    return
  }

  loading.value = true
  error.value = ''

  try {
    await syncCheckedCart()
    const result = await generateConfirmOrder(cartIds.value)
    confirmOrder.value = extractData<ConfirmOrderResult>(result)
    selectDefaultAddress(confirmOrder.value.memberReceiveAddressList || [])
  } catch (err) {
    error.value = readError(err, 'Checkout failed to load')
  } finally {
    loading.value = false
  }
}

async function submitOrder() {
  if (!canSubmit.value) {
    return
  }

  submitting.value = true
  error.value = ''

  try {
    const result = await generateOrder({
      memberReceiveAddressId: normalizeId(selectedAddressId.value),
      couponId: null,
      useIntegration: 0,
      payType: 0,
      cartIds: cartIds.value,
      note: note.value.trim()
    })
    const data = extractData(result)
    const order = data && typeof data === 'object' ? (data as { order?: { id?: number | string } }).order : null
    cart.removeMany(checkedLocalIds.value)

    if (order?.id) {
      await router.push(`/orders/${order.id}/pay`)
    } else {
      await router.push('/orders')
    }
  } catch (err) {
    error.value = readError(err, 'Order submission failed')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  void loadCheckout()
})
</script>

<template>
  <section class="checkout-page">
    <div class="page-heading">
      <div>
        <p>Checkout</p>
        <h1>Checkout</h1>
      </div>
      <RouterLink class="text-button" to="/cart">
        <ArrowLeft :size="18" />
        Back to Cart
      </RouterLink>
    </div>

    <div v-if="!auth.isLoggedIn" class="simple-empty">
      <ShoppingBag :size="36" />
      <strong>Please sign in first</strong>
      <button class="primary-button" @click="router.push('/auth')">Sign In</button>
    </div>
    <div v-else-if="loading" class="loading-line">Preparing checkout...</div>
    <div v-else-if="error" class="simple-empty">
      <PackageCheck :size="36" />
      <strong>{{ error }}</strong>
      <RouterLink class="primary-link" to="/cart">Back to Cart</RouterLink>
    </div>
    <div v-else-if="!items.length" class="simple-empty">
      <PackageCheck :size="36" />
      <strong>Please select products to checkout</strong>
      <RouterLink class="primary-link" to="/cart">Back to Cart</RouterLink>
    </div>
    <div v-else class="checkout-layout">
      <div class="checkout-main">
        <section class="checkout-panel">
          <div class="checkout-panel-head">
            <div>
              <p>Address</p>
              <h2>Shipping Address</h2>
            </div>
            <RouterLink class="text-button" to="/account/addresses/new">
              <MapPin :size="16" />
              Add Address
            </RouterLink>
          </div>

          <div v-if="!addresses.length" class="checkout-warning">
            No shipping address yet. Add one before submitting the order.
          </div>
          <div v-else class="checkout-address-list">
            <label
              v-for="address in addresses"
              :key="address.id"
              class="checkout-address"
              :class="{ active: String(address.id || '') === selectedAddressId }"
            >
              <input v-model="selectedAddressId" type="radio" :value="String(address.id || '')" />
              <span class="checkout-address-main">
                <strong>
                  {{ address.name }}
                  <em v-if="address.defaultStatus === 1">Default</em>
                </strong>
                <span>{{ fullAddress(address) }}</span>
                <small>{{ formattedPhone(address) }}</small>
              </span>
            </label>
          </div>
        </section>

        <section class="checkout-panel">
          <div class="checkout-panel-head">
            <div>
              <p>Items</p>
              <h2>Items</h2>
            </div>
          </div>

          <div class="checkout-items">
            <article v-for="item in items" :key="item.id || item.productId" class="checkout-item">
              <img :src="item.productPic" :alt="item.productName || 'Product'" />
              <div>
                <strong>{{ item.productName || 'Product' }}</strong>
                <span v-if="promotionText(item.promotionMessage)">{{ promotionText(item.promotionMessage) }}</span>
              </div>
              <em>x{{ item.quantity || 0 }}</em>
              <b>¥{{ price(item.price).toFixed(2) }}</b>
            </article>
          </div>
        </section>

        <section class="checkout-panel checkout-note">
          <div class="checkout-panel-head">
            <div>
              <p>Note</p>
              <h2>Order Note</h2>
            </div>
          </div>
          <textarea v-model="note" maxlength="200" rows="4" placeholder="Add delivery notes"></textarea>
        </section>
      </div>

      <aside class="checkout-summary">
        <div>
          <span>Ship To</span>
          <strong>{{ selectedAddress?.name || 'No address selected' }}</strong>
          <small>{{ selectedAddress ? fullAddress(selectedAddress) : 'Select a shipping address before submitting' }}</small>
        </div>
        <dl>
          <div>
            <dt>Items</dt>
            <dd>¥{{ price(amount.totalAmount).toFixed(2) }}</dd>
          </div>
          <div>
            <dt>Shipping</dt>
            <dd>¥{{ price(amount.freightAmount).toFixed(2) }}</dd>
          </div>
          <div>
            <dt>Promotion</dt>
            <dd>-¥{{ price(amount.promotionAmount).toFixed(2) }}</dd>
          </div>
          <div class="checkout-pay-line">
            <dt>Total</dt>
            <dd>¥{{ payableAmount.toFixed(2) }}</dd>
          </div>
        </dl>
        <p v-if="error" class="form-error">{{ error }}</p>
        <button class="primary-button" :disabled="!canSubmit" @click="submitOrder">
          {{ submitting ? 'Submitting...' : 'Place Order' }}
        </button>
      </aside>
    </div>
  </section>
</template>
