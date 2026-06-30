<template>
	<view class="content">
		<text class="success-icon yticon icon-xuanzhong2"></text>
		<text class="tit">{{payText}}</text>
		
		<view class="btn-group">
			<navigator url="/pages/order/order?state=0" open-type="navigate" class="mix-btn">{{ $t('payment.viewOrder') }}</navigator>
			<navigator url="/pages/index/index" open-type="switchTab" class="mix-btn hollow">{{ $t('payment.backHome') }}</navigator>
		</view>
	</view>
</template>

<script>
	import {
		fetchAliapyStatus
	} from '@/api/order.js';
	import {
		queryPaymentStatus
	} from '@/api/h5Payment.js';
	import { USE_ALIPAY } from '@/utils/appConfig.js';
	import { setPageTitle } from '@/utils/pageTitleUtil.js';
	export default {
		data() {
			return {
				payText: '',
				tradeStatus: null,
				orderSn: '',
				paymentChannel: ''
			}
		},
		onLoad(options) {
			setPageTitle('pageTitle.paySuccess');
			
			// 检查是否是H5支付的结果
			// 优先从URL参数获取，如果没有则从存储中获取
			let orderSn = options.orderSn;
			let paymentChannel = options.paymentChannel;
			let success = options.success; // 从URL参数获取支付成功标识
			
			// 如果URL参数中明确指示支付成功，才设置刷新标记
			if (success === 'true') {
				// 设置标记，表示支付成功，商品页面需要刷新库存
				uni.setStorageSync('needRefreshProductAfterPayment', true);
				// 设置标记，表示支付成功，首页需要刷新轮播图（销量可能发生变化）
				uni.setStorageSync('needRefreshHomePage', true);
			}
			
			if (!orderSn || !paymentChannel) {
				// 从浏览器存储中获取支付参数
				orderSn = uni.getStorageSync('h5PaymentOrderSn');
				paymentChannel = uni.getStorageSync('h5PaymentChannel');
				
				// 尝试从localStorage获取（支付回调页面设置的）
				if (!orderSn || !paymentChannel) {
					try {
						if (typeof localStorage !== 'undefined') {
							orderSn = orderSn || localStorage.getItem('h5PaymentOrderSn');
							paymentChannel = paymentChannel || localStorage.getItem('h5PaymentChannel');
							
							// 获取到参数后清除localStorage
							if (orderSn && paymentChannel) {
								localStorage.removeItem('h5PaymentOrderSn');
								localStorage.removeItem('h5PaymentChannel');
								localStorage.removeItem('h5PaymentCallbackParams');
							}
						}
					} catch (error) {
						console.error('无法访问localStorage:', error);
					}
				}
			}
			
			if (orderSn && paymentChannel) {
				this.orderSn = orderSn;
				this.paymentChannel = paymentChannel;
				// 清除存储的参数
				uni.removeStorageSync('h5PaymentOrderSn');
				uni.removeStorageSync('h5PaymentChannel');
				this.checkH5PaymentResult();
				return;
			}
			
			// 原有的支付宝支付逻辑
			if(!USE_ALIPAY){
				this.payText = this.$t('h5Pay.paymentSuccess');
				return;
			}
			let outTradeNo = options.out_trade_no;
			fetchAliapyStatus({outTradeNo:outTradeNo}).then(response => {
				this.tradeStatus = response.data;
				if(this.tradeStatus!=null&&'TRADE_SUCCESS'==this.tradeStatus){
					this.payText = '支付成功';
				}else{
					this.payText = '支付失败';
				}
			});
		},
		methods: {
			// 检查H5支付结果
			async checkH5PaymentResult() {
				try {
					const response = await queryPaymentStatus(this.orderSn, this.paymentChannel);
					
					if (response.code === 200) {
						const { paymentStatus, paymentResponse } = response.data;
						
						// 检查 paymentResponse 中的 result_code
						let isPaymentSuccess = false;
						if (paymentResponse) {
							try {
								const responseData = typeof paymentResponse === 'string' ? JSON.parse(paymentResponse) : paymentResponse;
								isPaymentSuccess = responseData.result_code === 'PAY_SUCCESS';
							} catch (e) {
								console.error('解析 paymentResponse 失败:', e);
							}
						}
						
						// 如果 paymentResponse 中显示支付成功，或者 paymentStatus 为 SUCCESS
						if (isPaymentSuccess || paymentStatus === 'SUCCESS') {
							this.payText = this.$t('h5Pay.paymentSuccess');
						} else if (paymentStatus === 'FAILED') {
							this.payText = this.$t('h5Pay.paymentFailed');
						} else if (paymentStatus === 'CANCELLED') {
							this.payText = this.$t('h5Pay.paymentCancelled');
						} else {
							this.payText = this.$t('h5Pay.paymentStatusUnknown');
						}
					} else {
						this.payText = this.$t('h5Pay.queryPaymentFailed');
					}
				} catch (error) {
					console.error('查询H5支付结果失败:', error);
					this.payText = this.$t('h5Pay.queryPaymentFailed');
				}
			}
		}
	}
</script>

<style lang='scss'>
	.content{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.success-icon{
		font-size: 160upx;
		color: #fa436a;
		margin-top: 100upx;
	}
	.tit{
		font-size: 38upx;
		color: #303133;
	}
	.btn-group{
		padding-top: 100upx;
	}
	.mix-btn {
		margin-top: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 600upx;
		height: 80upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		&.hollow{
			background: #fff;
			color: #303133;
			border: 1px solid #ccc;
		}
	}
</style>
