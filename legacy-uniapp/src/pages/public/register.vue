<template>
	<view class="container">
		<view class="register-wrapper">
			<!-- 返回按钮 -->
			<view class="back-btn" @click="goBack">
				<text class="yticon icon-zuojiantou"></text>
			</view>
			
			<!-- 标题区域 -->
			<view class="header">
				<view class="title">{{ $t('auth.registerTitle') }}</view>
				<view class="welcome">{{ $t('auth.createAccount') }}</view>
			</view>
			
			<!-- 表单区域 -->
			<view class="register-form">
				<view class="form-item">
					<input 
						v-model="registerForm.username"
						:placeholder="$t('auth.usernamePlaceholder')"
						class="input"
						maxlength="20"
					/>
				</view>
				
				<view class="form-item">
					<input 
						v-model="registerForm.email"
						type="email"
						:placeholder="$t('auth.emailPlaceholder')"
						class="input"
					/>
				</view>
				
				<view class="form-item">
					<input 
						v-model="registerForm.telephone"
						type="number"
						:placeholder="$t('auth.phonePlaceholder')"
						class="input"
						maxlength="11"
					/>
				</view>
				
				<view class="form-item">
					<input 
						v-model="registerForm.password"
						type="password"
						:placeholder="$t('auth.passwordPlaceholder')"
						class="input"
						maxlength="20"
					/>
				</view>
				
				<view class="form-item">
					<input 
						v-model="confirmPassword"
						type="password"
						:placeholder="$t('auth.confirmPasswordPlaceholder')"
						class="input"
						maxlength="20"
						@confirm="handleRegister"
					/>
				</view>
				
				<view class="form-item">
					<button 
						class="register-btn"
						:class="{ loading: loading }"
						@click="handleRegister"
						:disabled="loading"
					>
						{{ loading ? $t('auth.registering') : $t('auth.registerBtn') }}
					</button>
				</view>
			</view>
			
			<view class="login-section">
				{{ $t('auth.hasAccount') }}
				<text class="login-link" @click="goToLogin">{{ $t('auth.loginNow') }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import { memberRegister } from '@/api/member.js'
import { setPageTitle } from '@/utils/pageTitleUtil.js'

export default {
	name: 'RegisterPage',
	data() {
		return {
			loading: false,
			registerForm: {
				username: '',
				email: '',
				telephone: '',
				password: ''
			},
			confirmPassword: ''
		}
	},
	onLoad() {
		setPageTitle('pageTitle.register');
	},
	methods: {
		// 处理注册
		async handleRegister() {
			// 验证必填字段
			if (!this.registerForm.username) {
				uni.showToast({
					title: this.$t('auth.usernameRequired'),
					icon: 'none'
				});
				return;
			}
			
			if (!this.registerForm.email) {
				uni.showToast({
					title: this.$t('auth.emailRequired'),
					icon: 'none'
				});
				return;
			}
			
			if (!this.registerForm.password) {
				uni.showToast({
					title: this.$t('auth.passwordRequired'),
					icon: 'none'
				});
				return;
			}
			
			if (!this.confirmPassword) {
				uni.showToast({
					title: this.$t('auth.confirmPasswordRequired'),
					icon: 'none'
				});
				return;
			}
			
			// 验证字段格式
			if (this.registerForm.username.length < 2 || this.registerForm.username.length > 20) {
				uni.showToast({
					title: this.$t('auth.usernameLength'),
					icon: 'none'
				});
				return;
			}
			
			// 验证邮箱格式
			const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailReg.test(this.registerForm.email)) {
				uni.showToast({
					title: this.$t('auth.emailInvalid'),
					icon: 'none'
				});
				return;
			}
			
			// 验证手机号格式（如果有输入）
			if (this.registerForm.telephone && this.registerForm.telephone.length > 0) {
				const phoneReg = /^1[3-9]\d{9}$/;
				if (!phoneReg.test(this.registerForm.telephone)) {
					uni.showToast({
						title: this.$t('auth.phoneInvalid'),
						icon: 'none'
					});
					return;
				}
			}
			
			if (this.registerForm.password.length < 6 || this.registerForm.password.length > 20) {
				uni.showToast({
					title: this.$t('auth.passwordLength'),
					icon: 'none'
				});
				return;
			}
			
			if (this.registerForm.password !== this.confirmPassword) {
				uni.showToast({
					title: this.$t('auth.passwordMismatch'),
					icon: 'none'
				});
				return;
			}
			
			try {
				this.loading = true;
				
				// 构建注册数据
				const registerData = {
					username: this.registerForm.username,
					password: this.registerForm.password,
					email: this.registerForm.email
				};
				
				// 手机号是可选的
				if (this.registerForm.telephone && this.registerForm.telephone.length > 0) {
					registerData.telephone = this.registerForm.telephone;
				}
				
				// 调用注册API
				const response = await memberRegister(registerData);
				
				if (response.code === 200) {
					uni.showToast({
						title: this.$t('tips.registerSuccess'),
						icon: 'success'
					});
					
					// 延迟跳转到登录页面
					setTimeout(() => {
						// 直接跳转到登录页面，而不是返回上一页
						uni.redirectTo({
							url: '/pages/public/login'
						});
					}, 1500);
				}
				
			} catch (error) {
				console.error('注册失败:', error);
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
			// 使用 redirectTo 替换当前页面，避免用户通过返回键回到注册页面
			uni.redirectTo({
				url: '/pages/public/login'
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

.register-wrapper {
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

.register-form {
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
		
		.register-btn {
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
	
	.register-wrapper {
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
