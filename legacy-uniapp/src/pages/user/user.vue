<template>
  <view class="page profile-page profile-theme-page">
    <view class="profile-theme-backdrop">
      <image class="profile-theme-backdrop__image" src="/static/profile-theme-bg.png" mode="aspectFill"></image>
      <view class="profile-theme-backdrop__wash"></view>
      <view class="profile-theme-backdrop__grain"></view>
    </view>

    <view class="top-nav">
      <view class="nav-left" @click="goToHome">
        <text class="logo-text">BANANA MAN</text>
      </view>
      <view class="nav-right">
        <view class="nav-icon" @click="goToLogin">
          <image src="/static/tab-my.png" class="nav-icon-img" mode="aspectFit"></image>
        </view>
        <view class="nav-icon" @click="goToCart">
          <image src="/static/tab-cart.png" class="nav-icon-img" mode="aspectFit"></image>
          <view v-if="cartCount > 0" class="cart-badge" :class="getCartBadgeClass(cartCount)">
            <text class="badge-text">{{ getCartCountText(cartCount) }}</text>
          </view>
        </view>
        <view class="nav-divider"></view>
        <view class="nav-icon" @click="toggleSidebar">
          <image src="/static/tab-cate.png" class="nav-icon-img" mode="aspectFit"></image>
        </view>
      </view>
    </view>

    <view class="sidebar-overlay" v-if="showSidebar" @click="closeSidebar"></view>
    <view class="sidebar" :class="{ active: showSidebar }">
      <view class="sidebar-content">
        <view class="sidebar-header">
          <view class="language-selector" @click="showLanguageSelector">
            <text class="language-text">Language</text>
            <text class="language-arrow" :class="{ rotated: showLanguageDropdown }">▼</text>
            <view class="language-dropdown" v-if="showLanguageDropdown">
              <view class="language-option" @click.stop="selectLanguage('zh-CN')">
                <text>简体中文</text>
              </view>
              <view class="language-option" @click.stop="selectLanguage('zh-TW')">
                <text>繁體中文</text>
              </view>
              <view class="language-option" @click.stop="selectLanguage('en-US')">
                <text>English</text>
              </view>
            </view>
          </view>
        </view>

        <view class="sidebar-item" @click="contactService">
          <text class="sidebar-item-text">{{ $t('index.contactService') }}</text>
        </view>
        <view class="sidebar-item" @click="goToHelpCenter">
          <text class="sidebar-item-text">{{ $t('index.helpCenter') }}</text>
        </view>
        <view class="sidebar-item" @click="goToCategoryPage">
          <text class="sidebar-item-text">{{ $t('common.category') }}</text>
        </view>

        <view class="sidebar-categories">
          <view
            v-for="item in categoryList"
            :key="item.id"
            class="sidebar-category-item"
            @click="selectCategoryFromSidebar(item)"
          >
            <text class="sidebar-category-name">{{ item.name }}</text>
          </view>
        </view>

        <view class="sidebar-item sidebar-item-bottom" @click="goToAbout">
          <text class="sidebar-item-text">{{ $t('index.aboutUs') }}</text>
        </view>
      </view>
    </view>

    <view class="profile-shell profile-theme-content">
      <view class="hero-card profile-theme-panel profile-theme-panel--strong" @click="handleUserInfoClick">
        <view class="hero-avatar-wrap">
          <image class="hero-avatar" :src="userInfo.icon || '/static/missing-face.png'" mode="aspectFill"></image>
        </view>
        <view class="hero-copy">
          <text class="hero-name">{{ userInfo.nickname || userInfo.username || $t('user.guest') }}</text>
          <view class="hero-action-pill">
            <text>{{ $t('user.profileAction') }}</text>
            <text class="hero-action-arrow">›</text>
          </view>
        </view>
      </view>

      <view class="feature-grid">
        <view
          v-for="item in featureCards"
          :key="item.key"
          class="feature-card profile-theme-panel"
          hover-class="feature-card--hover"
          :hover-stay-time="80"
          @click="handleFeatureAction(item.key)"
        >
          <view class="feature-main">
            <image class="feature-icon" :src="item.icon" mode="aspectFit"></image>
            <view class="feature-copy">
              <text class="feature-title">{{ item.title }}</text>
            </view>
          </view>
          <text class="feature-arrow">›</text>
        </view>
      </view>
    </view>

    <view class="qrcode-modal" v-if="showQrcodeModal" @click="hideQrcode">
      <view class="qrcode-content profile-theme-panel" @click.stop>
        <view class="qrcode-header">
          <text class="qrcode-title">{{ $t('index.wechatService') }}</text>
          <text class="qrcode-close yticon icon-guanbi" @click="hideQrcode"></text>
        </view>
        <view class="qrcode-body">
          <text class="qrcode-desc">{{ $t('index.scanQrcode') }}</text>
          <view class="qrcode-container">
            <image
              v-if="qrcodeUrl"
              :src="qrcodeUrl"
              mode="aspectFit"
              class="qrcode-image"
              @error="handleImageError"
            ></image>
            <view v-else class="qrcode-placeholder">
              <text class="placeholder-text">{{ qrcodeLoading ? $t('common.loading') : $t('index.noQrcode') }}</text>
            </view>
          </view>
          <text class="qrcode-tip">{{ $t('index.workingHours') }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { getServiceQrcode } from '@/api/service.js';
import { switchLanguage } from '@/utils/i18nUtil.js';
import { setPageTitle } from '@/utils/pageTitleUtil.js';
import languageRefreshMixin from '@/mixins/languageRefreshMixin.js';
import autoRefreshMixin from '@/mixins/autoRefreshMixin.js';

export default {
  mixins: [languageRefreshMixin, autoRefreshMixin],
  data() {
    return {
      showLanguageDropdown: false,
      showSidebar: false,
      categoryList: [],
      showQrcodeModal: false,
      qrcodeUrl: '',
      qrcodeLoading: false
    };
  },
  computed: {
    ...mapState(['hasLogin', 'userInfo', 'cartCount']),
    currentLocale() {
      return this.$i18n.locale;
    },
    profileSubtitle() {
      return this.userInfo.username || this.userInfo.email || this.userInfo.phone || this.$t('user.profileTagline');
    },
    featureCards() {
      return [
        {
          key: 'currentOrders',
          title: this.$t('user.menu.currentOrders'),
          desc: this.$t('user.menu.currentOrdersDesc'),
          icon: '/static/profile-icons/current-order.png'
        },
        {
          key: 'historyOrders',
          title: this.$t('user.menu.historyOrders'),
          desc: this.$t('user.menu.historyOrdersDesc'),
          icon: '/static/profile-icons/history-order.png'
        },
        {
          key: 'address',
          title: this.$t('user.menu.commonAddress'),
          desc: this.$t('user.menu.commonAddressDesc'),
          icon: '/static/profile-icons/address.png'
        },
        {
          key: 'points',
          title: this.$t('user.menu.points'),
          desc: this.$t('user.menu.pointsDesc'),
          icon: '/static/profile-icons/points.png'
        },
        {
          key: 'notice',
          title: this.$t('user.menu.notice'),
          desc: this.$t('user.menu.noticeDesc'),
          icon: '/static/profile-icons/notice.png'
        },
        {
          key: 'contact',
          title: this.$t('user.menu.contact'),
          desc: this.$t('user.menu.contactDesc'),
          icon: '/static/profile-icons/contact.png'
        }
      ];
    }
  },
  onLoad() {
    this.handleAutoRefresh('userPage', () => {
      setPageTitle('pageTitle.profile');
      this.refreshCartCount();
    }, 500);
    uni.hideTabBar();
  },
  onShow() {
    uni.hideTabBar();
    this.refreshCartCount();
    if (this.hasLogin) {
      this.getUserInfo().catch(error => {
        console.error('刷新用户信息失败:', error);
      });
    }
  },
  methods: {
    ...mapActions(['getUserInfo', 'refreshCartCount']),
    goToHome() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    },
    goToLogin() {
      if (!this.hasLogin) {
        uni.navigateTo({
          url: '/pages/public/login'
        });
      }
    },
    goToCart() {
      uni.switchTab({
        url: '/pages/cart/cart'
      });
    },
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
      if (this.showSidebar && this.categoryList.length === 0) {
        this.loadCategoryList();
      }
    },
    closeSidebar() {
      this.showSidebar = false;
      this.showLanguageDropdown = false;
    },
    showLanguageSelector() {
      this.showLanguageDropdown = !this.showLanguageDropdown;
    },
    async loadCategoryList() {
      try {
        const { fetchCategoryInfoList } = await import('@/api/product.js');
        const { processCategoryList } = await import('@/utils/textProcessor.js');
        const response = await fetchCategoryInfoList();
        this.categoryList = processCategoryList(response.data || []);
      } catch (error) {
        console.error('加载分类列表失败:', error);
        this.categoryList = [];
      }
    },
    selectLanguage(locale) {
      if (locale !== this.$i18n.locale) {
        switchLanguage(locale);
      }
      this.showLanguageDropdown = false;
    },
    async contactService() {
      this.closeSidebar();
      await this.showQrcode();
    },
    goToHelpCenter() {
      uni.navigateTo({
        url: '/pages/help/help'
      });
      this.closeSidebar();
    },
    goToAbout() {
      uni.navigateTo({
        url: '/pages/about/about'
      });
      this.closeSidebar();
    },
    selectCategoryFromSidebar(category) {
      uni.setStorageSync('selectedCategoryFromSidebar', {
        categoryId: category.id,
        categoryName: category.name
      });
      uni.switchTab({
        url: '/pages/category/category'
      });
      this.closeSidebar();
    },
    goToCategoryPage() {
      uni.switchTab({
        url: '/pages/category/category'
      });
      this.closeSidebar();
    },
    handleUserInfoClick() {
      if (!this.hasLogin) {
        uni.navigateTo({
          url: '/pages/public/login'
        });
        return;
      }
      uni.navigateTo({
        url: '/pages/userinfo/userinfo'
      });
    },
    requireLogin(onConfirm) {
      if (this.hasLogin) {
        onConfirm();
        return;
      }
      uni.showModal({
        title: this.$t('common.tips'),
        content: this.$t('auth.loginRequired'),
        showCancel: true,
        confirmText: this.$t('auth.goLogin'),
        cancelText: this.$t('common.cancel'),
        success: res => {
          if (res.confirm) {
            uni.navigateTo({
              url: '/pages/public/login'
            });
          }
        }
      });
    },
    handleFeatureAction(key) {
      const actionMap = {
        currentOrders: () => this.requireLogin(() => this.navTo('/pages/order/order?entry=current')),
        historyOrders: () => this.requireLogin(() => this.navTo('/pages/order/order?state=4')),
        address: () => this.requireLogin(() => this.navTo('/pages/address/address')),
        points: () => this.requireLogin(() => this.navTo('/pages/money/money')),
        notice: () => uni.navigateTo({ url: '/pages/notice/notice' }),
        contact: () => this.showQrcode()
      };
      if (actionMap[key]) {
        actionMap[key]();
      }
    },
    navTo(url) {
      uni.navigateTo({
        url
      });
    },
    async showQrcode() {
      this.showQrcodeModal = true;
      if (!this.qrcodeUrl && !this.qrcodeLoading) {
        await this.loadQrcode();
      }
    },
    hideQrcode() {
      this.showQrcodeModal = false;
    },
    async loadQrcode() {
      this.qrcodeLoading = true;
      try {
        const response = await getServiceQrcode();
        if (response.code === 200 && response.data) {
          this.qrcodeUrl = response.data;
        }
      } catch (error) {
        console.error('获取客服二维码失败:', error);
      } finally {
        this.qrcodeLoading = false;
      }
    },
    handleImageError() {
      this.qrcodeUrl = '';
    },
    getCartBadgeClass(count) {
      if (count >= 100) {
        return 'badge-large-number';
      }
      if (count >= 10) {
        return 'badge-two-digit';
      }
      return 'badge-single-digit';
    },
    getCartCountText(count) {
      if (count >= 100) {
        return '99+';
      }
      return String(count);
    },
    refreshPageData() {
      if (this.categoryList.length > 0) {
        this.loadCategoryList();
      }
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/profile-theme.scss';

.page {
  padding-top: 90upx;

  /* #ifndef H5 */
  padding-top: calc(90upx + var(--status-bar-height, 0));
  /* #endif */
}

.profile-shell {
  padding: 35vh 26upx calc(48upx + env(safe-area-inset-bottom));
}

.hero-card {
  display: flex;
  align-items: center;
  gap: 26upx;
  padding: 24upx 30upx;
  border-radius: 30upx;
}

.hero-avatar-wrap {
  width: 126upx;
  height: 126upx;
  flex-shrink: 0;
  padding: 6upx;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 220, 164, 0.74));
  box-shadow: 0 16upx 32upx rgba(49, 11, 0, 0.22);
}

.hero-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.hero-copy {
  flex: 1;
  min-width: 0;
}

.hero-name {
  display: block;
  font-size: 40upx;
  font-weight: 700;
  color: #ffffff;
  word-break: break-all;
}

.hero-action-pill {
  display: inline-flex;
  align-items: center;
  gap: 10upx;
  margin-top: 12upx;
  padding: 8upx 16upx;
  border-radius: 999upx;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 24upx;
}

.hero-action-arrow {
  font-size: 28upx;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14upx;
  margin-top: 20upx;
}

.feature-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 100upx;
  padding: 16upx 22upx;
  border-radius: 26upx;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.feature-card--hover {
  transform: translateY(-2upx);
  opacity: 0.94;
}

.feature-main {
  display: flex;
  align-items: center;
  gap: 18upx;
  min-width: 0;
  flex: 1;
}

.feature-icon {
  width: 60upx;
  height: 60upx;
  flex-shrink: 0;
}

.feature-copy {
  min-width: 0;
}

.feature-title {
  display: block;
  font-size: 30upx;
  font-weight: 700;
  color: #ffffff;
}

.feature-arrow {
  flex-shrink: 0;
  margin-left: 14upx;
  font-size: 38upx;
  color: #ffffff;
}

.top-nav {
  background: transparent;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  height: 90upx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30upx;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  /* #ifndef H5 */
  padding-top: var(--status-bar-height, 0);
  height: calc(90upx + var(--status-bar-height, 0));
  /* #endif */
}

.nav-left {
  flex: 1;
}

.logo-text {
  font-size: 32upx;
  font-weight: 900;
  color: #cccccc !important;
  letter-spacing: 2upx;
}

.nav-right {
  display: flex;
  gap: 20upx;
}

.nav-icon {
  width: 48upx;
  height: 48upx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon-img {
  width: 48upx;
  height: 48upx;
}

.cart-badge {
  position: absolute;
  top: -6upx;
  left: -6upx;
  background: #e74c3c;
  color: #ffffff;
  border-radius: 50%;
  width: 36upx;
  height: 36upx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2upx solid #e74c3c;
  box-shadow: 0 2upx 8upx rgba(231, 76, 60, 0.25);
  z-index: 10;
}

.badge-text {
  font-weight: bold;
  line-height: 1;
  color: #ffffff;
}

.badge-single-digit .badge-text {
  font-size: 22upx;
}

.badge-two-digit .badge-text {
  font-size: 18upx;
}

.badge-large-number .badge-text {
  font-size: 16upx;
}

.nav-divider {
  width: 1px;
  height: 30upx;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 0 8upx;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000;
}

.sidebar {
  position: fixed;
  top: 0;
  right: -420upx;
  width: 420upx;
  height: 100vh;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(245, 245, 245, 0.96));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 1001;
  transition: right 0.3s ease;
  box-shadow: -12upx 0 32upx rgba(0, 0, 0, 0.24);
}

.sidebar.active {
  right: 0;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.sidebar-header {
  padding: 40upx 30upx 20upx;
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.language-selector {
  position: relative;
  display: flex;
  align-items: center;
  padding: 12upx 20upx;
  border-radius: 999upx;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(0, 0, 0, 0.04);
}

.language-text,
.language-arrow,
.sidebar-item-text,
.sidebar-category-name {
  color: #333333;
}

.language-text {
  font-size: 26upx;
  margin-right: 8upx;
}

.language-arrow {
  font-size: 20upx;
  transition: transform 0.3s ease;
}

.language-arrow.rotated {
  transform: rotate(180deg);
}

.language-dropdown {
  position: absolute;
  top: calc(100% + 12upx);
  right: 0;
  min-width: 220upx;
  border-radius: 18upx;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18upx 40upx rgba(0, 0, 0, 0.1);
  border: 1upx solid rgba(0, 0, 0, 0.08);
}

.language-option {
  padding: 20upx 24upx;
  color: #333333;
  font-size: 24upx;
  border-bottom: 1upx solid rgba(0, 0, 0, 0.06);
}

.language-option:last-child {
  border-bottom: none;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 32upx 30upx;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.sidebar-item-bottom {
  margin-top: auto;
}

.sidebar-item-text {
  font-size: 30upx;
}

.sidebar-categories {
  padding: 14upx 0 28upx;
}

.sidebar-category-item {
  padding: 18upx 30upx;
}

.sidebar-category-name {
  font-size: 26upx;
  color: #666666;
}

.qrcode-modal {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30upx;
}

.qrcode-content {
  width: 100%;
  max-width: 620upx;
  border-radius: 30upx;
  padding: 26upx;
}

.qrcode-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.qrcode-title {
  font-size: 34upx;
  font-weight: 700;
  color: #ffffff;
}

.qrcode-close {
  font-size: 34upx;
  color: #ffffff;
}

.qrcode-body {
  padding-top: 20upx;
  text-align: center;
}

.qrcode-desc,
.qrcode-tip {
  display: block;
  font-size: 26upx;
  line-height: 1.6;
  color: #ffffff;
}

.qrcode-desc {
  display: block;
  font-size: 26upx;
  line-height: 1.6;
}

.qrcode-container {
  display: flex;
  justify-content: center;
  margin: 26upx 0;
}

.qrcode-image,
.qrcode-placeholder {
  width: 360upx;
  height: 360upx;
  border-radius: 24upx;
  background: rgba(255, 255, 255, 0.12);
  border: 1upx solid rgba(255, 255, 255, 0.18);
}

.qrcode-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30upx;
  box-sizing: border-box;
}

.qrcode-tip {
  display: block;
  font-size: 24upx;
  line-height: 1.6;
}
</style>
