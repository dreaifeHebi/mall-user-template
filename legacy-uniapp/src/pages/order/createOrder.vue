<template>
	<view>
		<!-- 地址 -->
		<navigator url="/pages/address/address?source=1" class="address-section">
			<view class="order-content">
				<text class="yticon icon-shouhuodizhi"></text>
				<view class="cen">
					<view class="top">
						<text class="name">{{currentAddress.name}}</text>
						<text class="mobile">{{currentAddress.phoneNumber}}</text>
					</view>
					<text class="address">{{currentAddress.province}} {{currentAddress.city}} {{currentAddress.region}}
						{{currentAddress.detailAddress}}</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>

			<image class="a-bg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvV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"></image>
		</navigator>

		<view class="goods-section">
			<view class="g-header b-b">
				<text class="name">{{ $t('order.productInfo') }}</text>
			</view>
			<!-- 商品列表 -->
			<view class="g-item" v-for="item in cartPromotionItemList" :key="item.id">
				<image :src="item.productPic"></image>
				<view class="right">
					<text class="title clamp">{{item.productName}}</text>
					<!-- <text class="spec">{{item.productAttr | formatProductAttr}}</text> -->
					<!-- <text class="promotion clamp">{{item.promotionMessage}}</text> -->
					<view class="price-box">
						<text class="price">¥{{item.price}} JPY</text>
						<text class="number">x {{item.quantity}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 优惠明细 -->
		<!-- <view class="yt-list">
			<view class="yt-list-cell b-b" @click="toggleMask('show')">
				<view class="cell-icon">
					券
				</view>
				<text class="cell-tit clamp">优惠券</text>
				<text class="cell-tip active">
					选择优惠券
				</text>
				<text class="cell-more wanjia wanjia-gengduo-d"></text>
			</view>
			<view class="yt-list-cell b-b">
				<view class="cell-icon hb">
					积
				</view>
				<text class="cell-tit clamp">积分抵扣</text>
				<input class="integration" type="number" v-model="useIntegration" placeholder="使用积分数量" placeholder-class="placeholder"
				 @input="handleIntegrationInput" />
			</view>
		</view> -->
		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">{{ $t('order.totalAmount') }}</text>
				<text class="cell-tip">¥{{calcAmount.totalAmount}} JPY</text>
			</view>
			<view class="yt-list-cell b-b" v-if="exchangeRate && calcAmount.totalAmount">
				<text class="cell-tit clamp"></text>
				<text class="cell-tip ref-price">≈ {{ formatPrice(calcAmount.totalAmount) }}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">{{ $t('order.shipping') }}</text>
				<text class="cell-tip">¥{{calcAmount.freightAmount}} JPY</text>
			</view>
			<view class="yt-list-cell b-b" v-if="exchangeRate && calcAmount.freightAmount">
				<text class="cell-tit clamp"></text>
				<text class="cell-tip ref-price">≈ {{ formatPrice(calcAmount.freightAmount) }}</text>
			</view>
			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp">活动优惠</text>
				<text class="cell-tip red">-${{calcAmount.promotionAmount}}</text>
			</view> -->
			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp">优惠券</text>
				<text class="cell-tip red" v-if="currCoupon!=null">-${{currCoupon.amount}}</text>
				<text class="cell-tip red" v-else>-$0</text>
			</view> -->
			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp">积分抵扣</text>
				<text class="cell-tip red">-${{calcIntegrationAmount(useIntegration)}}</text>
			</view> -->
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">{{ $t('order.note') }}</text>
				<input class="desc" type="text" v-model="desc" :placeholder="$t('order.notePlaceholder')" placeholder-class="placeholder" />
			</view>
		</view>

		<!-- 售后及责任说明 -->
		<view class="order-notice-section">
			<view class="notice-title">{{ $t('index.afterSalesNotice.title') }}</view>
			<view class="notice-list">
				<view class="notice-item">
					<text class="notice-text">{{ $t('index.afterSalesNotice.item1') }}</text>
				</view>
				<view class="notice-item">
					<text class="notice-text">{{ $t('index.afterSalesNotice.item2') }}</text>
				</view>
				<view class="notice-item">
					<text class="notice-text">{{ $t('index.afterSalesNotice.item3') }}</text>
				</view>
				<view class="notice-item">
					<text class="notice-text">{{ $t('index.afterSalesNotice.item4') }}</text>
				</view>
			</view>
		</view>

		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text>{{ $t('order.actualPayment') }}</text>
				<text class="price-tip">¥</text>
				<text class="price">{{calcAmount.totalAmount + calcAmount.freightAmount}}</text>
				<text class="price-currency">JPY</text>
			</view>
			<text class="submit" @click="submit">{{ $t('order.submitOrder') }}</text>
		</view>

	</view>
</template>

<script>
	import {
		generateConfirmOrder,
		generateOrder
	} from '@/api/order.js';
	import { USE_H5_PAYMENT } from '@/utils/appConfig.js';
	import {
		mapState
	} from 'vuex';
	import { setPageTitle } from '@/utils/pageTitleUtil.js';
	import { processProductList } from '@/utils/textProcessor.js';
	import { getExchangeRateByLocale, formatPriceByLocale } from '@/utils/exchangeRateUtil.js';
	export default {
		data() {
			return {
				desc: '', //备注
				payType: 1, //1微信 2支付宝
				memberReceiveAddressList: [],
				currentAddress: {},
				cartPromotionItemList: [],
				calcAmount: {},
				useIntegration: 0,
				integrationConsumeSetting: {},
				memberIntegration: 0,
				cartIds: [],
				exchangeRate: null // JPY 汇率（根据语言显示 USD 或 CNY）
			}
		},
		onLoad(option) {
			setPageTitle('pageTitle.createOrder');
			//商品数据
			
			try {
				// 处理URL编码的情况
				const cartIdsStr = decodeURIComponent(option.cartIds);
				
				this.cartIds = JSON.parse(cartIdsStr);
				
				// 验证购物车ID数组
				if (!this.cartIds || this.cartIds.length === 0) {
					throw new Error('购物车ID数组为空');
				}
				
				// 验证数组中的每个ID
				const invalidIds = this.cartIds.filter(id => !id || typeof id !== 'number');
				if (invalidIds.length > 0) {
					throw new Error('存在无效的购物车ID: ' + JSON.stringify(invalidIds));
				}
				
				this.initExchangeRate();
				this.loadData();
				
			} catch (error) {
				console.error('解析购物车数据失败:', error);
				uni.showToast({
					title: this.$t('error.paramError'),
					icon: 'none',
					duration: 2000
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 2000);
			}
		},
		filters: {
			formatProductAttr(jsonAttr) {
				let attrArr = JSON.parse(jsonAttr);
				let attrStr = '';
				for (let attr of attrArr) {
					attrStr += attr.key;
					attrStr += ":";
					attrStr += attr.value;
					attrStr += ";";
				}
				return attrStr
			},
			formatDateTime(time) {
				if (time == null || time === '') {
					return 'N/A';
				}
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
			},
		},
		methods: {
			// 初始化汇率
			async initExchangeRate() {
				try {
					const currentLocale = this.$i18n.locale || 'zh-CN';
					this.exchangeRate = await getExchangeRateByLocale(currentLocale);
				} catch (error) {
					console.error('获取汇率失败:', error);
					this.exchangeRate = null;
				}
			},
			
			// 格式化价格显示（根据语言自动选择币种）
			formatPrice(jpyPrice) {
				if (!this.exchangeRate || !jpyPrice) {
					return '';
				}
				const currentLocale = this.$i18n.locale || 'zh-CN';
				return formatPriceByLocale(jpyPrice, this.exchangeRate, currentLocale);
			},
			
			//生成确认单信息
			async loadData() {
				try {
					const response = await generateConfirmOrder(this.cartIds);
					const addressList = response.data.memberReceiveAddressList || [];
					this.memberReceiveAddressList = addressList.filter(this.isUkAddress);
					this.currentAddress = this.getDefaultAddress();
					// 应用多语言文本处理到购物车商品列表
					this.cartPromotionItemList = processProductList(response.data.cartPromotionItemList, 'productName');
					this.calcAmount = response.data.calcAmount;
					this.integrationConsumeSetting = response.data.integrationConsumeSetting;
					this.memberIntegration = response.data.memberIntegration;
				} catch (error) {
					console.error('生成确认单失败:', error);
					
					// 如果有错误响应数据，显示具体错误信息
					let errorMessage = this.$t('error.serverError');
					if (error.data && error.data.message) {
						errorMessage = error.data.message;
					} else if (error.errMsg) {
						errorMessage = error.errMsg;
					}
					
					uni.showToast({
						title: errorMessage,
						icon: 'none',
						duration: 3000
					});
					
					// 延迟返回上一页
					setTimeout(() => {
						uni.navigateBack();
					}, 3000);
				}
			},
			numberChange(data) {
				this.number = data.number;
			},
			changePayType(type) {
				this.payType = type;
			},
			submit() {
				if (!this.currentAddress || !this.currentAddress.id) {
					uni.showToast({
						title: this.$t('address.ukAddressRequired'),
						icon: 'none',
						duration: 2500
					});
					return;
				}
				let orderParam = {
					payType: 0,
					cartIds:this.cartIds,
					memberReceiveAddressId:this.currentAddress.id,
					useIntegration:this.useIntegration,
					note: this.desc
				}
				generateOrder(orderParam).then(response => {
					let orderId = response.data.order.id;
					uni.showModal({
						title: this.$t('common.confirm'),
						content: this.$t('order.createSuccessConfirm'),
						confirmText: this.$t('order.createSuccessAction'),
						cancelText: this.$t('common.cancel'),
						success: function(res) {
							if (res.confirm) {
								if (USE_H5_PAYMENT) {
									// 使用新的H5支付系统
									uni.navigateTo({
										url: `/pages/money/h5Pay?orderId=${orderId}`
									});
								} else {
									// 使用原有支付系统
									uni.navigateTo({
										url: `/pages/money/pay?orderId=${orderId}`
									});
								}
							} else if (res.cancel) {
								// 用户点击取消
								uni.navigateTo({
									url: '/pages/order/order?state=0'
								})
							}
						}
					});
				});
			},
			stopPrevent() {},
			isUkAddress(item) {
				if (!item) {
					return false;
				}
				return item.country === 'GB' || item.countryCode === '+44';
			},
			//获取默认收货地址
			getDefaultAddress() {
				for (let item of this.memberReceiveAddressList) {
					if (item.defaultStatus == 1 && this.isUkAddress(item)) {
						return item;
					}
				}
				if(this.memberReceiveAddressList!=null&&this.memberReceiveAddressList.length>0){
					return this.memberReceiveAddressList[0];
				}
				return {};
			},
			//计算支付金额
			calcPayAmount() {
				this.calcAmount.payAmount = this.calcAmount.totalAmount - this.calcAmount.promotionAmount - this.calcAmount.freightAmount;
				if (this.useIntegration != 0) {
					this.calcAmount.payAmount = this.calcAmount.payAmount - this.calcIntegrationAmount();
				}
			},
			//积分转金额
			calcIntegrationAmount(integration) {
				if (this.integrationConsumeSetting == undefined || this.integrationConsumeSetting == null) {
					return 0;
				}
				if (this.integrationConsumeSetting.couponStatus == 0) {
					return 0;
				}
				return integration / this.integrationConsumeSetting.deductionPerAmount;
			},
			handleIntegrationInput(event) {
				if (event.detail.value > this.memberIntegration) {
					this.useIntegration = this.memberIntegration;
					uni.showToast({
						title: this.$t('order.insufficientPoints', { points: this.memberIntegration }),
						duration: 1000
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}

	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding-bottom: 1px;

		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
		}

		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}

		.g-item {
			display: flex;
			margin: 20upx 30upx;

			image {
				flex-shrink: 0;
				display: block;
				width: 140upx;
				height: 140upx;
				border-radius: 4upx;
			}

			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
			}

			.title {
				font-size: 30upx;
				color: $font-color-dark;
			}

			.spec {
				font-size: 26upx;
				color: $font-color-light;
			}

			.promotion {
				font-size: 24upx;
				color: $base-color;
			}

			.price-box {
				display: flex;
				align-items: center;
				font-size: 32upx;
				color: $font-color-dark;
				padding-top: 10upx;

				.price {
					margin-bottom: 4upx;
				}

				.number {
					font-size: 26upx;
					color: $font-color-base;
					margin-left: 20upx;
				}
			}

			.step-box {
				position: relative;
			}
		}
	}

	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}

			&.red {
				color: $base-color;
			}
			
			&.ref-price {
				font-size: 24upx;
				color: #999;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}

		.integration {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
			text-align: right;
		}
	}

	/* 支付列表 */
	.pay-list {
		padding-left: 40upx;
		margin-top: 16upx;
		background: #fff;

		.pay-item {
			display: flex;
			align-items: center;
			padding-right: 20upx;
			line-height: 1;
			height: 110upx;
			position: relative;
		}

		.icon-weixinzhifu {
			width: 80upx;
			font-size: 40upx;
			color: #6BCC03;
		}

		.icon-alipay {
			width: 80upx;
			font-size: 40upx;
			color: #06B4FD;
		}

		.icon-xuanzhong2 {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 40upx;
			color: $base-color;
		}

		.tit {
			font-size: 32upx;
			color: $font-color-dark;
			flex: 1;
		}
	}

	/* 售后及责任说明 */
	.order-notice-section {
		margin-top: 16upx;
		background: #fff;
		padding: 30upx;
		margin-bottom: 120upx;

		.notice-title {
			font-size: 30upx;
			font-weight: 500;
			color: $font-color-dark;
			margin-bottom: 20upx;
		}

		.notice-list {
			.notice-item {
				padding: 12upx 0;
				border-bottom: 1upx solid #f5f5f5;

				&:last-child {
					border-bottom: none;
				}

				.notice-text {
					font-size: 26upx;
					color: $font-color-base;
					line-height: 1.6;
					display: block;
				}
			}
		}
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

		.price-content {
			padding-left: 30upx;
		}

		.price-tip {
			color: $base-color;
			margin-left: 8upx;
		}

		.price {
			font-size: 36upx;
			color: $base-color;
		}

		.submit {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 280upx;
			height: 100%;
			color: #fff;
			font-size: 32upx;
			background-color: $base-color;
		}
	}
</style>
