<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in imgList" :key="index">
					<view class="image-wrapper">
						<image :src="item.src" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<text class="title">{{product.name}}</text><br>
			<text class="title2">{{product.subTitle}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{product.price}}</text>
				<text class="price-currency">JPY</text>
				<!-- <text class="m-price">¥{{product.originalPrice}} JPY</text> -->
			</view>
			<!-- 参考价格显示（根据语言显示美元或人民币） -->
			<view class="usd-price-box" v-if="exchangeRate && product.price">
				<text class="usd-price-text">{{ formatPrice(product.price) }}</text>
			</view>
			<view class="bot-row">
				<text>{{ $t('product.sales') }}: {{product.sale}}</text>
				<text>{{ $t('product.stock') }}: {{product.stock}}</text>
				<text>{{ $t('product.views') }}: 768</text>
			</view>
		</view>

		<!--  分享 -->
		<!-- <view class="share-section" @click="share">
			<view class="share-icon">
				<text class="yticon icon-xingxing"></text>
				返
			</view>
			<text class="tit">该商品分享可领49减10红包</text>
			<text class="yticon icon-bangzhu1"></text>
			<view class="share-btn">
				立即分享
				<text class="yticon icon-you"></text>
			</view>

		</view> -->

		<view class="c-list">
			<!-- 隐藏购买类型选择，但保留商品参数 -->
			<!-- <view class="c-row b-b" @click="toggleSpec">
				<text class="tit">购买类型</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
						{{sItem.name}}
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view> -->
			<!-- 商品参数按钮移除，改为直接展示 -->
			<!-- 移除促销活动和服务相关显示 -->
			<!-- <view class="c-row b-b">
				<text class="tit">促销活动</text>
				<view class="con-list">
					<text v-for="item in promotionTipList" :key="item">{{item}}</text>
				</view>
			</view>
			<view class="c-row b-b">
				<text class="tit">服务</text>
				<view class="bz-list con">
					<text v-for="item in serviceList" :key="item">{{item}} ·</text>
				</view>
			</view> -->
		</view>

		<!-- 评价 -->
		<!-- <view class="eva-section">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>(86)</text>
				<text class="tip">好评率 100%</text>
				<text class="yticon icon-you"></text>
			</view>
			<view class="eva-box">
				<image class="portrait" src="http://img3.imgtn.bdimg.com/it/u=1150341365,1327279810&fm=26&gp=0.jpg" mode="aspectFill"></image>
				<view class="right">
					<text class="name">Leo yo</text>
					<text class="con">商品收到了，$79两件，质量不错，试了一下有点瘦，但是加个外罩很漂亮，我很喜欢</text>
					<view class="bot">
						<text class="attr">购买类型：XL 红色</text>
						<text class="time">2019-04-01 19:21</text>
					</view>
				</view>
			</view>
		</view> -->

		<!-- 商品参数 -->
		<view class="product-params" v-if="attrList && attrList.length > 0">
			<view class="d-header">
				<text>{{ $t('product.specifications') }}</text>
			</view>
			<view class="params-table">
				<view class="table-row" v-for="(row, index) in paramRows" :key="index">
					<view class="table-cell param-cell" v-if="row.left">
						<text class="param-text">{{row.left.display}}</text>
					</view>
					<view class="table-cell param-cell" v-if="row.right">
						<text class="param-text">{{row.right.display}}</text>
					</view>
					<view class="table-cell param-cell empty-cell" v-if="!row.right"></view>
				</view>
			</view>
		</view>

		<view class="detail-desc" v-if="desc && desc.trim()">
			<view class="d-header">
				<text>{{ $t('product.description') }}</text>
			</view>
			<rich-text :nodes="desc"></rich-text>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>{{ $t('common.home') }}</text>
			</navigator>
			<view class="p-b-btn" @click="goToCart">
				<text class="yticon icon-gouwuche"></text>
				<text>{{ $t('common.cart') }}</text>
				<view v-if="cartCount > 0" class="cart-badge" :class="getCartBadgeClass(cartCount)">
					<text class="badge-text">{{getCartCountText(cartCount)}}</text>
				</view>
			</view>
			<!-- <view class="p-b-btn" :class="{active: favorite}" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view> -->

			<view class="action-btn-group">
				<!-- <button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">{{ $t('product.buyNow') }}</button> -->
				<button type="primary" class="action-btn no-border add-cart-btn" @click="addToCart">{{ $t('product.addToCart') }}</button>
			</view>
		</view>


		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="product.pic"></image>
					<view class="right">
						<text class="price">¥{{product.price}} JPY</text>
						<text class="stock">库存：{{product.stock}}件</text>
						<view class="selected">
							已选：
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
								{{sItem.name}}
							</text>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in specList" :key="index" class="attr-list">
					<text>{{item.name}}</text>
					<view class="item-list">
						<text v-for="(childItem, childIndex) in specChildList" v-if="childItem.pid === item.id" :key="childIndex" class="tit"
						 :class="{selected: childItem.selected}" @click="selectSpec(childIndex, childItem.pid)">
							{{childItem.name}}
						</text>
					</view>
				</view>
				<button class="btn" @click="toggleSpec">{{ $t('common.confirm') }}</button>
			</view>
		</view>
		<!-- 商品参数弹窗已移除，改为直接展示 -->
		<!-- 分享 -->
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
	</view>
</template>

<script>
	import share from '@/components/share';
	import {
		fetchProductDetail
	} from '@/api/product.js';
	import {
		addCartItem,
		fetchCartList
	} from '@/api/cart.js';
	import {
		addToLocalCart,
		getLocalCartList
	} from '@/utils/localCartUtil.js';
	import {
		createReadHistory
	} from '@/api/memberReadHistory.js';
	import {
		createProductCollection,
		deleteProductCollection,
		productCollectionDetail
	} from '@/api/memberProductCollection.js';
	import { getExchangeRateByLocale, formatPriceByLocale } from '@/utils/exchangeRateUtil.js';
	import {
		mapState,
		mapActions
	} from 'vuex';
	import {
		formatDate
	} from '@/utils/date';
	import { setPageTitle } from '@/utils/pageTitleUtil.js';
	import { processProductName, processMultiLanguageText } from '@/utils/textProcessor.js';
	import { translateApiMessage } from '@/utils/messageUtil.js';
	import languageRefreshMixin from '@/mixins/languageRefreshMixin.js';
	import autoRefreshMixin from '@/mixins/autoRefreshMixin.js';
	const defaultServiceList = [{
		id: 1,
		name: "无忧退货"
	}, {
		id: 2,
		name: "快速退款"
	}, {
		id: 3,
		name: "免费包邮"
	}];
	const getDefaultShareList = (t) => [{
			type: 1,
			icon: '/static/temp/share_wechat.png',
			text: t('share.wechatFriend')
		},
		{
			type: 2,
			icon: '/static/temp/share_moment.png',
			text: t('share.wechatMoment')
		},
		{
			type: 3,
			icon: '/static/temp/share_qq.png',
			text: t('share.qqFriend')
		},
		{
			type: 4,
			icon: '/static/temp/share_qqzone.png',
			text: t('share.qqZone')
		}
	]
	export default {
		mixins: [languageRefreshMixin, autoRefreshMixin],
		components: {
			share
		},
		data() {
			return {
				specClass: 'none',
				specSelected: [],
				favorite: false,
				shareList: [],
				imgList: [],
				desc: '',
				specList: [],
				specChildList: [],
				product: {},
				brand: {},
				serviceList: [],
				skuStockList: [],
				attrList: [],
				productId: null, // 保存商品ID
				lastRefreshTime: 0, // 上次刷新时间
				exchangeRate: null // JPY 汇率（根据语言显示 USD 或 CNY）
			};
		},
		async onLoad(options) {
			let id = options.id;
			this.productId = id; // 保存商品ID用于后续刷新
			this.shareList = getDefaultShareList(this.$t);
			
			// 使用自动刷新mixin处理首次加载
			this.handleAutoRefresh('productPage', () => {
				this.initExchangeRate(); // 初始化汇率
				this.loadData(id);
			});
		},
		onShow() {
			// 刷新购物车数量
			this.refreshCartCount();
			// 设置页面标题
			setPageTitle('pageTitle.productDetail');
			// 页面显示时检查是否需要刷新商品数据
			// 如果是从支付页面返回或者超过30秒未刷新，则强制刷新
			const now = Date.now();
			const lastRefreshTime = this.lastRefreshTime || 0;
			const shouldRefresh = now - lastRefreshTime > 30000; // 30秒
			
			// 检查是否有全局标记表示需要刷新商品数据
			const needRefreshAfterPayment = uni.getStorageSync('needRefreshProductAfterPayment');
			
			if ((shouldRefresh || needRefreshAfterPayment) && this.productId) {
				this.refreshProductData();
				// 清除刷新标记
				if (needRefreshAfterPayment) {
					uni.removeStorageSync('needRefreshProductAfterPayment');
				}
			}
		},
	computed: {
		...mapState(['hasLogin', 'userInfo', 'cartCount']),
		// 将商品参数按每行两列进行分组，并格式化为"参数名：value"形式
		paramRows() {
			if (!this.attrList || this.attrList.length === 0) {
				return [];
			}
			
			const processedParams = this.attrList.map(param => {
				return {
					key: param.key,
					value: param.value,
					display: `${param.key}：${param.value}` // 格式化为"参数名：value"形式
				};
			});
			
			const rows = [];
			for (let i = 0; i < processedParams.length; i += 2) {
				const row = {
					left: processedParams[i],
					right: processedParams[i + 1] || null
				};
				rows.push(row);
			}
			
			return rows;
		}
	},
	filters: {
		formatDateTime(time) {
			if (time == null || time === '') {
				return 'N/A';
			}
			let date = new Date(time);
			return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
		},
	},
	methods: {
		...mapActions(['refreshCartCount']),
		processMultiLanguageText,
		
		// 处理产品参数名称的特殊翻译
		processProductParamName(paramName) {
			// 如果当前语言不是英语，直接返回原始文本处理结果
			if (this.$i18n.locale !== 'en-US') {
				return this.processMultiLanguageText(paramName);
			}
			
			// 英语环境下的特殊映射
			const paramMap = {
				'数量': 'Quantity',
				'焦油量': 'Tar Content',
				'焦油': 'Tar Content',
				'尼古丁含量': 'Nicotine', 
				'尼古丁': 'Nicotine',
				'包装规格': 'Package',
				'包装数量': 'Package Quantity',
				'单支价格': 'Price per Piece'
			};
			
			// 检查是否是需要特殊处理的中文参数名
			if (paramMap[paramName]) {
				return paramMap[paramName];
			}
			
			// 如果不在映射中，使用默认的多语言处理
			return this.processMultiLanguageText(paramName);
		},
		
		// 处理产品参数值的特殊翻译
		processProductParamValue(paramValue) {
			// 如果当前语言不是英语，直接返回原始文本处理结果
			if (this.$i18n.locale !== 'en-US') {
				return this.processMultiLanguageText(paramValue);
			}
			
			// 英语环境下的特殊映射
			const valueMap = {
				'软': 'Soft',
				'硬': 'Hard',
				'中等': 'Medium',
				'强': 'Strong',
				'淡': 'Light',
				'超淡': 'Ultra Light',
				'无': 'None',
				'低': 'Low',
				'高': 'High'
			};
			
			// 检查是否是需要特殊处理的中文参数值
			if (valueMap[paramValue]) {
				return valueMap[paramValue];
			}
			
			// 如果不在映射中，使用默认的多语言处理
			return this.processMultiLanguageText(paramValue);
		},
		
		// 初始化汇率
		async initExchangeRate() {
			try {
				const currentLocale = this.$i18n.locale || 'zh-CN';
				this.exchangeRate = await getExchangeRateByLocale(currentLocale);
				console.log('汇率初始化成功:', this.exchangeRate);
			} catch (error) {
				console.error('汇率初始化失败:', error);
				// 即使失败也设置一个默认汇率，避免页面显示异常
				this.exchangeRate = 0.0067;
			}
		},
		
		// 格式化价格显示（根据语言自动选择币种）
	formatPrice(jpyPrice) {
		if (!this.exchangeRate || !jpyPrice) {
			return '';
		}
		const currentLocale = this.$i18n.locale || 'zh-CN';
		return formatPriceByLocale(jpyPrice, this.exchangeRate, currentLocale);
	},		// 安全解析SKU的spData
		parseSpData(spData) {
			if (!spData) {
				return null;
			}
			
			// 如果已经是对象，直接返回
			if (typeof spData === 'object') {
				return spData;
			}
			
			if (typeof spData !== 'string' || spData.trim() === '') {
				return null;
			}
			
			try {
				const parsed = JSON.parse(spData);
				if (!Array.isArray(parsed) && typeof parsed !== 'object') {
					return null;
				}
				// 确保返回的是数组 (spData通常是数组结构)
				// 如果API返回的是Proxy(Object)且不是数组，可能需要根据结构调整，但通常这里是数组
				return parsed;
			} catch (error) {
				console.error('解析spData失败:', error, spData);
				return null;
			}
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
		
		goToCart() {
			uni.switchTab({
				url: '/pages/cart/cart'
			});
		},
		
			async loadData(id, forceRefresh = false) {
				try {
					const response = await fetchProductDetail(id, forceRefresh);
					
					// 应用多语言文本处理
					this.product = {
						...response.data.product,
						name: processProductName(response.data.product.name)
					};
					this.skuStockList = response.data.skuStockList || [];
					this.brand = response.data.brand || {};
					
					// 记录刷新时间
					this.lastRefreshTime = Date.now();
			
			// 使用try-catch包装每个初始化方法，确保一个失败不影响其他
			try {
				this.initImgList();
			} catch (error) {
				console.error('initImgList失败:', error);
			}
			
			try {
				this.initServiceList();
			} catch (error) {
				console.error('initServiceList失败:', error);
			}
			
			try {
				this.initSpecList(response.data);
			} catch (error) {
				console.error('initSpecList失败:', error);
			}
			
			try {
				this.initAttrList(response.data);
			} catch (error) {
				console.error('initAttrList失败:', error);
			}
			
			try {
				this.initProductDesc();
			} catch (error) {
				console.error('initProductDesc失败:', error);
			}
			
			// 确保handleReadHistory一定会执行
			try {
				this.handleReadHistory();
			} catch (error) {
				console.error('handleReadHistory失败:', error);
			}
			
			// 注释掉收藏功能的初始化
			// try {
			// 	this.initProductCollection();
			// } catch (error) {
			// 	console.error('initProductCollection失败:', error);
			// }
			
		} catch (error) {
			console.error('loadData整体失败:', error);
			uni.showToast({
				title: this.$t('product.loadFailedMessage'),
				icon: 'none'
			});
		}
	},
	
	// 刷新商品数据的方法
	async refreshProductData() {
		if (!this.productId) {
			return;
		}
		
		try {
			// 强制刷新商品基本信息（价格、库存等核心数据）
			const response = await fetchProductDetail(this.productId, true);
			
			// 只更新可能变化的核心数据，保持页面状态
			const newProduct = response.data.product;
			if (newProduct) {
				this.product.price = newProduct.price;
				this.product.stock = newProduct.stock;
				this.product.sale = newProduct.sale;
				
				// 如果有促销价格变化，也需要更新
				if (newProduct.promotionPrice !== undefined) {
					this.product.promotionPrice = newProduct.promotionPrice;
				}
			}
			
			// 更新SKU库存信息
			if (response.data.skuStockList) {
				this.skuStockList = response.data.skuStockList;
				// 如果当前选中了规格，重新计算价格和库存
				if (this.specSelected.length > 0) {
					this.changeSpecInfo();
				}
			}
			
			// 更新刷新时间
			this.lastRefreshTime = Date.now();
			
		} catch (error) {
			console.error('刷新商品数据失败:', error);
			// 静默失败，不显示错误提示以免影响用户体验
		}
	},
	
	// 手动刷新商品信息
	async manualRefresh() {
		uni.showLoading({
			title: this.$t('common.refresh')
		});
		
		try {
			await this.refreshProductData();
			uni.hideLoading();
			uni.showToast({
				title: this.$t('common.refreshSuccess'),
				icon: 'success',
				duration: 1000
			});
		} catch (error) {
			uni.hideLoading();
			uni.showToast({
				title: this.$t('common.refreshFailed'),
				icon: 'none',
				duration: 1500
			});
		}
	},
	
			//规格弹窗开关
			toggleSpec() {
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			//选择规格
			selectSpec(index, pid) {
				let list = this.specChildList;
				list.forEach(item => {
					if (item.pid === pid) {
						this.$set(item, 'selected', false);
					}
				})

				this.$set(list[index], 'selected', true);
				//存储已选择
				/**
				 * 修复选择规格存储错误
				 * 将这几行代码替换即可
				 * 选择的规格存放在specSelected中
				 */
				this.specSelected = [];
				list.forEach(item => {
					if (item.selected === true) {
						this.specSelected.push(item);
					}
				})
				this.changeSpecInfo();

			},
			//分享
			share() {
				this.$refs.share.toggleMask();
			},
			//收藏 - 已隐藏收藏功能
			toFavorite() {
				// 收藏功能已被隐藏
				/* if (!this.checkForLogin()) {
					return;
				}
				if (this.favorite) {
					//取消收藏
					deleteProductCollection({
						productId: this.product.id
					}).then(response => {
						uni.showToast({
							title: this.$t('product.unfavoriteSuccess'),
							icon: 'none'
						});
						this.favorite = !this.favorite;
					});
				} else {
					//收藏
					let productCollection = {
						productId: this.product.id,
						productName: this.product.name,
						productPic: this.product.pic,
						productPrice: this.product.price,
						productSubTitle: this.product.subTitle
					}
					createProductCollection(productCollection).then(response => {
						uni.showToast({
							title: this.$t('product.favoriteSuccess'),
							icon: 'none'
						});
						this.favorite = !this.favorite;
					});
				} */
			},
			buy() {
				uni.showToast({
					title: this.$t('product.buyFromCartOnly'),
					icon: 'none'
				});
			},
			stopPrevent() {},
			//设置头图信息
			initImgList() {
				let tempPics = this.product.albumPics.split(',');
				tempPics.unshift(this.product.pic);
				for (let item of tempPics) {
					if (item != null && item != '') {
						this.imgList.push({
							src: item
						});
					}
				}
			},
			//设置服务信息
			initServiceList() {
				for (let item of defaultServiceList) {
					if (this.product.serviceIds.indexOf(item.id) != -1) {
						this.serviceList.push(item.name);
					}
				}
			},		//设置商品规格
		initSpecList(data) {
			// 检查必要的数据是否存在
			if (!data || !data.productAttributeList) {
				return;
			}
			
			if (!Array.isArray(data.productAttributeList)) {
				return;
			}
			
			for (let i = 0; i < data.productAttributeList.length; i++) {
				let item = data.productAttributeList[i];
				if (item.type == 0) {
					this.specList.push({
						id: item.id,
						name: item.name
					});
					if (item.handAddStatus == 1) {
						//支持手动新增的
						let valueList = data.productAttributeValueList || [];
						let filterValueList = valueList.filter(value => value.productAttributeId == item.id);
						if (filterValueList.length > 0) {
							let inputList = filterValueList[0].value.split(',');
							for (let j = 0; j < inputList.length; j++) {
								this.specChildList.push({
									pid: item.id,
									pname: item.name,
									name: inputList[j]
								});
							}
						}
					} else if (item.handAddStatus == 0) {
						//不支持手动新增的
						if (item.inputList) {
							let inputList = item.inputList.split(',');
							for (let j = 0; j < inputList.length; j++) {
								this.specChildList.push({
									pid: item.id,
									pname: item.name,
									name: inputList[j]
								});
							}
						}
					}
				}
			}
			
			// 检查SKU数据
			if (!this.skuStockList || this.skuStockList.length === 0) {
				return;
			}
			
			let availAbleSpecSet = new Set();
			for (let i = 0; i < this.skuStockList.length; i++) {
				const spDataArr = this.parseSpData(this.skuStockList[i].spData);
				if (spDataArr) {
					for (let j = 0; j < spDataArr.length; j++) {
						if (spDataArr[j] && spDataArr[j].value) {
							availAbleSpecSet.add(spDataArr[j].value);
						}
					}
				}
			}
			
			// 根据商品sku筛选出可用规格
			this.specChildList = this.specChildList.filter(item => {
				return availAbleSpecSet.has(item.name)
			});
			
			// 规格 默认选中第一条
			this.specList.forEach(item => {
				for (let cItem of this.specChildList) {
					if (cItem.pid === item.id) {
						this.$set(cItem, 'selected', true);
						this.specSelected.push(cItem);
						this.changeSpecInfo();
						break;
					}
				}
			});
		},		//设置商品参数
		initAttrList(data) {
			// 重置参数列表
			this.attrList = [];
			
			// 检查必要的数据是否存在
			if (!data || !data.productAttributeList) {
				return;
			}
			
			if (!Array.isArray(data.productAttributeList)) {
				return;
			}
			
			for (let item of data.productAttributeList) {
				if (item.type == 1) {
					let valueList = data.productAttributeValueList || [];
					let filterValueList = valueList.filter(value => value.productAttributeId == item.id);
					
					if (filterValueList.length > 0) {
						let value = filterValueList[0].value;
						this.attrList.push({
							key: this.processProductParamName(item.name),
							value: this.processProductParamValue(value)
						});
					}
				}
			}
		},
			//初始化商品详情信息
			initProductDesc() {
				let rawhtml = this.product.detailMobileHtml;
				
				// 检查图文详情是否存在有效内容
				if (!rawhtml || rawhtml.trim() === '') {
					this.desc = '';
					return;
				}
				
				let tempNode = document.createElement('div');
				tempNode.innerHTML = rawhtml;
				
				// 检查是否有实际的文本内容或图片
				let textContent = tempNode.textContent || tempNode.innerText || '';
				let imgs = tempNode.getElementsByTagName('img');
				
				// 如果既没有文本内容，也没有图片，则认为没有有效内容
				if (textContent.trim() === '' && imgs.length === 0) {
					this.desc = '';
					return;
				}
				
				// 处理图片样式
				for (let i = 0; i < imgs.length; i++) {
					imgs[i].style.width = '100%';
					imgs[i].style.height = 'auto';
					imgs[i].style.display = 'block';
				}
				
				this.desc = tempNode.innerHTML;
			},		//处理创建浏览记录
		handleReadHistory() {
			// 获取本地存储的登录信息
			const token = uni.getStorageSync('token');
			const userInfo = uni.getStorageSync('userInfo');
			
			// 判断用户是否登录 - 使用多种方式检查
			const isLoggedIn = this.hasLogin || (token && userInfo && userInfo.id);
			
			if (isLoggedIn) {
				// 确保product数据存在
				if (!this.product || !this.product.id) {
					return;
				}
				
				let data = {
					productId: this.product.id,
					productName: this.product.name,
					productPic: this.product.pic,
					productPrice: this.product.price,
					productSubTitle: this.product.subTitle,
				}
				
				createReadHistory(data).then(response => {
					// 浏览记录创建成功
				}).catch(error => {
					console.error('创建浏览记录失败:', error);
				});
			}
		},
			//当商品规格改变时，修改商品信息
			changeSpecInfo() {
				let skuStock = this.getSkuStock();
				if (skuStock != null) {
					this.product.originalPrice = skuStock.price;
					if (this.product.promotionType == 1) {
						//单品优惠使用促销价
						this.product.price = skuStock.promotionPrice;
					} else {
						this.product.price = skuStock.price;
					}
					this.product.stock = skuStock.stock;
				}
			},
			//获取当前选中商品的SKU
			getSkuStock() {
				// 如果没有SKU列表，返回null
				if (!this.skuStockList || this.skuStockList.length === 0) {
					return null;
				}
				
				// 如果没有选择规格，返回null
				if (!this.specSelected || this.specSelected.length === 0) {
					return null;
				}
				
				for (let i = 0; i < this.skuStockList.length; i++) {
					const spDataArr = this.parseSpData(this.skuStockList[i].spData);
					if (spDataArr) {
						let availAbleSpecSet = new Map();
						for (let j = 0; j < spDataArr.length; j++) {
							if (spDataArr[j] && spDataArr[j].key && spDataArr[j].value) {
								availAbleSpecSet.set(spDataArr[j].key, spDataArr[j].value);
							}
						}
						let correctCount = 0;
						for (let item of this.specSelected) {
							let value = availAbleSpecSet.get(item.pname);
							if (value != null && value == item.name) {
								correctCount++;
							}
						}
						if (correctCount == this.specSelected.length && correctCount > 0) {
							return this.skuStockList[i];
						}
					}
				}
				return null;
			},
			//将商品加入到购物车
			addToCart() {
				// 确保默认规格已经选择
				if (this.skuStockList.length > 0 && this.specSelected.length === 0) {
					// 如果有SKU但没有选择规格，自动选择第一个可用的SKU
					this.autoSelectFirstAvailableSpec();
				}
				
				let productSkuStock = this.getSkuStock();
				
				// 如果没有SKU数据，作为简单商品处理
				if (this.skuStockList.length === 0) {
					let cartItem = {
						price: this.product.price,
						productAttr: '',
						productBrand: this.product.brandName,
						productCategoryId: this.product.productCategoryId,
						productId: this.product.id,
						productName: this.product.name,
						productPic: this.product.pic,
						productSkuCode: '',
						productSkuId: 0,
						productSn: this.product.productSn,
						productSubTitle: this.product.subTitle,
						quantity: 1
					};
					this.submitCartItem(cartItem);
					return;
				}
				
				// 如果有SKU但找不到匹配的，使用第一个可用的SKU
				if (!productSkuStock && this.skuStockList.length > 0) {
					productSkuStock = this.skuStockList[0]; // 使用第一个SKU
				}
				
				// 使用找到的SKU或默认SKU添加到购物车
				if (productSkuStock) {
					let cartItem = {
						price: productSkuStock.price || this.product.price,
						productAttr: productSkuStock.spData || '',
						productBrand: this.product.brandName,
						productCategoryId: this.product.productCategoryId,
						productId: this.product.id,
						productName: this.product.name,
						productPic: this.product.pic,
						productSkuCode: productSkuStock.skuCode || '',
						productSkuId: productSkuStock.id || 0,
						productSn: this.product.productSn,
						productSubTitle: this.product.subTitle,
						quantity: 1
					};
					this.submitCartItem(cartItem);
				} else {
					// 最后的fallback，作为简单商品处理
					let cartItem = {
						price: this.product.price,
						productAttr: '',
						productBrand: this.product.brandName,
						productCategoryId: this.product.productCategoryId,
						productId: this.product.id,
						productName: this.product.name,
						productPic: this.product.pic,
						productSkuCode: '',
						productSkuId: 0,
						productSn: this.product.productSn,
						productSubTitle: this.product.subTitle,
						quantity: 1
					};
					this.submitCartItem(cartItem);
				}
			},
			
			// 自动选择第一个可用的规格组合
			autoSelectFirstAvailableSpec() {
				if (this.skuStockList.length > 0) {
					// 清空当前选择
					this.specSelected = [];
					this.specChildList.forEach(item => {
						this.$set(item, 'selected', false);
					});
					
					// 获取第一个可用SKU的规格数据
					const firstSku = this.skuStockList[0];
					const spDataArr = this.parseSpData(firstSku.spData);
					
					if (!spDataArr) {
						console.warn('第一个SKU spData解析失败:', firstSku);
						return;
					}
					
					// 根据第一个SKU的规格数据设置选中状态
					spDataArr.forEach(spData => {
						if (spData && spData.key && spData.value) {
							const matchingSpec = this.specChildList.find(spec => 
								spec.pname === spData.key && spec.name === spData.value
							);
							if (matchingSpec) {
								this.$set(matchingSpec, 'selected', true);
								this.specSelected.push(matchingSpec);
							}
						}
					});
					
					// 更新商品信息
					this.changeSpecInfo();
				}
			},
			
			// 提交购物车项目的公共方法
			async submitCartItem(cartItem) {
				try {
					let existingItem = null;
					let currentQuantity = 0;
					
					if (this.hasLogin) {
						// 已登录用户，检查服务器购物车
						const cartResponse = await fetchCartList();
						const cartList = cartResponse.data || [];
						
						// 查找相同的商品（根据商品ID和SKU ID匹配）
						existingItem = cartList.find(item => {
							return item.productId === cartItem.productId && 
								   item.productSkuId === cartItem.productSkuId;
						});
					} else {
						// 未登录用户，检查本地购物车
						const localCartList = getLocalCartList();
						existingItem = localCartList.find(item => {
							return item.productId === cartItem.productId && 
								   item.productSkuId === cartItem.productSkuId;
						});
					}
					
					// 计算添加后的总数量
					currentQuantity = existingItem ? existingItem.quantity : 0;
					const newTotalQuantity = currentQuantity + cartItem.quantity;
					
					// 检查是否超过单笔交易上限12个
					if (newTotalQuantity > 12) {
						uni.showToast({
							title: this.$t('product.maxQuantityExceeded', { current: currentQuantity }),
							icon: 'none',
							duration: 2500
						});
						return;
					}
					
					// 检查是否超过库存
					const availableStock = this.product.stock;
					if (newTotalQuantity > availableStock) {
						uni.showToast({
							title: this.$t('product.stockInsufficient', { stock: availableStock }),
							icon: 'none',
							duration: 2000
						});
						return;
					}
					
					// 添加到购物车
					if (this.hasLogin) {
						// 已登录用户，添加到服务器购物车
						const response = await addCartItem(cartItem);
						uni.showToast({
							title: translateApiMessage(response.message),
							duration: 1500
						});
						this.refreshCartCount(); // 刷新购物车数量徽章
						
						// 设置需要刷新首页数据的标记（销量可能发生变化）
						uni.setStorageSync('needRefreshHomePage', true);
					} else {
						// 未登录用户，添加到本地购物车
						const result = addToLocalCart(cartItem);
						if (result.success) {
							uni.showToast({
								title: result.message,  // 本地购物车函数已经返回多语言消息
								duration: 1500
							});
							this.refreshCartCount(); // 刷新购物车数量徽章
							
							// 设置需要刷新首页数据的标记（销量可能发生变化）
							uni.setStorageSync('needRefreshHomePage', true);
						} else {
							uni.showToast({
								title: result.message,  // 本地购物车函数已经返回多语言消息
								icon: 'none',
								duration: 2000
							});
						}
					}
					
				} catch (error) {
					console.error('添加到购物车失败:', error);
					uni.showToast({
						title: this.$t('product.addToCartFailed'),
						icon: 'none',
						duration: 2000
					});
				}
			},
			//检查登录状态并弹出登录框
			checkForLogin() {
				if (!this.hasLogin) {
					uni.showModal({
						title: this.$t('common.tips'),
						content: this.$t('auth.loginRequired'),
						confirmText: this.$t('auth.goLogin'),
						cancelText: this.$t('common.cancel'),
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/public/login'
								})
							} else if (res.cancel) {
								// 用户点击取消
							}
						}
					});
					return false;
				} else {
					return true;
				}
			},
			//初始化收藏状态 - 已隐藏收藏功能
			initProductCollection() {
				// 收藏功能已被隐藏
				/* if (this.hasLogin) {
					productCollectionDetail({
						productId: this.product.id
					}).then(response => {
						this.favorite = response.data != null;
					});
				} */
			},
			
			// 语言切换后刷新页面数据
			refreshPageData() {
				console.log('商品详情页刷新数据以适应新语言')
				
				// 刷新汇率（根据新语言获取对应货币的汇率）
				this.initExchangeRate()
				
				// 刷新商品数据
				if (this.product && this.product.id) {
					this.loadProduct()
				}
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
		padding-bottom: 120upx;
	}

	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}

		.title2 {
			font-size: 28upx;
			color: $font-color-light;
			height: 46upx;
			line-height: 46upx;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color: $uni-color-primary;
		}

		.price {
			font-size: $font-lg + 2upx;
		}

		.price-currency {
			font-size: 24upx;
			color: $uni-color-primary;
			margin-left: 8upx;
		}

		.m-price {
			margin: 0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		
		.usd-price-box {
			margin-top: 10upx;
			
			.usd-price-text {
				font-size: 28upx;
				color: #666;
				font-weight: 500;
				background: #f0f7ff;
				padding: 6upx 12upx;
				border-radius: 6upx;
				border: 1px solid #e6f3ff;
			}
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;

			text {
				flex: 1;
			}
		}
	}

	/* 分享 */
	.share-section {
		display: flex;
		align-items: center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;

		.share-icon {
			display: flex;
			align-items: center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position: relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;

			&:after {
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position: absolute;
				background: $uni-color-primary;
			}
		}

		.icon-xingxing {
			position: relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}

		.tit {
			font-size: $font-base;
			margin-left: 10upx;
		}

		.icon-bangzhu1 {
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}

		.share-btn {
			flex: 1;
			text-align: right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}

		.icon-you {
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}

	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}

		.red {
			color: $uni-color-primary;
		}
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.tit {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20upx 0;

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;

			.con {
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	.detail-desc>>>img {
		width: 100%;
		height: auto;
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;

		.a-t {
			display: flex;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
				;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;

				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}

		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}

			.selected {
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}

	.no-padding {
		padding: 0upx 0upx;
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.btn {
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 0;
				bottom: 0;
		z-index: 95;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 100upx;
		background: rgba(255, 255, 255, .95);
		box-shadow: 0 -2upx 10upx 0 rgba(0, 0, 0, .1);
		padding: 0 20upx;
		box-sizing: border-box;

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 20upx;
			color: $font-color-base;
			width: 110upx;
			/* 移除旧的badge样式 */
			
			position: relative; /* 确保徽章相对于按钮定位 */

			.yticon {
				font-size: 32upx;
				line-height: 36upx;
				color: $font-color-light;
				margin-bottom: 2upx;
			}

			.cart-badge {
				position: absolute;
				top: -2upx;
				left: 30upx; /* 调整到图标左上角 */
				background: #e74c3c;
				color: #ffffff;
				border-radius: 50%;
				width: 30upx;
				height: 30upx;
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
					font-size: 20upx;
				}
				
				/* 两位数字 (10-99) */
				&.badge-two-digit .badge-text {
					font-size: 16upx;
				}
				
				/* 大数字 (99+) */
				&.badge-large-number .badge-text {
					font-size: 14upx;
				}
			}

			text:not(.yticon) {
				white-space: nowrap;
				line-height: 1.2;
				font-size: 20upx;
			}

			&.active,
			&.active .yticon {
				color: $uni-color-primary;
			}

			.icon-fenxiang2 {
				font-size: 34upx;
				transform: translateY(-2upx);
			}

			.icon-shoucang {
				font-size: 36upx;
			}
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 38upx;
			overflow: hidden;
			box-shadow: 0 4upx 12upx rgba(250, 67, 106, 0.3);
			background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
			flex: 1;
			max-width: 400upx;
			margin-left: 20upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, .5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				flex: 1;
				height: 100%;
				font-size: 28upx;
				font-weight: 500;
				padding: 0;
				border-radius: 0;
				background: transparent;
				color: #fff;
				white-space: nowrap;
			}
		}
	}

	.brand-info {
		margin-top: 16upx;
		background-color: #fff;
		display: flex;
		flex-direction: column;

		.brand-box {
			display: flex;
			align-items: center;
			padding: 30upx 50upx;

			.image-wrapper {
				width: 210upx;
				height: 70upx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.title {
				flex: 1;
				display: flex;
				flex-direction: column;
				font-size: $font-lg+4upx;
				margin-left: 30upx;
				color: $font-color-dark;

				text:last-child {
					font-size: $font-sm;
					color: $font-color-light;
					margin-top: 8upx;

					&.Skeleton {
						width: 220upx;
					}
				}
			}
		}

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
		
			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
		
			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	// 商品参数样式
	.product-params {
		margin-top: 16upx;
		background-color: #fff;
		display: flex;
		flex-direction: column;

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
		
			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
		
			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}

		.params-table {
			display: table;
			width: 100%;
			border-collapse: collapse;
			margin: 20upx;

			.table-row {
				display: table-row;
				border-bottom: 1px solid #f0f0f0;

				&:last-child {
					border-bottom: none;
				}

				.table-cell {
					display: table-cell;
					padding: 24upx 20upx;
					vertical-align: middle;
					border-right: 1px solid #f0f0f0;

					&:last-child {
						border-right: none;
					}
				}

				.param-text {
					font-size: $font-base;
					color: $font-color-dark;
					line-height: 1.5;
				}

				.table-label {
					width: 35%;
					font-size: $font-base;
					color: $font-color-light;
					background-color: #fafafa;
					font-weight: 500;
				}

				.table-value {
					width: 65%;
					font-size: $font-base;
					color: $font-color-dark;
					background-color: #fff;
				}
			}
		}
	}
</style>
