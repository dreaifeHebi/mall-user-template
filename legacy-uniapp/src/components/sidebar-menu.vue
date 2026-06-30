<template>
	<view>
		<!-- 侧边浮窗遮罩 -->
		<view class="sidebar-overlay" v-if="visible" @click="handleClose"></view>
		
		<!-- 侧边栏 -->
		<view class="sidebar" :class="{active: visible}">
			<view class="sidebar-content">
				<!-- 语言选择 -->
				<view class="sidebar-item" @click="showLanguageSelector">
					<text class="sidebar-item-icon">🌐</text>
					<text class="sidebar-item-text">{{ $t('index.sidebarMenu.language') }}</text>
					<text class="sidebar-item-arrow">›</text>
				</view>
				
				<!-- 联系客服 -->
				<view class="sidebar-item" @click="contactService">
					<text class="sidebar-item-icon">👥</text>
					<text class="sidebar-item-text">{{ $t('index.sidebarMenu.contactService') }}</text>
					<text class="sidebar-item-arrow">›</text>
				</view>
				
				<!-- 帮助中心 -->
				<view class="sidebar-item" @click="goToHelpCenter">
					<text class="sidebar-item-icon">❓</text>
					<text class="sidebar-item-text">{{ $t('index.sidebarMenu.helpCenter') }}</text>
					<text class="sidebar-item-arrow">›</text>
				</view>
				
				<!-- 分类分隔线 -->
				<view class="sidebar-divider">
					<text class="sidebar-divider-text">{{ $t('index.sidebarMenu.categories') }}</text>
				</view>
				
				<!-- 分类列表 -->
				<view class="sidebar-categories">
					<view v-for="(item, index) in categoryList" :key="item.id" 
						  class="sidebar-category-item" 
						  @click="selectCategory(item)">
						<text class="sidebar-category-name">{{item.name}}</text>
					</view>
				</view>
				
				<!-- 关于我们 -->
				<view class="sidebar-item sidebar-item-bottom" @click="goToAbout">
					<text class="sidebar-item-icon">ℹ️</text>
					<text class="sidebar-item-text">{{ $t('index.sidebarMenu.aboutUs') }}</text>
					<text class="sidebar-item-arrow">›</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'SidebarMenu',
	props: {
		visible: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			categoryList: []
		}
	},
	watch: {
		visible(newVal) {
			if (newVal && this.categoryList.length === 0) {
				this.loadCategoryList();
			}
		}
	},
	methods: {
		handleClose() {
			this.$emit('close');
		},
		
		// 加载分类列表
		async loadCategoryList() {
			try {
				const { fetchCategoryInfoList } = await import('@/api/product.js');
				const response = await fetchCategoryInfoList();
				this.categoryList = response.data || [];
			} catch (error) {
				console.error('加载分类列表失败:', error);
			}
		},
		
		// 显示语言选择器
		showLanguageSelector() {
			const supportedLanguages = [
				{ name: '中文 Chinese', code: 'zh-CN' },
				{ name: 'English 英文', code: 'en-US' }
			];
			
			const itemList = supportedLanguages.map(lang => lang.name);
			uni.showActionSheet({
				itemList: itemList,
				success: (res) => {
					const selectedLang = supportedLanguages[res.tapIndex];
					this.selectLanguage(selectedLang.code);
				}
			});
			this.handleClose();
		},
		
		// 选择语言
		selectLanguage(locale) {
			if (locale !== this.$i18n.locale) {
				this.$i18n.locale = locale;
				uni.setStorageSync('locale', locale);
				this.$forceUpdate();
			}
		},
		
		// 联系客服
		contactService() {
			uni.navigateTo({
				url: '/pages/contact/contact'
			});
			this.handleClose();
		},
		
		// 帮助中心
		goToHelpCenter() {
			uni.navigateTo({
				url: '/pages/help/help'
			});
			this.handleClose();
		},
		
		// 关于我们
		goToAbout() {
			uni.navigateTo({
				url: '/pages/about/about'
			});
			this.handleClose();
		},
		
		// 选择分类
		selectCategory(category) {
			// 判断当前页面，如果是分类页面则直接选择，否则跳转
			const currentPages = getCurrentPages();
			const currentPage = currentPages[currentPages.length - 1];
			
			if (currentPage.route === 'pages/category/category') {
				// 在分类页面，触发父组件的选择方法
				this.$emit('selectCategory', category);
			} else {
				// 不在分类页面，跳转到分类页面
				uni.navigateTo({
					url: `/pages/category/category?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}`
				});
			}
			this.handleClose();
		}
	}
}
</script>

<style lang="scss" scoped>
/* 侧边栏样式 */
.sidebar-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1000;
}

.sidebar {
	position: fixed;
	top: 0;
	right: -400upx;
	width: 400upx;
	height: 100vh;
	background: #fff;
	z-index: 1001;
	transition: right 0.3s ease;
	box-shadow: -4upx 0 16upx rgba(0, 0, 0, 0.1);
	
	&.active {
		right: 0;
	}
}

.sidebar-content {
	padding-top: 120upx; /* 避开状态栏和导航栏 */
	height: 100%;
	overflow-y: auto;
}

.sidebar-item {
	display: flex;
	align-items: center;
	padding: 32upx 30upx;
	border-bottom: 1px solid #f0f0f0;
	transition: background-color 0.3s ease;
	
	&:hover {
		background-color: #f8f8f8;
	}
	
	&.sidebar-item-bottom {
		margin-top: auto;
		border-top: 1px solid #f0f0f0;
		border-bottom: none;
	}
}

.sidebar-item-icon {
	font-size: 36upx;
	margin-right: 24upx;
	width: 40upx;
	text-align: center;
}

.sidebar-item-text {
	flex: 1;
	font-size: 30upx;
	color: #333;
}

.sidebar-item-arrow {
	font-size: 32upx;
	color: #999;
	margin-left: 10upx;
}

.sidebar-divider {
	padding: 20upx 30upx 16upx;
	border-bottom: 1px solid #e0e0e0;
	background-color: #f8f8f8;
}

.sidebar-divider-text {
	font-size: 26upx;
	color: #666;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 1upx;
}

.sidebar-categories {
	max-height: 400upx;
	overflow-y: auto;
}

.sidebar-category-item {
	padding: 24upx 30upx;
	border-bottom: 1px solid #f5f5f5;
	background-color: #fafafa;
	transition: background-color 0.3s ease;
	
	&:hover {
		background-color: #f0f0f0;
	}
	
	&:last-child {
		border-bottom: 1px solid #e0e0e0;
	}
}

.sidebar-category-name {
	font-size: 28upx;
	color: #555;
	line-height: 1.4;
}
</style>