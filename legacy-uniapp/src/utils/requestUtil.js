import Request from '@/js_sdk/luch-request/request.js'
import { API_BASE_URL} from '@/utils/appConfig.js';
import store from '@/store'

const http = new Request()

http.setConfig((config) => { /* 设置全局配置 */
	config.baseUrl = API_BASE_URL /* 根域名不同 */
	config.header = {
		...config.header
	}
	return config
})

/**
 * 自定义验证器，如果返回true 则进入响应拦截器的响应成功函数(resolve)，否则进入响应拦截器的响应错误函数(reject)
 * @param { Number } statusCode - 请求响应体statusCode（只读）
 * @return { Boolean } 如果为true,则 resolve, 否则 reject
 */
http.validateStatus = (statusCode) => {
	return statusCode === 200
}

http.interceptor.request((config, cancel) => { /* 请求之前拦截器 */
	const token = uni.getStorageSync('token');
	if(token){
		config.header = {
			'Authorization': `Bearer ${token}`,
			...config.header
		}
	}else{
		config.header = {
			...config.header
		}
	}
	
	// 合并自定义的header配置
	if (config.customHeader) {
		config.header = {
			...config.header,
			...config.customHeader
		};
		delete config.customHeader; // 删除自定义字段避免传递到底层
	}
	
	/*
	if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
	  cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
	}
	*/
	return config
})

http.interceptor.response((response) => { /* 请求之后拦截器 */
	const res = response.data;
	if (res.code !== 200) {
		//提示错误信息
		uni.showToast({
			title:res.message,
			duration:1500
		})
		//401未登录处理
		if (res.code === 401) {
			// 清除过期的token和用户信息
			uni.removeStorageSync('token');
			uni.removeStorageSync('userInfo');
			
			// 更新Vuex状态
			store.commit('logout');
			
			uni.showModal({
				title: '提示',
				content: '登录已过期，请重新登录',
				confirmText:'重新登录',
				cancelText:'取消',
				success: function(modalRes) {
					if (modalRes.confirm) {
						uni.navigateTo({
							url: '/pages/public/login'
						})
					} else if (modalRes.cancel) {
						// 用户点击取消
					}
				}
			});
		}
		return Promise.reject(response);
	} else {
		return response.data;
	}
}, (response) => {
	//提示错误信息 - 提供更友好的错误提示
	const errorMsg = response.errMsg || '网络请求失败';
	
	// 根据不同的错误类型提供不同的提示
	let friendlyMsg = errorMsg;
	if (errorMsg.includes('timeout')) {
		friendlyMsg = '请求超时，请检查网络连接';
	} else if (errorMsg.includes('fail')) {
		friendlyMsg = '网络连接失败，请检查网络设置';
	} else if (errorMsg.includes('abort')) {
		friendlyMsg = '请求已取消';
	}
	
	uni.showToast({
		title: friendlyMsg,
		icon: 'none',
		duration: 2000
	})
	return Promise.reject(response);
})

export function request (options = {}) {
	return http.request(options);
}

export default request