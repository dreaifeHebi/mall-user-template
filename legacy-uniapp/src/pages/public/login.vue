<template>
	<view class="container">
		<view class="login-wrapper">
			<!-- 返回按钮 -->
			<view class="back-btn" @click="goBack">
				<text class="yticon icon-zuojiantou"></text>
			</view>
			
			<!-- 标题区域 -->
			<view class="header">
				<view class="title">{{ $t('auth.loginTitle') }}</view>
				<view class="welcome">{{ $t('auth.welcomeBack') }}</view>
			</view>
			
			<!-- 表单区域 -->
			<view class="login-form">
				<view class="form-item">
					<input 
						v-model="loginForm.username"
						:placeholder="$t('auth.usernamePlaceholder')"
						class="input"
						maxlength="20"
					/>
				</view>
				
				<view class="form-item">
					<input 
						v-model="loginForm.password"
						type="password"
						:placeholder="$t('auth.passwordPlaceholder')"
						class="input"
						maxlength="20"
						@confirm="handleLogin"
					/>
				</view>
				
				<view class="form-item">
					<button 
						class="login-btn"
						:class="{ loading: loading }"
						@click="handleLogin"
						:disabled="loading"
					>
						{{ loading ? $t('auth.loggingIn') : $t('auth.loginBtn') }}
					</button>
				</view>
			</view>
			
			<!-- 底部链接 -->
			<view class="footer-links">
				<view class="link" @click="goToForgetPassword">
					{{ $t('auth.forgetPassword') }}
				</view>
			</view>
			
			<view class="register-section">
				{{ $t('auth.noAccount') }}
				<text class="register-link" @click="goToRegister">{{ $t('auth.registerNow') }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import { mapMutations } from 'vuex'
import { memberLogin, memberInfo } from '@/api/member.js'
import { syncLocalCartToServer } from '@/utils/localCartUtil.js'
import { setPageTitle } from '@/utils/pageTitleUtil.js'

export default {
	name: 'LoginPage',
	data() {
		return {
			loading: false,
			loginForm: {
				username: '',
				password: ''
			}
		}
	},
	onLoad() {
		setPageTitle('pageTitle.login');
	},
	methods: {
		...mapMutations(['login']),
		
		// 处理登录
		async handleLogin() {
			// 简单验证
			if (!this.loginForm.username) {
				uni.showToast({
					title: this.$t('auth.usernameRequired'),
					icon: 'none'
				});
				return;
			}
			
			if (!this.loginForm.password) {
				uni.showToast({
					title: this.$t('auth.passwordRequired'),
					icon: 'none'
				});
				return;
			}
			
			if (this.loginForm.username.length < 2 || this.loginForm.username.length > 20) {
				uni.showToast({
					title: this.$t('auth.usernameLength'),
					icon: 'none'
				});
				return;
			}
			
			if (this.loginForm.password.length < 6 || this.loginForm.password.length > 20) {
				uni.showToast({
					title: this.$t('auth.passwordLength'),
					icon: 'none'
				});
				return;
			}
			
			try {
				this.loading = true;
				
				// 调用登录API
				const loginResponse = await memberLogin({
					username: this.loginForm.username,
					password: this.loginForm.password
				});
				
				if (loginResponse.code === 200) {
					// 登录成功，保存token
					uni.setStorageSync('token', loginResponse.data.token);
					
					// 获取用户信息
					const userInfoResponse = await memberInfo();
					if (userInfoResponse.code === 200) {
						// 保存用户信息到store
						this.login(userInfoResponse.data);
						
						// 同步本地购物车到服务器
						const syncResult = await syncLocalCartToServer();
						
						uni.showToast({
							title: this.$t('tips.loginSuccess'),
							icon: 'success'
						});
						
						// 检查是否有指定的重定向页面
						const redirectUrl = uni.getStorageSync('loginRedirect');
						
						// 延迟跳转
						setTimeout(() => {
							if (redirectUrl) {
								// 清除重定向标记
								uni.removeStorageSync('loginRedirect');
								// 跳转到指定页面
								if (redirectUrl.startsWith('/pages/cart/cart')) {
									uni.switchTab({
										url: '/pages/cart/cart'
									});
								} else {
									uni.navigateTo({
										url: redirectUrl
									});
								}
							} else {
								// 默认跳转到商城首页
								uni.switchTab({
									url: '/pages/index/index'
								});
							}
						}, 1500);
					}
				}
				
			} catch (error) {
				console.error('登录失败:', error);
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
		
		// 去注册页面
		goToRegister() {
			uni.navigateTo({
				url: '/pages/public/register'
			});
		},
		
		// 去忘记密码页面
		goToForgetPassword() {
			uni.navigateTo({
				url: '/pages/public/forgot-password'
			});
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

.login-wrapper {
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
		letter-spacing: 4upx;
	}
	
	.welcome {
		font-size: 32upx;
		color: #666;
	}
}

.login-form {
	margin-bottom: 40upx;
	
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
		
		.login-btn {
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
			
			&:disabled {
				background: #c0c4cc;
				transform: none;
			}
		}
	}
}

.footer-links {
	text-align: center;
	margin-bottom: 60upx;
	
	.link {
		color: #667eea;
		font-size: 28upx;
		
		&:active {
			opacity: 0.7;
		}
	}
}

.register-section {
	text-align: center;
	font-size: 28upx;
	color: #666;
	
	.register-link {
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
	
	.login-wrapper {
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
