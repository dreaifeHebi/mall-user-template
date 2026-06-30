<template>
	<view class="container">
		<view class="header">
			<text class="title">{{ $t('contact.title') }}</text>
		</view>
		
		<view class="content">
			<view class="qrcode-section">
				<text class="section-title">{{ $t('contact.wechatService') }}</text>
				<text class="section-desc">{{ $t('contact.scanQrcode') }}</text>
				
				<view class="qrcode-container">
					<image v-if="qrcodeUrl" 
						   :src="qrcodeUrl" 
						   mode="aspectFit" 
						   class="qrcode-image"
						   @error="handleImageError">
					</image>
					<view v-else class="qrcode-placeholder">
						<text class="placeholder-text">{{loading ? $t('contact.loading') : $t('contact.noQrcode')}}</text>
					</view>
				</view>
				
				<text class="qrcode-tip">{{ $t('contact.workingHours') }}</text>
			</view>
			
			<view class="contact-methods">
				<text class="section-title">{{ $t('contact.otherMethods') }}</text>
				
				<view class="method-item" @click="openWechat">
					<view class="method-icon wechat">
						<text class="yticon icon-weixin"></text>
					</view>
					<view class="method-info">
						<text class="method-name">{{ $t('contact.wechatContact') }}</text>
						<text class="method-desc">{{ $t('contact.wechatDesc') }}</text>
					</view>
					<view class="method-arrow">
						<text class="yticon icon-you"></text>
					</view>
				</view>
				
				<view class="method-item" @click="openWhatsApp">
					<view class="method-icon whatsapp">
						<text class="yticon icon-message"></text>
					</view>
					<view class="method-info">
						<text class="method-name">{{ $t('contact.whatsappContact') }}</text>
						<text class="method-desc">{{ $t('contact.whatsappDesc') }}</text>
					</view>
					<view class="method-arrow">
						<text class="yticon icon-you"></text>
					</view>
				</view>
				
				<view class="method-item" @click="copyEmail">
					<view class="method-icon email">
						<text class="yticon icon-youjian"></text>
					</view>
					<view class="method-info">
						<text class="method-name">{{ $t('contact.emailContact') }}</text>
						<text class="method-desc">service@mall.com</text>
					</view>
					<view class="method-arrow">
						<text class="yticon icon-you"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getServiceQrcode } from '@/api/service.js';
	import { setPageTitle } from '@/utils/pageTitleUtil.js';
	
	export default {
		data() {
			return {
				qrcodeUrl: '',
				loading: true
			};
		},
		onLoad() {
			setPageTitle('pageTitle.contact');
			this.loadQrcode();
		},
		methods: {
			async loadQrcode() {
				try {
					const response = await getServiceQrcode();
					if (response.code === 200 && response.data) {
						this.qrcodeUrl = response.data;
					}
				} catch (error) {
					console.error('获取客服二维码失败:', error);
				} finally {
					this.loading = false;
				}
			},
			
			handleImageError() {
				this.qrcodeUrl = '';
			},
			
			openWechat() {
				// 显示二维码提示
				uni.showToast({
					title: this.$t('contact.scanWechatQrcode'),
					icon: 'none',
					duration: 2000
				});
			},
			
			openWhatsApp() {
				const phoneNumber = '8618888888888'; // WhatsApp号码,需要替换为实际号码
				const url = `https://wa.me/${phoneNumber}`;
				// #ifdef H5
				window.open(url, '_blank');
				// #endif
				// #ifndef H5
				uni.showModal({
					title: this.$t('contact.whatsappContact'),
					content: `+${phoneNumber}`,
					showCancel: false
				});
				// #endif
			},
			
			copyEmail() {
				const email = 'service@mall.com';
				uni.setClipboardData({
					data: email,
					success: () => {
						uni.showToast({
							title: this.$t('contact.emailCopied'),
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
			font-weight: bold;
			color: #333;
		}
	}
	
	.content {
		padding: 30upx;
	}
	
	.qrcode-section {
		background: #fff;
		border-radius: 15upx;
		padding: 40upx;
		margin-bottom: 20upx;
		text-align: center;
		
		.section-title {
			font-size: 32upx;
			font-weight: bold;
			color: #333;
			margin-bottom: 10upx;
			display: block;
		}
		
		.section-desc {
			font-size: 28upx;
			color: #666;
			margin-bottom: 30upx;
			display: block;
		}
		
		.qrcode-container {
			display: flex;
			justify-content: center;
			margin-bottom: 30upx;
			
			.qrcode-image {
				width: 400upx;
				height: 400upx;
				border: 1upx solid #e5e5e5;
				border-radius: 10upx;
			}
			
			.qrcode-placeholder {
				width: 400upx;
				height: 400upx;
				border: 2upx dashed #ddd;
				border-radius: 10upx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #f9f9f9;
				
				.placeholder-text {
					font-size: 28upx;
					color: #999;
				}
			}
		}
		
		.qrcode-tip {
			font-size: 24upx;
			color: #999;
			display: block;
		}
	}
	
	.contact-methods {
		background: #fff;
		border-radius: 15upx;
		padding: 30upx;
		
		.section-title {
			font-size: 32upx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20upx;
			display: block;
		}
		
		.method-item {
			display: flex;
			align-items: center;
			padding: 20upx 0;
			border-bottom: 1upx solid #f5f5f5;
			
			&:last-child {
				border-bottom: none;
			}
			
			.method-icon {
				width: 80upx;
				height: 80upx;
				border-radius: 50%;
				background: #f0f9ff;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 20upx;
				
				.yticon {
					font-size: 36upx;
					color: #409eff;
				}
				
				&.wechat {
					background: #e8f5e9;
					.yticon {
						color: #07c160;
					}
				}
				
				&.whatsapp {
					background: #e8f5e9;
					.yticon {
						color: #25d366;
					}
				}
				
				&.email {
					background: #fff3e0;
					.yticon {
						color: #ff9800;
					}
				}
			}
			
			.method-info {
				flex: 1;
				
				.method-name {
					font-size: 30upx;
					color: #333;
					margin-bottom: 5upx;
					display: block;
				}
				
				.method-desc {
					font-size: 26upx;
					color: #666;
					display: block;
				}
			}
			
			.method-arrow {
				.yticon {
					font-size: 24upx;
					color: #ccc;
				}
			}
		}
	}
</style>
