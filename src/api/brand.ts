import request from '@/services/request'
import type { Brand, CommonResult, Product, QueryParams } from '@/types/api'

export function fetchBrandDetail(id: number | string) {
  return request.get<CommonResult<Brand>, CommonResult<Brand>>(`/brand/detail/${id}`)
}

export function fetchBrandProductList(params: QueryParams) {
  return request.get<CommonResult<Product[]>, CommonResult<Product[]>>('/brand/productList', { params })
}

export function fetchBrandRecommendList(params: QueryParams) {
  return request.get<CommonResult<Brand[]>, CommonResult<Brand[]>>('/brand/recommendList', { params })
}

export function fetchBrandInfoList() {
  return request.get<CommonResult<Brand[]>, CommonResult<Brand[]>>('/brand/brandInfoList')
}

export function fetchBrandInfoListByCategory(categoryId: number | string) {
  return request.get<CommonResult<Brand[]>, CommonResult<Brand[]>>(`/brand/brandInfoList/${categoryId}`)
}
