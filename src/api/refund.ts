import request from '@/services/request'
import type { CommonResult, QueryParams, RefundApplyParam, RefundRequest } from '@/types/api'

export function applyRefund(data: RefundApplyParam) {
  return request.post<CommonResult<RefundRequest>, CommonResult<RefundRequest>>('/refund/apply', data)
}

export function fetchRefundList(params: QueryParams) {
  return request.get<CommonResult<unknown>, CommonResult<unknown>>('/refund/list', { params })
}

export function fetchRefundDetail(refundRequestId: number | string) {
  return request.get<CommonResult<RefundRequest>, CommonResult<RefundRequest>>(`/refund/${refundRequestId}`)
}

export function queryRefundStatus(refundRequestId: number | string) {
  return request.get<CommonResult<RefundRequest>, CommonResult<RefundRequest>>(`/refund/status/${refundRequestId}`)
}

export function cancelRefund(refundRequestId: number | string) {
  return request.post<CommonResult<null>, CommonResult<null>>(`/refund/cancel/${refundRequestId}`)
}
