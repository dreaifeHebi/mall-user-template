<template>
	<view class="container">
		<view class="forgot-wrapper">
			<!-- 返回按钮 -->
			<view class="back-btn" @click="goBack">
				<text class="yticon icon-zuojiantou"></text>
			</view>
			
			<!-- 标题区域 -->
			<view class="header">
				<view class="title">{{ $t('auth.forgetPassword') }}</view>
				<view class="welcome">{{ $t('auth.resetPassword') }}</view>
			</view>
			
			<!-- 表单区域 -->
			<view class="forgot-form">
				<view class="form-item">
					<input 
						v-model="email"
						type="email"
						:placeholder="$t('auth.resetEmailPlaceholder')"
						class="input"
					/>
				</view>
				
				<view class="form-item">
					<button 
						class="send-btn"
						:class="{ loading: loading, sent: emailSent }"
						@click="handleSendEmail"
						:disabled="loading || emailSent"
					>
						{{ loading ? $t('auth.sending') : emailSent ? $t('auth.emailSent') : $t('auth.sendResetEmail') }}
					</button>
				</view>
			</view>
			
			<!-- 说明文字 -->
			<view class="tips">
				<view class="tip-item">
					<text class="tip-icon">📧</text>
					<text class="tip-text">{{ $t('auth.resetTipEmail') }}</text>
				</view>
				<view class="tip-item">
					<text class="tip-icon">⏰</text>
					<text class="tip-text">{{ $t('auth.resetTipTime') }}</text>
				</view>
				<view class="tip-item">
					<text class="tip-icon">🔒</text>
					<text class="tip-text">{{ $t('auth.resetTipSpam') }}</text>
				</view>
			</view>
			
			<view class="login-section">
				{{ $t('auth.rememberPassword') }}
				<text class="login-link" @click="goToLogin">{{ $t('auth.backToLogin') }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import { sendResetPasswordEmail } from '@/api/member.js'
import { setPageTitle } from '@/utils/pageTitleUtil.js'

export default {
	name: 'ForgotPasswordPage',
	data() {
		return {
			loading: false,
			email: '',
			emailSent: false
		}
	},
	onLoad() {
		setPageTitle('pageTitle.forgotPassword');
	},
	methods: {
		// 发送重置密码邮件
		async handleSendEmail() {
			// 验证邮箱
			if (!this.email) {
				uni.showToast({
					title: this.$t('auth.emailRequired'),
					icon: 'none'
				});
				return;
			}
			
			// 验证邮箱格式
			const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailReg.test(this.email)) {
				uni.showToast({
					title: this.$t('auth.emailInvalid'),
					icon: 'none'
				});
				return;
			}
			
			try {
				this.loading = true;
				
				// 调用发送重置密码邮件API
				const response = await sendResetPasswordEmail({
					email: this.email
				});
				
				if (response.code === 200) {
					this.emailSent = true;
					uni.showModal({
						title: this.$t('auth.emailSent'),
						content: this.$t('auth.resetEmailSuccess'),
						showCancel: false,
						confirmText: this.$t('common.confirm'),
						success: () => {
							// 可以选择返回登录页面或保持在当前页面
							uni.navigateBack();
						}
					});
				}
				
			} catch (error) {
				console.error('发送邮件失败:', error);
				uni.showToast({
					title: error.message || this.$t('error.networkError'),
					icon: 'none',
					duration: 2000
				});
			} finally {
				this.loading = false;
			}
		},
		
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},
		
		// 去登录页面
		goToLogin() {
			uni.navigateBack();
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40upx;
}

.forgot-wrapper {
	background: #fff;
	border-radius: 32upx;
	padding: 80upx 60upx;
	width: 100%;
	max-width: 800upx;
	position: relative;
	box-shadow: 0 20upx 60upx rgba(0, 0, 0, 0.2);
}

.back-btn {
	position: absolute;
	top: 40upx;
	left: 40upx;
	width: 64upx;
	height: 64upx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: #f5f7fa;
	transition: all 0.3s;
	
	&:active {
		background: #e4e7ed;
		transform: scale(0.95);
	}
	
	.yticon {
		font-size: 32upx;
		color: #666;
	}
}

.header {
	text-align: center;
	margin-bottom: 80upx;
	
	.title {
		font-size: 56upx;
		font-weight: bold;
		color: #667eea;
		margin-bottom: 16upx;
		letter-spacing: 2upx;
	}
	
	.welcome {
		font-size: 32upx;
		color: #666;
	}
}

.forgot-form {
	margin-bottom: 60upx;
	
	.form-item {
		margin-bottom: 48upx;
		
		.input {
			width: 100%;
			height: 96upx;
			border: 2upx solid #e4e7ed;
			border-radius: 16upx;
			padding: 0 32upx;
			font-size: 32upx;
			box-sizing: border-box;
			transition: border-color 0.3s;
			
			&:focus {
				border-color: #667eea;
				outline: none;
			}
			
			&::placeholder {
				color: #c0c4cc;
			}
		}
		
		.send-btn {
			width: 100%;
			height: 96upx;
			background: #667eea;
			color: #fff;
			border: none;
			border-radius: 16upx;
			font-size: 32upx;
			font-weight: 500;
			transition: all 0.3s;
			
			&:active {
				background: #5a6fd8;
				transform: scale(0.98);
			}
			
			&.loading {
				background: #c0c4cc;
			}
			
			&.sent {
				background: #67c23a;
			}
			
			&:disabled {
				transform: none;
			}
		}
	}
}

.tips {
	margin-bottom: 60upx;
	
	.tip-item {
		display: flex;
		align-items: center;
		margin-bottom: 24upx;
		font-size: 28upx;
		color: #666;
		
		.tip-icon {
			margin-right: 16upx;
			font-size: 32upx;
		}
		
		.tip-text {
			flex: 1;
		}
	}
}

.login-section {
	text-align: center;
	font-size: 28upx;
	color: #666;
	
	.login-link {
		color: #667eea;
		font-weight: 500;
		
		&:active {
			opacity: 0.7;
		}
	}
}

/* 响应式设计 */
@media (max-width: 768px) {
	.container {
		padding: 32upx;
	}
	
	.forgot-wrapper {
		padding: 60upx 40upx;
	}
	
	.header {
		margin-bottom: 60upx;
		
		.title {
			font-size: 48upx;
		}
		
		.welcome {
			font-size: 28upx;
		}
	}
}
</style>
