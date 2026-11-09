<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { KeyRound, MailCheck, Save, ShieldCheck, Settings, UserRound } from '@lucide/vue'
import { sendEmailVerification, updateMemberInfo, updatePassword } from '@/api/member'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const profileSaving = ref(false)
const passwordSaving = ref(false)
const emailSending = ref(false)
const profileMessage = ref('')
const passwordMessage = ref('')
const emailMessage = ref('')
const profileError = ref('')
const passwordError = ref('')
const emailError = ref('')

const profileForm = reactive({
  nickname: '',
  phone: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

function syncProfileForm() {
  profileForm.nickname = auth.profile?.nickname || ''
  profileForm.phone = auth.profile?.phone || ''
}

function messageFromError(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message?: unknown }).message || fallback)
  }

  return fallback
}

async function loadProfile() {
  if (!auth.isLoggedIn) {
    return
  }

  try {
    await auth.loadProfile()
    syncProfileForm()
  } catch {
    auth.clearSession()
  }
}

async function saveProfile() {
  profileSaving.value = true
  profileMessage.value = ''
  profileError.value = ''

  try {
    await updateMemberInfo({
      nickname: profileForm.nickname.trim(),
      phone: profileForm.phone.trim()
    })
    await auth.loadProfile()
    profileMessage.value = 'Profile updated'
  } catch (error) {
    profileError.value = messageFromError(error, 'Profile update failed')
  } finally {
    profileSaving.value = false
  }
}

async function sendVerification() {
  const email = auth.profile?.email

  if (!email) {
    emailError.value = 'This account has no email address'
    return
  }

  emailSending.value = true
  emailMessage.value = ''
  emailError.value = ''

  try {
    await sendEmailVerification(email)
    emailMessage.value = 'Verification email sent'
  } catch (error) {
    emailError.value = messageFromError(error, 'Verification email failed to send')
  } finally {
    emailSending.value = false
  }
}

async function changePassword() {
  passwordMessage.value = ''
  passwordError.value = ''

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'The two passwords do not match'
    return
  }

  passwordSaving.value = true

  try {
    await updatePassword(passwordForm.oldPassword, passwordForm.newPassword)
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    passwordMessage.value = 'Password updated'
  } catch (error) {
    passwordError.value = messageFromError(error, 'Password update failed')
  } finally {
    passwordSaving.value = false
  }
}

watch(() => auth.profile, syncProfileForm, { immediate: true })
onMounted(loadProfile)
</script>

<template>
  <section class="settings-page">
    <div class="page-heading">
      <div>
        <p>Account</p>
        <h1>Account Settings</h1>
      </div>
      <RouterLink class="secondary-button" to="/account">Back to Account</RouterLink>
    </div>

    <section v-if="!auth.isLoggedIn" class="empty-state">
      <UserRound :size="36" />
      <h2>Please sign in first</h2>
      <button class="primary-button" @click="router.push('/auth')">Sign In</button>
    </section>

    <div v-else class="settings-grid">
      <section class="form-card">
        <div class="form-card-head">
          <Settings :size="22" />
          <h2>Profile</h2>
        </div>
        <form class="settings-form" @submit.prevent="saveProfile">
          <label>
            <span>Username</span>
            <input :value="auth.profile?.username || ''" disabled />
          </label>
          <label>
            <span>Nickname</span>
            <input v-model="profileForm.nickname" autocomplete="nickname" />
          </label>
          <label>
            <span>Phone</span>
            <input v-model="profileForm.phone" autocomplete="tel" />
          </label>
          <p v-if="profileError" class="form-error">{{ profileError }}</p>
          <p v-if="profileMessage" class="form-success">{{ profileMessage }}</p>
          <button class="primary-button" :disabled="profileSaving">
            <Save :size="18" />
            {{ profileSaving ? 'Saving...' : 'Save Profile' }}
          </button>
        </form>
      </section>

      <section class="form-card">
        <div class="form-card-head">
          <MailCheck :size="22" />
          <h2>Email Verification</h2>
        </div>
        <div class="settings-form">
          <label>
            <span>Email</span>
            <input :value="auth.profile?.email || 'No email bound'" disabled />
          </label>
          <p v-if="emailError" class="form-error">{{ emailError }}</p>
          <p v-if="emailMessage" class="form-success">{{ emailMessage }}</p>
          <button class="primary-button" :disabled="emailSending || !auth.profile?.email" @click="sendVerification">
            <MailCheck :size="18" />
            {{ emailSending ? 'Sending...' : 'Send Verification Email' }}
          </button>
        </div>
      </section>

      <section class="form-card">
        <div class="form-card-head">
          <ShieldCheck :size="22" />
          <h2>Change Password</h2>
        </div>
        <form class="settings-form" @submit.prevent="changePassword">
          <label>
            <span>Current Password</span>
            <input v-model="passwordForm.oldPassword" type="password" autocomplete="current-password" required />
          </label>
          <label>
            <span>New Password</span>
            <input v-model="passwordForm.newPassword" type="password" autocomplete="new-password" required />
          </label>
          <label>
            <span>Confirm New Password</span>
            <input v-model="passwordForm.confirmPassword" type="password" autocomplete="new-password" required />
          </label>
          <p v-if="passwordError" class="form-error">{{ passwordError }}</p>
          <p v-if="passwordMessage" class="form-success">{{ passwordMessage }}</p>
          <button class="primary-button" :disabled="passwordSaving">
            <KeyRound :size="18" />
            {{ passwordSaving ? 'Updating...' : 'Change Password' }}
          </button>
        </form>
      </section>
    </div>
  </section>
</template>
