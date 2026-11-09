import request from '@/services/request'
import type { CommonResult, LoginPayload, MemberProfile } from '@/types/api'

export interface LoginResponse {
  token?: string
  tokenHead?: string
}

export function memberLogin(payload: LoginPayload) {
  const data = new URLSearchParams()
  data.set('username', payload.username)
  data.set('password', payload.password)

  return request.post<CommonResult<LoginResponse>, CommonResult<LoginResponse>>('/sso/login', data, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}

export function memberRegister(payload: LoginPayload & { email?: string }) {
  return request.post<CommonResult, CommonResult>('/sso/register/json', payload)
}

export function memberInfo() {
  return request.get<CommonResult<MemberProfile>, CommonResult<MemberProfile>>('/sso/info')
}

function formData(payload: Record<string, string | number | undefined | null>) {
  const data = new URLSearchParams()

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      data.set(key, String(value))
    }
  })

  return data
}

export function sendResetPasswordEmail(email: string) {
  return request.post<CommonResult, CommonResult>('/sso/resetPassword', formData({ email }), {
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}

export function confirmResetPassword(token: string, newPassword: string) {
  return request.post<CommonResult, CommonResult>('/sso/resetPassword/confirm', formData({ token, newPassword }), {
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}

export function updatePassword(oldPassword: string, newPassword: string) {
  return request.post<CommonResult, CommonResult>('/sso/updatePassword', formData({ oldPassword, newPassword }), {
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}

export function sendEmailVerification(email: string) {
  return request.post<CommonResult, CommonResult>('/sso/sendEmailVerification', formData({ email }), {
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}

export function confirmEmail(token: string) {
  return request.post<CommonResult, CommonResult>('/sso/email/confirm', formData({ token }), {
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}

export function updateMemberInfo(data: Pick<MemberProfile, 'nickname' | 'phone'>) {
  return request.post<CommonResult, CommonResult>('/sso/updateInfo', formData(data), {
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}
