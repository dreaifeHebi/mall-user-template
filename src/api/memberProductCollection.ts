import request from '@/services/request'
import type { CommonResult, MemberProductInteraction, QueryParams } from '@/types/api'

export function createProductCollection(data: MemberProductInteraction) {
  return request.post<CommonResult<number>, CommonResult<number>>(
    '/member/productCollection/add',
    data
  )
}

export function deleteProductCollection(productId: number | string) {
  return request.post<CommonResult<number>, CommonResult<number>>(
    '/member/productCollection/delete',
    null,
    { params: { productId } }
  )
}

export function fetchProductCollectionList(params: QueryParams) {
  return request.get<CommonResult<unknown>, CommonResult<unknown>>(
    '/member/productCollection/list',
    { params }
  )
}

export function productCollectionDetail(productId: number | string) {
  return request.get<CommonResult<MemberProductInteraction | null>, CommonResult<MemberProductInteraction | null>>(
    '/member/productCollection/detail',
    { params: { productId } }
  )
}

export function clearProductCollection() {
  return request.post<CommonResult<null>, CommonResult<null>>('/member/productCollection/clear')
}
