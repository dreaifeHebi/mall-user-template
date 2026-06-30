// 多语言数据刷新 Mixin
import { getCurrentLocale } from '@/utils/i18nUtil.js'

export default {
  data() {
    return {
      // 当前语言，用于监听语言变化
      currentLanguage: getCurrentLocale(),
      // 语言切换刷新状态
      isLanguageRefreshing: false
    }
  },
  
  watch: {
    // 监听语言变化
    '$store.state.locale'(newLocale, oldLocale) {
      if (newLocale !== oldLocale && newLocale !== this.currentLanguage) {
        console.log(`Store语言状态变化: ${oldLocale} → ${newLocale}`)
        this.currentLanguage = newLocale
        this.onLanguageChanged(newLocale, oldLocale)
      }
    }
  },

  methods: {
    /**
     * 语言切换时的回调方法
     * 子组件需要实现这个方法来处理数据刷新
     * @param {string} newLocale - 新语言
     * @param {string} oldLocale - 旧语言
     */
    onLanguageChanged(newLocale, oldLocale) {
      if (this.isLanguageRefreshing) {
        console.log('语言刷新正在进行中，跳过重复刷新')
        return
      }
      
      this.isLanguageRefreshing = true
      console.log(`开始刷新页面数据: ${oldLocale} → ${newLocale}`)
      
      // 延迟执行，确保语言切换和i18n更新完成
      this.$nextTick(() => {
        setTimeout(() => {
          try {
            if (this.refreshPageData && typeof this.refreshPageData === 'function') {
              console.log('正在刷新页面数据以适应新语言...')
              this.refreshPageData(newLocale, oldLocale)
            } else {
              console.log('页面未实现 refreshPageData 方法')
            }
          } catch (error) {
            console.error('刷新页面数据时发生错误:', error)
          } finally {
            this.isLanguageRefreshing = false
          }
        }, 200) // 增加延迟确保切换完成
      })
    },

    /**
     * 手动触发语言切换处理（用于测试或特殊情况）
     */
    manualLanguageRefresh() {
      const currentLocale = getCurrentLocale()
      this.onLanguageChanged(currentLocale, this.currentLanguage)
      this.currentLanguage = currentLocale
    }
  },

  // 监听全局语言切换事件
  onLoad() {
    uni.$on('languageChanged', (data) => {
      console.log(`${this.$options.name || 'Page'} 收到语言切换事件:`, data)
      this.currentLanguage = data.newLocale
      this.onLanguageChanged(data.newLocale, data.oldLocale)
    })
  },

  // 页面显示时检查语言是否有变化
  onShow() {
    const currentLocale = getCurrentLocale()
    if (currentLocale !== this.currentLanguage) {
      console.log(`页面显示时检测到语言变化: ${this.currentLanguage} → ${currentLocale}`)
      this.onLanguageChanged(currentLocale, this.currentLanguage)
      this.currentLanguage = currentLocale
    }
  },

  // 页面销毁时移除事件监听
  onUnload() {
    uni.$off('languageChanged')
  }
}