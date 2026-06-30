import request from '@/utils/requestUtil'

export function searchProductList(params) {
	return request({
		method: 'GET',
		url: '/product/search',
		params: params
	})
}

/**
 * 获取商品列表（支持分类筛选和排序）
 * @param {Object} params 查询参数
 * @param {number} params.pageNum - 页码，默认1
 * @param {number} params.pageSize - 每页数量，默认5
 * @param {string} params.sort - 排序字段（id/name/price/stock/sale/create_time/update_time/sort），默认sale
 * @param {string} params.order - 排序方式（asc/desc），默认desc
 * @param {number} params.productCategoryId - 商品分类ID，用于筛选指定分类下的商品
 */
export function fetchProductList(params) {
	return request({
		method: 'GET',
		url: '/product/list',
		params: params
	})
}

export function fetchCategoryTreeList() {
	return request({
		method: 'GET',
		url: '/product/categoryTreeList'
	})
}

export function fetchProductDetail(id, forceRefresh = false) {
	const config = {
		method: 'GET',
		url: '/product/detail/'+id
	};
	
	// 如果需要强制刷新，添加时间戳参数和缓存控制头
	if (forceRefresh) {
		config.params = { 
			_t: Date.now() // 添加时间戳避免缓存
		};
		config.customHeader = {
			'Cache-Control': 'no-cache',
			'Pragma': 'no-cache'
		};
	}
	
	return request(config);
}

/**
 * 获取分类信息列表
 * @description 获取所有分类信息列表，包含每个分类的上架商品数量
 */
export function fetchCategoryInfoList() {
	return request({
		method: 'GET',
		url: '/product/categoryInfoList'
	})
}

/**
 * 根据ID获取分类信息
 * @param {number} id - 分类ID
 * @description 根据分类ID获取单个分类的详细信息，包含上架商品数量
 */
export function fetchCategoryInfo(id) {
	return request({
		method: 'GET',
		url: `/product/categoryInfo/${id}`
	})
}

/**
 * 获取品牌信息列表
 * @description 获取品牌信息列表（包含商品数量）
 */
export function fetchBrandInfoList() {
	return request({
		method: 'GET',
		url: '/brand/brandInfoList'
	})
}

/**
 * 根据分类获取品牌信息列表
 * @param {number} categoryId - 分类ID
 * @description 根据分类ID获取品牌信息列表（包含该分类下的商品数量）
 */
export function fetchBrandInfoListByCategory(categoryId) {
	return request({
		method: 'GET',
		url: `/brand/brandInfoList/${categoryId}`
	})
}
