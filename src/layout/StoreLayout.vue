<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import MobileTabBar from './MobileTabBar.vue'
</script>

<template>
  <div class="store-shell">
    <AppHeader />
    <main class="store-main">
      <RouterView />
    </main>
    <AppFooter />
    <MobileTabBar />
  </div>
</template>
