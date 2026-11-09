<script setup lang="ts">
import { computed } from 'vue'
import { Languages } from '@lucide/vue'
import { useLocale } from '@/i18n'

const { locale, setLocale } = useLocale()
const isEnglish = computed(() => locale.value === 'en')
</script>

<template>
  <div class="locale-switch" aria-label="Language">
    <Languages :size="16" />
    <button :class="{ active: isEnglish }" type="button" @click="setLocale('en')">EN</button>
    <button :class="{ active: !isEnglish }" type="button" @click="setLocale('zh')">ZH</button>
  </div>
</template>
