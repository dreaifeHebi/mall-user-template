<script setup lang="ts">
import { Check, ShoppingCart } from '@lucide/vue'
import { onUnmounted, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types/api'
import { price } from '@/utils/api-data'

const props = defineProps<{
  product: Product
}>()

const cart = useCartStore()
const added = ref(false)
let addedTimer: number | undefined

function addToCart() {
  cart.addProduct(props.product)
  added.value = true

  if (addedTimer) {
    window.clearTimeout(addedTimer)
  }
  addedTimer = window.setTimeout(() => {
    added.value = false
  }, 1200)
}

onUnmounted(() => {
  if (addedTimer) {
    window.clearTimeout(addedTimer)
  }
})
</script>

<template>
  <article class="product-card">
    <RouterLink class="product-media" :to="`/products/${product.id}`">
      <img :src="product.pic || product.albumPics || ''" :alt="product.name" />
    </RouterLink>
    <div class="product-body">
      <RouterLink class="product-name" :to="`/products/${product.id}`">{{ product.name }}</RouterLink>
      <p>{{ product.subTitle || product.brandName || 'Featured mall product' }}</p>
      <div class="product-row">
        <strong>¥{{ price(product.price).toFixed(2) }}</strong>
        <button
          class="icon-button add-cart"
          :class="{ added }"
          :aria-label="added ? `Added ${product.name}` : `Add to cart ${product.name}`"
          @click="addToCart"
        >
          <Check v-if="added" :size="18" />
          <ShoppingCart v-else :size="18" />
        </button>
      </div>
    </div>
  </article>
</template>
