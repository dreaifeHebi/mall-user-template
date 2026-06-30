<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'
</script>

<template>
  <main class="not-found-page">
    <section>
      <p>404</p>
      <h1>页面不存在</h1>
      <RouterLink class="primary-link" to="/">
        <ArrowLeft :size="18" />
        返回首页
      </RouterLink>
    </section>
  </main>
</template>
