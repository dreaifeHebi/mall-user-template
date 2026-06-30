<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="top-nav">
			<view class="nav-left" @click="goToHome">
				<text class="logo-text">BANANA MAN</text>
			</view>
			<view class="nav-right">
				<view class="nav-icon" @click="goToLogin">
					<image src="/static/tab-my.png" class="nav-icon-img" mode="aspectFit"></image>
				</view>
				<view class="nav-icon" @click="goToCart">
					<image src="/static/tab-cart.png" class="nav-icon-img" mode="aspectFit"></image>
					<view v-if="cartCount > 0" class="cart-badge" :class="getCartBadgeClass(cartCount)">
						<text class="badge-text">{{getCartCountText(cartCount)}}</text>
					</view>
				</view>
				<view class="nav-divider"></view>
				<view class="nav-icon" @click="toggleSidebar">
					<image src="/static/tab-cate.png" class="nav-icon-img" mode="aspectFit"></image>
				</view>
			</view>
		</view>
		
		<!-- 侧边浮窗 -->
		<view class="sidebar-overlay" v-if="showSidebar" @click="closeSidebar"></view>
		<view class="sidebar" :class="{active: showSidebar}">
			<view class="sidebar-content">
				<!-- 语言选择器 - 右上角 -->
				<view class="sidebar-header">
					<view class="language-selector" @click="showLanguageSelector">
						<text class="language-text">Language</text>
						<text class="language-arrow" :class="{rotated: showLanguageDropdown}">▼</text>
						<!-- 下拉菜单 -->
						<view class="language-dropdown" v-if="showLanguageDropdown">
							<view class="language-option" @click.stop="selectLanguage('zh-CN')">
								<text>简体中文</text>
							</view>
							<view class="language-option" @click.stop="selectLanguage('zh-TW')">
								<text>繁體中文</text>
							</view>
							<view class="language-option" @click.stop="selectLanguage('en-US')">
								<text>English</text>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 联系客服 -->
				<view class="sidebar-item" @click="contactService">
					<text class="sidebar-item-text">{{ $t('index.contactService') }}</text>
				</view>
				
				<!-- 帮助中心 -->
				<view class="sidebar-item" @click="goToHelpCenter">
					<text class="sidebar-item-text">{{ $t('index.helpCenter') }}</text>
				</view>
				
				<!-- 分类标题 -->
				<view class="sidebar-item" @click="goToCategoryPage">
					<text class="sidebar-item-text">{{ $t('common.category') }}</text>
				</view>
				
				<!-- 分类列表 -->
				<view class="sidebar-categories">
					<view v-for="(item, index) in categoryList" :key="item.id" 
						  class="sidebar-category-item" 
						  @click="selectCategoryFromSidebar(item)">
						<text class="sidebar-category-name">{{item.name}}</text>
					</view>
				</view>
				
				<!-- 关于我们 -->
				<view class="sidebar-item sidebar-item-bottom" @click="goToAbout">
					<text class="sidebar-item-text">{{ $t('index.aboutUs') }}</text>
				</view>
			</view>
		</view>

		<!-- 搜索框 -->
		<view class="search-section">
			<view class="search-box" @click="focusSearchInput">
				<input ref="searchInput"
					   class="search-input" 
					   type="text" 
					   v-model="searchKeyword" 
					   :placeholder="$t('index.searchPlaceholder')"
					   @confirm="handleSearch"
					   @input="onSearchInput"
					   @focus="onSearchFocus"
					   @blur="onSearchBlur"
					   confirm-type="search"
					   :focus="searchInputFocus" />
				<view class="clear-btn" v-if="searchKeyword.trim()" @click.stop="clearSearch">
					<text class="yticon icon-guanbi"></text>
				</view>
				<view class="search-btn" @click="handleSearch">
					<text class="yticon icon-sousuo"></text>
				</view>
			</view>
		</view>
		<!-- 轮播图 -->		<view class="carousel-section" v-if="bannerList && bannerList.length > 0">
			<swiper class="carousel" circular @change="swiperChange" indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff">
				<swiper-item v-for="(item, index) in bannerList" :key="index" class="carousel-item">
					<view class="banner-card">
						<image :src="item.imageUrl" mode="aspectFill" class="banner-image" />
						<view class="banner-info" v-if="item.title">
							<text class="banner-title">{{item.title}}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="content">
			<!-- 分类导航栏 -->
			<view class="category-nav-bar">
				<view class="category-nav-list" v-if="categoryList && categoryList.length > 0">
					<view v-for="(item, index) in categoryList" :key="item.id" 
						  class="category-nav-item" 
						  :class="{active: selectedCategoryId === item.id}"
						  @click="quickSelectCategory(item)">
						<text class="nav-item-name">{{item.name}}</text>
					</view>
				</view>
			</view>
			
			<!-- 右侧内容区域 -->
			<view class="right-content">
				<!-- 分类列表视图 -->
				<view v-if="currentView === 'category'" class="category-view">
					<view class="section-title">
						<text>{{ $t('index.allProducts') }}</text>
					</view>
					<scroll-view scroll-y class="category-scroll">
						<view class="category-grid">
							<view v-for="(item, index) in categoryList" :key="item.id" 
								  class="category-card" 
								  @click="selectCategory(item)">
								<view class="category-image">
									<image :src="item.icon || '/static/errorImage.jpg'" mode="aspectFill"></image>
								</view>
								<view class="category-info">
									<text class="category-name">{{item.name}}</text>
									<text class="category-subtitle">{{item.subTitle}}</text>
								</view>
							</view>
						</view>
						
						<!-- 暂无数据 -->
						<view v-if="!loading && categoryList.length === 0" class="empty-state">
							<image src="/static/emptyCart.jpg" class="empty-image"></image>
							<text class="empty-text">{{ $t('common.noData') }}</text>
						</view>
					</scroll-view>
				</view>
				
				<!-- 品牌列表视图 -->
				<view v-if="currentView === 'brand'" class="brand-view">
					<!-- 返回分类按钮 -->
					<view v-if="selectedCategoryId" class="back-to-category" @click="backToCategory">
						<text class="yticon icon-zuojiantou"></text>
						<text>{{ $t('category.backToCategory') }}</text>
					</view>
					
					<scroll-view scroll-y class="brand-scroll">
						<view class="brand-grid">
							<view v-for="(item, index) in brandList" :key="item.id" 
								  class="brand-card" 
								  @click="selectBrand(item)">
								<view class="brand-image">
									<image :src="item.logoUrl || '/static/errorImage.jpg'" mode="aspectFill"></image>
								</view>
								<view class="brand-info">
									<text class="brand-name">{{item.name}}</text>
									<text class="brand-subtitle">{{item.subTitle}}</text>
								</view>
							</view>
						</view>
						
						<!-- 暂无数据 -->
						<view v-if="!loading && brandList.length === 0" class="empty-state">
							<image src="/static/emptyCart.jpg" class="empty-image"></image>
							<text class="empty-text">{{ $t('common.noData') }}</text>
						</view>
					</scroll-view>
				</view>
				
				<!-- 商品列表视图 -->
				<view v-if="currentView === 'product'" class="product-view">
					<!-- 返回按钮 -->
					<view v-if="selectedBrandId" class="back-to-category" @click="backToBrand">
						<text class="yticon icon-zuojiantou"></text>
						<text>{{ $t('category.backToBrandList') }}</text>
					</view>
					<view v-else-if="selectedCategoryId" class="back-to-category" @click="backToCategory">
						<text class="yticon icon-zuojiantou"></text>
						<text>{{ $t('category.backToCategory') }}</text>
					</view>
					
					<!-- 商品列表 -->
					<scroll-view scroll-y class="product-scroll">
						<view class="product-list">
							<view v-for="(item, index) in productList" :key="item.id" 
								  class="product-item" 
								  @click="navToProductDetail(item)">
								<view class="product-image">
									<image :src="item.pic || '/static/errorImage.jpg'" mode="aspectFill"></image>
								</view>
								<view class="product-info">
									<text class="product-name">{{item.name}}</text>
									<!-- 参考价格显示（上方，根据语言显示美元或人民币） -->
									<view class="usd-price" v-if="exchangeRate && item.price">
										<text class="usd-text">≈ {{ formatPrice(item.price) }}</text>
									</view>
									<!-- 日元价格显示（下方） -->
									<view class="product-price">
										<text class="price-symbol">¥</text>
										<text class="price-value">{{item.price}}</text>
										<text class="price-currency">JPY</text>
										<text v-if="item.originalPrice && item.originalPrice > item.price" class="original-price">
											¥{{item.originalPrice}} JPY
										</text>
									</view>
								</view>
							</view>
						</view>

						<!-- 分页控件 -->
						<view class="pagination" v-if="totalPages > 1">
							<view class="page-info">
								{{ $t('category.pageInfo', { current: currentPage, total: totalPages, count: totalCount }) }}
							</view>
							<view class="page-controls">
								<view class="page-btn" 
									  :class="{disabled: currentPage <= 1}" 
									  @click="changePage(currentPage - 1)">
									{{ $t('category.prevPage') }}
								</view>
								<view v-for="page in visiblePages" :key="page" 
									  class="page-num" 
									  :class="{active: page === currentPage}" 
									  @click="changePage(page)">
									{{page}}
								</view>
								<view class="page-btn" 
									  :class="{disabled: currentPage >= totalPages}" 
									  @click="changePage(currentPage + 1)">
									{{ $t('category.nextPage') }}
								</view>
							</view>
						</view>

						<!-- 暂无数据 -->
						<view v-if="!loading && productList.length === 0" class="empty-state">
							<image src="/static/emptyCart.jpg" class="empty-image"></image>
							<text class="empty-text">{{ $t('common.noData') }}</text>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>

		<!-- 加载状态 -->
		<view v-if="loading" class="loading-mask">
			<view class="loading-content">
				<text>{{ $t('common.loading') }}</text>
			</view>
		</view>

		<!-- 底部链接 -->
		<view class="footer-links">
			<view class="link-item" @click="navToPage('/pages/about/about')">
				<text>{{ $t('index.aboutUs') }}</text>
			</view>
			<view class="link-item" @click="showQrcode">
				<text>{{ $t('index.contactService') }}</text>
			</view>
			<view class="link-item" @click="navToPage('/pages/help/help')">
				<text>{{ $t('index.helpCenter') }}</text>
			</view>
		</view>
		
		<!-- 客服二维码弹窗 -->
		<view class="qrcode-modal" v-if="showQrcodeModal" @click="hideQrcode">
			<view class="qrcode-content" @click.stop>
				<view class="qrcode-header">
					<text class="qrcode-title">{{ $t('index.wechatService') }}</text>
					<text class="qrcode-close yticon icon-guanbi" @click="hideQrcode"></text>
				</view>
				<view class="qrcode-body">
					<text class="qrcode-desc">{{ $t('index.scanQrcode') }}</text>
					<view class="qrcode-container">
						<image v-if="qrcodeUrl" 
							   :src="qrcodeUrl" 
							   mode="aspectFit" 
							   class="qrcode-image"
							   @error="handleImageError">
						</image>
						<view v-else class="qrcode-placeholder">
							<text class="placeholder-text">{{qrcodeLoading ? $t('common.loading') : $t('index.noQrcode')}}</text>
						</view>
					</view>
					<text class="qrcode-tip">{{ $t('index.workingHours') }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>	import {
		fetchRecommendProductList
	} from '@/api/home.js';
	import {
		fetchProductList,
		searchProductList,
		fetchCategoryInfoList,
		fetchCategoryInfo,
		fetchProductDetail,
		fetchBrandInfoList,
		fetchBrandInfoListByCategory
	} from '@/api/product.js';
	import {
		getServiceQrcode
	} from '@/api/service.js';
	import {
		fetchBannerList
	} from '@/api/banner.js';
	import { setPageTitle } from '@/utils/pageTitleUtil.js';
	import { getExchangeRateByLocale, formatPriceByLocale } from '@/utils/exchangeRateUtil.js';
	import { processProductList, processCategoryList, processNestedCategories, processBrandList } from '@/utils/textProcessor.js';
	import languageRefreshMixin from '@/mixins/languageRefreshMixin.js';
	import autoRefreshMixin from '@/mixins/autoRefreshMixin.js';
	import swipeBackMixin from '@/mixins/swipeBackMixin.js';
	import { switchLanguage } from '@/utils/i18nUtil.js';
	import { mapState, mapActions } from 'vuex';
	
		export default {
		mixins: [languageRefreshMixin, autoRefreshMixin, swipeBackMixin],
		data() {
			return {
				// 原有搜索框数据
				searchKeyword: '',
				searchInputFocus: false,
				
				// 侧边栏状态
				showSidebar: false,
				showLanguageDropdown: false,
				categoryList: [], // 添加分类列表				// 轮播图数据
				swiperCurrent: 0,
				bannerList: [],
				recommendProductList: [],
				
				// 客服二维码数据
				showQrcodeModal: false,
				qrcodeUrl: '',
				qrcodeLoading: false,
				
				// 首次加载标记
				isFirstLoad: true,
				
				// 分类系统数据
				currentView: 'category', // 'category' | 'brand' | 'product'
				selectedCategoryId: null,
				selectedCategoryName: '',
				selectedBrandId: null,
				selectedBrandName: '',
				
				// 商品排序
				sortType: 'default', // default, price_asc, price_desc, sale_desc
				
				// 分类列表
				categoryList: [],
				
				// 品牌列表
				brandList: [],
				
				// 商品列表
				productList: [],
				loading: false,
				
				// 分页
				currentPage: 1,
				pageSize: 10,
				totalCount: 0,
				totalPages: 0,
				
				// 汇率相关
				exchangeRate: null // JPY 汇率（根据语言显示 USD 或 CNY）
			};
		},
		computed: {
			...mapState(['cartCount']),
			// 计算可见的页码
			visiblePages() {
				const pages = [];
				const start = Math.max(1, this.currentPage - 2);
				const end = Math.min(this.totalPages, start + 4);
				
				for (let i = start; i <= end; i++) {
					pages.push(i);
				}
				return pages;
			}
		},
		onLoad() {
			// 使用自动刷新mixin处理首次加载
			this.handleAutoRefresh('indexPage', () => {
				this.loadData();
				this.loadCategoryList();
				this.initExchangeRate();
			});
			
			this.refreshCartCount();
			
			// 隐藏底部tabBar
			uni.hideTabBar();
			
			// 临时测试：设置一个购物车数量来验证徽章显示
			console.log('当前购物车数量:', this.cartCount);
		},
		onShow() {
			// 设置页面标题
			setPageTitle('pageTitle.home');
			// 检查是否需要刷新数据（例如从商品详情页返回）
			const needRefresh = uni.getStorageSync('needRefreshHomePage');
			if (needRefresh) {
				this.loadData();
				uni.removeStorageSync('needRefreshHomePage');
			}
			// 刷新购物车数量
			this.refreshCartCount();
			
			// 隐藏底部tabBar
			uni.hideTabBar();
		},
		onPullDownRefresh() {
			this.loadData();
		},
		methods: {
			...mapActions(['refreshCartCount']),
			
			// 自定义滑动手势返回处理
			onSwipeBack() {
				// 如果当前在商品视图，尝试返回品牌视图或分类视图
				if (this.currentView === 'product') {
					if (this.selectedBrandId) {
						this.backToBrand();
					} else {
						this.backToCategory();
					}
					return true;
				}
				// 如果当前在品牌视图，返回分类视图
				else if (this.currentView === 'brand') {
					this.backToCategory();
					return true;
				}
				return false;
			},
			// ========== 顶部导航栏方法 ==========
			
			// 回到首页
			goToHome() {
				// 重置到分类视图
				this.backToCategory();
			},
			
			// 跳转到登录/用户页面
			goToLogin() {
				const token = uni.getStorageSync('token');
				if (token) {
					// 已登录，跳转到用户中心
					uni.switchTab({
						url: '/pages/user/user'
					});
				} else {
					// 未登录，跳转到登录页
					uni.navigateTo({
						url: '/pages/public/login'
					});
				}
			},
			
			// 跳转到购物车
			goToCart() {
				uni.switchTab({
					url: '/pages/cart/cart'
				});
			},
			
			// 跳转到分类页面
			goToCategory() {
				uni.switchTab({
					url: '/pages/category/category'
				});
			},
			
			// 侧边栏相关方法
			toggleSidebar() {
				this.showSidebar = !this.showSidebar;
				// 如果打开侧边栏且分类列表为空，则加载分类列表
				if (this.showSidebar && this.categoryList.length === 0) {
					this.loadCategoryList();
				}
			},
			
			closeSidebar() {
				this.showSidebar = false;
				this.showLanguageDropdown = false;
			},
			

			
			// 显示语言选择器
			showLanguageSelector() {
				this.showLanguageDropdown = !this.showLanguageDropdown;
			},
			
			// 选择语言
			selectLanguage(locale) {
				if (locale !== this.$i18n.locale) {
					// 使用统一的语言切换方法
					switchLanguage(locale);
				}
				// 关闭下拉框但不关闭侧边栏
				this.showLanguageDropdown = false;
			},
			
			// 联系客服
			contactService() {
				uni.navigateTo({
					url: '/pages/contact/contact'
				});
				this.closeSidebar();
			},
			
			// 帮助中心
			goToHelpCenter() {
				uni.navigateTo({
					url: '/pages/help/help'
				});
				this.closeSidebar();
			},
			
			// 关于我们
			goToAbout() {
				uni.navigateTo({
					url: '/pages/about/about'
				});
				this.closeSidebar();
			},
			
			// 进入分类页面
			goToCategoryPage() {
				uni.switchTab({
					url: '/pages/category/category'
				});
				this.closeSidebar();
			},
			
			// 从侧边栏选择分类
			selectCategoryFromSidebar(category) {
				// 先存储分类信息，再跳转
				uni.setStorageSync('selectedCategoryFromSidebar', {
					categoryId: category.id,
					categoryName: category.name
				});
				
				// 跳转到分类页面
				uni.switchTab({
					url: '/pages/category/category'
				});
				this.closeSidebar();
			},
			
			// 初始化汇率
			async initExchangeRate() {
				try {
					const currentLocale = this.$i18n.locale;
					this.exchangeRate = await getExchangeRateByLocale(currentLocale);
					console.log('汇率初始化成功:', this.exchangeRate, '语言:', currentLocale);
				} catch (error) {
					console.error('汇率初始化失败:', error);
					// 即使失败也设置一个默认汇率，避免页面显示异常
					const currentLocale = this.$i18n.locale;
					this.exchangeRate = (currentLocale === 'zh-CN' || currentLocale === 'zh-TW') ? 0.052 : 0.0067;
				}
			},
			
			// 格式化价格显示（根据语言自动选择币种）
			formatPrice(jpyPrice) {
				if (!this.exchangeRate || !jpyPrice) {
					return '';
				}
				const currentLocale = this.$i18n.locale;
				return formatPriceByLocale(jpyPrice, this.exchangeRate, currentLocale);
			},
			
			//初期显示 - 加载数据
			async loadData(retryCount = 0) {
				try {
					this.loading = true;
					
					// 先确保加载推荐商品数据（这个是必须的）
					const productResponse = await fetchRecommendProductList({
						pageNum: 1,
						pageSize: 20
					});
					// 应用多语言文本处理
					this.recommendProductList = processProductList(productResponse.data || []);
					console.log('推荐商品数据:', this.recommendProductList);
					
					// 尝试加载轮播图数据（可选的）
					try {
						const bannerResponse = await fetchBannerList();
						this.bannerList = bannerResponse.data || [];
						console.log('轮播图数据:', this.bannerList);
					} catch (bannerError) {
						console.warn('轮播图加载失败，使用默认显示:', bannerError);
						// 轮播图加载失败时，可以设置空数组或使用默认图片
						this.bannerList = [];
					}
					
					this.loading = false;
					uni.stopPullDownRefresh();
				} catch (error) {
					console.error('加载数据失败:', error);
					this.loading = false;
					uni.stopPullDownRefresh();
					
					// 如果是首次加载失败，提供重试选项
					if (retryCount < 2) {
						uni.showModal({
							title: this.$t('common.tip'),
							content: this.$t('error.networkError') + ', ' + this.$t('common.retryPrompt'),
							confirmText: this.$t('common.retry'),
							cancelText: this.$t('common.cancel'),
							success: (res) => {
								if (res.confirm) {
									// 用户选择重试
									this.loadData(retryCount + 1);
								}
							}
						});
					} else {
						// 重试次数过多，显示错误信息
						uni.showToast({
							title: this.$t('error.networkError'),
							icon: 'none',
							duration: 2000
						});
					}
				}
			},			
			//轮播图切换
			swiperChange(e) {
				this.swiperCurrent = e.detail.current;
			},
			
			//处理搜索输入
			onSearchInput(e) {
				this.searchKeyword = e.detail.value;
			},

			//搜索框聚焦
			onSearchFocus() {
				this.searchInputFocus = true;
			},

			//搜索框失焦
			onSearchBlur() {
				this.searchInputFocus = false;
			},

			//点击搜索框聚焦
			focusSearchInput() {
				this.searchInputFocus = true;
			},
			
			//处理搜索
			handleSearch() {
				if (!this.searchKeyword.trim()) {
					uni.showToast({
						title: this.$t('index.enterProductName'),
						icon: 'none'
					});
					return;
				}
				
				// 将搜索关键字存储到全局状态中
				uni.setStorageSync('searchKeyword', this.searchKeyword.trim());
				
				// 清空当前搜索框
				this.searchKeyword = '';
				
				// 跳转到分类页面 (tabbar页面使用switchTab)
				uni.switchTab({
					url: '/pages/category/category'
				});
			},

			// 清空搜索
			clearSearch() {
				this.searchKeyword = '';
			},
			
			//点击商品卡片 - 跳转到商品详情页面并传递商品ID
			navToProductDetail(item) {
				uni.navigateTo({
					url: `/pages/product/product?id=${item.id}`
				});
			},
			
			//导航到其他页面
			navToPage(url) {
				uni.navigateTo({
					url: url
				});
			},
			
			//显示客服二维码
			async showQrcode() {
				this.showQrcodeModal = true;
				if (!this.qrcodeUrl && !this.qrcodeLoading) {
					await this.loadQrcode();
				}
			},
			
			//隐藏客服二维码
			hideQrcode() {
				this.showQrcodeModal = false;
			},
			
			//加载客服二维码
			async loadQrcode() {
				this.qrcodeLoading = true;
				try {
					const response = await getServiceQrcode();
					if (response.code === 200 && response.data) {
						this.qrcodeUrl = response.data;
					} else {
						//暂无客服微信图片
					}
				} catch (error) {
					console.error('获取客服二维码失败:', error);
				} finally {
					this.qrcodeLoading = false;
				}
			},
			
			//处理图片加载错误
			handleImageError() {
				this.qrcodeUrl = '';
			},
			
			// ========== 分类系统方法 ==========
			
			// 加载分类列表
			async loadCategoryList() {
				this.loading = true;
				try {
					const response = await fetchCategoryInfoList();
					// 应用多语言文本处理
					this.categoryList = processCategoryList(response.data || []);
				} catch (error) {
					console.error('加载分类列表失败:', error);
					uni.showToast({
						title: this.$t('common.failed'),
						icon: 'none'
					});
				} finally {
					this.loading = false;
				}
			},
			
			// 选择分类
			selectCategory(category) {
				this.selectedCategoryId = category.id;
				this.selectedCategoryName = category.name;
				this.currentView = 'brand';
				this.currentPage = 1;
				this.loadBrandList();
			},
			
			// 快速选择分类（从导航栏点击）
			quickSelectCategory(category) {
				// 如果点击的是当前已选中的分类，则返回到分类列表
				if (this.selectedCategoryId === category.id && this.currentView !== 'category') {
					this.backToCategory();
					return;
				}
				
				this.selectedCategoryId = category.id;
				this.selectedCategoryName = category.name;
				this.selectedBrandId = null;
				this.selectedBrandName = '';
				this.currentView = 'brand';
				this.currentPage = 1;
				this.sortType = 'default';
				this.loadBrandList();
			},
			
			// 加载品牌列表
			async loadBrandList() {
				this.loading = true;
				try {
					let response;
					if (this.selectedCategoryId) {
						// 根据分类加载品牌
						response = await fetchBrandInfoListByCategory(this.selectedCategoryId);
					} else {
						// 加载所有品牌
						response = await fetchBrandInfoList();
					}
					// 应用多语言文本处理
					this.brandList = processBrandList(response.data || []);
				} catch (error) {
					console.error('加载品牌列表失败:', error);
					uni.showToast({
						title: this.$t('common.failed'),
						icon: 'none'
					});
				} finally {
					this.loading = false;
				}
			},
			
			// 选择品牌
			selectBrand(brand) {
				this.selectedBrandId = brand.id;
				this.selectedBrandName = brand.name;
				this.currentView = 'product';
				this.currentPage = 1;
				this.loadProductList();
			},
			
			// 返回分类列表
			backToCategory() {
				this.currentView = 'category';
				this.selectedCategoryId = null;
				this.selectedCategoryName = '';
				this.selectedBrandId = null;
				this.selectedBrandName = '';
				this.sortType = 'default';
				this.currentPage = 1;
			},
			
			// 返回品牌列表
			backToBrand() {
				this.currentView = 'brand';
				this.selectedBrandId = null;
				this.selectedBrandName = '';
				this.sortType = 'default';
				this.currentPage = 1;
				this.loadBrandList();
			},
			
			// 加载商品列表
			async loadProductList() {
				this.loading = true;
				try {
					let params = {
						pageNum: this.currentPage,
						pageSize: this.pageSize
					};

					// 添加分类筛选
					if (this.selectedCategoryId) {
						params.productCategoryId = this.selectedCategoryId;
					}
					
					// 添加品牌筛选
					if (this.selectedBrandId) {
						params.brandId = this.selectedBrandId;
					}

					// 添加排序
					if (this.sortType !== 'default') {
						const sortMap = {
							'price_asc': { sort: 'price', order: 'asc' },
							'price_desc': { sort: 'price', order: 'desc' },
							'sale_desc': { sort: 'sale', order: 'desc' }
						};
						Object.assign(params, sortMap[this.sortType]);
					}

					let response = await fetchProductList(params);

					const productList = response.data.list || [];
					this.totalCount = response.data.total || 0;
					this.totalPages = Math.ceil(this.totalCount / this.pageSize);
					
					// 为每个商品加载详细信息以获取属性数据
					await this.loadProductDetails(productList);
					
				} catch (error) {
					console.error('加载商品列表失败:', error);
					uni.showToast({
						title: this.$t('common.failed'),
						icon: 'none'
					});
				} finally {
					this.loading = false;
				}
			},
			
			// 加载商品详细信息（获取属性数据）
			async loadProductDetails(productList) {
				if (!productList || productList.length === 0) {
					this.productList = [];
					return;
				}
				
				try {
					// 并发请求所有商品的详细信息，但限制并发数量以避免服务器压力
					const batchSize = 5; // 每批处理5个商品
					const enhancedProducts = [];
					
					for (let i = 0; i < productList.length; i += batchSize) {
						const batch = productList.slice(i, i + batchSize);
						const batchPromises = batch.map(async (product) => {
							try {
								const detailResponse = await fetchProductDetail(product.id);
								if (detailResponse && detailResponse.data && detailResponse.data.product) {
									// 合并基本信息和详细信息
									return {
										...product,
										...detailResponse.data.product
									};
								}
								return product; // 如果获取详情失败，返回原始商品信息
							} catch (error) {
								console.warn(`获取商品${product.id}详情失败:`, error);
								return product; // 获取详情失败，返回原始商品信息
							}
						});
						
						const batchResults = await Promise.all(batchPromises);
						enhancedProducts.push(...batchResults);
					}
					
					// 应用多语言文本处理
					this.productList = processProductList(enhancedProducts);
					
				} catch (error) {
					console.error('加载商品详细信息失败:', error);
					// 如果批量加载详情失败，至少显示基本的商品信息，也要应用文本处理
					this.productList = processProductList(productList);
				}
			},

			// ========== 商品排序和分页相关方法 ==========
			
			// 处理排序
			handleSort(sortType) {
				this.sortType = sortType;
				this.currentPage = 1; // 重置页码
				this.loadProductList();
			},

			// 切换分页
			changePage(page) {
				if (page < 1 || page > this.totalPages || page === this.currentPage) {
					return;
				}
				this.currentPage = page;
				this.loadProductList();
				
				// 滚动到顶部
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},

			// 获取购物车徽章样式类
			getCartBadgeClass(count) {
				if (count >= 100) {
					return 'badge-large-number';
				} else if (count >= 10) {
					return 'badge-two-digit';
				} else {
					return 'badge-single-digit';
				}
			},

			// 获取购物车数量显示文本
			getCartCountText(count) {
				if (count >= 100) {
					return '99+';
				}
				return count.toString();
			},

			// 语言切换后刷新页面数据
			refreshPageData() {
				console.log('首页刷新数据以适应新语言')
				
				// 刷新汇率（根据新语言获取对应货币的汇率）
				this.initExchangeRate()
				
				// 刷新分类数据
				if (this.categoryList.length > 0) {
					this.loadCategoryList()
				}
				
				// 刷新品牌数据  
				if (this.brandList.length > 0) {
					this.loadBrandList()
				}
				
				// 刷新商品数据
				if (this.productList.length > 0) {
					this.loadProductList()
				}
				
				// 刷新推荐商品数据
				if (this.recommendProductList.length > 0) {
					this.loadData()
				}
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%);
		height: 100%;
	}

	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		
		/* 去掉所有顶部间距，让自定义导航贴顶 */
		padding-top: 0;
	}

	/* 顶部导航栏 */
	.top-nav {
		background: #fff;
		height: 90upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30upx;
		box-shadow: 0 2upx 8upx rgba(0,0,0,0.05);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		
		/* 适配安全区域 */
		/* #ifdef H5 */
		top: 0;
		/* #endif */
		
		/* #ifndef H5 */
		padding-top: var(--status-bar-height, 0);
		height: calc(90upx + var(--status-bar-height, 0));
		/* #endif */
		
		.nav-left {
			.logo-text {
				font-size: 32upx;
				font-weight: 900;
				color: #999999;
				font-family: 'Comic Sans MS', cursive;
			}
		}
		
		.nav-right {
			display: flex;
			align-items: center;
			gap: 30upx;
			
			.nav-icon {
				position: relative;
				width: 60upx;
				height: 60upx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				background: #f8f8f8;
				transition: all 0.3s ease;
				
				&:hover {
					background: #ff6b35;
					
					.nav-icon-img {
						filter: brightness(0) invert(1); /* 图片变白色 */
					}
				}
				
				.nav-icon-img {
					width: 40upx;
					height: 40upx;
					transition: filter 0.3s ease;
				}
				
				text {
					font-size: 36upx;
					color: #666;
					transition: color 0.3s ease;
				}
				
				.cart-badge {
					position: absolute;
					top: -6upx;
					left: -6upx;
					background: #e74c3c;
					color: #ffffff;
					border-radius: 50%;
					width: 36upx;
					height: 36upx;
					display: flex;
					align-items: center;
					justify-content: center;
					border: 2upx solid #e74c3c;
					box-shadow: 0 2upx 8upx rgba(231, 76, 60, 0.25);
					z-index: 10;
					
					.badge-text {
						font-weight: bold;
						line-height: 1;
						color: #ffffff;
					}
					
					/* 单位数字 (1-9) */
					&.badge-single-digit .badge-text {
						font-size: 22upx;
					}
					
					/* 两位数字 (10-99) */
					&.badge-two-digit .badge-text {
						font-size: 18upx;
					}
					
					/* 大数字 (99+) */
					&.badge-large-number .badge-text {
						font-size: 16upx;
					}
				}
			}
			
			.nav-divider {
				width: 1px;
				height: 30upx;
				background-color: #ddd;
				margin: 0 8upx;
			}
		}
	}

	/* 搜索框 */
	.search-section {
		background: #fff;
		padding: 20upx 30upx;
		margin-top: 90upx; /* 为固定导航留出空间 */
		
		/* #ifndef H5 */
		margin-top: calc(90upx + var(--status-bar-height, 0));
		/* #endif */
		
		.search-box {
			display: flex;
			align-items: center;
			background: #f5f5f5;
			border-radius: 8upx;
			min-height: 70upx;
			position: relative;
			
			.search-input {
				flex: 1;
				height: 100%;
				font-size: 28upx;
				color: #333;
				padding: 0 20upx;
			}
			
			.clear-btn {
				padding: 15upx;
				color: #999;
				font-size: 28upx;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-shrink: 0;
			}
			
			.search-btn {
				padding: 20upx 30upx;
				color: #999;
				font-size: 32upx;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-shrink: 0;
			}
		}
	}
	/* 轮播图 */
	.carousel-section {
		margin-top: 0; /* 去掉上边距 */
		
		.carousel {
			height: 400upx;
			border-radius: 0; /* 去掉圆角 */
			margin: 0; /* 去掉左右边距 */
			overflow: hidden;
			
			.carousel-item {
				width: 100%;
				height: 100%;
				
				.banner-card {
					position: relative;
					width: 100%;
					height: 100%;
					border-radius: 0; /* 去掉圆角，让图片填满 */
					overflow: hidden;
					
					.banner-image {
						width: 100%;
						height: 100%;
					}
					
					.banner-info {
						position: absolute;
						bottom: 0; /* 保持在底部 */
						left: 0;
						right: 0;
						background: linear-gradient(transparent, rgba(0,0,0,0.6));
						padding: 40upx 30upx 60upx; /* 增加上方内边距，下方留空给指示器 */
						
						.banner-title {
							display: block;
							font-size: 28upx;
							color: white;
							font-weight: bold;
							text-align: center;
							text-shadow: 0 2upx 4upx rgba(0,0,0,0.5); /* 添加文字阴影增强可读性 */
						}
					}
				}
			}
		}
	}

	/* 分类导航栏 */
	.category-nav-bar {
		background: #fff;
		margin-top: 0; /* 紧贴轮播图 */
		margin-bottom: 10upx;
		border-radius: 0;
		overflow: hidden;
		width: 100%;
		box-shadow: 0 2upx 8upx rgba(0,0,0,0.05);
		
		.category-nav-list {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			
			.category-nav-item {
				width: calc(33.333% - 1px);
				height: 80upx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #fff;
				border-right: 1px solid #e0e0e0;
				border-bottom: 1px solid #e0e0e0;
				transition: all 0.3s ease;
				cursor: pointer;
				box-sizing: border-box;
				
				/* 每行第三个元素去掉右边框 */
				&:nth-child(3n) {
					border-right: none;
				}
				
				/* 最后一行的元素去掉下边框 */
				&:nth-last-child(-n+3):nth-child(3n-2),
				&:nth-last-child(-n+3):nth-child(3n-1),
				&:nth-last-child(-n+3):nth-child(3n) {
					border-bottom: none;
				}
				
				&:last-child {
					border-right: none;
				}
				
				&.active {
					background: #ff6b35;
					color: #fff;
					
					.nav-item-name {
						color: #fff;
						font-weight: bold;
					}
				}
				
				&:hover {
					background: #f8f8f8;
				}
				
				&.active:hover {
					background: #e55a2e;
				}
				
				.nav-item-name {
					font-size: 28upx;
					color: #333;
					text-align: center;
					transition: all 0.3s ease;
				}
			}
		}
	}

	/* 推荐商品列表 */
	.products-section {
		background: #fff;
		margin-top: 20upx;
		padding: 10upx;
		
		.section-title {
			font-size: 32upx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20upx;
			text-align: center;
			padding: 20upx 10upx;
		}
		
		.products-grid {
			display: flex;
			flex-wrap: wrap;
			gap: 12upx;
			padding: 10upx;
			
			.product-card {
				width: calc(50% - 6upx);
				background: #fff;
				border-radius: 12upx;
				overflow: hidden;
				box-shadow: 0 2upx 8upx rgba(0,0,0,0.1);
				border: 1px solid #e0e0e0;
				transition: all 0.3s ease;
				
				&:hover {
					transform: translateY(-2upx);
					box-shadow: 0 4upx 16upx rgba(0,0,0,0.15);
					border-color: #ff6b35;
				}
				
				.product-image {
					width: 100%;
					height: 400upx; /* 增加25%: 320 * 1.25 = 400 */
					position: relative;
					background: #f8f8f8;
					
					image {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
				}
				
				.product-info {
					padding: 16upx 20upx;
					background: #fff;
					
					.product-name {
						font-size: 26upx;
						color: #000;
						font-weight: 500;
						margin-bottom: 12upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						line-clamp: 2;
						overflow: hidden;
						line-height: 1.3;
						font-family: "Hiragino Sans", "ヒラギノ角ゴシック", "Hiragino Kaku Gothic ProN", "Hiragino Sans GB", "Meiryo", "Microsoft YaHei", "MS PGothic", sans-serif;
					}
					
					.usd-price {
						margin-top: 6upx;
						margin-bottom: 4upx;
						
						.usd-text {
							font-size: 20upx;
							color: #666;
							font-weight: 400;
							background: #f8f9fa;
							padding: 2upx 6upx;
							border-radius: 3upx;
						}
					}
					
					.product-price {
						display: flex;
						align-items: baseline;
						
						.price-symbol {
							font-size: 24upx;
							color: #ff6b35;
							font-weight: bold;
						}
						
						.price-value {
							font-size: 32upx;
							color: #ff6b35;
							font-weight: bold;
							margin-left: 2upx;
						}
						
						.price-currency {
							font-size: 20upx;
							color: #ff6b35;
							font-weight: 500;
							margin-left: 4upx;
						}
						
						.original-price {
							font-size: 20upx;
							color: #999;
							text-decoration: line-through;
							margin-left: 12upx;
						}
					}
				}
			}
		}
	}

	/* 底部链接 */
	.footer-links {
		display: flex;
		justify-content: space-around;
		background: #fff;
		margin-top: 20upx;
		padding: 40upx 0;
		
		.link-item {
			text {
				font-size: 28upx;
				color: #666;
			}
		}
	}
	
	/* 客服二维码弹窗 */
	.qrcode-modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
		
		.qrcode-content {
			background: #fff;
			border-radius: 20upx;
			width: 600upx;
			max-width: 90%;
			overflow: hidden;
			
			.qrcode-header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 30upx;
				border-bottom: 1upx solid #f0f0f0;
				
				.qrcode-title {
					font-size: 32upx;
					font-weight: bold;
					color: #333;
				}
				
				.qrcode-close {
					font-size: 36upx;
					color: #999;
				}
			}
			
			.qrcode-body {
				padding: 40upx;
				text-align: center;
				
				.qrcode-desc {
					font-size: 28upx;
					color: #666;
					margin-bottom: 30upx;
					display: block;
				}
				
				.qrcode-container {
					display: flex;
					justify-content: center;
					margin-bottom: 30upx;
					
					.qrcode-image {
						width: 400upx;
						height: 400upx;
						border: 1upx solid #e5e5e5;
						border-radius: 10upx;
					}
					
					.qrcode-placeholder {
						width: 400upx;
						height: 400upx;
						border: 2upx dashed #ddd;
						border-radius: 10upx;
						display: flex;
						align-items: center;
						justify-content: center;
						background: #f9f9f9;
						
						.placeholder-text {
							font-size: 28upx;
							color: #999;
						}
					}
				}
				
				.qrcode-tip {
					font-size: 24upx;
					color: #999;
					display: block;
				}
			}
		}
	}

	/* ========== 分类系统样式 ========== */
	
	/* 主内容区域 */
	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	/* 右侧内容区域 */
	.right-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: transparent;
	}
	
	/* 分类视图 */
	.category-view {
		flex: 1;
		display: flex;
		flex-direction: column;
		
		.section-title {
			background: #fff;
			padding: 30upx;
			font-size: 32upx;
			font-weight: bold;
			color: #333;
			text-align: center;
			border-bottom: 1px solid #f0f0f0;
		}
	}
	
	.category-scroll {
		flex: 1;
		padding: 10upx;
	}
	
	.category-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 12upx;
		padding: 10upx;
		padding-bottom: 100upx;
		
		.category-card {
			width: calc(50% - 6upx);
			background: #fff;
			border-radius: 12upx;
			overflow: hidden;
			box-shadow: 0 2upx 8upx rgba(0,0,0,0.1);
			border: 1px solid #e0e0e0;
			transition: all 0.3s ease;
			
			&:hover {
				transform: translateY(-2upx);
				box-shadow: 0 4upx 16upx rgba(0,0,0,0.15);
				border-color: #ff6b35;
			}
			
			.category-image {
				width: 100%;
				height: 400upx;
				position: relative;
				background: #f8f8f8;
				
				image {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
			
			.category-info {
				padding: 16upx 20upx;
				background: #fff;
				
				.category-name {
					font-size: 28upx;
					color: #333;
					font-weight: 600;
					margin-bottom: 6upx;
					display: block;
					line-height: 1.3;
				}
				
				.category-subtitle {
					font-size: 22upx;
					color: #666;
					margin-bottom: 8upx;
					display: block;
					line-height: 1.2;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					overflow: hidden;
				}
			}
		}
	}
	
	/* 品牌视图 */
	.brand-view {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	
	.brand-scroll {
		flex: 1;
		padding: 10upx;
	}
	
	.brand-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 12upx;
		padding: 10upx;
		padding-bottom: 100upx;
		
		.brand-card {
			width: calc(50% - 6upx);
			background: #fff;
			border-radius: 12upx;
			overflow: hidden;
			box-shadow: 0 2upx 8upx rgba(0,0,0,0.1);
			border: 1px solid #e0e0e0;
			transition: all 0.3s ease;
			
			&:hover {
				transform: translateY(-2upx);
				box-shadow: 0 4upx 16upx rgba(0,0,0,0.15);
				border-color: #ff6b35;
			}
			
			.brand-image {
				width: 100%;
				height: 400upx;
				position: relative;
				background: #f8f8f8;
				
				image {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
			
			.brand-info {
				padding: 16upx 20upx;
				background: #fff;
				
				.brand-name {
					font-size: 28upx;
					color: #333;
					font-weight: 600;
					margin-bottom: 6upx;
					display: block;
					line-height: 1.3;
				}
				
				.brand-subtitle {
					font-size: 22upx;
					color: #666;
					margin-bottom: 8upx;
					display: block;
					line-height: 1.2;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					overflow: hidden;
				}
			}
		}
	}
	
	/* 商品视图 */
	.product-view {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	
	/* 返回分类按钮 */
	.back-to-category {
		background: #fff;
		padding: 20upx 30upx;
		border-bottom: 1px solid #f0f0f0;
		display: flex;
		align-items: center;
		color: #ff6b35;
		font-size: 28upx;
		
		.yticon {
			margin-right: 10upx;
			font-size: 32upx;
		}
	}



	/* 商品列表（两列卡片样式） */
	.product-scroll {
		flex: 1;
		padding: 10upx;
	}

	.product-list {
		display: flex;
		flex-wrap: wrap;
		gap: 12upx;
		padding: 10upx;
		padding-bottom: 100upx;
		
		.product-item {
			width: calc(50% - 6upx);
			background: #fff;
			border-radius: 12upx;
			overflow: hidden;
			box-shadow: 0 2upx 8upx rgba(0,0,0,0.1);
			border: 1px solid #e0e0e0;
			transition: all 0.3s ease;
			
			&:hover {
				transform: translateY(-2upx);
				box-shadow: 0 4upx 16upx rgba(0,0,0,0.15);
				border-color: #ff6b35;
			}
			
			.product-image {
				width: 100%;
				height: 400upx;
				position: relative;
				background: #f8f8f8;
				
				image {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
			
			.product-info {
				padding: 16upx 20upx;
				background: #fff;
				
				.product-name {
					font-size: 26upx;
					color: #000;
					font-weight: 500;
					margin-bottom: 12upx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					overflow: hidden;
					line-height: 1.3;
					font-family: "Hiragino Sans", "ヒラギノ角ゴシック", "Hiragino Kaku Gothic ProN", "Hiragino Sans GB", "Meiryo", "Microsoft YaHei", "MS PGothic", sans-serif;
				}
				
				.usd-price {
					margin-top: 6upx;
					margin-bottom: 4upx;
					
					.usd-text {
						font-size: 20upx;
						color: #666;
						font-weight: 400;
						background: #f8f9fa;
						padding: 2upx 6upx;
						border-radius: 3upx;
					}
				}
				
				.product-price {
					display: flex;
					align-items: baseline;
					
					.price-symbol {
						font-size: 24upx;
						color: #ff6b35;
						font-weight: bold;
					}
					
					.price-value {
						font-size: 32upx;
						color: #ff6b35;
						font-weight: bold;
						margin-left: 2upx;
					}
					
					.price-currency {
						font-size: 20upx;
						color: #ff6b35;
						font-weight: 500;
						margin-left: 4upx;
					}
					
					.original-price {
						font-size: 20upx;
						color: #999;
						text-decoration: line-through;
						margin-left: 12upx;
					}
				}
			}
		}
	}

	/* 分页控件 */
	.pagination {
		background: #fff;
		padding: 30upx 20upx;
		margin-top: 20upx;
		margin-bottom: 30upx;
		border-radius: 12upx;
		
		.page-info {
			text-align: center;
			font-size: 24upx;
			color: #666;
			margin-bottom: 20upx;
		}
		
		.page-controls {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 10upx;
			
			.page-btn, .page-num {
				padding: 12upx 20upx;
				border: 1px solid #ddd;
				border-radius: 6upx;
				font-size: 24upx;
				color: #666;
				background: #fff;
				min-width: 60upx;
				text-align: center;
				
				&.active {
					background: #ff6b35;
					color: #fff;
					border-color: #ff6b35;
				}
				
				&.disabled {
					opacity: 0.5;
					pointer-events: none;
				}
			}
		}
	}

	/* 空状态 */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100upx 0;
		padding-bottom: 150upx;
		background: #fff;
		
		.empty-image {
			width: 400upx;
			height: 400upx;
			margin-bottom: 30upx;
		}
		
		.empty-text {
			font-size: 28upx;
			color: #999;
		}
	}

	/* 加载状态 */
	.loading-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
		
		.loading-content {
			background: #fff;
			padding: 40upx 60upx;
			border-radius: 12upx;
			font-size: 28upx;
			color: #333;
		}
	}

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
		padding-top: 0; /* 从顶部开始 */
		height: 100%;
		overflow-y: auto;
	}

	.sidebar-header {
		padding: 40upx 30upx 20upx; /* 减少顶部空间 */
		display: flex;
		justify-content: flex-end;
		border-bottom: 1px solid #e0e0e0;
		background-color: #fff;
		position: relative;
	}

	.language-selector {
		position: relative;
		display: flex;
		align-items: center;
		padding: 12upx 20upx;
		background-color: #f5f5f5;
		border-radius: 8upx;
		border: 1px solid #ddd;
		cursor: pointer;
		transition: all 0.3s ease;
		
		&:hover {
			background-color: #e8e8e8;
			border-color: #ccc;
		}
	}

	.language-text {
		font-size: 26upx;
		color: #333;
		margin-right: 8upx;
	}

	.language-arrow {
		font-size: 20upx;
		color: #666;
		transition: transform 0.3s ease;
		
		&.rotated {
			transform: rotate(180deg);
		}
	}

	.language-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: #fff;
		border: 1px solid #ddd;
		border-top: none;
		border-radius: 0 0 8upx 8upx;
		box-shadow: 0 4upx 12upx rgba(0, 0, 0, 0.15);
		z-index: 1002;
		overflow: hidden;
	}

	.language-option {
		padding: 16upx 20upx;
		border-bottom: 1px solid #f0f0f0;
		transition: background-color 0.3s ease;
		
		&:last-child {
			border-bottom: none;
		}
		
		&:hover {
			background-color: #f8f8f8;
		}
		
		text {
			font-size: 24upx;
			color: #333;
		}
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

	.sidebar-item-text {
		font-size: 30upx;
		color: #333;
		width: 100%;
		text-align: left;
	}



	.sidebar-categories {
		max-height: 60vh;
		overflow-y: auto;
	}

	.sidebar-category-item {
		padding: 20upx 30upx 20upx 50upx; /* 左边增加缩进，显示为子项 */
		border-bottom: 1px solid #f5f5f5;
		background-color: #fff;
		transition: background-color 0.3s ease;
		
		&:hover {
			background-color: #f8f8f8;
		}
		
		&:last-child {
			border-bottom: 1px solid #f0f0f0;
		}
	}

	.sidebar-category-name {
		font-size: 26upx; /* 稍小一点的字体 */
		color: #666; /* 稍浅一点的颜色 */
		line-height: 1.4;
	}
</style>
