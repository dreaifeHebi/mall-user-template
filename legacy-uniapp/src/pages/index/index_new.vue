<template>
	<view class="container">
		<!-- 搜索框 -->
		<view class="search-section">
			<view class="search-box">
				<text class="search-icon yticon icon-sousuo"></text>
				<input class="search-input" type="text" v-model="searchKeyword" placeholder="输入商品名称" @confirm="handleSearch" />
			</view>
		</view>

		<!-- 导航栏/分类 -->
		<view class="category-nav">
			<view v-for="(category, index) in categoryList" :key="index" 
				  class="nav-item" 
				  @click="navToCategory(category)">
				<image :src="category.icon" class="nav-icon"></image>
				<text class="nav-text">{{category.name}}</text>
			</view>
		</view>

		<!-- 轮播图 -->
		<view class="carousel-section">
			<swiper class="carousel" circular @change="swiperChange" indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff">
				<swiper-item v-for="(item, index) in advertiseList" :key="index" class="carousel-item" @click="navToAdvertisePage(item)">
					<image :src="item.pic" mode="aspectFill" />
				</swiper-item>
			</swiper>
		</view>

		<!-- 推荐商品列表 -->
		<view class="products-section">
			<view class="section-title">
				<text>推荐商品</text>
			</view>
			<view class="products-grid">
				<view v-for="(item, index) in recommendProductList" :key="index" 
					  class="product-card" 
					  @click="navToProductDetail(item)">
					<view class="product-image">
						<image :src="item.pic" mode="aspectFill"></image>
					</view>
					<view class="product-info">
						<text class="product-name">{{item.name}}</text>
						<text class="product-price">¥{{item.price}} JPY</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部链接 -->
		<view class="footer-links">
			<view class="link-item" @click="navToPage('/pages/about/about')">
				<text>关于我们</text>
			</view>
			<view class="link-item" @click="navToPage('/pages/contact/contact')">
				<text>联系客服</text>
			</view>
			<view class="link-item" @click="navToPage('/pages/help/help')">
				<text>帮助中心</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		fetchContent,
		fetchRecommendProductList
	} from '@/api/home.js';
	
	export default {
		data() {
			return {
				searchKeyword: '',
				swiperCurrent: 0,
				advertiseList: [],
				categoryList: [],
				recommendProductList: []
			};
		},
		onLoad() {
			this.loadData();
		},
		onPullDownRefresh() {
			this.loadData();
		},
		methods: {
			//初期显示 - 加载数据
			async loadData() {
				try {
					const response = await fetchContent();
					this.advertiseList = response.data.advertiseList || [];
					this.categoryList = this.initCategoryList();
					
					// 获取推荐商品
					const productResponse = await fetchRecommendProductList({
						pageNum: 1,
						pageSize: 10
					});
					this.recommendProductList = productResponse.data || [];
					
					uni.stopPullDownRefresh();
				} catch (error) {
					console.error('加载数据失败:', error);
					uni.stopPullDownRefresh();
				}
			},
			
			//初始化分类列表
			initCategoryList() {
				return [
					{id: 1, name: '手机数码', icon: '/static/temp/c1.png'},
					{id: 2, name: '家用电器', icon: '/static/temp/c2.png'}, 
					{id: 3, name: '服装鞋帽', icon: '/static/temp/c3.png'},
					{id: 4, name: '家居用品', icon: '/static/temp/c4.png'},
					{id: 5, name: '美妆护肤', icon: '/static/temp/c5.png'},
					{id: 6, name: '运动户外', icon: '/static/temp/c6.png'},
					{id: 7, name: '食品生鲜', icon: '/static/temp/c7.png'},
					{id: 8, name: '母婴用品', icon: '/static/temp/c8.png'}
				];
			},
			
			//处理搜索
			handleSearch() {
				if (!this.searchKeyword.trim()) {
					uni.showToast({
						title: '请输入商品名称',
						icon: 'none'
					});
					return;
				}
				uni.navigateTo({
					url: `/pages/product/list?keyword=${encodeURIComponent(this.searchKeyword)}`
				});
			},
			
			//点击导航栏分类 - 跳转到商品列表页面并传递分类ID
			navToCategory(category) {
				uni.navigateTo({
					url: `/pages/product/list?categoryId=${category.id}&categoryName=${category.name}`
				});
			},
			
			//轮播图切换
			swiperChange(e) {
				this.swiperCurrent = e.detail.current;
			},
			
			//点击轮播图广告 - 在新标签页打开对应活动页面URL
			navToAdvertisePage(item) {
				if (item.url) {
					// #ifdef H5
					window.open(item.url, '_blank');
					// #endif
					
					// #ifndef H5
					uni.navigateTo({
						url: `/pages/webview/webview?url=${encodeURIComponent(item.url)}`
					});
					// #endif
				}
			},
			
			//点击商品卡片 - 跳转到商品详情页面并传递商品ID
			navToProductDetail(item) {
				uni.navigateTo({
					url: `/pages/product/product?id=${item.id}`
				});
			},
			
			//导航到其他页面
			navToPage(url) {
				uni.navigateTo({
					url: url
				});
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background: #f5f5f5;
	}

	.container {
		width: 100%;
	}

	/* 搜索框 */
	.search-section {
		background: #fff;
		padding: 20upx 30upx;
		
		.search-box {
			display: flex;
			align-items: center;
			background: #f5f5f5;
			border-radius: 50upx;
			padding: 0 20upx;
			height: 70upx;
			
			.search-icon {
				font-size: 32upx;
				color: #999;
				margin-right: 15upx;
			}
			
			.search-input {
				flex: 1;
				height: 100%;
				font-size: 28upx;
				color: #333;
			}
		}
	}

	/* 导航栏/分类 */
	.category-nav {
		display: flex;
		flex-wrap: wrap;
		background: #fff;
		padding: 30upx 20upx;
		margin-top: 20upx;
		
		.nav-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 25%;
			margin-bottom: 30upx;
			
			.nav-icon {
				width: 80upx;
				height: 80upx;
				margin-bottom: 10upx;
			}
			
			.nav-text {
				font-size: 24upx;
				color: #333;
			}
		}
	}

	/* 轮播图 */
	.carousel-section {
		margin-top: 20upx;
		
		.carousel {
			height: 360upx;
			border-radius: 20upx;
			margin: 0 30upx;
			overflow: hidden;
			
			.carousel-item {
				width: 100%;
				height: 100%;
				
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	/* 推荐商品列表 */
	.products-section {
		background: #fff;
		margin-top: 20upx;
		padding: 30upx;
		
		.section-title {
			font-size: 32upx;
			font-weight: bold;
			color: #333;
			margin-bottom: 30upx;
			text-align: center;
		}
		
		.products-grid {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			
			.product-card {
				width: 48%;
				margin-bottom: 30upx;
				border-radius: 15upx;
				overflow: hidden;
				box-shadow: 0 4upx 20upx rgba(0, 0, 0, 0.1);
				
				.product-image {
					width: 100%;
					height: 280upx;
					
					image {
						width: 100%;
						height: 100%;
					}
				}
				
				.product-info {
					padding: 20upx;
					
					.product-name {
						font-size: 28upx;
						color: #333;
						margin-bottom: 10upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
					
					.product-price {
						font-size: 32upx;
						color: #ff6b35;
						font-weight: bold;
					}
				}
			}
		}
	}

	/* 底部链接 */
	.footer-links {
		display: flex;
		justify-content: space-around;
		background: #fff;
		margin-top: 20upx;
		padding: 40upx 0;
		
		.link-item {
			text {
				font-size: 28upx;
				color: #666;
			}
		}
	}
</style>
