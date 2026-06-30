<template>
	<view class="app">
		<view class="price-box">
			<text>{{ $t('h5Pay.paymentAmount') }}</text>
			<text class="price">¥{{orderInfo.payAmount || '0.00'}} JPY</text>
		</view>

		<!-- 支付方式选择 -->
		<view class="payment-methods-container">
			<view class="section-title">{{ $t('h5Pay.selectPaymentMethod') }}</view>
			<view class="payment-methods">
				<view class="service-image-container">
					<image v-if="qrcodeUrl" :src="qrcodeUrl" mode="widthFix" class="service-image"></image>
					<view v-else class="service-image-placeholder">
						<text>加载中...</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 订单信息 -->
		<view class="order-info" v-if="orderInfo && orderInfo.orderSn">
			<view class="info-item">
				<text class="label">{{ $t('h5Pay.orderNumber') }}</text>
				<text class="value">{{orderInfo.orderSn || ''}}</text>
			</view>
			<view class="info-item">
				<text class="label">{{ $t('h5Pay.receiver') }}</text>
				<text class="value">{{orderInfo.receiverName || ''}}</text>
			</view>
			<view class="info-item">
				<text class="label">{{ $t('h5Pay.productDesc') }}</text>
				<text class="value">{{paymentSubject || ''}}</text>
			</view>
		</view>

		<view class="copy-arrow-wrap">
			<text class="copy-arrow">👇</text>
		</view>

		<view class="mix-btn" @tap="copyServiceWechat">
			<text class="mix-btn-text">{{ $t('h5Pay.copyWechatId') }}</text>
		</view>
		
		<!-- 支付状态查询的遮罩层 -->
		<view class="payment-status-modal" v-if="showStatusModal">
			<view class="modal-content">
				<view class="status-icon">
					<text class="loading-icon">⏳</text>
				</view>
				<text class="status-text">{{ $t('h5Pay.queryingPayment') }}</text>
				<text class="status-desc">{{ $t('h5Pay.doNotClose') }}</text>
				<button class="cancel-btn" @click="cancelPaymentCheck">{{ $t('h5Pay.cancelQuery') }}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		fetchOrderDetail
	} from '@/api/order.js';
	import {
		createH5Payment,
		queryPaymentStatus,
		generateOrderSn,
		PAYMENT_CHANNELS,
		PAYMENT_STATUS,
		CURRENCY_TYPES
	} from '@/api/h5Payment.js';
	import { 
		API_BASE_URL, 
		PAYMENT_RETURN_URL, 
		PAYMENT_NOTIFY_URL 
	} from '@/utils/appConfig.js';
	import { setPageTitle } from '@/utils/pageTitleUtil.js';

	import { getServiceQrcode } from '@/api/service.js';


	export default {
		data() {
			return {
				orderId: null,
				orderInfo: {},
				selectedPaymentChannel: 'WECHAT_H5', // 默认选择微信
				paymentSubject: '',
				pollingTimer: null, // 轮询定时器
				showStatusModal: false, // 支付状态查询遮罩
				paymentOrderSn: '', // 支付订单号
				qrcodeUrl: '' // 客服二维码地址
			};
		},
		onLoad(options) {
			// 设置页面标题
			setPageTitle('pageTitle.h5Pay');
			
			this.orderId = options.orderId;
			this.loadOrderInfo();
			this.loadServiceQrcode();
		},
		onUnload() {
			// 页面卸载时清除轮询定时器
			this.clearPollingTimer();
		},
		methods: {
			// 加载订单信息
			async loadOrderInfo() {
				console.log('开始加载订单信息，orderId:', this.orderId);
				try {
					const response = await fetchOrderDetail(this.orderId);
					console.log('订单信息响应:', response);
					this.orderInfo = response.data;
					console.log('设置orderInfo:', this.orderInfo);
					this.paymentSubject = `${this.orderInfo.receiverName}${this.$t('h5Pay.orderSuffix')}`;
					console.log('设置paymentSubject:', this.paymentSubject);
				} catch (error) {
					console.error('加载订单信息失败:', error);
					uni.showToast({
						title: this.$t('h5Pay.loadOrderFailed'),
						icon: 'none'
					});
				}
			},

			// 加载客服二维码
			async loadServiceQrcode() {
				try {
					const response = await getServiceQrcode();
					if (response.code === 200 && response.data) {
						this.qrcodeUrl = response.data;
					}
				} catch (error) {
					console.error('获取客服二维码失败:', error);
				}
			},

			// 选择支付方式
			selectPaymentMethod(channel) {
				console.log('选择支付方式:', channel, '当前选择:', this.selectedPaymentChannel);
				this.selectedPaymentChannel = channel;
				console.log('选择后的支付方式:', this.selectedPaymentChannel);
				// 强制更新视图
				this.$forceUpdate();
			},
			copyServiceWechat() {
				uni.setClipboardData({
					data: 'Banana-man24',
					success: () => {
						uni.showToast({
							title: this.$t('tips.copySuccess'),
							icon: 'success'
						});
					}
				});
			},

			// 确认支付
			async confirmPayment() {
				if (!this.selectedPaymentChannel) {
					uni.showToast({
						title: this.$t('h5Pay.selectPaymentRequired'),
						icon: 'none'
					});
					return;
				}

				// 生成支付订单号（基于原订单号）
				this.paymentOrderSn = this.orderInfo.orderSn || generateOrderSn();

				// 构建支付数据
				const paymentData = {
					orderId: this.orderInfo.id,
					orderSn: this.paymentOrderSn,
					paymentChannel: this.selectedPaymentChannel,
					totalAmount: this.orderInfo.payAmount,
					currency: CURRENCY_TYPES.JPY,
					subject: this.paymentSubject,
					returnUrl: `${PAYMENT_RETURN_URL}?orderSn=${this.paymentOrderSn}&paymentChannel=${this.selectedPaymentChannel}`,
					notifyUrl: PAYMENT_NOTIFY_URL
				};

				try {
					uni.showLoading({
						title: this.$t('h5Pay.creatingOrder')
					});

					const response = await createH5Payment(paymentData);
					uni.hideLoading();

					if (response.code === 200) {
						const { paymentUrl } = response.data;

						// 不再依赖本地存储，完全通过URL参数传递
						// uni.setStorageSync('h5PaymentOrderSn', this.paymentOrderSn);
						// uni.setStorageSync('h5PaymentChannel', this.selectedPaymentChannel);

						if (this.selectedPaymentChannel === PAYMENT_CHANNELS.CREDIT_CARD) {
							// 信用卡支付：直接查询结果
							this.startPaymentStatusPolling();
						} else {
							// 微信H5支付：直接跳转到支付页面
							// 使用 location.href 确保能正确唤起微信
							window.location.href = paymentUrl;
						}
					} else {
						this.handlePaymentError(response);
					}
				} catch (error) {
					uni.hideLoading();
					this.handlePaymentError(error);
				}
			},

			// 开始轮询支付状态
			startPaymentStatusPolling() {
				this.showStatusModal = true;
				
				const checkStatus = async () => {
					try {
						const response = await queryPaymentStatus(this.paymentOrderSn, this.selectedPaymentChannel);
						
						if (response.code === 200) {
							const { paymentStatus, failureReason, paymentResponse } = response.data;
							
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
							if (isPaymentSuccess || paymentStatus === PAYMENT_STATUS.SUCCESS) {
								// 支付成功
								this.clearPollingTimer();
								this.showStatusModal = false;
								
								// 设置标记，表示支付成功
								uni.setStorageSync('needRefreshProductAfterPayment', true);
								uni.setStorageSync('needRefreshHomePage', true);
								
								uni.showToast({
									title: this.$t('h5Pay.paymentSuccess'),
									icon: 'success'
								});
								
								setTimeout(() => {
									// 通过URL参数传递，确保支付成功页面能获取到正确信息
									uni.redirectTo({
										url: `/pages/money/paySuccess?orderSn=${this.paymentOrderSn}&paymentChannel=${this.selectedPaymentChannel}`
									});
								}, 1500);
							} else if (paymentStatus === PAYMENT_STATUS.FAILED) {
								// 支付失败
								this.clearPollingTimer();
								this.showStatusModal = false;
								
								uni.showModal({
									title: '支付失败',
									content: failureReason || '支付失败，请重新支付',
									confirmText: '重新支付',
									cancelText: '返回',
									success: (res) => {
										if (!res.confirm) {
											uni.navigateBack();
										}
									}
								});
							} else if (paymentStatus === PAYMENT_STATUS.CANCELLED) {
								// 支付取消
								this.clearPollingTimer();
								this.showStatusModal = false;
								
								uni.showToast({
									title: this.$t('h5Pay.paymentCancelled'),
									icon: 'none'
								});
							} else if (paymentStatus === PAYMENT_STATUS.PENDING) {
								// 继续轮询
								this.pollingTimer = setTimeout(checkStatus, 3000);
							}
						} else {
							// 查询失败，继续轮询
							this.pollingTimer = setTimeout(checkStatus, 3000);
						}
					} catch (error) {
						console.error('查询支付状态失败:', error);
						// 查询失败，继续轮询
						this.pollingTimer = setTimeout(checkStatus, 3000);
					}
				};

				// 启动轮询（延迟3秒开始）
				this.pollingTimer = setTimeout(checkStatus, 3000);
			},

			// 清除轮询定时器
			clearPollingTimer() {
				if (this.pollingTimer) {
					clearTimeout(this.pollingTimer);
					this.pollingTimer = null;
				}
			},

			// 取消支付查询
			cancelPaymentCheck() {
				this.clearPollingTimer();
				this.showStatusModal = false;
				
				uni.showModal({
					title: '提示',
					content: '已停止查询支付状态，如果已完成支付，请手动刷新订单状态',
					confirmText: '查看订单',
					cancelText: '继续支付',
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/order/order?state=0'
							});
						}
					}
				});
			},

			// 处理支付错误
			handlePaymentError(error) {
				let errorMessage = '支付失败，请重试';
				
				if (error.data && error.data.message) {
					errorMessage = error.data.message;
				} else if (error.message) {
					errorMessage = error.message;
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
			}
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
		padding-bottom: 120upx;
		background-color: #f5f5f5;
	}

	.price-box {
		background-color: #fff;
		height: 200upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 20upx;

		text:first-child {
			font-size: 28upx;
			color: #666;
			margin-bottom: 10upx;
		}

		.price {
			font-size: 48upx;
			color: #fa436a;
			font-weight: bold;
		}
	}

	.payment-methods-container {
		background-color: #fff;
		margin-bottom: 20upx;
		padding: 30upx 40upx;

		.section-title {
			font-size: 32upx;
			font-weight: bold;
			color: #333;
			margin-bottom: 30upx;
		}
	}

	.payment-methods {
		.service-image-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20upx 0;
			
			.service-image {
				width: 300upx;
				height: 300upx;
				margin-bottom: 20upx;
			}
			
			.service-image-placeholder {
				width: 300upx;
				height: 300upx;
				background-color: #f5f5f5;
				margin-bottom: 20upx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #999;
				font-size: 24upx;
			}
			
			.service-tip {
				font-size: 28upx;
				color: #999;
			}
		}
	}

	.order-info {
		background-color: #fff;
		margin-bottom: 20upx;
		padding: 30upx 40upx;

		.info-item {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20upx;

			&:last-child {
				margin-bottom: 0;
			}

			.label {
				font-size: 28upx;
				color: #666;
			}

			.value {
				font-size: 28upx;
				color: #333;
				flex: 1;
				text-align: right;
				word-break: break-all;
			}
		}
	}

	.copy-arrow-wrap {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 150upx;
		display: flex;
		justify-content: center;
		z-index: 10;

		.copy-arrow {
			font-size: 52upx;
			line-height: 1;
			color: #fa436a;
			font-weight: bold;
		}
	}

	.mix-btn {
		position: fixed;
		bottom: 30upx;
		left: 24upx;
		right: 24upx;
		height: 88upx;
		background-color: #fa436a;
		border-radius: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;

		.mix-btn-text {
			font-size: 36upx;
			font-weight: bold;
			line-height: 1;
			color: #fff;
		}

		&.disabled {
			background-color: #ccc;
		}
	}

	.payment-status-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;

		.modal-content {
			width: 600upx;
			background: #fff;
			border-radius: 20upx;
			padding: 60upx 40upx;
			text-align: center;

			.status-icon {
				margin-bottom: 30upx;

				.loading-icon {
					font-size: 80upx;
				}
			}

			.status-text {
				display: block;
				font-size: 32upx;
				color: #333;
				margin-bottom: 20upx;
			}

			.status-desc {
				display: block;
				font-size: 26upx;
				color: #666;
				margin-bottom: 40upx;
			}

			.cancel-btn {
				background-color: #f5f5f5;
				color: #666;
				border: none;
				border-radius: 10upx;
				padding: 20upx 40upx;
				font-size: 28upx;
			}
		}
	}
</style>
