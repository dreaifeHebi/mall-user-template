<template>
	<view>
		<!-- 顶部大图 -->
		<view class="top-image">
			<view class="image-wrapper">
				<image :src="brand.bigPic" class="loaded" mode="aspectFill"></image>
			</view>
		</view>
		<!-- 品牌信息 -->
		<view class="info">
			<view class="image-wrapper">
				<image :src="brand.logo" class="loaded" mode="aspectFit"></image>
			</view>
			<view class="title">
				<text :class="{Skeleton:!loaded}">{{brand.name}}</text>
				<text :class="{Skeleton:!loaded}">品牌首字母：{{brand.firstLetter}}</text>
			</view>
			<!-- 隐藏关注按钮 -->
			<!-- <view>
				<text class="yticon icon-shoucang" :class="{active: favoriteStatus}" @click="favorite()"></text>
			</view> -->
		</view>
		<!-- 品牌故事 -->
		<view class="section-tit">品牌故事</view>
		<view class="brand-story">
			<text class="text">{{brand.brandStory}}</text>
		</view>
		<!-- 相关商品 -->
		<view class="section-tit">相关商品</view>
		<view class="goods-list">
			<view v-for="(item, index) in productList" :key="index" class="goods-item" @click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="item.pic" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.name}}</text>
				<text class="title2">{{item.subTitle}}</text>
				<view class="price-box">
					<text class="price">{{item.price}}</text>
					<text>已售 {{item.sale}}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import share from '@/components/share';
	import {
		getBrandDetail,
		fetchBrandProductList
	} from '@/api/brand.js';
	import {
		createBrandAttention,
		deleteBrandAttention,
		brandAttentionDetail
	} from '@/api/memberBrandAttention.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			share
		},
		data() {
			return {
				loaded: false,
				brand: {},
				productList:[],
				loadingType: 'more',
				favoriteStatus:false,
				queryParam: {
					brandId: null,
					pageNum: 1,
					pageSize: 4
				}
			};
		},
		onLoad(options) {
			this.loaded = true;
			let id = options.id;
			getBrandDetail(id).then(response => {
				this.brand = response.data;
				// 注释掉品牌关注功能的初始化
				// this.initBrandAttention();
			});
			this.queryParam.brandId = id;
			this.loadData('refresh');
		},
		computed: {
			...mapState(['hasLogin'])
		},
		methods: {
			imageOnLoad(key, index) {
				this.$set(this.data[key][index], 'loaded', 'loaded');
			},
			//收藏
			// 品牌关注功能已隐藏
			favorite() {
				// 关注功能已被隐藏
				/* if (!this.checkForLogin()) {
					return;
				}
				
				if (this.favoriteStatus) {
					//取消收藏
					deleteBrandAttention({
						brandId: this.brand.id
					}).then(response => {
						uni.showToast({
							title: this.$t('brand.unfavoriteSuccess'),
							icon: 'none'
						});
						this.favoriteStatus = !this.favoriteStatus;
					}).catch(error => {
						console.error('取消关注失败:', error);
						uni.showToast({
							title: this.$t('brand.unfavoriteFailed'),
							icon: 'none'
						});
					});
				} else {
					//收藏
					let brandAttention = {
						brandId : this.brand.id,
						brandName : this.brand.name,
						brandLogo : this.brand.logo,
						brandCity : ""
					}
					console.log('添加关注品牌:', brandAttention);
					createBrandAttention(brandAttention).then(response=>{
						console.log('添加关注成功:', response);
						uni.showToast({
							title: this.$t('brand.favoriteSuccess'),
							icon: 'none'
						});
						this.favoriteStatus = !this.favoriteStatus;
					}).catch(error => {
						console.error('添加关注失败:', error);
						uni.showToast({
							title: this.$t('brand.favoriteFailed'),
							icon: 'none'
						});
					});
				} */
			},
			//详情
			navToDetailPage(item) {
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type = 'add', loading) {
				//没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more'
				}
			
				if (type === 'refresh') {
					this.queryParam.pageNum=1;
					this.productList = [];
				}
				fetchBrandProductList(this.queryParam).then(response => {
					let productList = response.data.list;
					if (response.data.list.length === 0) {
						//没有更多了
						this.loadingType = 'nomore';
						this.queryParam.pageNum--;
					} else {
						if (response.data.list.length < this.queryParam.pageSize) {
							this.loadingType = 'nomore';
							this.queryParam.pageNum--;
						} else {
							this.loadingType = 'more';
						}
						this.productList = this.productList.concat(productList);
					}
					if (type === 'refresh') {
						if (loading == 1) {
							uni.hideLoading()
						} else {
							uni.stopPullDownRefresh();
						}
					}
				});
			},
			//下拉刷新
			onPullDownRefresh() {
				this.loadData('refresh');
			},
			//加载更多
			onReachBottom() {
				this.queryParam.pageNum++;
				this.loadData();
			},
			//初始化收藏状态 - 品牌关注功能已隐藏
			initBrandAttention(){
				// 关注功能已被隐藏
				/* if(this.hasLogin){
					console.log('检查品牌关注状态，品牌ID:', this.brand.id);
					brandAttentionDetail({brandId:this.brand.id}).then(response=>{
						console.log('品牌关注状态查询结果:', response);
						this.favoriteStatus = response.data!=null;
						console.log('设置关注状态为:', this.favoriteStatus);
					}).catch(error => {
						console.error('查询品牌关注状态失败:', error);
					});
				} else {
					console.log('用户未登录，无法检查关注状态');
				} */
			},
			//检查登录状态并弹出登录框
			checkForLogin() {
				if (!this.hasLogin) {
					uni.showModal({
						title: this.$t('common.tips'),
						content: this.$t('brand.loginPrompt'),
						confirmText: this.$t('auth.goLogin'),
						cancelText: this.$t('common.cancel'),
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/public/login'
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					return false;
				} else {
					return true;
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.top-image {
		height: 200px;

		.image-wrapper {
			display: flex;
			justify-content: center;
			align-content: center;
			width: 100%;
			height: 100%;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.info {
		display: flex;
		align-items: center;
		padding: 30upx 50upx;
		background: #fff;
		margin-top: 16upx;
		.image-wrapper {
			width: 210upx;
			height: 70upx;
			background: #fff;
			image{
				width:100%;
				height: 100%;
			}
		}

		.title {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-lg+4upx;
			margin-left: 30upx;
			color: $font-color-dark;
			text:last-child {
				font-size: $font-sm;
				color: $font-color-light;
				margin-top: 8upx;
				&.Skeleton{
					width:220upx;
				}
			}
		}

		.yticon {
			font-size: 80upx;
			color: $font-color-base;
			margin: 0 10upx 0 30upx;
			&.active {
				color: #ff4443;
			}
		}
	}

	.brand-story {
		display: flex;
		padding: 30upx;
		background: #fff;

		.text {
			font-size: $font-sm;
			color: $font-color-light;
		}
	}

	.actions {
		padding: 10upx 28upx;
		background: #fff;

		.yticon {
			font-size: 46upx;
			color: $font-color-base;
			padding: 10upx 12upx;

			&.active {
				color: #ff4443;
			}

			&:nth-child(2) {
				font-size: 50upx;
			}
		}
	}
	
	.section-tit {
		font-size: $font-base+2upx;
		color: $font-color-dark;
		background: #fff;
		margin-top: 16upx;
		text-align: center;
		padding-top: 20upx;
		padding-bottom: 20upx;
	}

	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;
	
		.goods-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;
	
			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}
	
		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;
	
			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
	
		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}
	
		.title2 {
			font-size: $font-sm;
			color: $font-color-light;
			line-height: 40upx;
			height: 80upx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: block;
		}
	
		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
		}
	
		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
	
			&:before {
				content: '$';
				font-size: 26upx;
			}
		}
	}
</style>
