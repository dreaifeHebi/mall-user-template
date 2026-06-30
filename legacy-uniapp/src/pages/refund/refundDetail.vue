<template>
	<view class="container">
		<!-- 状态展示 -->
		<view class="status-section">
			<view class="status-icon" :class="getStatusIconClass(refundInfo.status)">
				{{getStatusIcon(refundInfo.status)}}
			</view>
			<view class="status-text">
				<text class="status-title">{{refundInfo.statusText}}</text>
				<text class="status-desc">{{getStatusDescription(refundInfo.status)}}</text>
			</view>
		</view>

		<!-- 退款信息 -->
		<view class="info-section">
			<view class="section-title">退款信息</view>
			<view class="info-list">
				<view class="info-item">
					<text class="label">退款金额</text>
					<text class="value amount">¥{{refundInfo.refundAmount}}</text>
				</view>
				<view class="info-item">
					<text class="label">退款原因</text>
					<text class="value">{{refundInfo.refundReason}}</text>
				</view>
				<view class="info-item" v-if="refundInfo.description">
					<text class="label">问题描述</text>
					<text class="value">{{refundInfo.description}}</text>
				</view>
				<view class="info-item">
					<text class="label">申请时间</text>
					<text class="value">{{formatDateTime(refundInfo.createdAt)}}</text>
				</view>
				<view class="info-item" v-if="refundInfo.processedAt">
					<text class="label">处理时间</text>
					<text class="value">{{formatDateTime(refundInfo.processedAt)}}</text>
				</view>
			</view>
		</view>

		<!-- 订单信息 -->
		<view class="info-section">
			<view class="section-title">关联订单</view>
			<view class="order-card" @click="goToOrder">
				<view class="order-header">
					<text class="order-sn">订单号：{{refundInfo.orderSn}}</text>
					<view class="arrow">></view>
				</view>
				<view class="order-amount">
					<text class="label">订单金额：</text>
					<text class="amount">¥{{refundInfo.orderAmount}}</text>
				</view>
			</view>
		</view>

		<!-- 处理记录 -->
		<view class="info-section" v-if="processList.length > 0">
			<view class="section-title">处理记录</view>
			<view class="process-list">
				<view 
					class="process-item" 
					v-for="(item, index) in processList" 
					:key="index"
				>
					<view class="process-dot" :class="{ active: index === 0 }"></view>
					<view class="process-content">
						<view class="process-title">{{item.title}}</view>
						<view class="process-desc" v-if="item.description">{{item.description}}</view>
						<view class="process-time">{{formatDateTime(item.createdAt)}}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 图片证据 -->
		<view class="info-section" v-if="refundInfo.evidenceImages && refundInfo.evidenceImages.length > 0">
			<view class="section-title">问题图片</view>
			<view class="image-grid">
				<view 
					class="image-item" 
					v-for="(image, index) in refundInfo.evidenceImages" 
					:key="index"
					@click="previewImage(index)"
				>
					<image :src="image" mode="aspectFill" />
				</view>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="action-section" v-if="showActions">
			<button 
				v-if="refundInfo.status === 'PENDING_REVIEW'" 
				class="cancel-btn"
				@click="cancelRefund"
			>
				取消申请
			</button>
			<button 
				v-if="refundInfo.status === 'REJECTED'" 
				class="reapply-btn"
				@click="reapplyRefund"
			>
				重新申请
			</button>
		</view>
	</view>
</template>

<script>
	import { getRefundDetail, cancelRefund } from '@/api/h5Payment.js';
	
	export default {
		data() {
			return {
				refundRequestId: '',
				refundInfo: {},
				processList: [],
				loading: false
			}
		},
		computed: {
			showActions() {
				return ['PENDING_REVIEW', 'REJECTED'].includes(this.refundInfo.status);
			}
		},
		onLoad(options) {
			if (options.id) {
				this.refundRequestId = options.id;
				this.loadRefundDetail();
			}
		},
		methods: {
			// 加载退款详情
			async loadRefundDetail() {
				try {
					this.loading = true;
					uni.showLoading({
						title: this.$t('common.loading')
					});

					const response = await getRefundDetail(this.refundRequestId);
					uni.hideLoading();

					if (response.code === 200) {
						this.refundInfo = response.data.refundInfo;
						this.processList = response.data.processList || [];
					} else {
						uni.showToast({
							title: response.message || this.$t('refund.loadFailed'),
							icon: 'none'
						});
					}
				} catch (error) {
					uni.hideLoading();
					console.error('加载退款详情失败:', error);
					uni.showToast({
						title: this.$t('refund.networkError'),
						icon: 'none'
					});
				} finally {
					this.loading = false;
				}
			},

			// 取消退款申请
			cancelRefund() {
				uni.showModal({
					title: this.$t('refund.confirmCancel'),
					content: this.$t('refund.cancelConfirmContent'),
					confirmText: this.$t('refund.confirmCancelBtn'),
					cancelText: this.$t('refund.dontCancel'),
					success: async (res) => {
						if (res.confirm) {
							await this.doCancelRefund();
						}
					}
				});
			},

			// 执行取消操作
			async doCancelRefund() {
				try {
					uni.showLoading({
						title: this.$t('refund.cancelling')
					});

					const response = await cancelRefund(this.refundRequestId);
					uni.hideLoading();

					if (response.code === 200) {
						uni.showToast({
							title: this.$t('refund.cancelSuccess'),
							icon: 'success'
						});
						
						// 刷新详情
						setTimeout(() => {
							this.loadRefundDetail();
						}, 1000);
					} else {
						uni.showToast({
							title: response.message || this.$t('refund.cancelFailed'),
							icon: 'none'
						});
					}
				} catch (error) {
					uni.hideLoading();
					console.error('取消退款申请失败:', error);
					uni.showToast({
						title: this.$t('refund.networkError'),
						icon: 'none'
					});
				}
			},

			// 重新申请退款
			reapplyRefund() {
				uni.navigateTo({
					url: `/pages/refund/refundApply?orderId=${this.refundInfo.orderId}`
				});
			},

			// 跳转到订单详情
			goToOrder() {
				uni.navigateTo({
					url: `/pages/order/orderDetail?orderSn=${this.refundInfo.orderSn}`
				});
			},

			// 预览图片
			previewImage(index) {
				uni.previewImage({
					urls: this.refundInfo.evidenceImages,
					current: index
				});
			},

			// 获取状态图标
			getStatusIcon(status) {
				const iconMap = {
					'PENDING_REVIEW': '⏳',
					'APPROVED': '✅',
					'REJECTED': '❌', 
					'PROCESSING': '🔄',
					'COMPLETED': '✅',
					'FAILED': '❌',
					'CANCELLED': '🚫'
				};
				return iconMap[status] || '📋';
			},

			// 获取状态图标样式类
			getStatusIconClass(status) {
				const classMap = {
					'PENDING_REVIEW': 'status-pending',
					'APPROVED': 'status-success',
					'REJECTED': 'status-error',
					'PROCESSING': 'status-processing',
					'COMPLETED': 'status-success',
					'FAILED': 'status-error',
					'CANCELLED': 'status-cancelled'
				};
				return classMap[status] || 'status-default';
			},

			// 获取状态描述
			getStatusDescription(status) {
				const descMap = {
					'PENDING_REVIEW': '您的退款申请已提交，正在等待商家审核',
					'APPROVED': '退款申请已通过审核，正在为您处理退款',
					'REJECTED': '退款申请被拒绝，请查看拒绝原因',
					'PROCESSING': '退款正在处理中，请耐心等待',
					'COMPLETED': '退款已完成，请注意查收',
					'FAILED': '退款处理失败，请联系客服',
					'CANCELLED': '退款申请已取消'
				};
				return descMap[status] || '状态未知';
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

	.status-section {
		background-color: #fff;
		display: flex;
		align-items: center;
		padding: 60upx 40upx;
		margin-bottom: 20upx;

		.status-icon {
			width: 120upx;
			height: 120upx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 50upx;
			margin-right: 30upx;

			&.status-pending {
				background-color: #fff3cd;
				color: #856404;
			}

			&.status-success {
				background-color: #d4edda;
				color: #155724;
			}

			&.status-error {
				background-color: #f8d7da;
				color: #721c24;
			}

			&.status-processing {
				background-color: #d1ecf1;
				color: #0c5460;
			}

			&.status-cancelled {
				background-color: #e2e3e5;
				color: #383d41;
			}

			&.status-default {
				background-color: #f8f9fa;
				color: #6c757d;
			}
		}

		.status-text {
			flex: 1;

			.status-title {
				display: block;
				font-size: 36upx;
				font-weight: bold;
				color: #333;
				margin-bottom: 12upx;
			}

			.status-desc {
				display: block;
				font-size: 28upx;
				color: #666;
				line-height: 1.5;
			}
		}
	}

	.info-section {
		background-color: #fff;
		margin-bottom: 20upx;

		.section-title {
			padding: 30upx 40upx 20upx;
			font-size: 32upx;
			font-weight: bold;
			color: #333;
			border-bottom: 1upx solid #f5f5f5;
		}

		.info-list {
			padding: 0 40upx 20upx;

			.info-item {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				padding: 24upx 0;
				border-bottom: 1upx solid #f5f5f5;

				&:last-child {
					border-bottom: none;
				}

				.label {
					font-size: 28upx;
					color: #666;
					min-width: 140upx;
				}

				.value {
					flex: 1;
					text-align: right;
					font-size: 28upx;
					color: #333;
					word-break: break-all;

					&.amount {
						color: #fa436a;
						font-weight: bold;
					}
				}
			}
		}

		.order-card {
			margin: 20upx 40upx;
			padding: 30upx;
			background-color: #f8f9fa;
			border-radius: 12upx;
			border: 1upx solid #e9ecef;

			.order-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 16upx;

				.order-sn {
					font-size: 28upx;
					color: #333;
				}

				.arrow {
					font-size: 32upx;
					color: #999;
				}
			}

			.order-amount {
				.label {
					font-size: 26upx;
					color: #666;
				}

				.amount {
					font-size: 26upx;
					color: #fa436a;
					font-weight: bold;
				}
			}
		}

		.process-list {
			padding: 20upx 40upx;

			.process-item {
				display: flex;
				position: relative;
				margin-bottom: 40upx;

				&:last-child {
					margin-bottom: 0;
				}

				&:not(:last-child)::after {
					content: '';
					position: absolute;
					left: 15upx;
					top: 50upx;
					width: 2upx;
					height: calc(100% + 20upx);
					background-color: #e9ecef;
				}

				.process-dot {
					width: 30upx;
					height: 30upx;
					border-radius: 50%;
					background-color: #e9ecef;
					margin-right: 24upx;
					margin-top: 8upx;
					flex-shrink: 0;

					&.active {
						background-color: #fa436a;
					}
				}

				.process-content {
					flex: 1;

					.process-title {
						font-size: 28upx;
						color: #333;
						font-weight: bold;
						margin-bottom: 8upx;
					}

					.process-desc {
						font-size: 26upx;
						color: #666;
						margin-bottom: 8upx;
						line-height: 1.5;
					}

					.process-time {
						font-size: 24upx;
						color: #999;
					}
				}
			}
		}

		.image-grid {
			display: flex;
			flex-wrap: wrap;
			padding: 20upx 40upx;
			gap: 20upx;

			.image-item {
				width: 200upx;
				height: 200upx;
				border-radius: 12upx;
				overflow: hidden;
				border: 1upx solid #e9ecef;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	.action-section {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		padding: 30upx 40upx;
		border-top: 1upx solid #f5f5f5;
		display: flex;
		gap: 20upx;

		.cancel-btn, .reapply-btn {
			flex: 1;
			height: 88upx;
			border-radius: 44upx;
			font-size: 32upx;
			font-weight: bold;
		}

		.cancel-btn {
			background-color: #f8f9fa;
			color: #666;
			border: 1upx solid #e9ecef;
		}

		.reapply-btn {
			background-color: #fa436a;
			color: #fff;
			border: 1upx solid #fa436a;
		}
	}
</style>
