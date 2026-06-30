import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import zhTW from './locales/zh-TW'
import enUS from './locales/en-US'

// 获取存储的语言设置，默认中文简体
const getStoredLocale = () => {
  try {
    const stored = uni.getStorageSync('locale')
    return stored || 'zh-CN'
  } catch (e) {
    return 'zh-CN'
  }
}

const i18n = createI18n({
  locale: getStoredLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en-US': enUS
  }
})

export default i18n
