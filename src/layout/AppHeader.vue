<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Menu, Search, ShoppingBag, UserRound, X } from '@lucide/vue'
import LocaleSwitch from '@/components/LocaleSwitch.vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const keyword = ref('')
const menuOpen = ref(false)

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/categories', label: 'Categories' },
  { to: '/orders', label: 'Orders' }
]

const accountLabel = computed(() => (auth.isLoggedIn ? auth.displayName : 'Sign In'))

function search() {
  const value = keyword.value.trim()

  router.push({
    path: '/products',
    query: value ? { keyword: value } : {}
  })
  menuOpen.value = false
}
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <button class="icon-button mobile-menu" aria-label="Open menu" @click="menuOpen = true">
        <Menu :size="22" />
      </button>

      <RouterLink class="brand" to="/">
        <ShoppingBag :size="24" />
        <span>Mall</span>
      </RouterLink>

      <nav class="desktop-nav">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">{{ item.label }}</RouterLink>
      </nav>

      <form class="search-box" @submit.prevent="search">
        <Search :size="18" />
        <input v-model="keyword" type="search" placeholder="Search products" />
      </form>

      <div class="header-actions">
        <LocaleSwitch />
        <RouterLink class="cart-link" to="/cart">
          <ShoppingBag :size="20" />
          <span>{{ cart.count }}</span>
        </RouterLink>
        <RouterLink class="account-link" :to="auth.isLoggedIn ? '/account' : '/auth'">
          <UserRound :size="20" />
          <span>{{ accountLabel }}</span>
        </RouterLink>
      </div>
    </div>

    <div v-if="menuOpen" class="mobile-drawer">
      <div class="drawer-panel">
        <div class="drawer-head">
          <strong>Mall</strong>
          <button class="icon-button" aria-label="Close menu" @click="menuOpen = false">
            <X :size="22" />
          </button>
        </div>
        <form class="drawer-search" @submit.prevent="search">
          <Search :size="18" />
          <input v-model="keyword" type="search" placeholder="Search products" />
        </form>
        <LocaleSwitch />
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" @click="menuOpen = false">
          {{ item.label }}
        </RouterLink>
      </div>
    </div>
  </header>
</template>
