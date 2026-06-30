<template>
	<view class="content profile-theme-page">
		<view class="profile-theme-backdrop">
			<image class="profile-theme-backdrop__image" src="/static/profile-theme-bg.png" mode="aspectFill"></image>
			<view class="profile-theme-backdrop__wash"></view>
			<view class="profile-theme-backdrop__grain"></view>
		</view>
		<view class="order-inner profile-theme-content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				<text class="nav-text">{{item.text}}</text>
				<view class="tab-badge" :class="item.badgeClass">
					<text class="badge-text">{{ formatTabCount(item.count) }}</text>
				</view>
			</view>
		</view>

		<swiper v-if="navList.length > 0" :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData('add')">
					<!-- 空白页 -->
					<empty v-if="orderList==null||orderList.length === 0"></empty>

					<!-- 订单列表 -->
					<view v-for="(item,index) in orderList" :key="index" class="order-item" @click="showOrderDetail(item.id)">
						<view class="i-top b-b">
							<text class="time">{{formatDateTimeMethod(item.createTime)}}</text>
							<text class="state" :style="{color: '#fa436a'}">{{formatStatusMethod(item.status)}}</text>
							<text v-if="item.status===3||item.status===4" class="del-btn yticon icon-iconfontshanchu1" @click.stop="deleteOrder(item.id)"></text>
						</view>
						<view class="order-sn-row" @click.stop>
							<text class="order-sn-text">{{ $t('order.orderNumber') }}：{{ item.orderSn || '-' }}</text>
							<button class="copy-order-btn" @click.stop="copyOrderSn(item.orderSn)">{{ $t('order.copy') }}</button>
						</view>
						<view class="goods-box-single" v-for="(orderItem, itemIndex) in item.orderItemList"
						 :key="itemIndex">
							<image class="goods-img" :src="orderItem.productPic" mode="aspectFill"></image>
							<view class="right">
								<text class="title clamp">{{orderItem.productName}}</text>
								<text class="attr-box" v-if="formatProductAttrMethod(orderItem.productAttr)">{{formatProductAttrMethod(orderItem.productAttr)}}</text>
								<view class="price-quantity-box">
									<text class="price">¥{{orderItem.productPrice}} JPY</text>
									<text class="quantity">x {{orderItem.productQuantity}}</text>
								</view>
							</view>
						</view>

						<view class="price-box">
							{{ $t('order.totalItems') }}
							<text class="num">{{calcTotalQuantity(item)}}</text>
							{{ $t('order.itemsActualPay') }}
							<text class="price">¥{{item.payAmount}} JPY</text>
						</view>
						<view class="action-box b-t" v-if="item.status == 0" @click.stop>
							<button class="action-btn" @click="cancelOrder(item.id)">{{ $t('order.cancel') }}</button>
							<button class="action-btn recom" @click="payOrder(item.id)">{{ $t('order.pay') }}</button>
						</view>
						<view class="action-box b-t" v-if="item.status == 1" @click.stop>
							<button class="action-btn recom" @click="updateOrderAddress(item.id)">{{ $t('order.modifyAddress') }}</button>
						</view>
						<view class="action-box b-t" v-if="item.status == 2" @click.stop>
							<button class="action-btn" @click="viewOrderDetail(item.id)">{{ $t('order.viewLogistics') }}</button>
							<button class="action-btn recom" @click="receiveOrder(item.id)">{{ $t('order.confirmReceipt') }}</button>
						</view>
						<view class="action-box b-t" v-if="item.status == 3" @click.stop>
							<button class="action-btn recom" @click="showQrcode">{{ $t('order.contactService') }}</button>
						</view>
					</view>

					<uni-load-more :status="loadingType"></uni-load-more>

				</scroll-view>
			</swiper-item>
		</swiper>
		<view v-else class="no-tab-empty">
			<empty></empty>
		</view>
		
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
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import {
		formatDate
	} from '@/utils/date';
	import {
		fetchOrderList,
		cancelUserOrder,
		confirmReceiveOrder,
		deleteUserOrder,
		updateOrderAddress
	} from '@/api/order.js';
	import {
		getServiceQrcode
	} from '@/api/service.js';
	import { USE_H5_PAYMENT } from '@/utils/appConfig.js';
	import { setPageTitle } from '@/utils/pageTitleUtil.js';
	import { processOrderList } from '@/utils/textProcessor.js';
	import languageRefreshMixin from '@/mixins/languageRefreshMixin.js';
	import {
		mapState
	} from 'vuex';
	export default {
		mixins: [languageRefreshMixin],
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				tabCurrentIndex: 0,
				entryTabHint: null,
				orderParam: {
					status: 0,
					pageNum: 1,
					pageSize: 5
				},
				orderList: [],
				loadingType:'more',
				showQrcodeModal: false,
				qrcodeUrl: '',
				qrcodeLoading: false,
				statusOrderCount: {
					0: 0,
					1: 0,
					2: 0,
					3: 0
				},
				tabInitializing: false
			};
		},
		onLoad(options) {
			setPageTitle('pageTitle.orderList');
			
			// 检查登录状态
			if (!this.hasLogin) {
				uni.showModal({
					title: this.$t('common.tips'),
					content: this.$t('auth.loginRequired'),
					showCancel: true,
					confirmText: this.$t('auth.goLogin'),
					cancelText: this.$t('common.back'),
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/public/login'
							});
						} else {
							uni.navigateBack();
						}
					}
				});
				return;
			}

			const parsedState = Number(options && options.state);
			this.entryTabHint = Number.isNaN(parsedState) ? 0 : parsedState;
			this.initializeOrderPage();
		},
		onShow() {
			// 从其他页面返回时重新加载数据
			if (this.hasLogin) {
				this.initializeOrderPage({
					preserveCurrent: true
				});
			}
		},
		computed: {
			...mapState(['hasLogin','userInfo']),
			navList() {
				const tabConfig = [
					{
						state: 0,
						text: this.$t('order.status.pending'),
						badgeClass: 'badge-danger'
					},
					{
						state: 1,
						text: this.$t('order.waitingShipment'),
						badgeClass: 'badge-success'
					},
					{
						state: 2,
						text: this.$t('order.waitingReceive'),
						badgeClass: 'badge-success'
					},
					{
						state: 3,
						text: this.$t('order.status.completed'),
						badgeClass: 'badge-success'
					}
				];
				return tabConfig
					.map(tab => ({
						...tab,
						count: this.statusOrderCount[tab.state] || 0
					}))
					.filter(tab => tab.count > 0);
			}
		},
		filters: {
			formatStatus(status) {
				const statusNum = parseInt(status);
				if (isNaN(statusNum)) {
					return this.$t('order.status.unknown');
				}
				switch (statusNum) {
					case 0: return this.$t('order.status.pending');
					case 1: return this.$t('order.status.shipped');
					case 2: return this.$t('order.status.delivered');
					case 3: return this.$t('order.status.completed');
					case 4: return this.$t('order.status.cancelled');
					default: return this.$t('order.status.unknown');
				}
			},
			formatProductAttr(jsonAttr) {
				if (!jsonAttr || jsonAttr === '' || jsonAttr === 'null') {
					return '';
				}
				try {
					let attrArr = JSON.parse(jsonAttr);
					if (!Array.isArray(attrArr) || attrArr.length === 0) {
						return '';
					}
					let attrStr = '';
					for (let attr of attrArr) {
						if (attr && attr.key && attr.value) {
							attrStr += attr.key;
							attrStr += ":";
							attrStr += attr.value;
							attrStr += ";";
						}
					}
					return attrStr;
				} catch (e) {
					return '';
				}
			},
			formatDateTime(time) {
				if (time == null || time === '' || time === 0) {
					return this.$t('common.noTime');
				}
				try {
					let date = new Date(time);
					if (isNaN(date.getTime())) {
						return this.$t('common.timeFormatError');
					}
					
					const year = date.getFullYear();
					const month = String(date.getMonth() + 1).padStart(2, '0');
					const day = String(date.getDate()).padStart(2, '0');
					const hours = String(date.getHours()).padStart(2, '0');
					const minutes = String(date.getMinutes()).padStart(2, '0');
					const seconds = String(date.getSeconds()).padStart(2, '0');
					
					return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
				} catch (e) {
					return this.$t('common.timeParseError');
				}
			},
		},
		methods: {
			resolveEntryStatus(entryState) {
				// 兼容“我的页面”旧入口参数：state 代表旧tab索引
				// 0: 全部（默认首个可见tab）
				// 1: 待付款 -> status 0
				// 2: 待发货 -> status 1
				// 3: 待收货 -> status 2
				// 4: 已完成 -> status 3
				const legacyIndexToStatus = {
					1: 0,
					2: 1,
					3: 2,
					4: 3
				};
				return Object.prototype.hasOwnProperty.call(legacyIndexToStatus, entryState)
					? legacyIndexToStatus[entryState]
					: null;
			},
			async initializeOrderPage(options = {}) {
				const { preserveCurrent = false } = options;
				if (this.tabInitializing) {
					return;
				}
				this.tabInitializing = true;
				try {
					const previousState = this.navList[this.tabCurrentIndex]
						? this.navList[this.tabCurrentIndex].state
						: null;
					await this.loadStatusOrderCount();
					if (this.navList.length === 0) {
						this.tabCurrentIndex = 0;
						this.orderList = [];
						this.loadingType = 'more';
						return;
					}

					const targetState = this.resolveEntryStatus(this.entryTabHint);
					let targetIndex = 0;
					if (targetState !== null) {
						const matchedIndex = this.navList.findIndex(item => item.state === targetState);
						targetIndex = matchedIndex >= 0 ? matchedIndex : 0;
						this.entryTabHint = null;
					} else if (preserveCurrent && previousState !== null) {
						const matchedIndex = this.navList.findIndex(item => item.state === previousState);
						targetIndex = matchedIndex >= 0 ? matchedIndex : 0;
					}

					this.tabCurrentIndex = targetIndex;
					await this.loadData('refresh');
				} finally {
					this.tabInitializing = false;
				}
			},
			async loadStatusOrderCount() {
				const statusList = [0, 1, 2, 3];
				const countMap = {
					0: 0,
					1: 0,
					2: 0,
					3: 0
				};
				const requests = statusList.map(status => fetchOrderList({
					status,
					pageNum: 1,
					pageSize: 1
				}).then(response => ({
					status,
					count: this.extractOrderCount(response)
				})).catch(() => ({
					status,
					count: 0
				})));
				const results = await Promise.all(requests);
				results.forEach(item => {
					countMap[item.status] = item.count;
				});
				this.statusOrderCount = countMap;
			},
			extractOrderCount(response) {
				const total = response && response.data ? response.data.total : null;
				if (typeof total === 'number' && total >= 0) {
					return total;
				}
				const parsedTotal = Number(total);
				if (!Number.isNaN(parsedTotal) && parsedTotal >= 0) {
					return parsedTotal;
				}
				const list = response && response.data ? response.data.list : null;
				return Array.isArray(list) ? list.length : 0;
			},
			formatTabCount(count) {
				if (count > 99) {
					return '99+';
				}
				return String(count);
			},
			// 格式化时间方法
			formatDateTimeMethod(time) {
				if (time == null || time === '' || time === 0) {
					return this.$t('common.noTime');
				}
				try {
					let date = new Date(time);
					if (isNaN(date.getTime())) {
						return this.$t('common.timeFormatError');
					}
					
					const year = date.getFullYear();
					const month = String(date.getMonth() + 1).padStart(2, '0');
					const day = String(date.getDate()).padStart(2, '0');
					const hours = String(date.getHours()).padStart(2, '0');
					const minutes = String(date.getMinutes()).padStart(2, '0');
					const seconds = String(date.getSeconds()).padStart(2, '0');
					
					return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
				} catch (e) {
					return this.$t('common.timeParseError');
				}
			},
			
			// 格式化状态方法
			formatStatusMethod(status) {
				const statusNum = parseInt(status);
				if (isNaN(statusNum)) {
					return this.$t('order.status.unknown');
				}
				switch (statusNum) {
					case 0: return this.$t('order.status.pending');
					case 1: return this.$t('order.status.shipped');
					case 2: return this.$t('order.status.delivered');
					case 3: return this.$t('order.status.completed');
					case 4: return this.$t('order.status.cancelled');
					default: return this.$t('order.status.unknown');
				}
			},
			
			// 格式化商品属性方法
			formatProductAttrMethod(jsonAttr) {
				if (!jsonAttr || jsonAttr === '' || jsonAttr === 'null' || jsonAttr === '0') {
					return '';
				}
				try {
					let attrArr = JSON.parse(jsonAttr);
					if (!Array.isArray(attrArr) || attrArr.length === 0) {
						return '';
					}
					let attrStr = '';
					for (let attr of attrArr) {
						if (attr && attr.key && attr.value) {
							attrStr += attr.key;
							attrStr += ":";
							attrStr += attr.value;
							attrStr += ";";
						}				}
				return attrStr;
			} catch (e) {
				return '';
			}
		},
			
			//获取订单列表
			async loadData(type = 'refresh') {
				if (this.navList.length === 0) {
					this.orderList = [];
					this.loadingType = 'more';
					return;
				}
				if (type === 'refresh') {
					this.orderParam.pageNum = 1;
				} else {
					this.orderParam.pageNum++;
				}
				//这里是将订单挂载到tab列表下
				const index = this.tabCurrentIndex;
				// 确保索引在有效范围内
				if (index < 0 || index >= this.navList.length) {
					console.error('tabCurrentIndex 超出范围:', index);
					return;
				}
				const navItem = this.navList[index];
				if (!navItem) {
					console.error('navItem 为空:', index);
					return;
				}
				if (this.loadingType === 'loading') {
					//防止重复加载
					return;
				}
				this.orderParam.status = navItem.state;
				this.loadingType = 'loading';
				try {
					const response = await fetchOrderList(this.orderParam);
					const list = processOrderList((response.data && response.data.list) || []);
					if (type === 'refresh') {
						this.orderList = list;
						this.loadingType = 'more';
					} else if (list != null && list.length > 0) {
						this.orderList = this.orderList.concat(list);
						this.loadingType = 'more';
					} else {
						this.orderParam.pageNum--;
						this.loadingType = 'noMore';
					}
				} catch (error) {
					if (type !== 'refresh') {
						this.orderParam.pageNum--;
					}
					this.loadingType = 'more';
				}
			},
			//swiper 切换
			changeTab(e) {
				const newIndex = e.target.current || e.detail.current;
				// 确保索引在有效范围内
				if (newIndex < 0 || newIndex >= this.navList.length) {
					console.error('swiper切换的索引超出范围:', newIndex);
					return;
				}
				// 只有当索引真正改变时才更新并加载数据
				if (this.tabCurrentIndex !== newIndex) {
					this.tabCurrentIndex = newIndex;
					this.loadData('refresh');
				}
			},
			//顶部tab点击
			tabClick(index) {
				// 确保索引在有效范围内
				if (index < 0 || index >= this.navList.length) {
					console.error('点击的tab索引超出范围:', index);
					return;
				}
				this.tabCurrentIndex = index;
				// 点击tab时立即加载数据
				this.loadData('refresh');
			},
			//删除订单
			deleteOrder(orderId) {
				let superThis = this;
				uni.showModal({
				    title: this.$t('common.tips'),
				    content: this.$t('order.deleteConfirm'),
				    success: function (res) {
				        if (res.confirm) {
				            uni.showLoading({
				            	title: superThis.$t('common.loading')
				            })
				            deleteUserOrder({orderId:orderId}).then(response=>{
				            	uni.hideLoading();
				            	superThis.initializeOrderPage();
				            });
				        } else if (res.cancel) {
				            // 用户点击取消
				        }
				    }
				});
			},
			//取消订单
			cancelOrder(orderId) {
				let superThis = this;
				uni.showModal({
				    title: this.$t('common.tips'),
				    content: this.$t('order.cancelConfirm'),
				    success: function (res) {
				        if (res.confirm) {
				            uni.showLoading({
				            	title: superThis.$t('common.loading')
				            })
				            cancelUserOrder({orderId:orderId}).then(response=>{
				            	uni.hideLoading();
				            	superThis.initializeOrderPage();
				            });
				        } else if (res.cancel) {
				            // 用户点击取消
				        }
				    }
				});
			},
			//支付订单
			payOrder(orderId){
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
			},
			//确认收货
			receiveOrder(orderId){
				let superThis = this;
				uni.showModal({
				    title: this.$t('common.tips'),
				    content: this.$t('order.receiveConfirm'),
				    success: function (res) {
				        if (res.confirm) {
				            uni.showLoading({
				            	title: superThis.$t('common.loading')
				            })
				            confirmReceiveOrder({orderId:orderId}).then(response=>{
				            	uni.hideLoading();
				            	superThis.initializeOrderPage();
				            });
				        } else if (res.cancel) {
				            // 用户点击取消
				        }
				    }
				});
			},
			//修改订单地址
			updateOrderAddress(orderId) {
				// 跳转到地址选择页面，并传递订单ID
				uni.navigateTo({
					url: `/pages/address/address?orderId=${orderId}&mode=update`
				});
			},
			//查看订单详情
			showOrderDetail(orderId){
				uni.navigateTo({
					url: `/pages/order/orderDetail?orderId=${orderId}`
				})
			},
			//查看物流详情
			viewOrderDetail(orderId) {
				// 这里可以后续对接真实的物流页面
				// 目前先跳转到订单详情页
				uni.navigateTo({
					url: `/pages/order/orderDetail?orderId=${orderId}`
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
			copyOrderSn(orderSn) {
				if (!orderSn) {
					return;
				}
				uni.setClipboardData({
					data: String(orderSn),
					success: () => {
						uni.showToast({
							title: this.$t('tips.copySuccess'),
							icon: 'success'
						});
					}
				});
			},
			//计算商品总数量
			calcTotalQuantity(order){
				let totalQuantity = 0;
				if(order.orderItemList!=null&&order.orderItemList.length>0){
					for(let item of order.orderItemList){
						totalQuantity+=item.productQuantity
					}
				}
				return totalQuantity;
			},

			// 语言切换后刷新页面数据
			refreshPageData() {
				console.log('订单页刷新数据以适应新语言')

				this.initializeOrderPage({
					preserveCurrent: true
				});
			}
		},
	}
</script>

<style lang="scss">
	@import '@/styles/profile-theme.scss';

	page,
	.content {
		height: 100%;
	}

	.order-inner {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.swiper-box {
		flex: 1;
		height: 0;
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar {
		display: flex;
		height: 52px;
		padding: 0 5px;
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 10upx;
			height: 100%;
			color: $font-color-dark;
			position: relative;

			.nav-text {
				font-size: 32upx;
				font-weight: 500;
				line-height: 1;
			}

			.tab-badge {
				min-width: 34upx;
				height: 34upx;
				padding: 0 8upx;
				border-radius: 17upx;
				display: flex;
				align-items: center;
				justify-content: center;

				&.badge-danger {
					background: #e74c3c;
				}

				&.badge-success {
					background: #2eaf52;
				}

				.badge-text {
					font-size: 20upx;
					font-weight: 700;
					color: #fff;
					line-height: 1;
				}
			}

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 56px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.no-tab-empty {
		height: calc(100% - 52px);
	}

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: rgba(255, 255, 255, 0.75);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		margin-top: 16upx;
		cursor: pointer;
		transition: background-color 0.2s ease;

		&:active {
			background-color: rgba(255, 255, 255, 0.85);
		}

		.i-top {
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right: 30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;

			.time {
				flex: 1;
			}

			.state {
				color: $base-color;
			}

			.del-btn {
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;

				&:after {
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		.order-sn-row {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			padding: 0 30upx 18upx;
			gap: 16upx;

			.order-sn-text {
				font-size: $font-sm + 2upx;
				color: $font-color-light;
			}

			.copy-order-btn {
				height: 44upx;
				line-height: 44upx;
				padding: 0 18upx;
				margin: 0;
				font-size: $font-sm;
				color: $base-color;
				background: #fff9f9;
				border: 1upx solid #f7bcc8;
				border-radius: 22upx;

				&:after {
					border: none;
				}
			}
		}

		/* 多条商品 */
		.goods-box {
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;

			.goods-item {
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}

			.goods-img {
				display: block;
				width: 100%;
				height: 100%;
			}
		}

		/* 单条商品 */
		.goods-box-single {
			display: flex;
			padding: 20upx 0;

			.goods-img {
				display: block;
				width: 120upx;
				height: 120upx;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;

				.title {
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
					margin-bottom: 12upx;
				}

				.attr-box {
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
					margin-bottom: 16upx;
				}

				.price-quantity-box {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 8upx;
					
					.price {
						font-size: $font-base + 2upx;
						color: $font-color-dark;
					}
					
					.quantity {
						font-size: $font-sm + 2upx;
						color: $font-color-light;
					}
				}
			}
		}

		.price-box {
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.num {
				margin: 0 8upx;
				color: $font-color-dark;
			}

			.price {
				font-size: $font-lg;
				color: $font-color-dark;

				&:before {
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}

		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding: 20upx 30upx;
		}

		.action-btn {
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: rgba(255, 255, 255, 0.6);
			border-radius: 100px;
			border: 1upx solid rgba(0, 0, 0, 0.08);

			&:after {
				border-radius: 100px;
				border: none;
			}

			&.recom {
				background: rgba(255, 249, 249, 0.7);
				color: $base-color;

				&:after {
					border-color: #f7bcc8;
				}
			}
		}
	}


	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}

	.uni-load-more__img>view {
		position: absolute
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}

	.load2 {
		transform: rotate(30deg)
	}

	.load3 {
		transform: rotate(60deg)
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s
	}

	.load2 view:nth-child(1) {
		animation-delay: .13s
	}

	.load3 view:nth-child(1) {
		animation-delay: .26s
	}

	.load1 view:nth-child(2) {
		animation-delay: .39s
	}

	.load2 view:nth-child(2) {
		animation-delay: .52s
	}

	.load3 view:nth-child(2) {
		animation-delay: .65s
	}

	.load1 view:nth-child(3) {
		animation-delay: .78s
	}

	.load2 view:nth-child(3) {
		animation-delay: .91s
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}

	@keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}

	/* 客服二维码弹窗样式 */
	.qrcode-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.qrcode-content {
		width: 600upx;
		background: #fff;
		border-radius: 20upx;
		overflow: hidden;
		margin: 0 40upx;
	}

	.qrcode-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30upx 40upx;
		border-bottom: 1upx solid #f5f5f5;
	}

	.qrcode-title {
		font-size: 32upx;
		color: $font-color-dark;
		font-weight: 500;
	}

	.qrcode-close {
		font-size: 40upx;
		color: $font-color-light;
		line-height: 1;
	}

	.qrcode-body {
		padding: 40upx;
		text-align: center;
	}

	.qrcode-desc {
		font-size: 28upx;
		color: $font-color-base;
		margin-bottom: 40upx;
		display: block;
	}

	.qrcode-container {
		width: 320upx;
		height: 320upx;
		margin: 0 auto 30upx;
		border: 1upx solid #f0f0f0;
		border-radius: 12upx;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.qrcode-image {
		width: 100%;
		height: 100%;
	}

	.qrcode-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f8f8f8;
	}

	.placeholder-text {
		font-size: 26upx;
		color: $font-color-light;
	}

	.qrcode-tip {
		font-size: 24upx;
		color: $font-color-light;
		display: block;
	}
</style>
