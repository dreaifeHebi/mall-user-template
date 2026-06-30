<template>
	<view class="container">
		<view class="confirm-section">
			<view v-if="loading" class="loading">
				<text class="loading-text">{{ $t('emailVerify.verifying') }}</text>
			</view>
			
			<view v-if="!loading && success" class="success-box">
				<text class="success-icon">✓</text>
				<text class="success-title">{{ $t('emailVerify.verifySuccess') }}</text>
				<text class="success-text">{{ message }}</text>
				<button class="back-btn" @click="goBack">{{ $t('emailVerify.backToProfile') }}</button>
			</view>
			
			<view v-if="!loading && !success" class="error-box">
				<text class="error-icon">✗</text>
				<text class="error-title">{{ $t('emailVerify.verifyFailed') }}</text>
				<text class="error-text">{{ message }}</text>
				<button class="retry-btn" @click="goToEmailVerify">{{ $t('emailVerify.resendEmail') }}</button>
			</view>
		</view>
	</view>
</template>

<script>
import { confirmEmail } from '@/api/member.js'
import { mapActions } from 'vuex'

export default {
	data() {
		return {
			loading: true,
			success: false,
			message: ''
		}
	},
	
	onLoad(options) {
		const { token } = options
		if (token) {
			this.confirmEmailToken(token)
		} else {
			this.loading = false
			this.success = false
			this.message = this.$t('emailVerify.tokenMissing')
		}
	},
	
	methods: {
		...mapActions(['getUserInfo']),
		
		// 确认邮箱令牌
		async confirmEmailToken(token) {
			try {
				const res = await confirmEmail(token)
				if (res.code === 200) {
					this.success = true
					this.message = res.message || this.$t('emailVerify.confirmSuccess')
					
					// 邮箱验证成功后，刷新用户信息
					try {
						await this.getUserInfo();
						
						// 发送全局事件，通知其他页面用户信息已更新
						uni.$emit('userInfoUpdated');
					} catch (error) {
						console.error('刷新用户信息失败:', error);
					}
				} else {
					this.success = false
					this.message = res.message || this.$t('emailVerify.confirmFailed')
				}
			} catch (error) {
				console.error('邮箱确认失败:', error)
				this.success = false
				this.message = this.$t('emailVerify.confirmFailedRetry')
			} finally {
				this.loading = false
			}
		},
		
		// 返回个人中心
		goBack() {
			uni.switchTab({
				url: '/pages/user/user'
			})
		},
		
		// 跳转到邮箱验证页面
		goToEmailVerify() {
			uni.navigateTo({
				url: '/pages/user/emailVerify'
			})
		}
	}
}
</script>

<style scoped>
.container {
	padding: 40rpx;
	background-color: #f5f5f5;
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
}

.confirm-section {
	background: white;
	border-radius: 16rpx;
	padding: 60rpx 40rpx;
	width: 100%;
	max-width: 600rpx;
	text-align: center;
}

.loading {
	padding: 40rpx;
}

.loading-text {
	font-size: 28rpx;
	color: #666;
}

.success-box {
	padding: 40rpx;
}

.success-icon {
	font-size: 120rpx;
	color: #4caf50;
	display: block;
	margin-bottom: 30rpx;
}

.success-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 20rpx;
}

.success-text {
	font-size: 28rpx;
	color: #666;
	line-height: 1.5;
	display: block;
	margin-bottom: 40rpx;
}

.error-box {
	padding: 40rpx;
}

.error-icon {
	font-size: 120rpx;
	color: #f44336;
	display: block;
	margin-bottom: 30rpx;
}

.error-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 20rpx;
}

.error-text {
	font-size: 28rpx;
	color: #666;
	line-height: 1.5;
	display: block;
	margin-bottom: 40rpx;
}

.back-btn,
.retry-btn {
	background: #007aff;
	color: white;
	border: none;
	border-radius: 8rpx;
	padding: 20rpx 40rpx;
	font-size: 28rpx;
	width: 100%;
	margin-top: 20rpx;
}

.retry-btn {
	background: #ff9500;
}
</style>
