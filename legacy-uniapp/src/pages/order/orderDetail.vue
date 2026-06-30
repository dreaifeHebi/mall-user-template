<template>
	<view>
		<view class="status-section">
			<image :src="orderStatus.image" class="icon" />
			<text class="label-text">{{orderStatus.text}}</text>
		</view>

		<!-- 退款状态展示 -->
		<view class="refund-status-section" v-if="refundInfo && refundInfo.id">
			<view class="refund-header">
				<view class="refund-icon" :class="getRefundStatusClass(refundInfo.status)">
					{{getRefundStatusIcon(refundInfo.status)}}
				</view>
				<view class="refund-text">
					<text class="refund-title">{{refundInfo.statusText}}</text>
					<text class="refund-desc">{{getRefundStatusDescription(refundInfo.status)}}</text>
				</view>
			</view>
			<view class="refund-details">
				<view class="refund-detail-item">
					<text class="label">{{ $t('order.refund.amount') }}</text>
					<text class="value amount">¥{{refundInfo.refundAmount}}</text>
				</view>
				<view class="refund-detail-item">
					<text class="label">{{ $t('order.refund.applyTime') }}</text>
					<text class="value">{{formatDateTime(refundInfo.createdAt)}}</text>
				</view>
				<view class="refund-detail-item" v-if="refundInfo.processedAt">
					<text class="label">{{ $t('order.refund.processTime') }}</text>
					<text class="value">{{formatDateTime(refundInfo.processedAt)}}</text>
				</view>
			</view>
		</view>

		<!-- 地址 -->
		<view class="address-section">
			<view class="order-content">
				<text class="yticon icon-shouhuodizhi"></text>
				<view class="cen">
					<view class="top">
						<text class="name">{{order.receiverName}}</text>
						<text class="mobile">{{order.receiverPhone}}</text>
					</view>
					<text class="address">{{order.receiverProvince}} {{order.receiverCity}} {{order.receiverRegion}}
						{{order.receiverDetailAddress}}</text>
				</view>
			</view>

			<image class="a-bg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvVHce/1/deXzuJHSdOM+fhpKMllI2SkTZpV6ULYrCHQGwrf41p/LENVk3QTipSWujKoyot1aQN0FYQQxtsMCS2SVuqsfFYHxBKYQNGV9ouZdA8nDipH4mT+HFf+51rO0pN0japrw9HreLe3Pqc3/me3+f3uFdIvfVuDIAPix1C9oceicFRVQWlvRWCkL1omqb1Of9z9rXZY65rhcO6x5ove19oWkX/RAaSMLOEkg+2Zt0wEcvoWOZzYZnXeWEbzmP7XPs11//LnOiDEY9DkGRwGw5a59QUTM2As+1qiD5v0TUvvC9Bc52KpmDSnju4ic7+CIinNVQoElYtcUM8jx2L1bzwPn14DOrHZ0hzEdxOPJtW16FH45CvuBzyZU22aH7Od9LnU/E0xpMqJG6iZ309qeqYNoA1gTJ4ZdF2zY2pJNSTfYCmkb85+GnO1hIbh+DzQVndaiHYTs3ZGJpifE/DyVnzi+X7pWqen8/i+8kPYUSjEORPCd9XtUKs9Fi+KMxjVzE0n9ZNnIgkYXwK+B5LafC4JKyudcMxD2+LqblGfNcY30VxJsfhcOCJ7xr02ATkluXE96DtmrPvPxFLIUH7zY3vOc0Z39O0oGtqy1DlFIuu+Zx8P/Ffa8/hEBey4rh0uuPWS6S6CRUhyGjG0hcfOWex+c9zXSsE5HmFzseP3H294Sl847VBRGJJQHTwy9wJNKAE7otLfXi2K3hRgeB81+bar8IDEPvFMxi6cxebnMx2cjrnDmiIwUAGDTvugX9de9E1L7R9NK1jc+8gnj8dy2rOKY/JRhgV8Cr405ea0HEBOxajeaHtySPvYvD2bUgdP0lmuzkl7oLl6Wn0wX/Dd1D/xG5bNc/f+7NjY9jyzghlM5QxS/ySOGt+Wlt3WwDXBz22a86gHrqjG7Hnekhz5uciN9NVDEBxXYng87vgEoqveZ7y+XsPE99vOTyAs1SkU+bOT3NKIJHUsIb4/rsL8L0YmrMRffQ3GNn8c6L7BOnu4pW10/xR4nsK9T+5FzWda2fXcEXTfLbtYUrc7joSwguno9kilZfsLNmgtaBcxv7rmudN2i9Fc8YRlsvkr6aOvoeBHxDf//MBzVfGke9p8vVhVN2wAQ1P7rFdczYeO34Wm4+Gsr4mcqzWMqQ5IX5rex3W1pUXX/PCRlwkjpEtDyLy9B8sPxcgLWzFpy7rWlTH3eq66AbUj0fh7lyJhn27oFzVck41mTdgdnU5+3fzbczsqqVwQ14aSuCrhwZoo3UEqCLW6biZJZZZom0e0UhlSiY3rvBjd0cdfLJjTrsXYvN8e5TvPEZ2PYbw9l9CrKqAWFNB+2+W/oiTc2l9BFefC/WPdqPyuxts1/zMlIrbqVB7OZSgaSWrC2eUWHUGcLa2MVrLyho3ftvVhNYq1ye6J8XUnI3JFw8idNdOaB+GIS+vsZhf6gMvsP1OJKGFx1H9o1sQeOSBXOcfc9pQDM3Z2PGvEeykxJ0l7AGaTyux4YKVLpOvs0BO/v0UQf17LdUzwdcskuaFHRo1NIrQxq1I9ByEc2kj+ZwDZsk1z/H9I+L7us+j4fHdUFa2FF3zQtv3DyTwrTcGoVFxXOeWKZEoPeNm+E66b7zSj71r6+ERHXN21C5V85nPmo7I3scRvncfxOoyiP7y0vNdyMZ17X9xmGR+43MPwvvtm23XnPH9h68P4u8U2yuJ7wonvmu0pigValf73XhmfRCt1S5bNbd6QK/0ov+2bhjDE8T3aj58p5hujCehjsZQs+lWLNl5N0RvuS2a5z/T8cLOd8K4/72wxdaAXHq+syGT7sOM7xLxvaOe+F5lu+bqYBjDd25H4s+vQ26ugSBL1lsEC+m4C8fQvMhXZXTa/CR8N96MekrapWCdvc1t+rvn32PY3juYrc7cEjjonFuMYQm97QsBPLSq1v7pKJAPbbwHZ3ueoqCyhJIJStqto8/BdMTh8q1A8PcPo+xrXbbP97ehSXydFWpjU0CZzO8xInM+CqSdTV688OVmBBT7O6DRh/dhYOt20nqSdK+f1RIqdRMqRXgrR90Dm+Dfsdn2+QYpeH7/8CBe+mAsq7nIsevKEjivgv1dQdzYUGH7dMlXe3FmwxZMTRyFgiZkW48mF0/XMYWqm75JfH8IUmPA1tlUMnHv+8T3N3J8d3Hkey6I3re6Djvaam1v/urhswjdsQ2jf/kVJRI1xHdPrh1lltzTWUxXai5H07N74P7KettnPDQyjWtf/ohglyJfl7jz/drP+vDrzgYsLZdtP2PRnz6B/u4t9I+U9cYCH81hddoFuBG4bxNq7v9xSfh+G/H9wKkIwF5JkR38fF3VLb73dDXhpsYS8P0Vxve7MZ14E04EkX2SumDj40Lkjz2LS9x1nZVqcK1rh1L/GaiZDB1GYwGPRi9+sA4r63odGEjAoKTZS0mTwUtoS2sTPioc1jd64KJqNZXRP9EtLFrLT5KQOd6H1JtvQ/SUQ1CUC1Z/tjp5MgXn51bAfc1VpAUVb6pqi+bsqRlrOB0ITSI0kUa1IvF7JcribPbxZnt9BYIeBZm0ap1BO2yHLMOIxjH111chmDocXg9XzZFR4fD74e5cA9GtQEulbLGbfaNMvv4+BfG3hiet9wxlUeDGdDPn68uqXVgVKKezbiBN/HHYoTnrqlORkDx0BHr/ABzVVbknbZysZ3wnRVyda6HU1UIjvpt28p2C+T+GEtYeeEh3jqcdKjl2BcWY65q9UAQb+c6+k3iePnaS+P5Pq8spOJ38fJ09RVI1OFuWo6xtJXSD+J6xh++OHN8PEt8HxtNY4pbAczC+m2Rnh8V3J9Q0Fa4LeG97YQdehj4aoSL9NZiZNMTKStp6g5/x5NsW37vWQaS1WXzPHvjihzYS/lgshbeJ75WySHm7wNXXk8SbK/xutOX4ntHtYRxE0eJn6uARaGf6ie++7GPNxVkf/78AAwCn1+RYqusbZQAAAABJRU5ErkJggg=="></image>
		</view>

		<view class="goods-section">
			<view class="g-header b-b">
				<text class="name">{{ $t('order.goodsInfo') }}</text>
			</view>
			<!-- 商品列表 -->
			<view class="g-item" v-for="item in order.orderItemList" :key="item.id">
				<image :src="item.productPic"></image>
				<view class="right">
					<text class="title clamp">{{item.productName}}</text>
					<text class="spec" v-if="formatProductAttr(item.productAttr)">{{formatProductAttr(item.productAttr)}}</text>
					<view class="price-box">
						<text class="price">¥{{item.productPrice}} JPY</text>
						<text class="number">x {{item.productQuantity}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">{{ $t('order.goodsTotal') }}</text>
				<text class="cell-tip">¥{{order.totalAmount}} JPY</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">{{ $t('order.freight') }}</text>
				<text class="cell-tip">¥{{order.freightAmount}} JPY</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">{{ $t('order.note') }}</text>
				<text class="cell-tip">{{order.note || $t('order.noNote')}}</text>
			</view>
		</view>

		<!-- 订单明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">{{ $t('order.orderNumber') }}</text>
				<text class="cell-tip">{{order.orderSn}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">{{ $t('order.submitTime') }}</text>
				<text class="cell-tip">{{formatDateTime(order.createTime)}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">{{ $t('order.payMethod') }}</text>
				<text class="cell-tip">{{formatPayType(order.payType)}}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="order.status==1||order.status==2||order.status==3">
				<text class="cell-tit clamp">{{ $t('order.paidAmount') }}</text>
				<text class="cell-tip">¥{{order.payAmount}} JPY</text>
			</view>
			<view class="yt-list-cell b-b" v-if="order.status==1||order.status==2||order.status==3">
				<text class="cell-tit clamp">{{ $t('order.payTime') }}</text>
				<text class="cell-tip">{{formatDateTime(order.paymentTime)}}</text>
			</view>
		</view>

		<!-- 客户下单须知 -->
		<view class="order-notice-section">
			<view class="notice-title">{{ $t('order.orderNotice.title') }}</view>
			<view class="notice-list">
				<view class="notice-item">
					<text class="notice-text">{{ $t('order.orderNotice.item1') }}</text>
				</view>
				<view class="notice-item">
					<text class="notice-text">{{ $t('order.orderNotice.item2') }}</text>
				</view>
				<view class="notice-item">
					<text class="notice-text">{{ $t('order.orderNotice.item3') }}</text>
				</view>
				<view class="notice-item">
					<text class="notice-text">{{ $t('order.orderNotice.item4') }}</text>
				</view>
			</view>
		</view>

		<!-- 免责及责任说明 -->
		<view class="disclaimer-section">
			<view class="disclaimer-title">
				<text class="warning-icon">⚠️</text>
				<text class="title-text">{{ $t('order.disclaimer.title') }}</text>
			</view>
			<view class="disclaimer-content">
				<text class="disclaimer-text">{{ $t('order.disclaimer.content') }}</text>
			</view>
		</view>

		<!-- 底部 -->
		<view class="footer" v-if="order.status==0||order.status==1||order.status==2||order.status==3">
			<view class="action-box b-t" v-if="order.status==0">
				<button class="action-btn" @click="cancelOrder(order.id)">{{ $t('order.cancelOrder') }}</button>
				<button class="action-btn recom" @click="payOrder(order.id)">{{ $t('order.payNow') }}</button>
			</view>
			<view class="action-box b-t" v-if="order.status==1">
				<button class="action-btn recom" @click="updateOrderAddress(order.id)">{{ $t('order.modifyAddress') }}</button>
			</view>
			<view class="action-box b-t" v-if="order.status == 2">
				<button class="action-btn" @click="viewOrderDetail(order.id)">{{ $t('order.viewLogistics') }}</button>
				<button class="action-btn recom" @click="receiveOrder(order.id)">{{ $t('order.confirmReceipt') }}</button>
			</view>
			<view class="action-box b-t" v-if="order.status == 3">
				<button class="action-btn" @click="applyRefund(order.id)">{{ $t('order.applyRefund') }}</button>
				<button class="action-btn" @click="showCustomerService">{{ $t('order.contactService') }}</button>
			</view>
			<view class="price-content" v-if="order.status==0">
				<text>{{ $t('order.totalPayable') }}</text>
				<text class="price-tip">¥</text>
				<text class="price">{{order.payAmount}}</text>
				<text class="price-currency">JPY</text>
			</view>
		</view>

		<!-- 客服二维码弹窗 -->
		<view class="qrcode-modal" v-if="showQrcodeModal" @click="hideCustomerService">
			<view class="qrcode-content" @click.stop>
				<view class="qrcode-header">
					<text class="qrcode-title">{{ $t('order.wechatService') }}</text>
					<text class="qrcode-close yticon icon-guanbi" @click="hideCustomerService"></text>
				</view>
				<view class="qrcode-body">
					<text class="qrcode-desc">{{ $t('order.scanQrCode') }}</text>
					<view class="qrcode-container">
						<image v-if="qrcodeUrl" 
							   :src="qrcodeUrl" 
							   mode="aspectFit" 
							   class="qrcode-image"
							   @error="handleImageError">
						</image>
						<view v-else class="qrcode-placeholder">
							<text class="placeholder-text">{{qrcodeLoading ? $t('order.qrCodeLoading') : $t('order.noQrCode')}}</text>
						</view>
					</view>
					<text class="qrcode-tip">{{ $t('order.workingHours') }}</text>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		fetchOrderDetail,
		cancelUserOrder,
		confirmReceiveOrder,
		updateOrderAddress
	} from '@/api/order.js';
	import {
		getServiceQrcode
	} from '@/api/service.js';
	import { getRefundByOrderId } from '@/api/h5Payment.js';
	import { USE_H5_PAYMENT } from '@/utils/appConfig.js';
	import {
		formatDate
	} from '@/utils/date';
	import { setPageTitle } from '@/utils/pageTitleUtil.js';
	import { processOrderDetail } from '@/utils/textProcessor.js';
	import languageRefreshMixin from '@/mixins/languageRefreshMixin.js';
	export default {
		mixins: [languageRefreshMixin],
		data() {
			return {
				orderId: null,
				order: {},
				orderStatus: {},
				refundInfo: null, // 退款信息
				showQrcodeModal: false,
				qrcodeUrl: '',
				qrcodeLoading: false
			}
		},
		onLoad(option) {
			setPageTitle('pageTitle.orderDetail');
			//商品数据
			this.orderId = option.orderId;
			this.loadData();
		},
		onShow() {
			// 页面显示时刷新数据，确保从退款申请页面返回时能看到最新状态
			if (this.orderId) {
				this.loadData();
			}
		},
		filters: {},
		methods: {
			//商品属性格式化
			formatProductAttr(jsonAttr) {
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
						}
					}
					return attrStr;
				} catch (e) {
					return '';
				}
			},
			//时间格式化
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
			//支付方式格式化
			formatPayType(payType) {
				const payTypeNum = parseInt(payType);
				if (isNaN(payTypeNum)) {
					return this.$t('order.payType.unknown');
				}
				switch (payTypeNum) {
					case 0: return this.$t('order.payType.unpaid');
					case 1: return this.$t('order.payType.alipay');
					case 2: return this.$t('order.payType.wechat');
					case 3: return this.$t('order.payType.bankCard');
					default: return this.$t('order.payType.other');
				}
			},
			//生成确认单信息
			async loadData() {
				try {
					// 获取订单详情
					const orderResponse = await fetchOrderDetail(this.orderId);
					// 应用多语言文本处理
					this.order = processOrderDetail(orderResponse.data);
					this.setOrderStatus(this.order.status);
					
					// 如果订单已完成，尝试获取退款信息
					if (this.order.status === 3) {
						try {
							const refundResponse = await getRefundByOrderId(this.orderId);
							if (refundResponse.code === 200 && refundResponse.data) {
								this.refundInfo = refundResponse.data;
							}
						} catch (error) {
							// 没有退款记录是正常的，不需要处理
							console.log('No refund info found for this order');
						}
					}
				} catch (error) {
					console.error('Failed to load order data:', error);
					uni.showToast({
						title: this.$t('h5Pay.loadOrderFailed'),
						icon: 'none'
					});
				}
			},
			submit() {},
			stopPrevent() {},
			//取消订单
			cancelOrder(orderId) {
				let superThis = this;
				uni.showModal({
					title: this.$t('common.confirm'),
					content: this.$t('order.cancelConfirm'),
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: superThis.$t('common.loading')
							})
							cancelUserOrder({
								orderId: orderId
							}).then(response => {
								uni.hideLoading();
								superThis.loadData();
							});
						} else if (res.cancel) {
							// 用户点击取消
						}
					}
				});
			},
			//支付订单
			payOrder(orderId) {
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
			receiveOrder(orderId) {
				let superThis = this;
				uni.showModal({
					title: this.$t('common.confirm'),
					content: this.$t('order.receiveConfirm'),
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: superThis.$t('common.loading')
							})
							confirmReceiveOrder({
								orderId: orderId
							}).then(response => {
								uni.hideLoading();
								superThis.loadData();
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
			//查看订单详情（用于物流跳转）
			viewOrderDetail(orderId) {
				// 这里可以后续对接真实的物流页面
				// 目前先跳转到当前订单详情页
				uni.navigateTo({
					url: `/pages/order/orderDetail?orderId=${orderId}`
				});
			},
			//申请退款
			applyRefund(orderId) {
				uni.navigateTo({
					url: `/pages/refund/refundApply?orderId=${orderId}`
				});
			},
			//获取退款状态图标
			getRefundStatusIcon(status) {
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
			//获取退款状态样式类
			getRefundStatusClass(status) {
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
			//获取退款状态描述
			getRefundStatusDescription(status) {
				const descMap = {
					'PENDING_REVIEW': this.$t('refund.status.pendingReviewDesc'),
					'APPROVED': this.$t('refund.status.approvedDesc'),
					'REJECTED': this.$t('refund.status.rejectedDesc'),
					'PROCESSING': this.$t('refund.status.processingDesc'),
					'COMPLETED': this.$t('refund.status.completedDesc'),
					'FAILED': this.$t('refund.status.failedDesc'),
					'CANCELLED': this.$t('refund.status.cancelledDesc')
				};
				return descMap[status] || this.$t('refund.status.unknown');
			},
			//显示客服二维码
			async showCustomerService() {
				this.showQrcodeModal = true;
				if (!this.qrcodeUrl && !this.qrcodeLoading) {
					await this.loadQrcode();
				}
			},
			//隐藏客服二维码
			hideCustomerService() {
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
			//设置订单状态信息
			setOrderStatus(status) {
				switch (status) {
					case 0:
						this.orderStatus = {
							text: this.$t('order.status.pending'),
							image: '/static/icon_wait.png'
						}
						break;
					case 1:
						this.orderStatus = {
							text: this.$t('order.status.shipped'),
							image: '/static/icon_deliver.png'
						}
						break;
					case 2:
						this.orderStatus = {
							text: this.$t('order.status.delivered'),
							image: '/static/icon_receive.png'
						}
						break;
					case 3:
						this.orderStatus = {
							text: this.$t('order.status.completed'),
							image: '/static/icon_finish.png'
						}
						break;
					case 4:
						this.orderStatus = {
							text: this.$t('order.status.cancelled'),
							image: '/static/icon_close.png'
						}
						break;
				};
			},

			// 语言切换后刷新页面数据  
			refreshPageData() {
				console.log('订单详情页刷新数据以适应新语言')
				
				// 重新加载订单详情
				if (this.orderId) {
					this.loadOrderDetail()
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}

	.status-section {
		height: 200upx;
		background-color: $base-color;
		display: flex;
		align-items: center;
		padding: 30upx;

		.icon {
			width: 48upx;
			height: 48upx;
		}

		.label-text {
			color: #fff;
			margin-left: 30upx;
		}
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
				margin-bottom: 12upx;
			}

			.spec {
				font-size: 26upx;
				color: $font-color-light;
				margin-bottom: 16upx;
			}

			.promotion {
				font-size: 24upx;
				color: $base-color;
				margin-bottom: 8upx;
			}

			.price-box {
				display: flex;
				align-items: center;
				font-size: 32upx;
				color: $font-color-dark;
				margin-top: 12upx;

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

	.footer {
		position: fixed;
		flex-direction: row-reverse;
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
		background: #fff;
		border-radius: 100px;
		border: 1upx solid #e5e5e5;

		&:after {
			border-radius: 100px;
			border: none;
		}

		&.recom {
			background: #fff9f9;
			color: $base-color;
			border-color: #f7bcc8;

			&:after {
				border: none;
			}
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

	/* 退款状态样式 */
	.refund-status-section {
		background-color: #fff;
		margin: 20upx;
		border-radius: 12upx;
		padding: 30upx;
		border: 1upx solid #f0f0f0;
	}

	.refund-header {
		display: flex;
		align-items: center;
		margin-bottom: 20upx;
	}

	.refund-icon {
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 40upx;
		margin-right: 20upx;

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

	.refund-text {
		flex: 1;

		.refund-title {
			display: block;
			font-size: 30upx;
			font-weight: 500;
			color: #000;
			margin-bottom: 8upx;
		}

		.refund-desc {
			display: block;
			font-size: 24upx;
			color: #666;
			line-height: 1.4;
		}
	}

	.refund-details {
		padding-top: 20upx;
		border-top: 1upx solid #f5f5f5;
	}

	.refund-detail-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12upx;

		&:last-child {
			margin-bottom: 0;
		}

		.label {
			font-size: 26upx;
			color: #666;
		}

		.value {
			font-size: 26upx;
			color: #000;

			&.amount {
				color: #fa436a;
				font-weight: bold;
			}
		}
	}

	/* 客户下单须知 */
	.order-notice-section {
		margin-top: 16upx;
		background: #fff;
		padding: 30upx;

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

	/* 免责及责任说明 */
	.disclaimer-section {
		margin-top: 16upx;
		background: #fff9f0;
		border: 1upx solid #ffe0b2;
		border-radius: 8upx;
		padding: 24upx 30upx;
		margin-left: 30upx;
		margin-right: 30upx;

		.disclaimer-title {
			display: flex;
			align-items: center;
			margin-bottom: 16upx;

			.warning-icon {
				font-size: 32upx;
				margin-right: 8upx;
			}

			.title-text {
				font-size: 30upx;
				font-weight: 500;
				color: #ff6b00;
			}
		}

		.disclaimer-content {
			.disclaimer-text {
				font-size: 26upx;
				color: #8b4513;
				line-height: 1.7;
				display: block;
			}
		}
	}
</style>
