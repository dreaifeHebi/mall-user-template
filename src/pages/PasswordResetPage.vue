<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { KeyRound, Mail } from '@lucide/vue'
import { confirmResetPassword, sendResetPasswordEmail } from '@/api/member'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const message = ref('')
const error = ref('')

const requestForm = reactive({
  email: ''
})

const resetForm = reactive({
  password: '',
  confirmPassword: ''
})

function legacyTokenFromHash() {
  const hash = window.location.hash
  const queryStart = hash.indexOf('?')

  if (queryStart < 0) {
    return ''
  }

  return new URLSearchParams(hash.slice(queryStart + 1)).get('token') || ''
}

const token = computed(() => String(route.query.token || legacyTokenFromHash() || ''))
const hasToken = computed(() => Boolean(token.value))

function messageFromError(submitError: unknown, fallback: string) {
  if (submitError instanceof Error) {
    return submitError.message
  }

  if (submitError && typeof submitError === 'object' && 'message' in submitError) {
    return String((submitError as { message?: unknown }).message || fallback)
  }

  return fallback
}

async function requestReset() {
  loading.value = true
  message.value = ''
  error.value = ''

  try {
    await sendResetPasswordEmail(requestForm.email.trim())
    message.value = 'Reset email sent'
  } catch (submitError) {
    error.value = messageFromError(submitError, 'Failed to send reset email')
  } finally {
    loading.value = false
  }
}

async function submitReset() {
  message.value = ''
  error.value = ''

  if (resetForm.password !== resetForm.confirmPassword) {
    error.value = 'The two passwords do not match'
    return
  }

  loading.value = true

  try {
    await confirmResetPassword(token.value, resetForm.password)
    message.value = 'Password reset'
    setTimeout(() => router.push('/auth'), 900)
  } catch (submitError) {
    error.value = messageFromError(submitError, 'Password reset failed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-panel">
      <div class="auth-head">
        <p>Account</p>
        <h1>{{ hasToken ? 'Set New Password' : 'Reset Password' }}</h1>
      </div>

      <form v-if="!hasToken" class="auth-form" @submit.prevent="requestReset">
        <label>
          <span>Email</span>
          <div>
            <Mail :size="18" />
            <input v-model="requestForm.email" type="email" autocomplete="email" required />
          </div>
        </label>
        <p v-if="error" class="form-error">{{ error }}</p>
        <p v-if="message" class="form-success">{{ message }}</p>
        <button class="primary-button" :disabled="loading">
          {{ loading ? 'Sending...' : 'Send Reset Email' }}
        </button>
      </form>

      <form v-else class="auth-form" @submit.prevent="submitReset">
        <label>
          <span>New Password</span>
          <div>
            <KeyRound :size="18" />
            <input v-model="resetForm.password" type="password" autocomplete="new-password" required />
          </div>
        </label>
        <label>
          <span>Confirm New Password</span>
          <div>
            <KeyRound :size="18" />
            <input v-model="resetForm.confirmPassword" type="password" autocomplete="new-password" required />
          </div>
        </label>
        <p v-if="error" class="form-error">{{ error }}</p>
        <p v-if="message" class="form-success">{{ message }}</p>
        <button class="primary-button" :disabled="loading">
          {{ loading ? 'Submitting...' : 'Reset Password' }}
        </button>
      </form>

      <RouterLink class="text-button auth-switch" to="/auth">Back to Sign In</RouterLink>
    </section>
  </main>
</template>
