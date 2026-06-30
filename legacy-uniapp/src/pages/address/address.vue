<template>
	<view class="content b-t profile-theme-page">
		<view class="profile-theme-backdrop">
			<image class="profile-theme-backdrop__image" src="/static/profile-theme-bg.png" mode="aspectFill"></image>
			<view class="profile-theme-backdrop__wash"></view>
			<view class="profile-theme-backdrop__grain"></view>
		</view>
		<view class="address-inner profile-theme-content">
		<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
			<view class="wrapper">
				<view class="address-box">
					<text v-if="item.defaultStatus==1" class="tag">{{ $t('address.default') }}</text>
					<view class="address-info">
						<text class="country-flag" v-if="getCountryFlag(item.country)">{{getCountryFlag(item.country)}}</text>
						<text class="address">{{getFullAddress(item)}}</text>
					</view>
				</view>
				<view class="u-box">
					<text class="name">{{item.name}}</text>
					<text class="mobile">{{getFormattedPhone(item)}}</text>
				</view>
			</view>
			<text class="yticon icon-bianji" @click.stop="addAddress('edit', item)"></text>
			<text class="yticon icon-iconfontshanchu1" @click.stop="handleDeleteAddress(item.id)"></text>
		</view>

		<button class="add-btn" @click="addAddress('add')">{{ $t('address.addNew') }}</button>
		</view>
	</view>
</template>

<script>
	import {
		fetchAddressList,
		deleteAddress
	} from '@/api/address.js';
	import {
		updateOrderAddress
	} from '@/api/order.js';
	import {
		mapState
	} from 'vuex';
	import { setPageTitle } from '@/utils/pageTitleUtil.js';
	export default {
		data() {
			return {
				source: 0,
				orderId: null,
				mode: null,
				addressList: [],
				// 国家信息映射
				countryMap: {
					'GB': { name: '英国', flag: '🇬🇧' }
				}
			}
		},
		onLoad(option) {
			setPageTitle('pageTitle.addressList');
			// 检查登录状态
			if (!this.hasLogin) {
				uni.showModal({
					title: this.$t('common.tips'),
					content: this.$t('address.loginRequired'),
					showCancel: true,
					confirmText: this.$t('address.goLogin'),
					cancelText: this.$t('address.back'),
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
			
			console.log(option.source);
			this.source = option.source;
			this.orderId = option.orderId;
			this.mode = option.mode;
			this.loadData();
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			async loadData() {
				fetchAddressList().then(response => {
					const list = response.data || [];
					this.addressList = list.filter(item => this.isUkAddress(item));
				});
			},
			isUkAddress(item) {
				if (!item) {
					return false;
				}
				return item.country === 'GB' || item.countryCode === '+44';
			},
			//选择地址
			checkAddress(item) {
				if (!this.isUkAddress(item)) {
					uni.showToast({
						title: this.$t('address.ukOnly'),
						icon: 'none'
					});
					return;
				}
				if (this.source == 1) {
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().currentAddress = item;
					uni.navigateBack()
				} else if (this.mode === 'update' && this.orderId) {
					// 修改订单地址
					this.updateOrderAddressConfirm(item);
				}
			},
			addAddress(type, item) {
				if (type == 'edit') {
					uni.navigateTo({
						url: `/pages/address/addressManage?type=${type}&id=${item.id}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/address/addressManage?type=${type}`
					})
				}
			},
			//处理删除地址
			handleDeleteAddress(id){
				let superThis = this;
				uni.showModal({
				    title: this.$t('common.tips'),
				    content: this.$t('address.deleteConfirm'),
				    success: function (res) {
				        if (res.confirm) {
				            deleteAddress(id).then(response=>{
								superThis.loadData();
							});
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			//修改订单地址确认
			updateOrderAddressConfirm(address) {
				const superThis = this;
				uni.showModal({
					title: this.$t('common.confirm'),
					content: `${this.$t('address.changeConfirm')}：${this.getFullAddress(address)}？`,
					success: function (res) {
						if (res.confirm) {
							superThis.updateOrderAddressRequest(address);
						}
					}
				});
			},
			//请求修改订单地址
			async updateOrderAddressRequest(address) {
				try {
					uni.showLoading({
						title: this.$t('address.updating')
					});
					
					const newAddress = {
						receiverName: address.name,
						receiverPhone: this.getFormattedPhone(address),
						receiverProvince: address.province || '',
						receiverCity: address.city || '',
						receiverRegion: address.region || '',
						receiverDetailAddress: address.detailAddress || '',
						receiverPostCode: address.postCode || ''
					};
					
					const response = await updateOrderAddress({
						orderId: this.orderId,
						newAddress: newAddress
					});
					
					uni.hideLoading();
					
					if (response.code === 200) {
						uni.showToast({
							title: this.$t('address.updateSuccess'),
							duration: 1500
						});
						
						// 延迟返回，确保用户看到提示
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					} else {
						uni.showToast({
							title: response.message || this.$t('address.updateFailed'),
							icon: 'none',
							duration: 2000
						});
					}
				} catch (error) {
					uni.hideLoading();
					console.error('修改订单地址失败:', error);
					uni.showToast({
						title: this.$t('address.updateRetry'),
						icon: 'none',
						duration: 2000
					});
				}
			},
			//添加或修改成功之后回调
			refreshList(data, type) {
				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				// this.addressList.unshift(data);
				this.loadData();
				console.log(data, type);
			},
			
			// 获取国家旗帜
			getCountryFlag(countryCode) {
				if (!countryCode) return '';
				const country = this.countryMap[countryCode];
				return country ? country.flag : '';
			},
			
			// 获取完整地址
			getFullAddress(item) {
				return `${item.province || ''} ${item.city || ''} ${item.region || ''} ${item.detailAddress || ''}`.trim();
			},
				
			// 格式化电话号码显示
			getFormattedPhone(item) {
				if (!item.phoneNumber) return '';
					
				// 如果有国家区号，显示区号
				if (item.countryCode) {
					return `${item.countryCode} ${item.phoneNumber}`;
				}
					
				return `+44 ${item.phoneNumber}`;
			}
		}
	}
</script>

<style lang='scss'>
	@import '@/styles/profile-theme.scss';
	page {
		padding-bottom: 120upx;
		background: transparent;
	}

	.content {
		position: relative;
	}

	.list {
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		;
		background: rgba(255, 255, 255, 0.75);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		position: relative;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.address-box {
		display: flex;
		align-items: center;

		.tag {
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
			flex-shrink: 0;
		}

		.address-info {
			display: flex;
			align-items: center;
			flex: 1;
		}

		.country-flag {
			font-size: 24upx;
			margin-right: 8upx;
		}

		.address {
			font-size: 30upx;
			color: $font-color-dark;
			flex: 1;
		}
	}

	.u-box {
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;

		.name {
			margin-right: 30upx;
		}
	}

	.icon-bianji {
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}
	
	.icon-iconfontshanchu1 {
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}

	.add-btn {
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
