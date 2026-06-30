<template>
	<view class="address-manage-page profile-theme-page">
		<view class="profile-theme-backdrop">
			<image class="profile-theme-backdrop__image" src="/static/profile-theme-bg.png" mode="aspectFill"></image>
			<view class="profile-theme-backdrop__wash"></view>
			<view class="profile-theme-backdrop__grain"></view>
		</view>
	<view class="content address-manage-content profile-theme-content">
		<view class="row b-b">
			<text class="tit">{{ $t('address.name') }}</text>
			<input class="input" type="text" v-model="addressData.name" :placeholder="$t('address.namePlaceholder')" placeholder-class="placeholder" />
		</view>
		
		<!-- 国家选择 -->
		<view class="row b-b" @click="showCountryPicker">
			<text class="tit">{{ $t('address.country') }}</text>
			<text class="input country-select">{{localizedSelectedCountry.name || $t('address.selectCountry')}}</text>
			<text class="yticon icon-you"></text>
		</view>
		
		<!-- 电话号码 -->
		<view class="row b-b">
			<text class="tit">{{ $t('address.phone') }}</text>
			<view class="phone-input-group">
				<view class="country-code-selector" @click="showCountryCodePicker">
					<text class="country-code">{{selectedCountryCode.code}}</text>
					<text class="yticon icon-xiala small-arrow"></text>
				</view>
				<input class="phone-input" type="number" v-model="addressData.phoneNumber" 
					   :placeholder="phonePlaceholder" placeholder-class="placeholder" />
			</view>
		</view>
		
		<view class="row b-b">
			<text class="tit">{{ $t('address.postCode') }}</text>
			<input class="input" type="text" v-model="addressData.postCode" :placeholder="$t('address.postCodePlaceholder')" placeholder-class="placeholder" />
		</view>
		
		<view class="row b-b">
			<text class="tit">{{ $t('address.region') }}</text>
			<input class="input" type="text" v-model="addressData.prefixAddress" :placeholder="$t('address.regionPlaceholder')" placeholder-class="placeholder" />
		</view>
		
		<view class="row b-b">
			<text class="tit">{{ $t('address.detail') }}</text>
			<input class="input" type="text" v-model="addressData.detailAddress" :placeholder="$t('address.detailPlaceholder')" placeholder-class="placeholder" />
		</view>

		<view class="row default-row">
			<text class="tit">{{ $t('address.setDefault') }}</text>
			<switch :checked="addressData.defaultStatus==1" color="#fa436a" @change="switchChange" />
		</view>
		
		<button class="add-btn" @click="confirm">{{ $t('common.submit') }}</button>
		
		<!-- 国家选择弹窗 -->
		<view class="picker-mask" v-if="showCountryModal" @click="hideCountryPicker" @touchmove.stop.prevent>
			<view class="picker-content" @click.stop @touchmove.stop>
				<view class="picker-header">
					<text class="picker-cancel" @click="hideCountryPicker">{{ $t('common.cancel') }}</text>
					<text class="picker-title">{{ $t('address.selectCountry') }}</text>
					<text class="picker-confirm" @click="confirmCountry">{{ $t('common.confirm') }}</text>
				</view>
				<scroll-view class="picker-list" scroll-y @touchmove.stop>
					<view class="picker-item" 
						  v-for="(country, index) in localizedCountryList" 
						  :key="index"
						  :class="{active: tempSelectedCountry.code === country.code}"
						  @click="selectCountry(country)">
						<text class="country-flag">{{country.flag}}</text>
						<text class="country-name">{{country.name}}</text>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<!-- 国家区号选择弹窗 -->
		<view class="picker-mask" v-if="showCountryCodeModal" @click="hideCountryCodePicker" @touchmove.stop.prevent>
			<view class="picker-content" @click.stop @touchmove.stop>
				<view class="picker-header">
					<text class="picker-cancel" @click="hideCountryCodePicker">{{ $t('common.cancel') }}</text>
					<text class="picker-title">{{ $t('address.selectCountryCode') }}</text>
					<text class="picker-confirm" @click="confirmCountryCode">{{ $t('common.confirm') }}</text>
				</view>
				<scroll-view class="picker-list" scroll-y @touchmove.stop>
					<view class="picker-item" 
						  v-for="(code, index) in countryCodeList" 
						  :key="index"
						  :class="{active: tempSelectedCountryCode.code === code.code}"
						  @click="selectCountryCode(code)">
						<text class="country-flag">{{code.flag}}</text>
						<text class="country-info">
							<text class="country-name">{{code.name}}</text>
							<text class="country-code">{{code.code}}</text>
						</text>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	import {
		addAddress,
		updateAddress,
		fetchAddressDetail
	} from '@/api/address.js';
	import { setPageTitle } from '@/utils/pageTitleUtil.js';
	
	export default {
		onLoad(options) {
			this.addressId = options.id;
			this.manageType = options.type ? options.type : 'add';
			setPageTitle(this.manageType === 'add' ? 'address.addNew' : 'address.edit');
			
			if (this.addressId) {
				this.getAddressDetail();
			}
		},
		data() {
			return {
				manageType: 'add',
				addressData: {
					name: '',
					phoneNumber: '',
					postCode: '',
					detailAddress: '',
					defaultStatus: 0,
					province: '',
					city: '',
					region: '',
					prefixAddress: '',
					country: 'GB', // 默认英国
					countryCode: '+44' // 默认英国区号
				},
				// 国家选择相关
				showCountryModal: false,
				selectedCountry: {
					code: 'GB',
					name: '英国',
					flag: '🇬🇧'
				},
				tempSelectedCountry: {},
				countryList: [
					{ code: 'GB', name: '英国', flag: '🇬🇧' }
				],
				// 国家区号选择相关
				showCountryCodeModal: false,
				selectedCountryCode: {
					code: '+44',
					name: '英国',
					flag: '🇬🇧'
				},
				tempSelectedCountryCode: {},
				countryCodeList: [
					{ code: '+44', name: '英国', flag: '🇬🇧' }
				]
			}
		},
		computed: {
			phonePlaceholder() {
				return this.$t('address.phonePlaceholder');
			},
			localizedCountryList() {
				const countryNames = {
					'GB': { 'zh-CN': '英国', 'zh-TW': '英國', 'en-US': 'United Kingdom' }
				};
				
				const currentLocale = this.$i18n.locale;
				return this.countryList.map(country => ({
					...country,
					name: countryNames[country.code] ? countryNames[country.code][currentLocale] || country.name : country.name
				}));
			},
			localizedSelectedCountry() {
				const countryNames = {
					'GB': { 'zh-CN': '英国', 'zh-TW': '英國', 'en-US': 'United Kingdom' }
				};
				
				const currentLocale = this.$i18n.locale;
				const countryName = countryNames[this.selectedCountry.code];
				return {
					...this.selectedCountry,
					name: countryName ? countryName[currentLocale] || this.selectedCountry.name : this.selectedCountry.name
				};
			}
		},
		methods: {
			// 获取地址详情
			getAddressDetail() {
				fetchAddressDetail(this.addressId).then(response => {
					this.addressData = response.data;
					this.addressData.prefixAddress = this.addressData.province + this.addressData.city + this.addressData.region;
					this.enforceUkAddress();
				});
			},
			enforceUkAddress() {
				const ukCountry = this.countryList[0];
				const ukCountryCode = this.countryCodeList[0];
				this.selectedCountry = { ...ukCountry };
				this.selectedCountryCode = { ...ukCountryCode };
				this.addressData.country = ukCountry.code;
				this.addressData.countryCode = ukCountryCode.code;
			},
			
			switchChange(e) {
				this.addressData.defaultStatus = e.detail.value ? 1 : 0;
			},
			
			// 国家选择相关方法
			showCountryPicker() {
				this.tempSelectedCountry = { ...this.selectedCountry };
				this.showCountryModal = true;
			},
			
			hideCountryPicker() {
				this.showCountryModal = false;
			},
			
			selectCountry(country) {
				this.tempSelectedCountry = country;
			},
			
			confirmCountry() {
				this.selectedCountry = { ...this.countryList[0] };
				this.addressData.country = this.selectedCountry.code;
				this.selectedCountryCode = { ...this.countryCodeList[0] };
				this.addressData.countryCode = this.selectedCountryCode.code;
				this.showCountryModal = false;
			},
			
			// 国家区号选择相关方法
			showCountryCodePicker() {
				this.tempSelectedCountryCode = { ...this.selectedCountryCode };
				this.showCountryCodeModal = true;
			},
			
			hideCountryCodePicker() {
				this.showCountryCodeModal = false;
			},
			
			selectCountryCode(countryCode) {
				this.tempSelectedCountryCode = countryCode;
			},
			
			confirmCountryCode() {
				this.selectedCountryCode = { ...this.countryCodeList[0] };
				this.addressData.countryCode = this.selectedCountryCode.code;
				this.showCountryCodeModal = false;
			},
			
			// 验证英国手机号码
			validatePhoneNumber(phone, countryCode) {
				if (!phone) return false;
				if (countryCode !== '+44') return false;
				const normalized = String(phone).replace(/\D/g, '');
				return /^\d{10,11}$/.test(normalized);
			},
			
			//地图选择地址
			chooseLocation() {
				uni.chooseLocation({
					success: (data) => {
						this.covertAdderss(data.address);
						this.addressData.detailAddress = data.name;
					}
				})
			},
			
			//将地址转化为省市区
			covertAdderss(address) {
				console.log("covertAdderss", address);
				
				// 重置地址字段
				this.addressData.province = '';
				this.addressData.city = '';
				this.addressData.region = '';
				
				if (!address || address.trim() === '') {
					return;
				}
				
				// 支持多种分隔符：逗号、空格、中文逗号等
				const separators = [',', '，', ' ', '　'];
				let addressParts = [address];
				
				// 尝试用不同分隔符分割
				for (let separator of separators) {
					if (address.includes(separator)) {
						addressParts = address.split(separator).map(part => part.trim()).filter(part => part);
						break;
					}
				}
				
				// 如果没有分隔符，尝试中国地址格式解析
				if (addressParts.length === 1) {
					if (address.indexOf("省") != -1) {
						this.addressData.province = address.substr(0, address.indexOf("省") + 1);
						address = address.replace(this.addressData.province, "");
						if (address.indexOf("市") != -1) {
							this.addressData.city = address.substr(0, address.indexOf("市") + 1);
							address = address.replace(this.addressData.city, "");
						}
						if (address.indexOf("区") != -1 || address.indexOf("县") != -1) {
							this.addressData.region = address.substr(0, Math.max(address.indexOf("区"), address.indexOf("县")) + 1);
						}
					} else if (address.indexOf("市") != -1) {
						this.addressData.province = address.substr(0, address.indexOf("市") + 1);
						address = address.replace(this.addressData.province, "");
						this.addressData.city = "";
						if (address.indexOf("区") != -1 || address.indexOf("县") != -1) {
							this.addressData.region = address.substr(0, Math.max(address.indexOf("区"), address.indexOf("县")) + 1);
						}
					} else {
						// 如果都没有标识符，直接作为省份
						this.addressData.province = address;
					}
				} else {
					// 根据分割后的部分数量进行赋值
					if (addressParts.length >= 1) {
						this.addressData.province = addressParts[0];
					}
					if (addressParts.length >= 2) {
						this.addressData.city = addressParts[1];
					}
					if (addressParts.length >= 3) {
						this.addressData.region = addressParts[2];
					}
				}
			},
			
			//提交
			confirm() {
				let data = this.addressData;
				if (!data.name) {
					this.$api.msg('请填写收货人姓名');
					return;
				}
				
				// 使用新的手机号验证方法
				if (!this.validatePhoneNumber(data.phoneNumber, this.selectedCountryCode.code)) {
					this.$api.msg(this.$t('address.ukPhoneFormatError'));
					return;
				}
				
				if (!data.prefixAddress) {
					this.$api.msg('请输入区域');
					return;
				}
				
				this.covertAdderss(data.prefixAddress);
				if (!data.province || data.province.trim() === '') {
					this.$api.msg('请输入正确的省/州信息');
					return;
				}
				
				if (!data.detailAddress) {
					this.$api.msg('请填写详细地址信息');
					return;
				}
				
				// 确保提交时包含国家和区号信息
				data.country = 'GB';
				data.countryCode = '+44';
				
				if(this.manageType=='edit'){
					updateAddress(this.addressData).then(response=>{
						//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
						this.$api.prePage().refreshList(data, this.manageType);
						this.$api.msg("地址修改成功！");
						setTimeout(() => {
							uni.navigateBack()
						}, 800)
					});
				}else{
					addAddress(this.addressData).then(response=>{
						//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
						this.$api.prePage().refreshList(data, this.manageType);
						this.$api.msg("地址添加成功！");
						setTimeout(() => {
							uni.navigateBack()
						}, 800)
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	@import '@/styles/profile-theme.scss';

	page {
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #fff;

		.tit {
			flex-shrink: 0;
			width: 150upx;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.icon-shouhuodizhi {
			font-size: 36upx;
			color: $font-color-light;
		}
	}

	.default-row {
		margin-top: 16upx;

		.tit {
			flex: 1;
		}

		switch {
			transform: translateX(16upx) scale(.9);
		}
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

	// 国家选择样式
	.country-select {
		color: $font-color-dark;
	}

	// 电话号码输入组样式
	.phone-input-group {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.country-code-selector {
		display: flex;
		align-items: center;
		padding: 0 20upx;
		margin-right: 20upx;
		border: 1px solid #e5e5e5;
		border-radius: 8upx;
		background: #f8f8f8;
		min-width: 120upx;
		justify-content: center;
	}

	.country-code {
		font-size: 28upx;
		color: $font-color-dark;
		margin-right: 8upx;
	}

	.small-arrow {
		font-size: 20upx;
		color: $font-color-light;
	}

	.phone-input {
		flex: 1;
		font-size: 30upx;
		color: $font-color-dark;
	}

	// 弹窗样式
	.picker-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 999;
		display: flex;
		align-items: flex-end;
		overflow: hidden; /* 防止遮罩层滚动 */
	}

	.picker-content {
		background: #fff;
		width: 100%;
		border-radius: 20upx 20upx 0 0;
		max-height: 70vh;
		height: 70vh; /* 给定明确高度 */
		display: flex;
		flex-direction: column;
		overflow: hidden; /* 防止内容溢出 */
	}

	.picker-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30upx 40upx;
		border-bottom: 1px solid #f0f0f0;
	}

	.picker-cancel,
	.picker-confirm {
		font-size: 32upx;
		color: $base-color;
	}

	.picker-title {
		font-size: 34upx;
		color: $font-color-dark;
		font-weight: bold;
	}

	.picker-list {
		flex: 1;
		padding: 20upx 0;
		height: 0; /* 关键：配合flex:1使用，使scroll-view能够正确计算滚动高度 */
	}

	.picker-item {
		display: flex;
		align-items: center;
		padding: 25upx 40upx;
		border-bottom: 1px solid #f8f8f8;

		&.active {
			background: #f0f8ff;
			color: $base-color;
		}

		&:last-child {
			border-bottom: none;
		}
	}

	.country-flag {
		font-size: 40upx;
		margin-right: 20upx;
	}

	.country-name {
		font-size: 32upx;
		color: $font-color-dark;
		flex: 1;
	}

	.country-info {
		display: flex;
		align-items: center;
		flex: 1;

		.country-name {
			margin-right: 20upx;
		}

		.country-code {
			font-size: 28upx;
			color: $font-color-light;
		}
	}

	.address-manage-page,
	page {
		background: #16060a;
	}

	.address-manage-content {
		padding: 26upx 22upx calc(40upx + env(safe-area-inset-bottom));
		box-sizing: border-box;
	}

	.address-manage-page .row {
		margin-bottom: 16upx;
		padding: 0 24upx;
		border: 1upx solid rgba(255, 255, 255, 0.14);
		border-radius: 24upx;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.26), rgba(255, 255, 255, 0.08));
		box-shadow: 0 18upx 40upx rgba(16, 4, 6, 0.24);
		backdrop-filter: blur(18px);
		-webkit-backdrop-filter: blur(18px);
	}

	.address-manage-page .default-row {
		margin-top: 0;
	}

	.address-manage-page .tit,
	.address-manage-page .input,
	.address-manage-page .country-code,
	.address-manage-page .country-select,
	.address-manage-page .phone-input,
	.address-manage-page .picker-title,
	.address-manage-page .country-name {
		color: #fff8ee;
	}

	.address-manage-page .small-arrow,
	.address-manage-page .yticon,
	.address-manage-page .country-info .country-code,
	.address-manage-page .placeholder {
		color: rgba(255, 245, 228, 0.68);
	}

	.address-manage-page .country-code-selector {
		border-color: rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.08);
	}

	.address-manage-page .add-btn {
		margin: 44upx auto 0;
		background: linear-gradient(135deg, #ffdd8d, #ff9940);
		color: #3b1202;
		border: none;
		border-radius: 999upx;
		box-shadow: 0 20upx 40upx rgba(255, 129, 0, 0.32);
	}

	.address-manage-page .picker-mask {
		background: rgba(10, 4, 8, 0.64);
	}

	.address-manage-page .picker-content {
		background: linear-gradient(180deg, rgba(35, 14, 22, 0.98), rgba(24, 8, 15, 0.98));
	}

	.address-manage-page .picker-header {
		border-bottom-color: rgba(255, 255, 255, 0.1);
	}

	.address-manage-page .picker-cancel,
	.address-manage-page .picker-confirm {
		color: #ffbf70;
	}

	.address-manage-page .picker-item {
		border-bottom-color: rgba(255, 255, 255, 0.06);
	}

	.address-manage-page .picker-item.active {
		background: rgba(255, 255, 255, 0.08);
	}
</style>
