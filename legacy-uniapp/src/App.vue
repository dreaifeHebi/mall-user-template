<script>
	/**
	 * vuex管理登陆状态，具体可以参考官方登陆模板示例
	 */
	import {
		mapMutations,
		mapActions
	} from 'vuex';
	import { initLocale } from '@/utils/i18nUtil.js';
	import { updateTabBarI18n } from '@/utils/tabBarUtil.js';
	import swipeBackMixin from '@/mixins/swipeBackMixin.js';
	
	export default {
		mixins: [swipeBackMixin],
		methods: {
			...mapMutations(['login']),
			...mapActions(['refreshCartCount']),
			
			// 初始化TabBar国际化
			initTabBarI18n() {
				// 使用多次尝试确保TabBar正确初始化
				const attemptUpdate = (attempt = 0) => {
					setTimeout(() => {
						try {
							updateTabBarI18n();
							console.log(`TabBar国际化更新成功 (尝试 ${attempt + 1})`);
						} catch (error) {
							console.error(`TabBar国际化更新失败 (尝试 ${attempt + 1}):`, error);
							
							// 如果失败且尝试次数少于3次，再次尝试
							if (attempt < 2) {
								attemptUpdate(attempt + 1);
							}
						}
					}, (attempt + 1) * 100); // 100ms, 200ms, 300ms
				};
				
				attemptUpdate();
			}
		},
		onLaunch: function() {
			// 初始化语言设置
			initLocale();
			
			// 初始化TabBar国际化 - 使用多重延迟确保成功
			this.initTabBarI18n();
			
			// 初始化购物车数量
			setTimeout(() => {
				this.refreshCartCount();
			}, 500);
			
			let userInfo = uni.getStorageSync('userInfo') || '';
			if(userInfo.id){
				//更新登陆状态
				uni.getStorage({
					key: 'userInfo',
					success: (res) => {
						this.login(res.data);
					}
				});
			}
			// 初始化购物车数量
			this.refreshCartCount();
			
			// 监听购物车数据更新事件
			uni.$on('cartDataUpdated', () => {
				this.refreshCartCount();
			});
			
			// 监听用户信息更新事件
			uni.$on('userInfoUpdated', () => {
				this.$store.dispatch('getUserInfo');
			});
		},
		onShow: function() {
			// 每次应用显示时确保TabBar文本正确
			setTimeout(() => {
				updateTabBarI18n();
			}, 50);
		},
		onHide: function() {
		},
	}
</script>

<style lang='scss'>
	/*
		全局公共样式和字体图标
	*/
	@font-face {
		font-family: yticon;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_1078604_w4kpxh0rafi.ttf') format('truetype');
	}

	/* 全局字体设置 - 中文简繁体与英文通用优化，但排除图标字体 */
	*:not(.yticon):not([class*="icon-"]) {
		font-family: 
			/* 现代系统字体 - 优先级最高 */
			-apple-system, BlinkMacSystemFont, "Segoe UI",
			/* 中文简体字体 */
			"PingFang SC", "Microsoft YaHei UI", "Microsoft YaHei", "微软雅黑",
			/* 中文繁体字体 */
			"PingFang TC", "Microsoft JhengHei UI", "Microsoft JhengHei", "微軟正黑體",
			/* 通用CJK字体 */
			"Noto Sans CJK SC", "Source Han Sans SC", "Hiragino Sans GB",
			/* 英文优质字体 */
			"Helvetica Neue", Helvetica, Arial,
			/* 通用回退字体 */
			sans-serif;
		font-weight: 400;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-rendering: optimizeLegibility;
	}

	/* 全局文字颜色，但排除图标字体 */
	page, view, text:not(.yticon):not([class*="icon-"]) {
		color: #000;
		font-family: 
			/* 现代系统字体 - 优先级最高 */
			-apple-system, BlinkMacSystemFont, "Segoe UI",
			/* 中文简体字体 */
			"PingFang SC", "Microsoft YaHei UI", "Microsoft YaHei", "微软雅黑",
			/* 中文繁体字体 */
			"PingFang TC", "Microsoft JhengHei UI", "Microsoft JhengHei", "微軟正黑體",
			/* 通用CJK字体 */
			"Noto Sans CJK SC", "Source Han Sans SC", "Hiragino Sans GB",
			/* 英文优质字体 */
			"Helvetica Neue", Helvetica, Arial,
			/* 通用回退字体 */
			sans-serif;
		font-weight: 400;
		line-height: 1.6; /* 适合中英文混排的行高 */
		letter-spacing: 0.02em; /* 轻微增加字间距提高可读性 */
	}

	/* 保持特定颜色的元素 */
	.price, .price-value, .price-symbol {
		color: #ff6b35 !important;
	}

	.original-price {
		color: #999 !important;
	}

	.subtitle, .desc, .tip {
		color: #666 !important;
	}

	/* 针对不同字体大小的优化 */
	.title, .category-name, .brand-name, .product-name {
		font-weight: 500; /* 标题稍微加粗 */
	}

	.small-text, .category-subtitle, .brand-subtitle {
		font-weight: 400;
		font-size: 12px;
		line-height: 1.4;
	}

	/* 解决中文字体在不同大小下的显示问题 */
	text[class*="name"], 
	.name,
	.title {
		text-rendering: optimizeLegibility;
		font-feature-settings: "kern" 1;
	}

	/* 中文简体优化 */
	:lang(zh-CN), [lang="zh-CN"] {
		font-family: "PingFang SC", "Microsoft YaHei UI", "Microsoft YaHei", "微软雅黑", sans-serif !important;
		letter-spacing: 0.02em;
	}

	/* 中文繁体优化 */
	:lang(zh-TW), [lang="zh-TW"], :lang(zh-HK), [lang="zh-HK"] {
		font-family: "PingFang TC", "Microsoft JhengHei UI", "Microsoft JhengHei", "微軟正黑體", sans-serif !important;
		letter-spacing: 0.02em;
	}

	/* 针对不同文字大小的优化 */
	.uni-text, text {
		font-size: inherit;
		line-height: 1.6;
		letter-spacing: 0.01em;
	}

	/* 修复不同平台字体渲染差异 - 适配中英文混合 */
	.category-name,
	.brand-name,
	.product-name,
	.nav-item-name {
		font-weight: 500;
		font-size: 14px;
		line-height: 1.5;
		letter-spacing: 0.02em;
		text-rendering: optimizeLegibility;
	}

	/* 英文文本优化 */
	:lang(en), [lang="en"] {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
		letter-spacing: 0.01em;
	}

	/* TabBar 顶部定位样式 - H5 环境 */
	/* #ifdef H5 */
	/* 将 tabBar 移动到顶部 */
	.uni-tabbar {
		position: fixed !important;
		top: 44px !important; /* 导航栏高度 */
		bottom: auto !important;
		z-index: 998 !important;
		width: 100% !important;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
	}
	
	/* 隐藏底部的原tabBar空间 */
	body {
		padding-bottom: 0 !important;
	}
	
	.uni-app--showlayout + .uni-tabbar {
		top: 44px !important;
	}
	/* #endif */

	.yticon {
		font-family: "yticon" !important;
		font-size: 16px;
		font-style: normal;
		font-weight: normal !important;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-rendering: auto !important;
	}

	.icon-yiguoqi1:before {
		content: "\e700";
	}

	.icon-iconfontshanchu1:before {
		content: "\e619";
	}

	.icon-iconfontweixin:before {
		content: "\e611";
	}

	.icon-alipay:before {
		content: "\e636";
	}

	.icon-shang:before {
		content: "\e624";
	}

	.icon-shouye:before {
		content: "\e626";
	}

	.icon-shanchu4:before {
		content: "\e622";
	}

	.icon-xiaoxi:before {
		content: "\e618";
	}

	.icon-jiantour-copy:before {
		content: "\e600";
	}

	.icon-fenxiang2:before {
		content: "\e61e";
	}

	.icon-pingjia:before {
		content: "\e67b";
	}

	.icon-daifukuan:before {
		content: "\e68f";
	}

	.icon-pinglun-copy:before {
		content: "\e612";
	}

	.icon-dianhua-copy:before {
		content: "\e621";
	}

	.icon-shoucang:before {
		content: "\e645";
	}

	.icon-xuanzhong2:before {
		content: "\e62f";
	}

	.icon-gouwuche_:before {
		content: "\e630";
	}

	.icon-icon-test:before {
		content: "\e60c";
	}

	.icon-icon-test1:before {
		content: "\e632";
	}

	.icon-bianji:before {
		content: "\e646";
	}

	.icon-jiazailoading-A:before {
		content: "\e8fc";
	}

	.icon-zuoshang:before {
		content: "\e613";
	}

	.icon-jia2:before {
		content: "\e60a";
	}

	.icon-huifu:before {
		content: "\e68b";
	}

	.icon-sousuo:before {
		content: "\e7ce";
	}

	.icon-arrow-fine-up:before {
		content: "\e601";
	}

	.icon-hot:before {
		content: "\e60e";
	}

	.icon-lishijilu:before {
		content: "\e6b9";
	}

	.icon-zhengxinchaxun-zhifubaoceping-:before {
		content: "\e616";
	}

	.icon-naozhong:before {
		content: "\e64a";
	}

	.icon-xiatubiao--copy:before {
		content: "\e608";
	}

	.icon-shoucang_xuanzhongzhuangtai:before {
		content: "\e6a9";
	}

	.icon-jia1:before {
		content: "\e61c";
	}

	.icon-bangzhu1:before {
		content: "\e63d";
	}

	.icon-arrow-left-bottom:before {
		content: "\e602";
	}

	.icon-arrow-right-bottom:before {
		content: "\e603";
	}

	.icon-arrow-left-top:before {
		content: "\e604";
	}

	.icon-icon--:before {
		content: "\e744";
	}

	.icon-zuojiantou-up:before {
		content: "\e605";
	}

	.icon-xia:before {
		content: "\e62d";
	}

	.icon--jianhao:before {
		content: "\e60b";
	}

	.icon-weixinzhifu:before {
		content: "\e61a";
	}

	.icon-comment:before {
		content: "\e64f";
	}

	.icon-weixin:before {
		content: "\e61f";
	}

	.icon-fenlei1:before {
		content: "\e620";
	}

	.icon-erjiye-yucunkuan:before {
		content: "\e623";
	}

	.icon-Group-:before {
		content: "\e688";
	}

	.icon-you:before {
		content: "\e606";
	}

	.icon-forward:before {
		content: "\e607";
	}

	.icon-tuijian:before {
		content: "\e610";
	}

	.icon-bangzhu:before {
		content: "\e679";
	}

	.icon-share:before {
		content: "\e656";
	}

	.icon-yiguoqi:before {
		content: "\e997";
	}

	.icon-shezhi1:before {
		content: "\e61d";
	}

	.icon-fork:before {
		content: "\e61b";
	}

	.icon-kafei:before {
		content: "\e66a";
	}

	.icon-iLinkapp-:before {
		content: "\e654";
	}

	.icon-saomiao:before {
		content: "\e60d";
	}

	.icon-shezhi:before {
		content: "\e60f";
	}

	.icon-shouhoutuikuan:before {
		content: "\e631";
	}

	.icon-gouwuche:before {
		content: "\e609";
	}

	.icon-dizhi:before {
		content: "\e614";
	}

	.icon-fenlei:before {
		content: "\e706";
	}

	.icon-xingxing:before {
		content: "\e70b";
	}

	.icon-tuandui:before {
		content: "\e633";
	}

	.icon-zuanshi:before {
		content: "\e615";
	}

	.icon-zuo:before {
		content: "\e63c";
	}

	.icon-shoucang2:before {
		content: "\e62e";
	}

	.icon-shouhuodizhi:before {
		content: "\e712";
	}

	.icon-yishouhuo:before {
		content: "\e71a";
	}

	.icon-dianzan-ash:before {
		content: "\e617";
	}





	view,
	scroll-view,
	swiper,
	swiper-item,
	cover-view,
	cover-image,
	icon,
	text,
	rich-text,
	progress,
	button,
	checkbox,
	form,
	input,
	label,
	radio,
	slider,
	switch,
	textarea,
	navigator,
	audio,
	camera,
	image,
	video {
		box-sizing: border-box;
	}
	/* 骨架屏替代方案 */
	.Skeleton {
		background: #f3f3f3;
		padding: 20upx 0;
		border-radius: 8upx;
	}

	/* 图片载入替代方案 */
	.image-wrapper {
		font-size: 0;
		background: #f3f3f3;
		border-radius: 4px;

		image {
			width: 100%;
			height: 100%;
			transition: .6s;
			opacity: 0;

			&.loaded {
				opacity: 1;
			}
		}
	}

	.clamp {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
		color: #000;
		font-family: "Hiragino Sans", "ヒラギノ角ゴシック", "Hiragino Kaku Gothic ProN", "Hiragino Sans GB", "Meiryo", "Microsoft YaHei", "MS PGothic", sans-serif;
	}

	.common-hover {
		background: #f5f5f5;
	}

	/*边框*/
	.b-b:after,
	.b-t:after {
		position: absolute;
		z-index: 3;
		left: 0;
		right: 0;
		height: 0;
		content: '';
		transform: scaleY(.5);
		border-bottom: 1px solid $border-color-base;
	}

	.b-b:after {
		bottom: 0;
	}

	.b-t:after {
		top: 0;
	}

	/* button样式改写 */
	uni-button,
	button {
		height: 80upx;
		line-height: 80upx;
		font-size: $font-lg + 2upx;
		font-weight: normal;

		&.no-border:before,
		&.no-border:after {
			border: 0;
		}
	}

	uni-button[type=default],
	button[type=default] {
		color: $font-color-dark;
	}

	/* input 样式 */
	.input-placeholder {
		color: #999999;
	}

	.placeholder {
		color: #999999;
	}
</style>
