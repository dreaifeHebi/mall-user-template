<template>
  <view class="notice-page profile-theme-page">
    <view class="profile-theme-backdrop">
      <image class="profile-theme-backdrop__image" src="/static/profile-theme-bg.png" mode="aspectFill"></image>
      <view class="profile-theme-backdrop__wash"></view>
      <view class="profile-theme-backdrop__grain"></view>
    </view>

    <view class="notice-content profile-theme-content">
      <view class="notice-card profile-theme-panel">
        <text class="notice-title">{{ $t('order.orderNotice.title') }}</text>
        <view class="notice-list">
          <text class="notice-item">{{ $t('order.orderNotice.item1') }}</text>
          <text class="notice-item">{{ $t('order.orderNotice.item2') }}</text>
          <text class="notice-item">{{ $t('order.orderNotice.item3') }}</text>
          <text class="notice-item">{{ $t('order.orderNotice.item4') }}</text>
        </view>
      </view>

      <view class="notice-card profile-theme-panel">
        <text class="notice-title">{{ $t('order.disclaimer.title') }}</text>
        <text class="notice-item notice-item--body">{{ $t('order.disclaimer.content') }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { setPageTitle } from '@/utils/pageTitleUtil.js';

export default {
  onLoad() {
    setPageTitle('pageTitle.notice');
  }
};
</script>

<style lang="scss">
@import '@/styles/profile-theme.scss';

.notice-page {
  min-height: 100vh;
}

.notice-content {
  padding: 30upx 22upx calc(40upx + env(safe-area-inset-bottom));
}

.notice-hero,
.notice-card {
  border-radius: 30upx;
}

.notice-hero {
  padding: 34upx 30upx;
}

.notice-card {
  margin-top: 18upx;
  padding: 30upx;
}

.notice-title {
  display: block;
  font-size: 34upx;
  font-weight: 700;
  color: #ffffff;
}

.notice-list {
  margin-top: 18upx;
}

.notice-item {
  display: block;
  font-size: 28upx;
  line-height: 1.8;
  color: #ffffff;
  margin-top: 12upx;
}

.notice-item--body {
  margin-top: 18upx;
}
</style>
