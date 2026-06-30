/**
 * 自动刷新Mixin
 * 用于在页面首次加载时自动刷新一次,解决首次加载可能失败的问题
 */
export default {
	data() {
		return {
			isFirstLoad: true
		}
	},
	methods: {
		/**
		 * 页面首次加载自动刷新逻辑
		 * @param {String} pageKey - 页面唯一标识,用于区分不同页面
		 * @param {Function} loadDataFunc - 数据加载函数
		 * @param {Number} delay - 延迟刷新时间(毫秒),默认1000ms
		 */
		handleAutoRefresh(pageKey, loadDataFunc, delay = 1000) {
			const storageKey = `${pageKey}_loaded`;
			const hasLoadedBefore = uni.getStorageSync(storageKey);
			
			if (!hasLoadedBefore) {
				// 首次加载,标记已加载并延迟后自动刷新
				uni.setStorageSync(storageKey, 'true');
				this.isFirstLoad = true;
				
				// 先加载一次数据
				if (typeof loadDataFunc === 'function') {
					loadDataFunc();
				}
				
				// 延迟后自动刷新一次,确保数据加载成功
				setTimeout(() => {
					console.log(`[${pageKey}] 首次加载,自动刷新数据...`);
					if (typeof loadDataFunc === 'function') {
						loadDataFunc();
					}
				}, delay);
			} else {
				// 非首次加载,正常加载数据
				this.isFirstLoad = false;
				if (typeof loadDataFunc === 'function') {
					loadDataFunc();
				}
			}
		},
		
		/**
		 * 清除页面加载标记(用于调试或重置)
		 * @param {String} pageKey - 页面唯一标识
		 */
		clearAutoRefreshFlag(pageKey) {
			const storageKey = `${pageKey}_loaded`;
			uni.removeStorageSync(storageKey);
		}
	}
}
