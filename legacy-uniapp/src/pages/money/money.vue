<template>
  <view class="points-page profile-theme-page">
    <view class="profile-theme-backdrop">
      <image class="profile-theme-backdrop__image" src="/static/profile-theme-bg.png" mode="aspectFill"></image>
      <view class="profile-theme-backdrop__wash"></view>
      <view class="profile-theme-backdrop__grain"></view>
    </view>

    <view class="points-content profile-theme-content">
      <view class="points-card profile-theme-panel profile-theme-panel--strong">
        <text class="profile-theme-section-title">BANANA MAN</text>
        <text class="profile-theme-page-title">{{ $t('money.comingSoon') }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { setPageTitle } from '@/utils/pageTitleUtil.js';

export default {
  onLoad() {
    setPageTitle('pageTitle.points');
  }
};
</script>

<style lang="scss">
@import '@/styles/profile-theme.scss';

.points-page {
  min-height: 100vh;
}

.points-content {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40upx;
  box-sizing: border-box;
}

.points-card {
  width: 100%;
  max-width: 620upx;
  padding: 54upx 40upx;
  border-radius: 32upx;
  text-align: center;
}
</style>
