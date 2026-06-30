import request from '@/services/request'
import type { CartPromotionItem, CommonResult, QueryParams } from '@/types/api'

export function addCartItem(data: Partial<CartPromotionItem>) {
  return request.post<CommonResult<number>, CommonResult<number>>('/cart/add', data)
}

export function fetchCartList() {
  return request.get<CommonResult<CartPromotionItem[]>, CommonResult<CartPromotionItem[]>>('/cart/list')
}

export function deleteCartItem(params: QueryParams) {
  return request.post<CommonResult, CommonResult>('/cart/delete', null, { params })
}

export function updateQuantity(params: QueryParams) {
  return request.get<CommonResult, CommonResult>('/cart/update/quantity', { params })
}

export function clearCartList() {
  return request.post<CommonResult, CommonResult>('/cart/clear')
}
