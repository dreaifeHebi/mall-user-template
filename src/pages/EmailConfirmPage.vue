<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { MailCheck } from '@lucide/vue'
import { confirmEmail } from '@/api/member'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const auth = useAuthStore()
const loading = ref(false)
const message = ref('')
const error = ref('')

function legacyTokenFromHash() {
  const hash = window.location.hash
  const queryStart = hash.indexOf('?')

  if (queryStart < 0) {
    return ''
  }

  return new URLSearchParams(hash.slice(queryStart + 1)).get('token') || ''
}

const token = computed(() => String(route.query.token || legacyTokenFromHash() || ''))

function messageFromError(confirmError: unknown, fallback: string) {
  if (confirmError instanceof Error) {
    return confirmError.message
  }

  if (confirmError && typeof confirmError === 'object' && 'message' in confirmError) {
    return String((confirmError as { message?: unknown }).message || fallback)
  }

  return fallback
}

async function runConfirm() {
  if (!token.value) {
    error.value = 'Verification link is missing a token'
    return
  }

  loading.value = true
  message.value = ''
  error.value = ''

  try {
    await confirmEmail(token.value)
    message.value = 'Email verified'

    if (auth.isLoggedIn) {
      await auth.loadProfile()
    }
  } catch (confirmError) {
    error.value = messageFromError(confirmError, 'Email verification failed')
  } finally {
    loading.value = false
  }
}

onMounted(runConfirm)
</script>

<template>
  <main class="auth-page">
    <section class="auth-panel confirm-panel">
      <MailCheck :size="42" />
      <div class="auth-head">
        <p>Account</p>
        <h1>Email Verification</h1>
      </div>
      <p v-if="loading" class="form-success">Verifying...</p>
      <p v-if="message" class="form-success">{{ message }}</p>
      <p v-if="error" class="form-error">{{ error }}</p>
      <div class="confirm-actions">
        <RouterLink class="primary-link" to="/account">My Account</RouterLink>
        <RouterLink class="secondary-button" to="/">Back Home</RouterLink>
      </div>
    </section>
  </main>
</template>
