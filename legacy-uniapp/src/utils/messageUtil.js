/**
 * 消息翻译工具
 * 用于翻译后台API返回的标准消息
 */

import { getCurrentLanguage, t } from '@/utils/i18nUtil.js';

/**
 * 翻译后台API返回的标准消息
 * @param {string} message - 后台返回的中文消息
 * @returns {string} 翻译后的消息
 */
export function translateApiMessage(message) {
	if (!message || typeof message !== 'string') {
		return message;
	}
	
	const currentLang = getCurrentLanguage();
	
	// 如果是中文环境，直接返回原消息
	if (currentLang === 'zh-CN' || currentLang === 'zh-TW') {
		return message;
	}
	
	// 尝试从翻译映射中获取翻译
	try {
		const translatedMessage = t(`common.apiMessages.${message}`);
		// 如果翻译键不存在，t函数会返回键本身，这时返回原消息
		if (translatedMessage === `common.apiMessages.${message}`) {
			return message;
		}
		return translatedMessage;
	} catch (error) {
		console.warn('Failed to translate API message:', message, error);
		return message;
	}
}

/**
 * 翻译响应对象中的消息
 * @param {Object} response - API响应对象 
 * @returns {Object} 翻译后的响应对象
 */
export function translateResponse(response) {
	if (!response || typeof response !== 'object') {
		return response;
	}
	
	const translatedResponse = { ...response };
	
	// 翻译 message 字段
	if (translatedResponse.message) {
		translatedResponse.message = translateApiMessage(translatedResponse.message);
	}
	
	// 翻译 msg 字段（有些API可能用msg）
	if (translatedResponse.msg) {
		translatedResponse.msg = translateApiMessage(translatedResponse.msg);
	}
	
	return translatedResponse;
}