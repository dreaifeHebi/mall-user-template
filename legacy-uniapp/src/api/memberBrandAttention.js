import request from '@/utils/requestUtil'

export function createBrandAttention(data) {
	console.log('调用创建品牌关注API，数据:', data);
	return request({
		method: 'POST',
		url: '/member/attention/add',
		data: data
	}).then(response => {
		console.log('创建品牌关注API响应:', response);
		return response;
	}).catch(error => {
		console.error('创建品牌关注API失败:', error);
		throw error;
	});
}

export function deleteBrandAttention(params) {
	return request({
		method: 'POST',
		url: '/member/attention/delete',
		params: params
	})
}

export function fetchBrandAttentionList(params) {
	console.log('调用获取品牌关注列表API，参数:', params);
	return request({
		method: 'GET',
		url: '/member/attention/list',
		params:params
	}).then(response => {
		console.log('获取品牌关注列表API响应:', response);
		return response;
	}).catch(error => {
		console.error('获取品牌关注列表API失败:', error);
		throw error;
	});
}

export function brandAttentionDetail(params) {
	console.log('调用查询品牌关注详情API，参数:', params);
	return request({
		method: 'GET',
		url: '/member/attention/detail',
		params: params
	}).then(response => {
		console.log('查询品牌关注详情API响应:', response);
		return response;
	}).catch(error => {
		console.error('查询品牌关注详情API失败:', error);
		throw error;
	});
}

export function clearBrandAttention() {
	return request({
		method: 'POST',
		url: '/member/attention/clear'
	})
}