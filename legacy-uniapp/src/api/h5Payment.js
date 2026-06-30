import request from '@/utils/requestUtil'
import { API_BASE_URL } from '@/utils/appConfig.js'

/**
 * 创建H5支付订单
 * @param {Object} data 支付数据
 * @param {number} data.orderId - 商城订单ID
 * @param {string} data.orderSn - 订单号
 * @param {string} data.paymentChannel - 支付渠道（ALIPAY_H5/WECHAT_H5/CREDIT_CARD）
 * @param {number} data.totalAmount - 支付金额
 * @param {string} data.currency - 货币类型（JPY/CNY）
 * @param {string} data.subject - 商品描述
 * @param {string} data.returnUrl - 支付成功跳转地址
 * @param {string} data.notifyUrl - 异步通知地址
 */
export function createH5Payment(data) {
	return request({
		method: 'POST',
		url: `/payment/h5/create`,
		header: {
			'content-type': 'application/json'
		},
		data: data
	})
}

/**
 * 查询支付状态
 * @param {string} orderSn - 订单号
 * @param {string} paymentChannel - 支付渠道
 */
export function queryPaymentStatus(orderSn, paymentChannel) {
	return request({
		method: 'GET',
		url: `/payment/h5/status/${orderSn}/${paymentChannel}`
	})
}

/**
 * 申请退款
 * @param {Object} data 退款数据
 * @param {number} data.orderId - 原订单ID
 * @param {number} data.refundAmount - 退款金额
 * @param {string} data.refundReason - 退款原因
 * @param {string} data.refundDescription - 详细说明（可选）
 */
export function applyRefund(data) {
	return request({
		method: 'POST',
		url: `/refund/apply`,
		header: {
			'content-type': 'application/json'
		},
		data: data
	})
}

/**
 * 查询退款申请列表
 * @param {Object} params 查询参数
 * @param {number} params.memberId - 会员ID
 * @param {string} params.status - 退款状态（可选）
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页数量
 */
export function getRefundList(params) {
	return request({
		method: 'GET',
		url: `/refund/list`,
		params: params
	})
}

/**
 * 查询退款详情
 * @param {number} refundRequestId - 退款申请ID
 */
export function getRefundDetail(refundRequestId) {
	return request({
		method: 'GET',
		url: `/refund/detail/${refundRequestId}`
	})
}

/**
 * 取消退款申请
 * @param {number} refundRequestId - 退款申请ID
 */
export function cancelRefund(refundRequestId) {
	return request({
		method: 'PUT',
		url: `/refund/cancel/${refundRequestId}`
	})
}

/**
 * 根据订单ID获取退款信息
 * @param {number} orderId - 订单ID
 */
export function getRefundByOrderId(orderId) {
	return request({
		method: 'GET',
		url: `/refund/order/${orderId}`
	})
}

/**
 * 生成订单号
 * 格式: GP + 时间戳 + 3位随机数
 */
export function generateOrderSn() {
	const timestamp = Date.now()
	const random = Math.floor(Math.random() * 900) + 100
	return `GP${timestamp}${random}`
}

/**
 * 支付渠道枚举
 */
export const PAYMENT_CHANNELS = {
	ALIPAY_H5: 'ALIPAY_H5',
	WECHAT_H5: 'WECHAT_H5', 
	CREDIT_CARD: 'CREDIT_CARD'
}

/**
 * 支付状态枚举
 */
export const PAYMENT_STATUS = {
	PENDING: 'PENDING',
	SUCCESS: 'SUCCESS',
	FAILED: 'FAILED',
	CANCELLED: 'CANCELLED'
}

/**
 * 退款状态枚举
 */
export const REFUND_STATUS = {
	PENDING_REVIEW: 'PENDING_REVIEW',
	APPROVED: 'APPROVED', 
	REJECTED: 'REJECTED',
	PROCESSING: 'PROCESSING',
	COMPLETED: 'COMPLETED',
	FAILED: 'FAILED',
	CANCELLED: 'CANCELLED'
}

/**
 * 货币类型枚举
 */
export const CURRENCY_TYPES = {
	JPY: 'JPY',
	CNY: 'CNY'
}
