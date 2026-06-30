import request from '@/utils/requestUtil'

/**
 * 获取轮播图列表
 */
export function fetchBannerList() {
	return request({
		method: 'GET',
		url: '/banner/list'
	});
}