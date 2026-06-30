<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Heart, History, LogOut, MapPin, PackageCheck, RotateCcw, Settings, Star, UserRound } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const actions = [
  { label: 'Orders', icon: PackageCheck, to: '/orders' },
  { label: 'Refunds', icon: RotateCcw, to: '/refunds' },
  { label: 'Profile', icon: Settings, to: '/account/settings' },
  { label: 'Addresses', icon: MapPin, to: '/account/addresses' },
  { label: 'Favorites', icon: Heart, to: '/account/collections' },
  { label: 'Following', icon: Star, to: '/account/brand-attentions' },
  { label: 'History', icon: History, to: '/account/history' }
]

function logout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <section class="account-page">
    <div class="profile-panel">
      <div class="avatar">
        <img v-if="auth.profile?.icon" :src="auth.profile.icon" alt="avatar" />
        <UserRound v-else :size="38" />
      </div>
      <div>
        <h1>{{ auth.displayName }}</h1>
        <p>{{ auth.profile?.email || auth.profile?.phone || 'Welcome back' }}</p>
      </div>
      <RouterLink v-if="!auth.isLoggedIn" class="primary-link" to="/auth">Sign In</RouterLink>
      <button v-else class="text-button logout-link" @click="logout">
        <LogOut :size="16" />
        Sign Out
      </button>
    </div>

    <div class="account-grid">
      <RouterLink v-for="item in actions" :key="item.label" class="account-action" :to="item.to">
        <component :is="item.icon" :size="22" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </div>
  </section>
</template>
