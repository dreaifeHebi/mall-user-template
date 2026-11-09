import request from '@/services/request'
import type { Category, CommonResult, Product, QueryParams } from '@/types/api'

export function fetchProductList(params: QueryParams) {
  return request.get<CommonResult<unknown>, CommonResult<unknown>>('/product/list', { params })
}

export function searchProductList(params: QueryParams) {
  return request.get<CommonResult<unknown>, CommonResult<unknown>>('/product/search', { params })
}

export function fetchProductDetail(id: number | string) {
  return request.get<CommonResult<Product>, CommonResult<Product>>(`/product/detail/${id}`)
}

export function fetchCategoryTreeList() {
  return request.get<CommonResult<Category[]>, CommonResult<Category[]>>('/product/categoryTreeList')
}

export function fetchCategoryInfoList() {
  return request.get<CommonResult<Category[]>, CommonResult<Category[]>>('/product/categoryInfoList')
}
