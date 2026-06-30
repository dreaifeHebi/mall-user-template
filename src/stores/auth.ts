import { defineStore } from 'pinia'
import { memberInfo, memberLogin, memberRegister } from '@/api/member'
import type { LoginPayload, MemberProfile } from '@/types/api'
import { syncSessionReadHistoryToAccount } from '@/utils/session-history'

const TOKEN_KEY = 'mall_user_token'
const PROFILE_KEY = 'mall_user_profile'

function readProfile(): MemberProfile | null {
  const raw = localStorage.getItem(PROFILE_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as MemberProfile
  } catch {
    localStorage.removeItem(PROFILE_KEY)
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || '',
    profile: readProfile()
  }),
  getters: {
    isLoggedIn: state => Boolean(state.token),
    displayName: state => state.profile?.nickname || state.profile?.username || 'Signed out'
  },
  actions: {
    setToken(token: string) {
      this.token = token.replace(/^Bearer\s+/i, '')
      localStorage.setItem(TOKEN_KEY, this.token)
    },
    setProfile(profile: MemberProfile | null) {
      this.profile = profile

      if (profile) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
      } else {
        localStorage.removeItem(PROFILE_KEY)
      }
    },
    clearSession() {
      this.token = ''
      this.profile = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(PROFILE_KEY)
    },
    async login(payload: LoginPayload) {
      const result = await memberLogin(payload)
      const tokenData = result.data || {}
      const token = tokenData.token || ''

      if (!token) {
        throw new Error('Login succeeded but no token was returned')
      }

      this.setToken(token)
      await this.loadProfile()
      try {
        await syncSessionReadHistoryToAccount()
      } catch {
        // Browsing history sync should not block sign-in.
      }
    },
    async register(payload: LoginPayload & { email?: string }) {
      await memberRegister(payload)
      await this.login(payload)
    },
    async loadProfile() {
      const result = await memberInfo()
      this.setProfile(result.data || null)
    },
    logout() {
      this.clearSession()
    }
  }
})
