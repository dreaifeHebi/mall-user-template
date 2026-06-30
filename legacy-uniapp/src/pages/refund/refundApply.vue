<template>
	<view class="container">
		<!-- 订单信息 -->
		<view class="order-info">
			<view class="info-title">{{ $t('refund.orderInfo') }}</view>
			<view class="info-item">
				<text class="label">{{ $t('refund.orderNumber') }}：</text>
				<text class="value">{{orderInfo.orderSn}}</text>
			</view>
			<view class="info-item">
				<text class="label">{{ $t('refund.orderAmount') }}：</text>
				<text class="value">¥{{orderInfo.payAmount}}</text>
				<text class="price-currency">JPY</text>
			</view>
			<view class="info-item">
				<text class="label">{{ $t('refund.paymentTime') }}：</text>
				<text class="value">{{formatDateTime(orderInfo.paymentTime)}}</text>
			</view>
		</view>

		<!-- 退款信息 -->
		<view class="refund-form">
			<view class="form-title">{{ $t('refund.refundInfo') }}</view>
			
			<view class="form-item">
				<text class="label">{{ $t('refund.refundAmount') }} <text class="required">*</text></text>
				<input 
					class="input" 
					type="digit" 
					v-model="refundAmount" 
					:placeholder="$t('refund.enterRefundAmount')"
					:maxlength="10"
					@input="validateAmount"
				/>
				<text class="tip">{{ $t('refund.maxRefundAmount') }} ¥{{orderInfo.payAmount}} JPY</text>
			</view>

			<view class="form-item">
				<text class="label">{{ $t('refund.refundReason') }} <text class="required">*</text></text>
				<picker @change="onReasonChange" :value="reasonIndex" :range="localizedRefundReasons">
					<view class="picker-display">
						<text class="picker-text" :class="{placeholder: reasonIndex === -1}">
							{{reasonIndex !== -1 ? localizedRefundReasons[reasonIndex] : $t('refund.selectReason')}}
						</text>
						<text class="picker-arrow">></text>
					</view>
				</picker>
			</view>

			<view class="form-item">
				<text class="label">{{ $t('refund.detailDescription') }}</text>
				<textarea 
					class="textarea" 
					v-model="refundDescription" 
					:placeholder="$t('refund.descriptionPlaceholder')"
					:maxlength="200"
					:show-confirm-bar="false"
				></textarea>
				<text class="char-count">{{refundDescription.length}}/200</text>
			</view>
		</view>

		<!-- 退款须知 -->
		<view class="refund-notice">
			<view class="notice-title">{{ $t('refund.refundNotice') }}</view>
			<view class="notice-content">
				<text class="notice-item">• {{ $t('refund.noticeItem1') }}</text>
				<text class="notice-item">• {{ $t('refund.noticeItem2') }}</text>
				<text class="notice-item">• {{ $t('refund.noticeItem3') }}</text>
				<text class="notice-item">• {{ $t('refund.noticeItem4') }}</text>
			</view>
		</view>

		<!-- 提交按钮 -->
		<view class="submit-container">
			<button class="submit-btn" @click="submitRefund" :disabled="!canSubmit">{{ $t('refund.submitApplication') }}</button>
		</view>
	</view>
</template>

<script>
	import { fetchOrderDetail } from '@/api/order.js';
	import { applyRefund } from '@/api/h5Payment.js';
	import { setPageTitle } from '@/utils/pageTitleUtil.js';
	import languageRefreshMixin from '@/mixins/languageRefreshMixin.js';
	
	export default {
		mixins: [languageRefreshMixin],
		data() {
			return {
				orderId: null,
				orderInfo: {},
				refundAmount: '',
				reasonIndex: -1,
				refundDescription: '',
				refundReasons: [
					'商品质量问题',
					'商品描述不符',
					'物流配送问题',
					'不喜欢/不想要',
					'重复下单',
					'其他原因'
				]
			}
		},
		computed: {
			canSubmit() {
				return this.refundAmount && 
					   this.reasonIndex !== -1 && 
					   parseFloat(this.refundAmount) > 0 && 
					   parseFloat(this.refundAmount) <= parseFloat(this.orderInfo.payAmount);
			},
			localizedRefundReasons() {
				return [
					this.$t('refund.reasons.qualityIssue'),
					this.$t('refund.reasons.descriptionMismatch'),
					this.$t('refund.reasons.shippingIssue'),
					this.$t('refund.reasons.dontLike'),
					this.$t('refund.reasons.duplicateOrder'),
					this.$t('refund.reasons.other')
				];
			}
		},
		onLoad(options) {
			setPageTitle('pageTitle.refundApply');

			this.orderId = options.orderId;
			this.loadOrderInfo();
		},
		methods: {
			// 加载订单信息
			async loadOrderInfo() {
				try {
					const response = await fetchOrderDetail(this.orderId);
					this.orderInfo = response.data;
					// 默认设置为全额退款
					this.refundAmount = this.orderInfo.payAmount.toString();
				} catch (error) {
					console.error('加载订单信息失败:', error);
					uni.showToast({
						title: this.$t('refund.loadOrderFailed'),
						icon: 'none'
					});
				}
			},

			// 验证金额输入
			validateAmount(e) {
				let value = e.detail.value;
				// 只允许输入数字和小数点
				value = value.replace(/[^\d.]/g, '');
				// 只允许一个小数点
				value = value.replace(/\.{2,}/g, '.');
				// 小数点后最多2位
				if (value.indexOf('.') !== -1) {
					const parts = value.split('.');
					if (parts[1] && parts[1].length > 2) {
						parts[1] = parts[1].substring(0, 2);
					}
					value = parts.join('.');
				}
				this.refundAmount = value;
			},

			// 选择退款原因
			onReasonChange(e) {
				this.reasonIndex = e.detail.value;
			},

			// 格式化日期时间
			formatDateTime(dateTime) {
				if (!dateTime) return '';
				try {
					const date = new Date(dateTime);
					const year = date.getFullYear();
					const month = String(date.getMonth() + 1).padStart(2, '0');
					const day = String(date.getDate()).padStart(2, '0');
					const hours = String(date.getHours()).padStart(2, '0');
					const minutes = String(date.getMinutes()).padStart(2, '0');
					return `${year}-${month}-${day} ${hours}:${minutes}`;
				} catch (e) {
					return dateTime;
				}
			},

			// 提交退款申请
			async submitRefund() {
				if (!this.canSubmit) {
					uni.showToast({
						title: this.$t('refund.completeInfo'),
						icon: 'none'
					});
					return;
				}

				// 验证退款金额
				const amount = parseFloat(this.refundAmount);
				const maxAmount = parseFloat(this.orderInfo.payAmount);
				
				if (amount <= 0) {
					uni.showToast({
						title: this.$t('refund.amountMustPositive'),
						icon: 'none'
					});
					return;
				}
				
				if (amount > maxAmount) {
					uni.showToast({
						title: this.$t('refund.amountExceedsOrder'),
						icon: 'none'
					});
					return;
				}

				// 确认提交
				uni.showModal({
					title: this.$t('refund.confirmSubmit'),
					content: this.$t('refund.confirmRefundContent', { amount: this.refundAmount }),
					confirmText: this.$t('common.confirm'),
					cancelText: this.$t('common.cancel'),
					success: async (res) => {
						if (res.confirm) {
							await this.doSubmitRefund();
						}
					}
				});
			},

			// 执行退款申请
			async doSubmitRefund() {
				try {
					uni.showLoading({
						title: this.$t('refund.submitting')
					});

					const refundData = {
						orderId: this.orderInfo.id,
						refundAmount: parseFloat(this.refundAmount),
						refundReason: this.refundReasons[this.reasonIndex],
						refundDescription: this.refundDescription.trim() || null
					};

					const response = await applyRefund(refundData);
					uni.hideLoading();

					if (response.code === 200) {
						uni.showToast({
							title: this.$t('refund.submitSuccess'),
							icon: 'success'
						});

						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					} else {
						uni.showToast({
							title: response.message || this.$t('refund.submitFailed'),
							icon: 'none'
						});
					}
				} catch (error) {
					uni.hideLoading();
					console.error('提交退款申请失败:', error);
					
					let errorMessage = this.$t('refund.networkError');
					if (error.data && error.data.message) {
						errorMessage = error.data.message;
					}
					
					uni.showToast({
						title: errorMessage,
						icon: 'none'
					});
				}
			},

			// 语言切换后刷新页面数据
			refreshPageData() {
				console.log('退款申请页刷新数据以适应新语言')
				
				// 重新加载订单信息
				if (this.orderId) {
					this.loadOrderInfo()
				}
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: #f5f5f5;
		min-height: 100vh;
		padding-bottom: 120upx;
	}

	.order-info, .refund-form, .refund-notice {
		background-color: #fff;
		margin-bottom: 20upx;
		padding: 30upx;
	}

	.info-title, .form-title, .notice-title {
		font-size: 32upx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30upx;
	}

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
		}
	}

	.form-item {
		margin-bottom: 40upx;

		&:last-child {
			margin-bottom: 0;
		}

		.label {
			display: block;
			font-size: 28upx;
			color: #333;
			margin-bottom: 15upx;

			.required {
				color: #fa436a;
			}
		}

		.input, .textarea {
			width: 100%;
			border: 1upx solid #ddd;
			border-radius: 8upx;
			padding: 20upx;
			font-size: 28upx;
			color: #333;
		}

		.input {
			height: 80upx;
		}

		.textarea {
			height: 160upx;
			resize: none;
		}

		.tip {
			display: block;
			font-size: 24upx;
			color: #999;
			margin-top: 10upx;
		}

		.char-count {
			display: block;
			font-size: 24upx;
			color: #999;
			text-align: right;
			margin-top: 10upx;
		}
	}

	.picker-display {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
		border: 1upx solid #ddd;
		border-radius: 8upx;
		padding: 0 20upx;

		.picker-text {
			font-size: 28upx;
			color: #333;

			&.placeholder {
				color: #999;
			}
		}

		.picker-arrow {
			font-size: 24upx;
			color: #999;
		}
	}

	.notice-content {
		.notice-item {
			display: block;
			font-size: 26upx;
			color: #666;
			line-height: 1.6;
			margin-bottom: 15upx;

			&:last-child {
				margin-bottom: 0;
			}
		}
	}

	.submit-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 30upx;
		background-color: #fff;
		border-top: 1upx solid #f5f5f5;

		.submit-btn {
			width: 100%;
			height: 80upx;
			background-color: #fa436a;
			color: #fff;
			border: none;
			border-radius: 40upx;
			font-size: 32upx;
			font-weight: bold;

			&[disabled] {
				background-color: #ccc;
				color: #999;
			}
		}
	}
</style>
