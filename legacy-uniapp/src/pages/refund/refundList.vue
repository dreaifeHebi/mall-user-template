<template>
	<view class="container">
		<!-- 状态筛选 -->
		<view class="filter-tabs">
			<view 
				class="tab-item" 
				:class="{ active: currentStatus === '' }"
				@click="changeStatus('')"
			>
				全部
			</view>
			<view 
				class="tab-item" 
				:class="{ active: currentStatus === 'PENDING_REVIEW' }"
				@click="changeStatus('PENDING_REVIEW')"
			>
				待审核
			</view>
			<view 
				class="tab-item" 
				:class="{ active: currentStatus === 'PROCESSING' }"
				@click="changeStatus('PROCESSING')"
			>
				处理中
			</view>
			<view 
				class="tab-item" 
				:class="{ active: currentStatus === 'COMPLETED' }"
				@click="changeStatus('COMPLETED')"
			>
				已完成
			</view>
		</view>

		<!-- 退款列表 -->
		<view class="refund-list" v-if="refundList.length > 0">
			<view 
				class="refund-item" 
				v-for="item in refundList" 
				:key="item.id"
				@click="goToDetail(item.id)"
			>
				<view class="item-header">
					<view class="order-info">
						<text class="order-sn">订单号：{{item.orderSn}}</text>
						<text class="refund-sn">退款号：{{item.refundSn}}</text>
					</view>
					<view class="status-badge" :class="getStatusClass(item.status)">
						{{item.statusText}}
					</view>
				</view>
				
				<view class="item-content">
					<view class="amount-info">
						<text class="amount-label">退款金额：</text>
						<text class="amount-value">¥{{item.refundAmount}}</text>
					</view>
					<view class="reason-info">
						<text class="reason-label">退款原因：</text>
						<text class="reason-value">{{item.refundReason}}</text>
					</view>
				</view>
				
				<view class="item-footer">
					<text class="create-time">申请时间：{{formatDateTime(item.createdAt)}}</text>
					<view class="actions">
						<button 
							v-if="item.status === 'PENDING_REVIEW'" 
							class="cancel-btn"
							@click.stop="cancelRefund(item.id)"
						>
							取消申请
						</button>
						<button class="detail-btn" @click.stop="goToDetail(item.id)">
							查看详情
						</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-else-if="!loading">
			<view class="empty-icon">📄</view>
			<text class="empty-text">暂无退款记录</text>
		</view>

		<!-- 加载更多 -->
		<view class="load-more" v-if="hasMore && refundList.length > 0">
			<text @click="loadMore">加载更多</text>
		</view>
	</view>
</template>

<script>
	import { getRefundList, cancelRefund } from '@/api/h5Payment.js';
	import { mapState } from 'vuex';
	
	export default {
		data() {
			return {
				currentStatus: '', // 当前筛选状态
				refundList: [],
				loading: false,
				pageNum: 1,
				pageSize: 10,
				hasMore: true
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
			this.loadRefundList();
		},
		onPullDownRefresh() {
			this.refreshList();
		},
		methods: {
			// 切换状态筛选
			changeStatus(status) {
				this.currentStatus = status;
				this.refreshList();
			},

			// 刷新列表
			refreshList() {
				this.pageNum = 1;
				this.hasMore = true;
				this.refundList = [];
				this.loadRefundList();
			},

			// 加载退款列表
			async loadRefundList() {
				if (this.loading || !this.hasMore) return;

				try {
					this.loading = true;
					
					const params = {
						memberId: this.userInfo.id,
						pageNum: this.pageNum,
						pageSize: this.pageSize
					};
					
					if (this.currentStatus) {
						params.status = this.currentStatus;
					}

					const response = await getRefundList(params);
					
					if (response.code === 200) {
						const { list, total } = response.data;
						
						if (this.pageNum === 1) {
							this.refundList = list;
						} else {
							this.refundList.push(...list);
						}
						
						this.hasMore = this.refundList.length < total;
						this.pageNum++;
					} else {
						uni.showToast({
							title: response.message || '加载失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('加载退款列表失败:', error);
					uni.showToast({
						title: this.$t('refund.networkError'),
						icon: 'none'
					});
				} finally {
					this.loading = false;
					uni.stopPullDownRefresh();
				}
			},

			// 加载更多
			loadMore() {
				this.loadRefundList();
			},

			// 取消退款申请
			async cancelRefund(refundRequestId) {
				uni.showModal({
					title: this.$t('refund.confirmCancel'),
					content: this.$t('refund.cancelConfirmContent'), 
					confirmText: this.$t('refund.confirmCancelBtn'),
					cancelText: this.$t('refund.dontCancel'),
					success: async (res) => {
						if (res.confirm) {
							await this.doCancelRefund(refundRequestId);
						}
					}
				});
			},

			// 执行取消操作
			async doCancelRefund(refundRequestId) {
				try {
					uni.showLoading({
						title: this.$t('refund.cancelling')
					});

					const response = await cancelRefund(refundRequestId);
					uni.hideLoading();

					if (response.code === 200) {
						uni.showToast({
							title: this.$t('refund.cancelSuccess'),
							icon: 'success'
						});
						
						// 刷新列表
						this.refreshList();
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

			// 跳转到详情页
			goToDetail(refundRequestId) {
				uni.navigateTo({
					url: `/pages/refund/refundDetail?id=${refundRequestId}`
				});
			},

			// 获取状态样式类
			getStatusClass(status) {
				const classMap = {
					'PENDING_REVIEW': 'status-pending',
					'APPROVED': 'status-approved',
					'REJECTED': 'status-rejected',
					'PROCESSING': 'status-processing',
					'COMPLETED': 'status-completed',
					'FAILED': 'status-failed',
					'CANCELLED': 'status-cancelled'
				};
				return classMap[status] || 'status-default';
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
	}

	.filter-tabs {
		display: flex;
		background-color: #fff;
		border-bottom: 1upx solid #f5f5f5;

		.tab-item {
			flex: 1;
			height: 88upx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28upx;
			color: #666;
			position: relative;

			&.active {
				color: #fa436a;
				font-weight: bold;

				&::after {
					content: '';
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					width: 60upx;
					height: 4upx;
					background-color: #fa436a;
					border-radius: 2upx;
				}
			}
		}
	}

	.refund-list {
		padding: 20upx;

		.refund-item {
			background-color: #fff;
			border-radius: 12upx;
			padding: 30upx;
			margin-bottom: 20upx;
			border: 1upx solid #f0f0f0;

			.item-header {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				margin-bottom: 20upx;

				.order-info {
					flex: 1;

					.order-sn, .refund-sn {
						display: block;
						font-size: 26upx;
						color: #666;
						margin-bottom: 8upx;

						&:last-child {
							margin-bottom: 0;
						}
					}
				}

				.status-badge {
					padding: 8upx 16upx;
					border-radius: 20upx;
					font-size: 24upx;
					color: #fff;

					&.status-pending {
						background-color: #ff9500;
					}

					&.status-approved {
						background-color: #34c759;
					}

					&.status-rejected {
						background-color: #ff3b30;
					}

					&.status-processing {
						background-color: #007aff;
					}

					&.status-completed {
						background-color: #30d158;
					}

					&.status-failed {
						background-color: #ff453a;
					}

					&.status-cancelled {
						background-color: #8e8e93;
					}

					&.status-default {
						background-color: #8e8e93;
					}
				}
			}

			.item-content {
				margin-bottom: 20upx;

				.amount-info, .reason-info {
					display: flex;
					margin-bottom: 12upx;

					&:last-child {
						margin-bottom: 0;
					}

					.amount-label, .reason-label {
						font-size: 28upx;
						color: #666;
						min-width: 140upx;
					}

					.amount-value {
						font-size: 28upx;
						color: #fa436a;
						font-weight: bold;
					}

					.reason-value {
						font-size: 28upx;
						color: #333;
						flex: 1;
					}
				}
			}

			.item-footer {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.create-time {
					font-size: 24upx;
					color: #999;
				}

				.actions {
					display: flex;
					gap: 20upx;

					.cancel-btn, .detail-btn {
						padding: 12upx 24upx;
						border-radius: 6upx;
						font-size: 24upx;
						border: 1upx solid;
					}

					.cancel-btn {
						background-color: #fff;
						color: #666;
						border-color: #ddd;
					}

					.detail-btn {
						background-color: #fa436a;
						color: #fff;
						border-color: #fa436a;
					}
				}
			}
		}
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 120upx 40upx;

		.empty-icon {
			font-size: 120upx;
			margin-bottom: 30upx;
			opacity: 0.5;
		}

		.empty-text {
			font-size: 28upx;
			color: #999;
		}
	}

	.load-more {
		text-align: center;
		padding: 40upx;
		font-size: 28upx;
		color: #666;
	}
</style>
