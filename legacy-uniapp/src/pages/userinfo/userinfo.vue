<template>
	<view class="container userinfo-page profile-theme-page">
		<view class="profile-theme-backdrop">
			<image class="profile-theme-backdrop__image" src="/static/profile-theme-bg.png" mode="aspectFill"></image>
			<view class="profile-theme-backdrop__wash"></view>
			<view class="profile-theme-backdrop__grain"></view>
		</view>
		<view class="userinfo-shell profile-theme-content">
		<view class="user-section">
			<view class="portrait-box">
				<image class="portrait" :src="userInfo.icon || '/static/missing-face.png'"></image>
			</view>
		</view>
		
		<view class="user-info-section">
			<view class="info-item">
				<text class="label">{{ $t('user.username') }}</text>
				<text class="value">{{ userInfo.username || $t('user.notSet') }}</text>
			</view>
			
			<view class="info-item" @click="showEditNickname">
				<text class="label">{{ $t('user.nickname') }}</text>
				<text class="value">{{ userInfo.nickname || $t('user.notSet') }}</text>
				<text class="arrow">›</text>
			</view>
			
			<view class="info-item" @click="showEditPhone">
				<text class="label">{{ $t('user.phone') }}</text>
				<text class="value">{{ userInfo.phone ? formatPhone(userInfo.phone) : $t('user.notSet') }}</text>
				<text class="arrow">›</text>
			</view>
			
			<view class="info-item">
				<text class="label">{{ $t('user.email') }}</text>
				<view class="email-info">
					<text class="value">{{ userInfo.email || $t('user.notSet') }}</text>
					<view v-if="userInfo.email" class="email-actions">
						<text class="email-status" :class="emailVerificationStatus === 1 ? 'verified' : 'unverified'">
							{{ emailVerificationStatus === 1 ? $t('user.verified') : $t('user.unverified') }}
						</text>
						<button v-if="shouldShowVerifyButton" class="verify-btn-small" @click="sendVerificationEmail" :disabled="sendingEmail">
							{{ sendingEmail ? $t('user.sending') : $t('user.verify') }}
						</button>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 编辑昵称弹窗 -->
		<view v-if="showNicknameModal" class="modal-overlay" @click="closeNicknameModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">{{ $t('userinfo.editNickname') }}</text>
				</view>
				<view class="modal-body">
					<input 
						class="modal-input" 
						v-model="editNickname" 
						:placeholder="$t('userinfo.enterNickname')"
						maxlength="50"
					/>
				</view>
				<view class="modal-footer">
					<button class="modal-btn cancel-btn" @click="closeNicknameModal">{{ $t('common.cancel') }}</button>
					<button class="modal-btn confirm-btn" @click="updateNickname" :disabled="updating">
						{{ updating ? $t('common.updating') : $t('common.update') }}
					</button>
				</view>
			</view>
		</view>
		
		<!-- 编辑电话弹窗 -->
		<view v-if="showPhoneModal" class="modal-overlay" @click="closePhoneModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">{{ $t('userinfo.editPhone') }}</text>
				</view>
				<view class="modal-body">
					<view class="phone-input-group">
						<view class="phone-prefix">+</view>
						<input 
							class="phone-code-input" 
							v-model="editPhoneCode" 
							type="number"
							:placeholder="$t('userinfo.countryCode')"
							maxlength="4"
						/>
						<view class="phone-separator">-</view>
						<input 
							class="phone-number-input" 
							v-model="editPhoneNumber" 
							type="number"
							:placeholder="$t('userinfo.phoneNumber')"
							maxlength="15"
						/>
					</view>
				</view>
				<view class="modal-footer">
					<button class="modal-btn cancel-btn" @click="closePhoneModal">{{ $t('common.cancel') }}</button>
					<button class="modal-btn confirm-btn" @click="updatePhone" :disabled="updating">
						{{ updating ? $t('common.updating') : $t('common.update') }}
					</button>
				</view>
			</view>
		</view>
		</view>
	</view>
</template>

<script>
	import {  
	    mapState,  
	    mapActions  
	} from 'vuex';
	import { sendEmailVerification, updateMemberInfo } from '@/api/member.js';
	import { setPageTitle } from '@/utils/pageTitleUtil.js';
	
	export default {
		onLoad() {
			setPageTitle('pageTitle.personalInfo');
		},
		data() {
			return {
				sendingEmail: false,
				refreshTimer: null, // 定时刷新器
				showNicknameModal: false,
				showPhoneModal: false,
				editNickname: '',
				editPhoneCode: '86',
				editPhoneNumber: '',
				updating: false
			};
		},
		computed:{
			...mapState(['userInfo']),
			// 计算邮箱验证状态，如果字段不存在则默认为未验证
			emailVerificationStatus() {
				// 如果 emailVerified 字段不存在，默认为 0（未验证）
				return this.userInfo.emailVerified !== undefined ? this.userInfo.emailVerified : 0;
			},
			// 计算是否应该显示验证按钮
			shouldShowVerifyButton() {
				return this.userInfo.email && this.emailVerificationStatus === 0;
			}
		},
		onShow() {
			// 确保每次显示页面时都刷新用户信息
			this.refreshUserInfo();
			// 开始定时刷新
			this.startAutoRefresh();
		},
		onHide() {
			// 页面隐藏时停止定时刷新
			this.stopAutoRefresh();
		},
		onUnload() {
			// 页面卸载时停止定时刷新
			this.stopAutoRefresh();
		},
		methods: {
			...mapActions(['getUserInfo']),
			
			// 刷新用户信息
			async refreshUserInfo() {
				const result = await this.getUserInfo();
				if (!result.success) {
					console.error('刷新用户信息失败:', result.message);
				}
			},
			
			// 开始自动刷新
			startAutoRefresh() {
				// 先清除之前的定时器
				this.stopAutoRefresh();
				
				// 每30秒刷新一次用户信息
				this.refreshTimer = setInterval(async () => {
					await this.refreshUserInfo();
				}, 30000); // 30秒
			},
			
			// 停止自动刷新
			stopAutoRefresh() {
				if (this.refreshTimer) {
					clearInterval(this.refreshTimer);
					this.refreshTimer = null;
				}
			},
			
			formatPhone(phone) {
				if (!phone) return '未设置';
				
				// 如果手机号已经包含区号（以+开头）
				if (phone.startsWith('+')) {
					return phone;
				}
				
				// 如果是中国大陆手机号（11位数字）
				if (/^1[3-9]\d{9}$/.test(phone)) {
					return `+86 ${phone}`;
				}
				
				// 其他情况默认添加+86
				return `+86 ${phone}`;
			},
			
			// 发送验证邮件
			async sendVerificationEmail() {
				if (!this.userInfo.email) {
					uni.showToast({
						title: this.$t('userinfo.emailRequired'),
						icon: 'none'
					});
					return;
				}
				
				this.sendingEmail = true;
				
				try {
					const res = await sendEmailVerification(this.userInfo.email);
					if (res.code === 200) {
						uni.showToast({
							title: this.$t('emailVerify.emailSent'),
							icon: 'success',
							duration: 3000
						});
						
						// 发送成功后，定期检查验证状态
						this.startCheckingVerificationStatus();
					} else {
						uni.showToast({
							title: res.message || this.$t('emailVerify.sendFailed'),
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('发送验证邮件失败:', error);
					uni.showToast({
						title: this.$t('emailVerify.sendFailedRetry'),
						icon: 'none'
					});
				} finally {
					this.sendingEmail = false;
				}
			},
			
			// 开始检查验证状态
			startCheckingVerificationStatus() {
				// 每30秒检查一次验证状态，最多检查10次（5分钟）
				let checkCount = 0;
				const maxChecks = 10;
				
				const checkInterval = setInterval(async () => {
					checkCount++;
					
					try {
						await this.refreshUserInfo();
						
						// 如果已验证或者检查次数超限，停止检查
						if (this.emailVerificationStatus === 1 || checkCount >= maxChecks) {
							clearInterval(checkInterval);
							
							if (this.emailVerificationStatus === 1) {
								uni.showToast({
									title: this.$t('emailVerify.verifySuccess'),
									icon: 'success'
								});
							}
						}
					} catch (error) {
						console.error('检查验证状态失败:', error);
						// 出错时也停止检查
						if (checkCount >= maxChecks) {
							clearInterval(checkInterval);
						}
					}
				}, 30000); // 30秒检查一次
			},
			
			// 显示编辑昵称弹窗
			showEditNickname() {
				this.editNickname = this.userInfo.nickname || '';
				this.showNicknameModal = true;
			},
			
			// 关闭编辑昵称弹窗
			closeNicknameModal() {
				this.showNicknameModal = false;
				this.editNickname = '';
			},
			
			// 更新昵称
			async updateNickname() {
				if (!this.editNickname.trim()) {
					uni.showToast({
						title: this.$t('userinfo.nicknameRequired'),
						icon: 'none'
					});
					return;
				}
				
				this.updating = true;
				try {
					const res = await updateMemberInfo({
						nickname: this.editNickname.trim()
					});
					
					if (res.code === 200) {
						uni.showToast({
							title: this.$t('userinfo.updateSuccess'),
							icon: 'success'
						});
						
						// 刷新用户信息
						await this.refreshUserInfo();
						this.closeNicknameModal();
					} else {
						uni.showToast({
							title: res.message || this.$t('userinfo.updateFailed'),
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('更新昵称失败:', error);
					uni.showToast({
						title: this.$t('userinfo.updateFailed'),
						icon: 'none'
					});
				} finally {
					this.updating = false;
				}
			},
			
			// 显示编辑电话弹窗
			showEditPhone() {
				// 解析当前电话号码
				if (this.userInfo.phone) {
					const phone = this.userInfo.phone;
					// 匹配 +86-11111111111 格式
					const match = phone.match(/^\+(\d+)-(\d+)$/);
					if (match) {
						this.editPhoneCode = match[1];
						this.editPhoneNumber = match[2];
					} else {
						// 如果不是标准格式，尝试直接解析
						if (phone.startsWith('+')) {
							const parts = phone.substring(1).split('-');
							if (parts.length === 2) {
								this.editPhoneCode = parts[0];
								this.editPhoneNumber = parts[1];
							} else {
								// 默认值
								this.editPhoneCode = '86';
								this.editPhoneNumber = '';
							}
						} else {
							this.editPhoneCode = '86';
							this.editPhoneNumber = phone;
						}
					}
				} else {
					this.editPhoneCode = '86';
					this.editPhoneNumber = '';
				}
				
				this.showPhoneModal = true;
			},
			
			// 关闭编辑电话弹窗
			closePhoneModal() {
				this.showPhoneModal = false;
				this.editPhoneCode = '86';
				this.editPhoneNumber = '';
			},
			
			// 更新电话
			async updatePhone() {
				if (!this.editPhoneCode.trim() || !this.editPhoneNumber.trim()) {
					uni.showToast({
						title: this.$t('userinfo.phoneRequired'),
						icon: 'none'
					});
					return;
				}
				
				// 验证区号和号码都是数字
				if (!/^\d+$/.test(this.editPhoneCode) || !/^\d+$/.test(this.editPhoneNumber)) {
					uni.showToast({
						title: this.$t('userinfo.phoneFormatError'),
						icon: 'none'
					});
					return;
				}
				
				this.updating = true;
				try {
					const phone = `+${this.editPhoneCode}-${this.editPhoneNumber}`;
					const res = await updateMemberInfo({
						phone: phone
					});
					
					if (res.code === 200) {
						uni.showToast({
							title: this.$t('userinfo.updateSuccess'),
							icon: 'success'
						});
						
						// 刷新用户信息
						await this.refreshUserInfo();
						this.closePhoneModal();
					} else {
						uni.showToast({
							title: res.message || this.$t('userinfo.updateFailed'),
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('更新电话失败:', error);
					uni.showToast({
						title: this.$t('userinfo.updateFailed'),
						icon: 'none'
					});
				} finally {
					this.updating = false;
				}
			}
		}
	}
</script>

<style lang="scss">
@import '@/styles/profile-theme.scss';

	page{
		background: $page-color-base;
	}
	
	.container {
		min-height: 100vh;
	}
	
	.user-section{
		display:flex;
		align-items:center;
		justify-content: center;
		height: 460upx;
		padding: 40upx 30upx 0;
		.portrait-box{
			width: 200upx;
			height: 200upx;
			border:6upx solid #fff;
			border-radius: 50%;
			position:relative;
			z-index: 2;
			overflow: hidden;
		}
		.portrait{
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}
	
	.user-info-section {
		background: #fff;
		margin: 20upx 30upx;
		border-radius: 20upx;
		overflow: hidden;
		box-shadow: 0 4upx 12upx rgba(0, 0, 0, 0.05);
		
		.info-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 40upx 30upx;
			border-bottom: 1upx solid #f5f5f5;
			transition: background-color 0.2s;
			
			&:last-child {
				border-bottom: none;
			}
			
			&:active {
				background-color: #f8f9fa;
			}
			
			.label {
				font-size: 32upx;
				color: #333;
				font-weight: 500;
				min-width: 120upx;
			}
			
			.arrow {
				font-size: 40upx;
				color: #ccc;
				margin-left: 10upx;
			}
			
			.value {
				font-size: 32upx;
				color: #666;
				flex: 1;
				text-align: right;
				margin-left: 20upx;
				word-break: break-all;
				
				&:empty::after {
					content: '未设置';
					color: #ccc;
				}
			}
			
			.email-info {
				display: flex;
				align-items: center;
				flex: 1;
				justify-content: space-between;
				
				.email-actions {
					display: flex;
					align-items: center;
					gap: 20upx;
				}
				
				.email-status {
					font-size: 24upx;
					padding: 4upx 12upx;
					border-radius: 8upx;
					
					&.verified {
						background: #e8f5e8;
						color: #52c41a;
					}
					
					&.unverified {
						background: #fff2e8;
						color: #fa8c16;
					}
				}
				
				.verify-btn-small {
					background: linear-gradient(135deg, #007aff, #5ac8fa);
					color: white;
					border: none;
					border-radius: 12upx;
					padding: 12upx 20upx;
					font-size: 24upx;
					min-width: 100upx;
					text-align: center;
					box-shadow: 0 2upx 8upx rgba(0, 122, 255, 0.3);
					transition: all 0.3s ease;
					
					&:active {
						transform: scale(0.95);
						box-shadow: 0 1upx 4upx rgba(0, 122, 255, 0.5);
					}
					
					&:disabled {
						background: #e0e0e0;
						color: #999;
						box-shadow: none;
						transform: none;
					}
				}
			}
		}
	}
	
	/* 弹窗样式 */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
	}
	
	.modal-content {
		background: white;
		border-radius: 20upx;
		width: 600upx;
		max-width: 90%;
		overflow: hidden;
		box-shadow: 0 8upx 24upx rgba(0, 0, 0, 0.15);
	}
	
	.modal-header {
		padding: 40upx 30upx 30upx;
		border-bottom: 1upx solid #f5f5f5;
		
		.modal-title {
			font-size: 36upx;
			font-weight: 600;
			color: #333;
		}
	}
	
	.modal-body {
		padding: 40upx 30upx;
		
		.modal-input {
			width: 100%;
			height: 80upx;
			border: 2upx solid #e0e0e0;
			border-radius: 12upx;
			padding: 0 20upx;
			font-size: 32upx;
			color: #333;
			box-sizing: border-box;
			
			&:focus {
				border-color: #007aff;
			}
		}
		
		.phone-input-group {
			display: flex;
			align-items: center;
			border: 2upx solid #e0e0e0;
			border-radius: 12upx;
			padding: 0 20upx;
			height: 80upx;
			
			&:focus-within {
				border-color: #007aff;
			}
			
			.phone-prefix {
				font-size: 32upx;
				color: #333;
				margin-right: 5upx;
			}
			
			.phone-code-input {
				width: 100upx;
				font-size: 32upx;
				color: #333;
			}
			
			.phone-separator {
				font-size: 32upx;
				color: #333;
				margin: 0 10upx;
			}
			
			.phone-number-input {
				flex: 1;
				font-size: 32upx;
				color: #333;
			}
		}
	}
	
	.modal-footer {
		display: flex;
		border-top: 1upx solid #f5f5f5;
		
		.modal-btn {
			flex: 1;
			height: 100upx;
			border: none;
			font-size: 32upx;
			background: white;
			
			&.cancel-btn {
				color: #666;
				border-right: 1upx solid #f5f5f5;
				
				&:active {
					background: #f8f9fa;
				}
			}
			
			&.confirm-btn {
				color: #007aff;
				font-weight: 600;
				
				&:active {
					background: #f0f7ff;
				}
				
				&:disabled {
					color: #ccc;
				}
			}
		}
	}

	page,
	.userinfo-page {
		background: #16060a;
	}

	.userinfo-shell {
		min-height: 100vh;
		padding-bottom: calc(40upx + env(safe-area-inset-bottom));
	}

	.userinfo-page .user-info-section {
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.26), rgba(255, 255, 255, 0.08));
		border: 1upx solid rgba(255, 255, 255, 0.14);
		box-shadow: 0 18upx 40upx rgba(16, 4, 6, 0.24);
		backdrop-filter: blur(18px);
		-webkit-backdrop-filter: blur(18px);
	}

	.userinfo-page .user-info-section .info-item {
		border-bottom-color: rgba(255, 255, 255, 0.1);
	}

	.userinfo-page .user-info-section .label,
	.userinfo-page .user-info-section .value,
	.userinfo-page .modal-title,
	.userinfo-page .modal-input,
	.userinfo-page .phone-prefix,
	.userinfo-page .phone-code-input,
	.userinfo-page .phone-separator,
	.userinfo-page .phone-number-input {
		color: #fff8ee;
	}

	.userinfo-page .user-info-section .arrow,
	.userinfo-page .verify-btn-small {
		color: #fff4df;
	}

	.userinfo-page .user-info-section .email-status.verified {
		background: rgba(106, 199, 134, 0.18);
		color: #9ff0ba;
	}

	.userinfo-page .user-info-section .email-status.unverified {
		background: rgba(255, 185, 108, 0.18);
		color: #ffd086;
	}

	.userinfo-page .verify-btn-small {
		background: linear-gradient(135deg, rgba(255, 204, 109, 0.92), rgba(255, 138, 61, 0.9));
		color: #3b1202;
		box-shadow: 0 12upx 24upx rgba(255, 129, 0, 0.28);
	}

	.userinfo-page .modal-overlay {
		background: rgba(10, 4, 8, 0.64);
	}

	.userinfo-page .modal-content {
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.1));
		border: 1upx solid rgba(255, 255, 255, 0.16);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}

	.userinfo-page .modal-header,
	.userinfo-page .modal-footer {
		border-color: rgba(255, 255, 255, 0.1);
	}

	.userinfo-page .modal-body .modal-input,
	.userinfo-page .modal-body .phone-input-group {
		border-color: rgba(255, 255, 255, 0.16);
		background: rgba(255, 255, 255, 0.08);
	}

	.userinfo-page .modal-btn {
		background: transparent;
	}

	.userinfo-page .modal-btn.cancel-btn {
		color: rgba(255, 245, 228, 0.68);
		border-right-color: rgba(255, 255, 255, 0.1);
	}

	.userinfo-page .modal-btn.confirm-btn {
		color: #ffbf70;
	}
</style>
