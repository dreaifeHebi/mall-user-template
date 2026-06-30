<template>
  <view class="language-selector">
    <view class="selector-trigger" @click="showLanguageSelector">
      <text class="current-language">{{ getCurrentLanguageName() }}</text>
      <text class="yticon icon-you"></text>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import { switchLanguage, getSupportedLocales } from '@/utils/i18nUtil.js'

export default {
  name: 'LanguageSelector',
  data() {
    return {
      supportedLanguages: getSupportedLocales()
    }
  },
  computed: {
    ...mapState(['locale']),
    currentLocale() {
      return this.$i18n.locale
    }
  },
  methods: {
    getCurrentLanguageName() {
      const current = getSupportedLocales().find(lang => lang.code === this.currentLocale)
      return current ? current.name : '中文 Chinese'
    },
    showLanguageSelector() {
      // 使用原生弹窗确保能覆盖整个屏幕包括TabBar
      const itemList = this.supportedLanguages.map(lang => lang.name)
      uni.showActionSheet({
        itemList: itemList,
        success: (res) => {
          const selectedLang = this.supportedLanguages[res.tapIndex]
          this.selectLanguage(selectedLang.code)
        }
      })
    },
    selectLanguage(locale) {
      if (locale !== this.currentLocale) {
        switchLanguage(locale)
        // 重新获取支持的语言列表（因为显示顺序可能改变）
        this.supportedLanguages = getSupportedLocales()
        this.$emit('languageChanged', locale)
        
        // 更新TabBar国际化
        const { updateTabBarI18n } = require('@/utils/tabBarUtil.js')
        setTimeout(() => {
          updateTabBarI18n()
        }, 100)
        
        // 显示切换成功提示
        uni.showToast({
          title: this.$t('tips.updateSuccess'),
          icon: 'success'
        })
      }
    }
  }
}
</script>

<style scoped>
.language-selector {
  position: relative;
}

.selector-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}

.current-language {
  font-size: 28rpx;
  color: #333;
}

.icon-you {
  font-size: 24rpx;
  color: #999;
}
</style>
