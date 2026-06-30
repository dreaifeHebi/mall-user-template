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

		<!-- 页面内容 -->
		<view class="page-content">
			<!-- 空白页 -->
			<view v-if="empty===true" class="empty">
				<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
				<view class="empty-tips">
					{{ $t('cart.empty') }}
					<navigator class="navigator" url="../index/index" open-type="switchTab">{{ $t('cart.browseMore') }}</navigator>
				</view>
			</view>
			<view v-else>
				<!-- 列表 -->
				<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.id">
					<view class="cart-item" :class="{'b-b': index!==cartList.length-1}">
						<view class="image-wrapper">
							<image :src="item.productPic" :class="[item.loaded]" mode="aspectFill" lazy-load @load="onImageLoad('cartList', index)"
							 @error="onImageError('cartList', index)"></image>
							<view class="yticon icon-xuanzhong2 checkbox" :class="{checked: item.checked}" @click="check('item', index)"></view>
						</view>
						<view class="item-right">
							<text class="clamp title">{{item.productName}}</text>
							<text class="attr">{{item.spDataStr}}</text>
							<text class="price">¥{{item.price}} JPY</text>
							<uni-number-box class="step" :min="1" :max="100" :value="item.quantity" :index="index" @eventChange="numberChange"></uni-number-box>
						</view>
						<text class="del-btn yticon icon-fork" @click="handleDeleteCartItem(index)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<view class="left-section">
					<view class="checkbox">
						<image :src="allChecked?'/static/selected.png':'/static/select.png'" mode="aspectFit" @click="check('all')"></image>
					</view>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						{{ $t('cart.clearCart') }}
					</view>
				</view>
				<view class="right-section">
					<view class="total-box">
						<text class="price">¥{{total}} JPY</text>
					</view>
					<button type="primary" 
						class="no-border confirm-btn" 
						:class="{ 
							disabled: selectedQuantity < 3,
							'long-text': getButtonTextLength() > 0
						}" 
						@click="createOrder">
						{{ selectedQuantity >= 3 ? $t('cart.checkout') : $t('cart.needMoreItems', { count: 3 - selectedQuantity }) }}
					</button>
				</view>
			</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue';
	import {
		fetchCartList,
		deletCartItem,
		updateQuantity,
		clearCartList
	} from '@/api/cart.js';
	import {
		fetchProductDetail
	} from '@/api/product.js';
	import {
		getLocalCartList,
		removeFromLocalCart,
		updateLocalCartQuantity,
		clearLocalCart,
		syncLocalCartToServer
	} from '@/utils/localCartUtil.js';
	import { setPageTitle } from '@/utils/pageTitleUtil.js';
	import { processProductList } from '@/utils/textProcessor.js';
	import languageRefreshMixin from '@/mixins/languageRefreshMixin.js';
	import autoRefreshMixin from '@/mixins/autoRefreshMixin.js';
	import { switchLanguage } from '@/utils/i18nUtil.js';
	export default {
		mixins: [languageRefreshMixin, autoRefreshMixin],
		components: {
			uniNumberBox
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
				lastLoginState: false, // 记录上次的登录状态
				productCache: {}, // 商品详情缓存
				cartCount: 0, // 购物车数量
				selectedQuantity: 0, // 选中商品的总数量
				
				// 侧边栏状态
				showSidebar: false,
				showLanguageDropdown: false,
				categoryList: [] // 添加分类列表
			};
		},
		onLoad() {
			// 使用自动刷新mixin处理首次加载
			this.handleAutoRefresh('cartPage', () => {
				// 不在这里加载，让onShow处理
			}, 500); // 购物车页面延迟更短
			
			// 监听购物车数据更新事件
			uni.$on('cartDataUpdated', () => {
				this.loadData();
			});
			
			// 隐藏底部tabBar
			uni.hideTabBar();
		},
		onShow(){
			// 设置页面标题
			setPageTitle('pageTitle.cart');
			//页面显示时重新加载购物车
			// 检查登录状态是否发生变化
			if (this.lastLoginState !== this.hasLogin) {
				this.lastLoginState = this.hasLogin;
				// 登录状态发生变化，重新加载数据
				this.loadData();
			} else {
				// 登录状态未变化，根据当前状态加载数据
				this.loadData();
			}
			
			// 隐藏底部tabBar
			uni.hideTabBar();
		},
		onUnload() {
			// 移除事件监听
			uni.$off('cartDataUpdated');
		},
		watch: {
			//显示空白页
			cartList(e) {
				let empty = e.length === 0 ? true : false;
				if (this.empty !== empty) {
					this.empty = empty;
				}
			}
		},
		computed: {
			...mapState(['hasLogin', 'cartCount'])
		},
		methods: {
			...mapActions(['refreshCartCount']),
			// 导航方法
			goToHome() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			goToLogin() {
				if (this.hasLogin) {
					uni.switchTab({
						url: '/pages/user/user'
					});
				} else {
					uni.navigateTo({
						url: '/pages/public/login'
					});
				}
			},
			goToCart() {
				// 当前已在购物车页面，不需要跳转
			},
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
			},
			
			// 加载分类列表
			async loadCategoryList() {
				try {
					// 导入API和文本处理工具
					const { fetchCategoryInfoList } = await import('@/api/product.js');
					const { processCategoryList } = await import('@/utils/textProcessor.js');
					
					const response = await fetchCategoryInfoList();
					// 应用多语言文本处理，模仿index.vue的做法
					this.categoryList = processCategoryList(response.data || []);
				} catch (error) {
					console.error('加载分类列表失败:', error);
					this.categoryList = [];
				}
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

			// 切换侧边栏
			toggleSidebar() {
				this.showSidebar = !this.showSidebar;
				// 如果打开侧边栏且分类列表为空，则加载分类列表
				if (this.showSidebar && this.categoryList.length === 0) {
					this.loadCategoryList();
				}
			},

			// 关闭侧边栏
			closeSidebar() {
				this.showSidebar = false;
				this.showLanguageDropdown = false;
			},

			// 显示语言选择器
			showLanguageSelector() {
				this.showLanguageDropdown = !this.showLanguageDropdown;
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
			
			// 从侧边栏选择分类（按照 index.vue 的标准）
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

			//请求数据
		async loadData() {
			try {
				let cartList = [];
				
				if (this.hasLogin) {
					// 已登录用户，从服务器加载购物车
					const response = await fetchCartList();
					cartList = response.data || [];
					
					// 检查是否有购物车数据需要获取商品详情
					if (cartList.length > 0) {
						// 为每个购物车项获取商品详细信息
						for (let i = 0; i < cartList.length; i++) {
							const cartItem = cartList[i];
							const productId = cartItem.productId;
							
							try {
								// 检查缓存
								let product = this.productCache[productId];
								
								if (!product) {
									const productResponse = await fetchProductDetail(productId);
									
									if (productResponse && productResponse.data && productResponse.data.product) {
										product = productResponse.data.product; // 修正：取 product 字段
										// 存入缓存
										this.productCache[productId] = product;
									} else {
										console.error(`商品${productId}的API响应无效:`, productResponse);
										throw new Error('API响应无效或商品不存在');
									}
								}
								
								// 合并购物车数据和商品详细信息
								cartList[i] = {
									...cartItem,
									productName: product.name || '未知商品',
									productPic: product.pic || '/static/errorImage.jpg',
									productSubTitle: product.subTitle || '',
									productBrand: product.brandName || '',
									productSn: product.productSn || '',
									price: cartItem.price || product.price || 0
								};
								
							} catch (error) {
								console.error(`获取商品${productId}详情失败:`, error);
								// 如果获取商品详情失败，使用默认值
								cartList[i] = {
									...cartItem,
									productName: '商品信息获取失败',
									productPic: '/static/errorImage.jpg',
									productSubTitle: '',
									productBrand: '',
									productSn: '',
									price: cartItem.price || 0
								};
							}
						}
					} else {
					}
				} else {
					// 未登录用户，从本地存储加载购物车
					cartList = getLocalCartList();
				}
				
				// 处理购物车数据
				cartList = cartList.map(item => {
					// 确保价格是数字类型
					if (typeof item.price === 'string') {
						item.price = parseFloat(item.price) || 0;
					}
					if (typeof item.quantity === 'string') {
						item.quantity = parseInt(item.quantity) || 1;
					}
					
					item.checked = true;
					item.loaded = "loaded";
					
					// 安全地解析productAttr，处理空字符串的情况
					let spDataArr = [];
					let spDataStr = '';
					
					if (item.productAttr && item.productAttr.trim() !== '' && item.productAttr !== '[]') {
						try {
							spDataArr = JSON.parse(item.productAttr);
							if (Array.isArray(spDataArr) && spDataArr.length > 0) {
								for (let attr of spDataArr) {
									spDataStr += attr.key;
									spDataStr += ":";
									spDataStr += attr.value;
									spDataStr += ";";
								}
							}
						} catch (error) {
							console.error('解析商品属性失败:', error, item.productAttr);
							spDataStr = '';
						}
					}
					
					item.spDataStr = spDataStr;
					return item;
				});
				
				// 应用多语言文本处理
				this.cartList = processProductList(cartList, 'productName');
				this.calcTotal(); //计算总价
				this.refreshCartCount(); // 刷新购物车数量徽章
			} catch (error) {
				console.error('加载购物车数据失败:', error);
				uni.showToast({
					title: this.$t('cart.loadFailed'),
					icon: 'none',
					duration: 2000
				});
				this.cartList = [];
			}
		},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].productPic = '/static/errorImage.jpg';
			},
			//选中状态处理
			check(type, index) {
				if (type === 'item') {
					this.cartList[index].checked = !this.cartList[index].checked;
				} else {
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item => {
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},		//数量
		numberChange(data) {
			let cartItem = this.cartList[data.index];
			
			if (this.hasLogin) {
				// 已登录用户，更新服务器购物车
				updateQuantity({id:cartItem.id,quantity:data.number}).then(response=>{
					cartItem.quantity = data.number;
					this.calcTotal();
					this.refreshCartCount(); // 刷新购物车数量徽章
				}).catch(error => {
					console.error('更新购物车数量失败:', error);
					uni.showToast({
						title: this.$t('cart.updateQuantityFailed'),
						icon: 'none',
						duration: 2000
					});
				});
			} else {
				// 未登录用户，更新本地购物车
				const result = updateLocalCartQuantity(data.index, data.number);
				if (result.success) {
					cartItem.quantity = data.number;
					this.calcTotal();
					this.refreshCartCount(); // 刷新购物车数量徽章
				} else {
					uni.showToast({
						title: this.$t('cart.updateQuantityFailed'),
						icon: 'none',
						duration: 2000
					});
				}
			}
		},		//删除
		handleDeleteCartItem(index) {
			let list = this.cartList;
			let row = list[index];
			
			if (this.hasLogin) {
				// 已登录用户，从服务器删除
				let id = row.id;
				deletCartItem({ids:id}).then(response=>{
					this.cartList.splice(index, 1);
					this.calcTotal();
					this.refreshCartCount(); // 刷新购物车数量徽章
				}).catch(error => {
					console.error('删除购物车商品失败:', error);
					uni.showToast({
						title: this.$t('cart.deleteFailed'),
						icon: 'none',
						duration: 2000
					});
				});
			} else {
				// 未登录用户，从本地删除
				const result = removeFromLocalCart(index);
				if (result.success) {
					this.cartList.splice(index, 1);
					this.calcTotal();
					this.refreshCartCount(); // 刷新购物车数量徽章
				} else {
					uni.showToast({
						title: this.$t('cart.deleteFailed'),
						icon: 'none',
						duration: 2000
					});
				}
			}
		},		//清空
		clearCart() {
			uni.showModal({
				content: this.$t('cart.confirmClear'),
				success: (e) => {
					if (e.confirm) {
						if (this.hasLogin) {
							// 已登录用户，清空服务器购物车
							clearCartList().then(response=>{
								this.cartList = [];
								this.calcTotal();
								this.refreshCartCount(); // 刷新购物车数量徽章
							}).catch(error => {
								console.error('清空购物车失败:', error);
								uni.showToast({
									title: this.$t('cart.clearFailed'),
									icon: 'none',
									duration: 2000
								});
							});
						} else {
							// 未登录用户，清空本地购物车
							const result = clearLocalCart();
							if (result.success) {
								this.cartList = [];
								this.calcTotal();
								this.refreshCartCount(); // 刷新购物车数量徽章
							} else {
								uni.showToast({
									title: this.$t('cart.clearFailed'),
									icon: 'none',
									duration: 2000
								});
							}
						}
					}
				}
			});
		},
			//计算总价
			calcTotal() {
				let list = this.cartList;
				if (list.length === 0) {
					this.empty = true;
					this.selectedQuantity = 0;
					return;
				}
				let total = 0;
				let checked = true;
				let selectedQuantity = 0;
				list.forEach(item => {
					if (item.checked === true) {
						const itemTotal = item.price * item.quantity;
						total += itemTotal;
						selectedQuantity += item.quantity;
					} else if (checked === true) {
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
				this.selectedQuantity = selectedQuantity;
			},
		createOrder() {
			// 检查选中商品数量是否满足最低要求
			if (this.selectedQuantity < 3) {
				uni.showToast({
					title: this.$t('cart.needMoreItems', { count: 3 - this.selectedQuantity }),
					icon: 'none',
					duration: 2000
				});
				return;
			}
			
			// 检查用户是否已登录
			if (!this.hasLogin) {
				uni.showModal({
					title: this.$t('common.tips'),
					content: this.$t('auth.loginRequired'),
					showCancel: true,
					confirmText: this.$t('auth.goLogin'),
					cancelText: this.$t('common.cancel'),
					success: (res) => {
						if (res.confirm) {
							// 保存当前页面路径，用于登录后返回
							uni.setStorageSync('loginRedirect', '/pages/cart/cart');
							uni.navigateTo({
								url: '/pages/public/login'
							});
						}
					}
				});
				return;
			}
			
			let list = this.cartList;
			let cartIds = [];
			list.forEach(item => {
				if (item.checked) {
					cartIds.push(item.id);
				}
			});
			
			if(cartIds.length == 0){
				uni.showToast({
					title: this.$t('cart.noSelectedItems'),
					duration:1000
				});
				return;
			}
			
			// 验证购物车ID是否有效
			const invalidIds = cartIds.filter(id => !id || typeof id !== 'number');
			if (invalidIds.length > 0) {
				console.error('存在无效的购物车ID:', invalidIds);
				uni.showToast({
					title: this.$t('cart.invalidData'),
					icon: 'none',
					duration: 2000
				});
				return;
			}
			
			// 设置标记，表示从购物车创建订单，需要刷新首页
			uni.setStorageSync('needRefreshHomePage', true);
			
			uni.navigateTo({
				url: `/pages/order/createOrder?cartIds=${encodeURIComponent(JSON.stringify(cartIds))}`
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
			console.log('购物车页刷新数据以适应新语言')
			
			// 重新加载购物车数据
			this.loadData()
			
			// 刷新分类数据（模仿index.vue的做法）
			if (this.categoryList.length > 0) {
				this.loadCategoryList()
			}
		},

		// 计算按钮文字长度，用于动态调整样式
		getButtonTextLength() {
			const buttonText = this.selectedQuantity >= 3 ? 
				this.$t('cart.checkout') : 
				this.$t('cart.needMoreItems', { count: 3 - this.selectedQuantity });
			
			if (!buttonText) return 0;
			
			// 根据当前语言调整长文字阈值
			const currentLocale = this.$i18n.locale;
			if (currentLocale === 'en-US') {
				// 英文字符通常更宽，降低阈值
				return buttonText.length > 8 ? buttonText.length : 0;
			} else {
				// 中文字符，使用原来的阈值
				return buttonText.length > 6 ? buttonText.length : 0;
			}
		}
		}
	}
</script>

<style lang='scss'>
	.container {
		padding-bottom: 134upx;
		
		/* H5环境下适配顶部tabBar */
		/* #ifdef H5 */
		padding-top: 50px; /* tabBar高度 */
		/* #endif */
		
		/* 其他环境保持原样 */
		/* #ifndef H5 */
		padding-top: var(--top-window-height, 0);
		/* #endif */

		/* 空白页 */
		.empty {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100vh;
			padding-bottom: 100upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;

			image {
				width: 480upx;
				height: 320upx;
				margin-bottom: 30upx;
			}

			.empty-tips {
				display: flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;

				.navigator {
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}

	/* 购物车列表项 */
	.cart-item {
		display: flex;
		position: relative;
		padding: 30upx 40upx;

		.image-wrapper {
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position: relative;

			image {
				border-radius: 8upx;
			}
		}

		.checkbox {
			position: absolute;
			left: -16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background: #fff;
			border-radius: 50px;
		}

		.item-right {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position: relative;
			padding-left: 30upx;

			.title,
			.price {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}

			.attr {
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}

			.price {
				height: 50upx;
				line-height: 50upx;
			}
		}

		.del-btn {
			padding: 4upx 10upx;
			font-size: 34upx;
			height: 50upx;
			color: $font-color-light;
		}
	}

	/* 底部栏 */
	.action-section {
		/* #ifdef H5 */
		margin-bottom: 100upx;
		/* #endif */
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 690upx;
		min-height: 100upx;
		padding: 12upx 20upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;
		
		/* 小屏幕适配 */
		@media (max-width: 750px) {
			left: 15upx;
			width: calc(100% - 30upx);
			padding: 10upx 15upx;
		}

		.left-section {
			display: flex;
			align-items: center;
			position: relative;
			flex-shrink: 0;

			.checkbox {
				height: 52upx;
				width: 52upx;
				flex-shrink: 0;

				image {
					width: 52upx;
					height: 100%;
				}
			}

			.clear-btn {
				margin-left: 8upx;
				padding: 8upx 16upx;
				font-size: $font-sm + 2upx;
				color: #fff;
				background: $font-color-disabled;
				border-radius: 26upx;
				opacity: 0;
				transition: all 0.3s ease;
				white-space: nowrap;
				transform: scale(0.8);

				&.show {
					opacity: 1;
					transform: scale(1);
				}
			}
		}

		.right-section {
			display: flex;
			align-items: center;
			gap: 16upx;
			flex-shrink: 0;
			flex: 1;
			justify-content: flex-end;

			.total-box {
				display: flex;
				flex-direction: column;
				text-align: right;
				flex-shrink: 0;

				.price {
					font-size: $font-base + 4upx;
					color: $font-color-dark;
					word-wrap: break-word;
					line-height: 1.3;
				}
				
				/* 小屏幕适配 */
				@media (max-width: 750px) {
					.price {
						font-size: $font-base + 2upx;
					}
				}
			}

			.confirm-btn {
				padding: 0 38upx;
				margin: 0;
				border-radius: 100px;
				height: 76upx;
				min-width: 120upx;
				max-width: 200upx;
				line-height: 1.2;
				font-size: $font-base + 2upx;
				background: $uni-color-primary;
				box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72);
				transition: all 0.3s ease;
				display: flex;
				align-items: center;
				justify-content: center;
				text-align: center;
				word-wrap: break-word;
				word-break: break-all;
				white-space: normal;
				flex-shrink: 0;
				
				&.disabled {
					background: #ccc;
					box-shadow: none;
					color: #999;
					opacity: 0.8;
				}
				
				/* 当文字较长时调整字体大小，但保持椭圆形状 */
				&.long-text {
					font-size: $font-sm + 2upx;
					padding: 0 28upx;
					max-width: 240upx; /* 英文需要更长的按钮 */
					height: 84upx;
					
					/* 小屏幕进一步优化 */
					@media (max-width: 750px) {
						font-size: $font-sm;
						max-width: 200upx; /* 小屏幕上也给英文更多空间 */
						padding: 0 24upx;
						height: 80upx;
					}
				}
				
				/* 小屏幕通用优化 */
				@media (max-width: 750px) {
					font-size: $font-base;
					padding: 0 32upx;
					max-width: 190upx; /* 小屏幕默认也增加宽度 */
					height: 72upx;
				}
			}
		}
	}

	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked {
		color: $uni-color-primary;
	}

	/* 自定义导航栏样式 */
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
		
		/* #ifndef H5 */
		padding-top: var(--status-bar-height, 0);
		height: calc(90upx + var(--status-bar-height, 0));
		/* #endif */
	}

	.page-content {
		margin-top: 90upx; /* 为固定导航留出空间 */
		
		/* #ifndef H5 */
		margin-top: calc(90upx + var(--status-bar-height, 0));
		/* #endif */
	}

	.nav-left {
		flex: 1;
		
		.logo-text {
			font-size: 32upx;
			font-weight: 900;
			color: #999999;
			font-family: 'Comic Sans MS', cursive;
		}
	}

	.nav-right {
		display: flex;
		gap: 20px;
	}

	.nav-icon {
		width: 48upx;
		height: 48upx;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		
		.nav-icon-img {
			width: 48upx;
			height: 48upx;
		}
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

	.nav-divider {
		width: 1px;
		height: 30upx;
		background-color: #ddd;
		margin: 0 8upx;
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
</style>
