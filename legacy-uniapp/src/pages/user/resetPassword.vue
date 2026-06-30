<template>
	<view class="container">
		<view class="header">
			<view class="title">重置密码</view>
			<view class="subtitle">请设置您的新密码</view>
		</view>
		
		<view class="form-section">
			<view class="form-item">
				<view class="label">新密码</view>
				<input 
					class="input" 
					type="password" 
					v-model="newPassword" 
					placeholder="请输入新密码（6-20位）"
					maxlength="20"
				/>
			</view>
			
			<view class="form-item">
				<view class="label">确认密码</view>
				<input 
					class="input" 
					type="password" 
					v-model="confirmPassword" 
					placeholder="请再次输入新密码"
					maxlength="20"
				/>
			</view>
			
			<view class="password-tips">
				<text>密码要求：</text>
				<text>• 长度6-20位</text>
				<text>• 建议包含字母、数字或特殊字符</text>
			</view>
			
			<button 
				class="reset-btn" 
				@click="handleResetPassword"
				:disabled="!canSubmit || isSubmitting"
			>
				{{ isSubmitting ? '重置中...' : '重置密码' }}
			</button>
		</view>
		
		<view class="footer">
			<text class="tip">重置成功后请重新登录</text>
		</view>
	</view>
</template>

<script>
	import { confirmResetPassword } from '@/api/member.js';
	
	export default {
		data() {
			return {
				token: '',
				newPassword: '',
				confirmPassword: '',
				isSubmitting: false
			};
		},
		computed: {
			// 检查是否可以提交
			canSubmit() {
				return this.newPassword.length >= 6 && 
					   this.confirmPassword.length >= 6 && 
					   this.newPassword === this.confirmPassword;
			}
		},
		onLoad(options) {
			// 从URL参数中获取token
			if (options.token) {
				this.token = options.token;
			} else {
				// 如果没有token，显示错误并返回
				uni.showModal({
					title: '错误',
					content: '缺少重置令牌，请重新发起密码重置请求',
					showCancel: false,
					confirmText: '确定',
					success: () => {
						uni.navigateBack();
					}
				});
			}
		},
		methods: {
			// 验证密码格式
			validatePassword(password) {
				if (password.length < 6 || password.length > 20) {
					return '密码长度必须在6-20位之间';
				}
				return null;
			},
			
			// 处理密码重置
			async handleResetPassword() {
				// 基本验证
				if (!this.token) {
					uni.showToast({
						title: '重置令牌无效',
						icon: 'none'
					});
					return;
				}
				
				// 验证新密码
				const passwordError = this.validatePassword(this.newPassword);
				if (passwordError) {
					uni.showToast({
						title: passwordError,
						icon: 'none'
					});
					return;
				}
				
				// 验证密码一致性
				if (this.newPassword !== this.confirmPassword) {
					uni.showToast({
						title: '两次输入的密码不一致',
						icon: 'none'
					});
					return;
				}
				
				this.isSubmitting = true;
				
				try {
					const res = await confirmResetPassword({
						token: this.token,
						newPassword: this.newPassword
					});
					
					if (res.code === 200) {
						uni.showModal({
							title: '成功',
							content: '密码重置成功！请使用新密码登录',
							showCancel: false,
							confirmText: '去登录',
							success: () => {
								// 跳转到登录页面
								uni.reLaunch({
									url: '/pages/public/login'
								});
							}
						});
					} else {
						uni.showToast({
							title: res.message || '重置失败',
							icon: 'none',
							duration: 3000
						});
					}
				} catch (error) {
					console.error('密码重置失败:', error);
					
					let errorMessage = '重置失败，请稍后重试';
					
					// 根据错误类型显示不同的提示
					if (error.message && error.message.includes('token')) {
						errorMessage = '重置链接已过期或无效，请重新发起密码重置请求';
					} else if (error.message && error.message.includes('password')) {
						errorMessage = '密码格式不符合要求';
					}
					
					uni.showToast({
						title: errorMessage,
						icon: 'none',
						duration: 3000
					});
				} finally {
					this.isSubmitting = false;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}
	
	.container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		padding: 60upx 40upx;
	}
	
	.header {
		text-align: center;
		margin-bottom: 80upx;
		
		.title {
			font-size: 48upx;
			font-weight: bold;
			color: #fff;
			margin-bottom: 20upx;
		}
		
		.subtitle {
			font-size: 28upx;
			color: rgba(255, 255, 255, 0.8);
		}
	}
	
	.form-section {
		background: #fff;
		border-radius: 24upx;
		padding: 60upx 40upx;
		box-shadow: 0 8upx 32upx rgba(0, 0, 0, 0.1);
		
		.form-item {
			margin-bottom: 40upx;
			
			.label {
				font-size: 28upx;
				color: #333;
				margin-bottom: 16upx;
				font-weight: 500;
			}
			
			.input {
				width: 100%;
				height: 88upx;
				border: 2upx solid #e0e6ed;
				border-radius: 12upx;
				padding: 0 24upx;
				font-size: 32upx;
				color: #333;
				background: #f8f9fa;
				transition: all 0.3s ease;
				box-sizing: border-box;
				
				&:focus {
					border-color: #667eea;
					background: #fff;
					box-shadow: 0 0 0 6upx rgba(102, 126, 234, 0.1);
				}
				
				&::placeholder {
					color: #999;
				}
			}
		}
		
		.password-tips {
			background: #f0f7ff;
			border: 1upx solid #d6e4ff;
			border-radius: 12upx;
			padding: 24upx;
			margin-bottom: 40upx;
			
			text {
				display: block;
				font-size: 24upx;
				color: #1890ff;
				line-height: 1.6;
				
				&:first-child {
					font-weight: 500;
					margin-bottom: 8upx;
				}
			}
		}
		
		.reset-btn {
			width: 100%;
			height: 88upx;
			background: linear-gradient(135deg, #667eea, #764ba2);
			color: #fff;
			border: none;
			border-radius: 12upx;
			font-size: 32upx;
			font-weight: 500;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all 0.3s ease;
			box-shadow: 0 4upx 16upx rgba(102, 126, 234, 0.3);
			
			&:active {
				transform: translateY(2upx);
				box-shadow: 0 2upx 8upx rgba(102, 126, 234, 0.5);
			}
			
			&:disabled {
				background: #e0e0e0;
				color: #999;
				box-shadow: none;
				transform: none;
			}
		}
	}
	
	.footer {
		margin-top: 60upx;
		text-align: center;
		
		.tip {
			font-size: 24upx;
			color: rgba(255, 255, 255, 0.7);
		}
	}
</style>
