/**
 * 客服相关接口
 */
import { API_BASE_URL } from '@/utils/appConfig.js';
import { t } from '@/utils/i18nUtil.js';

/**
 * 获取客服微信二维码（不需要登录的公开接口）
 */
export function getServiceQrcode() {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${API_BASE_URL}/wechat/image/service/qrcode`,
			method: 'GET',
			success: (res) => {
				// 直接返回数据，不经过统一的错误处理
				if (res.statusCode === 200) {
					resolve(res.data);
				} else {
					reject({
						code: res.statusCode,
						message: t('order.qrCodeError')
					});
				}
			},
			fail: (err) => {
				reject({
					code: -1,
					message: t('common.networkError')
				});
			}
		});
	});
}
