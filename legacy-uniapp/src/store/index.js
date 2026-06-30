import { createStore } from 'vuex'
import { getLocalCartCount } from '@/utils/localCartUtil.js'
import { fetchCartList } from '@/api/cart.js'
import { memberInfo } from '@/api/member.js'
import { t } from '@/utils/i18nUtil.js'

const store = createStore({
	state: {
		hasLogin: false,
		userInfo: {},
		cartCount: 0, // 购物车数量
		locale: 'zh-CN', // 当前语言
	},
	mutations: {
		login(state, provider) {

			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: provider  
			})
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({  
                key: 'userInfo'  
            });
			uni.removeStorage({
			    key: 'token'  
			})
		},
		// 更新购物车数量
		setCartCount(state, count) {
			state.cartCount = count;
			// 设置徽章
			if (count > 0) {
				uni.setTabBarBadge({
					index: 2, // 购物车tab的索引
					text: count.toString(),
					fail: () => {} // 忽略非tabbar页面的错误
				});
			} else {
				uni.removeTabBarBadge({
					index: 2,
					fail: () => {} // 忽略非tabbar页面的错误
				});
			}
		},
		// 更新用户信息
		updateUserInfo(state, userInfo) {
			state.userInfo = userInfo;
			// 同时更新本地存储
			uni.setStorage({
			    key: 'userInfo',  
			    data: userInfo  
			});
		},
		// 设置语言
		setLocale(state, locale) {
			state.locale = locale;
			// 存储到本地
			uni.setStorage({
				key: 'locale',
				data: locale
			});
		}
	},
	actions: {
		// 刷新购物车数量
		async refreshCartCount({ commit, state }) {
			try {
				let count = 0;
				if (state.hasLogin) {
					// 已登录用户，从服务器获取购物车数量
					const response = await fetchCartList();
					const cartList = response.data || [];
					count = cartList.reduce((total, item) => total + item.quantity, 0);
				} else {
					// 未登录用户，从本地获取购物车数量
					count = getLocalCartCount();
				}
				commit('setCartCount', count);
			} catch (error) {
				console.error('刷新购物车数量失败:', error);
				// 如果获取失败，尝试从本地获取
				const localCount = getLocalCartCount();
				commit('setCartCount', localCount);
			}
		},
		// 获取用户信息
		async getUserInfo({ commit, state }) {
			try {
				if (!state.hasLogin) {
					return { success: false, message: t('error.loginRequired') };
				}
				
				const response = await memberInfo();
				if (response.code === 200) {
					commit('updateUserInfo', response.data);
					return { success: true, data: response.data };
				} else {
					console.error('获取用户信息失败:', response.message);
					return { success: false, message: response.message };
				}
			} catch (error) {
				console.error('获取用户信息失败:', error);
				return { success: false, message: t('common.networkError') };
			}
		},
		// 切换语言
		changeLocale({ commit }, locale) {
			commit('setLocale', locale);
		}
	}
})

export default store
