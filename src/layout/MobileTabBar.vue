<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Grid2X2, Home, ShoppingBag, UserRound } from '@lucide/vue'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
</script>

<template>
  <nav class="mobile-tabbar">
    <RouterLink to="/">
      <Home :size="20" />
      <span>Home</span>
    </RouterLink>
    <RouterLink to="/categories">
      <Grid2X2 :size="20" />
      <span>Categories</span>
    </RouterLink>
    <RouterLink to="/cart">
      <ShoppingBag :size="20" />
      <span>Cart {{ cart.count }}</span>
    </RouterLink>
    <RouterLink to="/account">
      <UserRound :size="20" />
      <span>Account</span>
    </RouterLink>
  </nav>
</template>
