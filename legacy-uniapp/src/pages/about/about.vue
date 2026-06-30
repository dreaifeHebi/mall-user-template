<template>
	<view class="container">
		<view class="header">
			<text class="title">{{ $t('about.title') }}</text>
		</view>
		
		<view class="content">
			<view class="section">
				<text class="section-title">{{ $t('about.companyIntro') }}</text>
				<text class="section-content">
					{{ $t('about.companyDescription') }}
				</text>
			</view>
			
			<view class="section">
				<text class="section-title">{{ $t('about.contact') }}</text>
				<view class="contact-item" @click="handleWechatClick">
					<text class="contact-label">{{ $t('about.wechat') }}</text>
					<text class="contact-value clickable">{{ $t('about.wechatValue') }}</text>
				</view>
				<view class="contact-item" @click="handleWhatsAppClick">
					<text class="contact-label">{{ $t('about.whatsapp') }}</text>
					<text class="contact-value clickable">{{ $t('about.whatsappValue') }}</text>
				</view>
				<view class="contact-item" @click="handleEmailClick">
					<text class="contact-label">{{ $t('about.email') }}</text>
					<text class="contact-value clickable">service@mall.com</text>
				</view>
			</view>
			
			<view class="section">
				<text class="section-title">{{ $t('about.serviceTime') }}</text>
				<text class="section-content">
					{{ $t('about.serviceTimeValue') }}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { setPageTitle } from '@/utils/pageTitleUtil.js';
	export default {
		data() {
			return {
				
			};
		},
		onLoad() {
			setPageTitle('pageTitle.about');
		},
		methods: {
			handleWechatClick() {
				uni.showToast({
					title: this.$t('about.viewContactPage'),
					icon: 'none'
				});
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/contact/contact'
					});
				}, 500);
			},
			
			handleWhatsAppClick() {
				const phoneNumber = '8618888888888';
				const url = `https://wa.me/${phoneNumber}`;
				// #ifdef H5
				window.open(url, '_blank');
				// #endif
				// #ifndef H5
				uni.showModal({
					title: this.$t('about.whatsapp'),
					content: `+${phoneNumber}`,
					showCancel: false
				});
				// #endif
			},
			
			handleEmailClick() {
				const email = 'service@mall.com';
				uni.setClipboardData({
					data: email,
					success: () => {
						uni.showToast({
							title: this.$t('about.emailCopied'),
							icon: 'success'
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background: #f5f5f5;
		min-height: 100vh;
	}
	
	.header {
		background: #fff;
		padding: 30upx;
		text-align: center;
		border-bottom: 1upx solid #e5e5e5;
		
		.title {
			font-size: 36upx;
			font-weight: 500;
			color: #000;
		}
	}
	
	.content {
		padding: 30upx;
	}
	
	.section {
		background: #fff;
		border-radius: 15upx;
		padding: 30upx;
		margin-bottom: 20upx;
		
		.section-title {
			font-size: 32upx;
			font-weight: 500;
			color: #000;
			margin-bottom: 20upx;
			display: block;
		}
		
		.section-content {
			font-size: 28upx;
			color: #666;
			line-height: 1.6;
			display: block;
		}
		
		.contact-item {
			display: flex;
			margin-bottom: 15upx;
			
			.contact-label {
				font-size: 28upx;
				color: #999;
				width: 150upx;
			}
			
			.contact-value {
				font-size: 28upx;
				color: #000;
				flex: 1;
				
				&.clickable {
					color: #409eff;
					cursor: pointer;
				}
			}
		}
	}
</style>
