import request from '@/services/request'
import type {
  CommonResult,
  ConfirmOrderResult,
  GenerateOrderResult,
  OrderCreateParam,
  OrderDetail,
  QueryParams
} from '@/types/api'

export function fetchOrderList(params: QueryParams) {
  return request.get<CommonResult<unknown>, CommonResult<unknown>>('/order/list', { params })
}

export function fetchOrderDetail(orderId: number | string) {
  return request.get<CommonResult<OrderDetail>, CommonResult<OrderDetail>>(`/order/detail/${orderId}`)
}

function orderForm(orderId: number | string) {
  const data = new URLSearchParams()
  data.set('orderId', String(orderId))
  return data
}

export function cancelUserOrder(orderId: number | string) {
  return request.post<CommonResult<null>, CommonResult<null>>('/order/cancelUserOrder', orderForm(orderId), {
    headers: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' }
  })
}

export function confirmReceiveOrder(orderId: number | string) {
  return request.post<CommonResult<null>, CommonResult<null>>('/order/confirmReceiveOrder', orderForm(orderId), {
    headers: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' }
  })
}

export function deleteUserOrder(orderId: number | string) {
  return request.post<CommonResult<null>, CommonResult<null>>('/order/deleteOrder', orderForm(orderId), {
    headers: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' }
  })
}

export function generateConfirmOrder(data: Array<number | string>) {
  return request.post<CommonResult<ConfirmOrderResult>, CommonResult<ConfirmOrderResult>>(
    '/order/generateConfirmOrder',
    data
  )
}

export function generateOrder(data: OrderCreateParam) {
  return request.post<CommonResult<GenerateOrderResult>, CommonResult<GenerateOrderResult>>(
    '/order/generateOrder',
    data
  )
}
