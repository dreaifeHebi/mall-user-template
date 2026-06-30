import request from '@/services/request'
import type { CommonResult, MemberProductInteraction, QueryParams } from '@/types/api'

export function createReadHistory(data: MemberProductInteraction) {
  return request.post<CommonResult<number>, CommonResult<number>>('/member/readHistory/create', data)
}

export function fetchReadHistoryList(params: QueryParams) {
  return request.get<CommonResult<unknown>, CommonResult<unknown>>('/member/readHistory/list', {
    params
  })
}

export function deleteReadHistory(ids: Array<number | string>) {
  return request.post<CommonResult<number>, CommonResult<number>>('/member/readHistory/delete', null, {
    params: { ids: ids.join(',') }
  })
}

export function clearReadHistory() {
  return request.post<CommonResult<null>, CommonResult<null>>('/member/readHistory/clear')
}
