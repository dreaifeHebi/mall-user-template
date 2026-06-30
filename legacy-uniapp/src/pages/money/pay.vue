<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{orderInfo.payAmount}}</text>
		</view>

		<view class="pay-type-list">
			<radio-group @change="radioChange">
				<view class="type-item b-b" @click="changePayType(1)">
					<text class="icon yticon icon-alipay"></text>
					<view class="con">
						<text class="tit">支付宝支付</text>
						<text>推荐使用支付宝支付</text>
					</view>
					<label class="radio">
						<radio value="1" color="#fa436a" :checked='payType == 1' />
					</label>
				</view>
				<view class="type-item b-b" @click="changePayType(2)">
					<text class="icon yticon icon-weixinzhifu"></text>
					<view class="con">
						<text class="tit">微信支付</text>
						<text>安全便捷的微信支付</text>
					</view>
					<label class="radio">
						<radio value="2" color="#fa436a" :checked='payType == 2' />
					</label>
				</view>
				<!-- 信用卡支付选项已隐藏 -->
				<!-- <view class="type-item b-b" @click="changePayType(3)">
					<text class="icon yticon credit-card-text">卡</text>
					<view class="con">
						<text class="tit">信用卡支付</text>
						<text>支持主流信用卡支付</text>
					</view>
					<label class="radio">
						<radio value="3" color="#fa436a" :checked='payType == 3' />
					</label>
				</view> -->
			</radio-group>
		</view>

		<!-- 信用卡信息表单已隐藏 -->
		<!-- <view class="credit-card-form" v-if="payType === 3">
			<view class="form-title">请填写信用卡信息</view>
			<view class="form-item">
				<text class="label">卡号</text>
				<input class="input" v-model="creditCardInfo.cardNumber" placeholder="请输入16位卡号" maxlength="19" @input="formatCardNumber" />
			</view>
			<view class="form-row">
				<view class="form-item half">
					<text class="label">有效期</text>
					<input class="input" v-model="creditCardInfo.expiry" placeholder="MM/YY" maxlength="5" @input="formatExpiry" />
				</view>
				<view class="form-item half">
					<text class="label">CVV</text>
					<input class="input" v-model="creditCardInfo.cvv" placeholder="CVV" maxlength="4" type="number" />
				</view>
			</view>
			<view class="form-item">
				<text class="label">持卡人姓名</text>
				<input class="input" v-model="creditCardInfo.holderName" placeholder="请输入持卡人姓名" />
			</view>
		</view> -->

		<!-- 测试支付按钮 -->
		<text class="test-pay-btn" @click="testPayment">测试支付（直接成功）</text>
		
		<text class="mix-btn" @click="confirm">确认支付</text>
	</view>
</template>

<script>
	import {
		fetchOrderDetail,
		payOrderSuccess
	} from '@/api/order.js';
	import { API_BASE_URL, USE_ALIPAY } from '@/utils/appConfig.js';
	export default {
		data() {
			return {
				orderId: null,
				payType: 1,
				orderInfo: {},
				creditCardInfo: {
					cardNumber: '',
					expiry: '',
					cvv: '',
					holderName: ''
				}
			};
		},
		onLoad(options) {
			this.orderId = options.orderId;
			fetchOrderDetail(this.orderId).then(response => {
				this.orderInfo = response.data;
			});
		},
		methods: {
			//radio-group改变事件
			radioChange(e) {
				this.payType = parseInt(e.detail.value);
			},
			//选择支付方式
			changePayType(type) {
				this.payType = type;
			},
			//格式化卡号显示 (添加空格)
			formatCardNumber(e) {
				let value = e.detail.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
				let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
				this.creditCardInfo.cardNumber = formattedValue;
			},
			//格式化有效期 (MM/YY格式)
			formatExpiry(e) {
				let value = e.detail.value.replace(/[^0-9]/g, '');
				if (value.length >= 2) {
					value = value.substring(0, 2) + '/' + value.substring(2, 4);
				}
				this.creditCardInfo.expiry = value;
			},
			//验证信用卡信息
			validateCreditCardInfo() {
				const { cardNumber, expiry, cvv, holderName } = this.creditCardInfo;
				
				if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
					uni.showToast({
						title: '请输入正确的卡号',
						icon: 'none'
					});
					return false;
				}
				
				if (!expiry || expiry.length !== 5) {
					uni.showToast({
						title: '请输入正确的有效期',
						icon: 'none'
					});
					return false;
				}
				
				if (!cvv || cvv.length < 3) {
					uni.showToast({
						title: '请输入正确的CVV',
						icon: 'none'
					});
					return false;
				}
				
				if (!holderName || holderName.trim() === '') {
					uni.showToast({
						title: '请输入持卡人姓名',
						icon: 'none'
					});
					return false;
				}
				
				return true;
			},
			//确认支付
			confirm: async function() {
				// 如果是信用卡支付，先验证信用卡信息
				if (this.payType === 3) {
					if (!this.validateCreditCardInfo()) {
						return;
					}
				}
				
				if(USE_ALIPAY){
					if(this.payType!=1){
						uni.showToast({
							title:"暂不支持微信支付和信用卡支付！",
							icon:"none"
						})
						return;
					}
					window.location.href = API_BASE_URL+"/alipay/webPay?outTradeNo=" + this.orderInfo.orderSn + "&subject=" + this.orderInfo.receiverName + "的商品订单" + "&totalAmount=" + this.orderInfo.totalAmount
				}else{
					// 处理不同支付方式
					let payTypeText = '';
					let paymentData = {
						orderId: this.orderId,
						payType: this.payType
					};
					
					switch(this.payType) {
						case 1:
							payTypeText = '支付宝支付';
							break;
						case 2:
							payTypeText = '微信支付';
							break;
						case 3:
							payTypeText = '信用卡支付';
							// 添加信用卡信息到支付数据
							paymentData.creditCardInfo = {
								cardNumber: this.creditCardInfo.cardNumber.replace(/\s/g, ''), // 移除空格
								expiry: this.creditCardInfo.expiry,
								cvv: this.creditCardInfo.cvv,
								holderName: this.creditCardInfo.holderName
							};
							break;
						default:
							payTypeText = '支付宝支付';
					}
					
					// 显示确认提示
					if (this.payType === 3) {
						uni.showModal({
							title: '确认支付',
							content: `确认使用信用卡(****${this.creditCardInfo.cardNumber.slice(-4)})支付$${this.orderInfo.payAmount}？`,
							success: (res) => {
								if (res.confirm) {
									this.processCreditCardPayment(paymentData);
								}
							}
						});
					} else {
						payOrderSuccess(paymentData).then(response => {
							// 设置标记，表示支付成功，商品页面需要刷新库存
							uni.setStorageSync('needRefreshProductAfterPayment', true);
							// 设置标记，表示支付成功，首页需要刷新轮播图（销量可能发生变化）
							uni.setStorageSync('needRefreshHomePage', true);
							
							uni.redirectTo({
								url: '/pages/money/paySuccess'
							})
						}).catch(error => {
							this.handlePaymentError(error);
						});
					}
				}
			},
			//处理信用卡支付
			processCreditCardPayment(paymentData) {
				uni.showLoading({
					title: '处理中...'
				});
				
				payOrderSuccess(paymentData).then(response => {
					uni.hideLoading();
					
					// 设置标记，表示支付成功，商品页面需要刷新库存
					uni.setStorageSync('needRefreshProductAfterPayment', true);
					// 设置标记，表示支付成功，首页需要刷新轮播图（销量可能发生变化）
					uni.setStorageSync('needRefreshHomePage', true);
					
					uni.showToast({
						title: '支付成功',
						icon: 'success'
					});
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/money/paySuccess'
						});
					}, 1500);
				}).catch(error => {
					uni.hideLoading();
					this.handlePaymentError(error);
				});
			},
			//处理支付错误
			handlePaymentError(error) {
				let errorMessage = '支付失败，请重试';
				
				if (error.data && error.data.message) {
					const message = error.data.message;
					if (message.includes('库存不足')) {
						errorMessage = '商品库存不足，无法完成支付。请返回购物车重新选择商品。';
					} else if (message.includes('信用卡')) {
						errorMessage = '信用卡信息验证失败，请检查后重试';
					} else if (message.includes('订单')) {
						errorMessage = '订单异常，请联系客服处理';
					} else {
						errorMessage = message;
					}
				}
				
				uni.showModal({
					title: '支付失败',
					content: errorMessage,
					showCancel: true,
					confirmText: '重试',
					cancelText: '返回',
					success: (res) => {
						if (!res.confirm) {
							uni.navigateBack();
						}
					}
				});
			},
			//测试支付方法（直接调用支付成功）
			testPayment() {
				uni.showModal({
					title: '测试支付',
					content: `确认测试支付订单 ${this.orderInfo.orderSn}，金额 $${this.orderInfo.payAmount}？`,
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '支付处理中...'
							});
							
							// 模拟支付处理时间
							setTimeout(() => {
								// 直接调用支付成功接口
								payOrderSuccess({
									orderId: this.orderId,
									payType: 99, // 使用特殊的支付类型标识测试支付
									testPayment: true
								}).then(response => {
									uni.hideLoading();
									
									// 设置标记，表示支付成功，商品页面需要刷新库存
									uni.setStorageSync('needRefreshProductAfterPayment', true);
									// 设置标记，表示支付成功，首页需要刷新轮播图（销量可能发生变化）
									uni.setStorageSync('needRefreshHomePage', true);
									
									uni.showToast({
										title: '测试支付成功',
										icon: 'success'
									});
									
									setTimeout(() => {
										uni.redirectTo({
											url: '/pages/money/paySuccess'
										});
									}, 1500);
								}).catch(error => {
									uni.hideLoading();
									this.handlePaymentError(error);
								});
							}, 1000); // 1秒延迟模拟真实支付处理时间
						}
					}
				});
			},
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price {
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;

			&:before {
				content: '$';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;

		.type-item {
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position: relative;
		}

		.icon {
			width: 100upx;
			font-size: 52upx;
		}

		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}

		.icon-weixinzhifu {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.credit-card-text {
			color: #ff6b35;
			// font-weight: bold;
			// border: 2upx solid #ff6b35;
			// border-radius: 6upx;
			// padding: 8upx 12upx;
			// font-size: 32upx !important;
		}

		.tit {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}

	/* 信用卡表单样式 */
	.credit-card-form {
		background: #fff;
		margin-top: 20upx;
		padding: 30upx;
		border-radius: 10upx;

		.form-title {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 30upx;
			text-align: center;
			font-weight: bold;
		}

		.form-item {
			margin-bottom: 30upx;

			.label {
				display: block;
				font-size: $font-base;
				color: $font-color-dark;
				margin-bottom: 10upx;
			}

			.input {
				width: 100%;
				height: 80upx;
				border: 2upx solid #e0e0e0;
				border-radius: 8upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
				background: #fafafa;

				&:focus {
					border-color: $base-color;
					background: #fff;
				}
			}

			&.half {
				width: 48%;
				display: inline-block;

				&:first-child {
					margin-right: 4%;
				}
			}
		}

		.form-row {
			display: flex;
			justify-content: space-between;
		}
	}

	/* 测试支付按钮 */
	.test-pay-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 40upx auto 20upx;
		font-size: $font-lg;
		color: #fff;
		background-color: #ff9500;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(255, 149, 0, 0.4);
	}

	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 20upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
