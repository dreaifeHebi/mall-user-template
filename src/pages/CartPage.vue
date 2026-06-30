<script setup lang="ts">
import { Trash2 } from '@lucide/vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const emptyCart = '/template-assets/cart-empty.svg'
const cart = useCartStore()
const router = useRouter()
const auth = useAuthStore()

function submitOrder() {
  if (!cart.checkedItems.length) {
    return
  }

  if (!auth.isLoggedIn) {
    router.push('/auth')
    return
  }

  router.push('/checkout')
}
</script>

<template>
  <section class="cart-page">
    <div class="page-heading">
      <div>
        <p>Cart</p>
        <h1>Shopping Cart</h1>
      </div>
      <button v-if="cart.items.length" class="text-button" @click="cart.clear">Clear</button>
    </div>

    <div v-if="!cart.items.length" class="empty-state">
      <img :src="emptyCart" alt="Empty cart" />
      <strong>Your cart is empty</strong>
      <button class="primary-button" @click="router.push('/products')">Browse Products</button>
    </div>

    <div v-else class="cart-layout">
      <div class="cart-list">
        <article v-for="item in cart.items" :key="item.id" class="cart-item">
          <input :checked="item.checked" type="checkbox" @change="cart.toggle(item.id)" />
          <img :src="item.productPic" :alt="item.productName" />
          <div class="cart-info">
            <strong>{{ item.productName }}</strong>
            <span>¥{{ item.price.toFixed(2) }}</span>
          </div>
          <div class="cart-quantity">
            <button @click="cart.updateQuantity(item.id, item.quantity - 1)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="cart.updateQuantity(item.id, item.quantity + 1)">+</button>
          </div>
          <button class="icon-button" aria-label="Remove" @click="cart.remove(item.id)">
            <Trash2 :size="18" />
          </button>
        </article>
      </div>

      <aside class="cart-summary">
        <span>{{ cart.checkedItems.length }} selected</span>
        <strong>¥{{ cart.total.toFixed(2) }}</strong>
        <button class="primary-button" :disabled="!cart.checkedItems.length" @click="submitOrder">Checkout</button>
      </aside>
    </div>
  </section>
</template>
