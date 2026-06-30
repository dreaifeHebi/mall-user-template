import request from '@/services/request'
import type { Banner, Category, CommonResult, Product, QueryParams } from '@/types/api'

export interface HomeContent {
  advertiseList?: Banner[]
  bannerList?: Banner[]
  productCateList?: Category[]
  newProductList?: Product[]
  hotProductList?: Product[]
  recommendProductList?: Product[]
  brandList?: unknown[]
  [key: string]: unknown
}

export function fetchHomeContent() {
  return request.get<CommonResult<HomeContent>, CommonResult<HomeContent>>('/home/content')
}

export function fetchRecommendProductList(params: QueryParams) {
  return request.get<CommonResult<Product[]>, CommonResult<Product[]>>('/home/recommendProductList', {
    params
  })
}

export function fetchNewProductList(params: QueryParams) {
  return request.get<CommonResult<Product[]>, CommonResult<Product[]>>('/home/newProductList', {
    params
  })
}

export function fetchHotProductList(params: QueryParams) {
  return request.get<CommonResult<Product[]>, CommonResult<Product[]>>('/home/hotProductList', {
    params
  })
}

export function fetchProductCateList(parentId = 0) {
  return request.get<CommonResult<Category[]>, CommonResult<Category[]>>(
    `/home/productCateList/${parentId}`
  )
}
