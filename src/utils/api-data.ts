import type { Product } from '@/types/api'

export function normalizeList<T>(payload: unknown): T[] {
  const source = extractData(payload)

  if (Array.isArray(source)) {
    return source as T[]
  }

  if (!source || typeof source !== 'object') {
    return []
  }

  const data = source as Record<string, unknown>
  const list = data.list || data.records || data.items || data.content || []

  return Array.isArray(list) ? (list as T[]) : []
}

export function extractData<T = unknown>(payload: unknown): T {
  if (!payload || typeof payload !== 'object') {
    return payload as T
  }

  const data = payload as Record<string, unknown>

  if ('data' in data) {
    return data.data as T
  }

  return payload as T
}

export function normalizeProduct(payload: unknown): Product | null {
  const data = extractData(payload)

  if (!data || typeof data !== 'object') {
    return null
  }

  return data as Product
}

export function price(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}
