/**
 * 登录验证工具类
 */

/**
 * 检查用户登录状态，如果未登录则显示提示弹窗
 * @param {Object} store - Vuex store 实例
 * @param {String} message - 提示消息，默认为 '请先登录'
 * @param {Function} onCancel - 取消按钮回调，默认返回上一页
 * @returns {Boolean} - 返回是否已登录
 */
export function checkLogin(store, message = '请先登录', onCancel = null) {
	if (!store.state.hasLogin) {
		uni.showModal({
			title: '提示',
			content: message,
			showCancel: true,
			confirmText: '去登录',
			cancelText: '取消',
			success: (res) => {
				if (res.confirm) {
					uni.navigateTo({
						url: '/pages/public/login'
					});
				} else if (onCancel) {
					onCancel();
				} else {
					uni.navigateBack();
				}
			}
		});
		return false;
	}
	return true;
}

/**
 * 页面级别的登录检查mixin
 */
export const loginCheckMixin = {
	computed: {
		...require('vuex').mapState(['hasLogin', 'userInfo'])
	},
	methods: {
		/**
		 * 检查登录状态
		 * @param {String} message - 提示消息
		 * @param {Function} onCancel - 取消回调
		 */
		checkLogin(message, onCancel) {
			return checkLogin(this.$store, message, onCancel);
		}
	}
};
