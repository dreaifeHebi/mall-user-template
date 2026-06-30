<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Lock, Mail, UserRound } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const mode = ref<'login' | 'register'>('login')
const loading = ref(false)
const error = ref('')

const form = reactive({
  username: '',
  password: '',
  email: ''
})

watch(
  () => route.query.mode,
  value => {
    mode.value = value === 'register' ? 'register' : 'login'
  },
  { immediate: true }
)

async function submit() {
  error.value = ''
  loading.value = true

  try {
    if (mode.value === 'login') {
      await auth.login(form)
    } else {
      await auth.register(form)
    }

    await router.push('/account')
  } catch (submitError) {
    error.value = submitError instanceof Error ? submitError.message : 'Request failed'
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
        <h1>{{ mode === 'login' ? 'Member Sign In' : 'Create Account' }}</h1>
      </div>

      <form class="auth-form" @submit.prevent="submit">
        <label>
          <span>Username</span>
          <div>
            <UserRound :size="18" />
            <input v-model="form.username" autocomplete="username" required />
          </div>
        </label>
        <label>
          <span>Password</span>
          <div>
            <Lock :size="18" />
            <input v-model="form.password" type="password" autocomplete="current-password" required />
          </div>
        </label>
        <label v-if="mode === 'register'">
          <span>Email</span>
          <div>
            <Mail :size="18" />
            <input v-model="form.email" type="email" autocomplete="email" />
          </div>
        </label>
        <p v-if="error" class="form-error">{{ error }}</p>
        <button class="primary-button" :disabled="loading">
          {{ loading ? 'Submitting...' : mode === 'login' ? 'Sign In' : 'Sign Up' }}
        </button>
      </form>

      <button class="text-button auth-switch" @click="mode = mode === 'login' ? 'register' : 'login'">
        {{ mode === 'login' ? 'Create Account' : 'Already have an account? Sign in' }}
      </button>
      <RouterLink v-if="mode === 'login'" class="text-button auth-switch" to="/auth/forgot-password">
        Forgot password
      </RouterLink>
    </section>
  </main>
</template>
