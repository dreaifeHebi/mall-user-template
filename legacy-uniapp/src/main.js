import { createSSRApp } from 'vue'
import store from './store'
import i18n from './i18n'
import App from './App'

const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	app.use(i18n)
	
	// 全局属性设置
	app.config.globalProperties.$api = {msg, prePage}
	
	return {
		app
	}
}