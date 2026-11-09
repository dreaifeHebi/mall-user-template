import request from '@/services/request'
import type {
  CommonResult,
  H5PaymentRequest,
  H5PaymentResponse,
  PaymentMethod,
  PaymentRecord
} from '@/types/api'

export const PAYMENT_CHANNELS = {
  STRIPE_CHECKOUT: 'STRIPE_CHECKOUT',
  ALIPAY_H5: 'ALIPAY_H5',
  WECHAT_H5: 'WECHAT_H5',
  CREDIT_CARD: 'CREDIT_CARD'
} as const

export function createH5Payment(data: H5PaymentRequest) {
  return request.post<CommonResult<H5PaymentResponse>, CommonResult<H5PaymentResponse>>('/payment/h5/create', data)
}

export function queryPaymentStatus(orderSn: string, paymentChannel: string) {
  return request.get<CommonResult<PaymentRecord>, CommonResult<PaymentRecord>>(
    `/payment/h5/status/${orderSn}/${paymentChannel}`
  )
}

export function cancelH5Payment(orderSn: string, paymentChannel: string) {
  const data = new URLSearchParams()
  data.set('orderSn', orderSn)
  data.set('paymentChannel', paymentChannel)

  return request.post<CommonResult<boolean>, CommonResult<boolean>>('/payment/h5/cancel', data, {
    headers: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' }
  })
}

export function fetchPaymentMethods(type?: string) {
  return request.get<CommonResult<PaymentMethod[]>, CommonResult<PaymentMethod[]>>('/payment/h5/methods', {
    params: { type }
  })
}
