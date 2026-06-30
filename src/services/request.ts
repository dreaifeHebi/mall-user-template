import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'
import type { CommonResult } from '@/types/api'
import { translateApiMessage } from '@/i18n'

export const apiBaseURL = import.meta.env.VITE_API_BASE_URL || '/portal'

const service = axios.create({
  baseURL: apiBaseURL,
  timeout: 15000
})

function createApiError(payload: CommonResult, fallback = 'Request failed') {
  const message = translateApiMessage(String(payload.message || fallback), fallback)
  return Object.assign(new Error(message), payload, { message })
}

service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const auth = useAuthStore()

  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }

  return config
})

service.interceptors.response.use(
  (response: AxiosResponse<CommonResult | Blob | unknown>): AxiosResponse<unknown> => {
    if (response.config.responseType === 'blob') {
      return response.data as unknown as AxiosResponse<unknown>
    }

    const payload = response.data as CommonResult
    const hasBusinessCode =
      payload &&
      typeof payload === 'object' &&
      Object.prototype.hasOwnProperty.call(payload, 'code')

    if (hasBusinessCode && Number(payload.code) !== 200) {
      throw createApiError(payload)
    }

    return payload as unknown as AxiosResponse<unknown>
  },
  (error: AxiosError<CommonResult>) => {
    if (error.response?.status === 401 || Number(error.response?.data?.code) === 401) {
      const auth = useAuthStore()
      auth.clearSession()
    }

    if (error.response?.data?.message) {
      return Promise.reject(createApiError(error.response.data))
    }

    return Promise.reject(error)
  }
)

export default service
