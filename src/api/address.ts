import request from '@/services/request'
import type { CommonResult, ReceiveAddress } from '@/types/api'

export function fetchAddressList() {
  return request.get<CommonResult<ReceiveAddress[]>, CommonResult<ReceiveAddress[]>>(
    '/member/address/list'
  )
}

export function fetchAddressDetail(id: number | string) {
  return request.get<CommonResult<ReceiveAddress>, CommonResult<ReceiveAddress>>(
    `/member/address/${id}`
  )
}

export function addAddress(data: ReceiveAddress) {
  return request.post<CommonResult<number>, CommonResult<number>>('/member/address/add', data)
}

export function updateAddress(data: ReceiveAddress) {
  return request.post<CommonResult<number>, CommonResult<number>>(
    `/member/address/update/${data.id}`,
    data
  )
}

export function deleteAddress(id: number | string) {
  return request.post<CommonResult<number>, CommonResult<number>>(`/member/address/delete/${id}`)
}
