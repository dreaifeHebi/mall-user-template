import request from '@/services/request'
import type { CommonResult, MemberBrandAttention, QueryParams } from '@/types/api'

export function createBrandAttention(data: MemberBrandAttention) {
  return request.post<CommonResult<number>, CommonResult<number>>('/member/attention/add', data)
}

export function deleteBrandAttention(brandId: number | string) {
  return request.post<CommonResult<number>, CommonResult<number>>(
    '/member/attention/delete',
    null,
    { params: { brandId } }
  )
}

export function fetchBrandAttentionList(params: QueryParams) {
  return request.get<CommonResult<unknown>, CommonResult<unknown>>('/member/attention/list', { params })
}

export function brandAttentionDetail(brandId: number | string) {
  return request.get<CommonResult<MemberBrandAttention | null>, CommonResult<MemberBrandAttention | null>>(
    '/member/attention/detail',
    { params: { brandId } }
  )
}

export function clearBrandAttention() {
  return request.post<CommonResult<null>, CommonResult<null>>('/member/attention/clear')
}
