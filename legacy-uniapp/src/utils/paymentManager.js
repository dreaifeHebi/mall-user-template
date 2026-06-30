/**
 * 支付管理工具类
 * 统一管理H5支付和传统支付的切换
 */
import { USE_H5_PAYMENT } from '@/utils/appConfig.js'

/**
 * 跳转到支付页面
 * @param {number} orderId 订单ID
 */
export function navigateToPayment(orderId) {
	if (USE_H5_PAYMENT) {
		// 使用新的H5支付系统
		uni.navigateTo({
			url: `/pages/money/h5Pay?orderId=${orderId}`
		});
	} else {
		// 使用原有支付系统
		uni.navigateTo({
			url: `/pages/money/pay?orderId=${orderId}`
		});
	}
}

/**
 * 支付渠道映射
 * 将内部支付类型映射到H5支付渠道
 */
export const PAYMENT_CHANNEL_MAP = {
	1: 'ALIPAY_H5',    // 支付宝H5支付
	2: 'WECHAT_H5',    // 微信H5支付
	3: 'CREDIT_CARD'   // 信用卡支付
}

/**
 * 支付类型映射（反向）
 * 将H5支付渠道映射到内部支付类型
 */
export const PAY_TYPE_MAP = {
	'ALIPAY_H5': 1,
	'WECHAT_H5': 2,
	'CREDIT_CARD': 3
}

/**
 * 格式化支付方式显示名称
 * @param {string} paymentChannel H5支付渠道
 * @returns {string} 显示名称
 */
export function formatPaymentChannelName(paymentChannel) {
	const nameMap = {
		'ALIPAY_H5': '支付宝H5支付',
		'WECHAT_H5': '微信H5支付',
		'CREDIT_CARD': '信用卡支付'
	};
	return nameMap[paymentChannel] || paymentChannel;
}

/**
 * 格式化支付状态显示名称
 * @param {string} paymentStatus H5支付状态
 * @returns {string} 显示名称
 */
export function formatPaymentStatusName(paymentStatus) {
	const statusMap = {
		'PENDING': '待支付',
		'SUCCESS': '支付成功',
		'FAILED': '支付失败',
		'CANCELLED': '已取消'
	};
	return statusMap[paymentStatus] || paymentStatus;
}
