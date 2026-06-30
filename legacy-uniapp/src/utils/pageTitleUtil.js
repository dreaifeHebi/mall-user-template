import { getCurrentLocale } from './i18nUtil.js'
import i18n from '@/i18n/index.js'

// 设置页面标题 - 支持翻译键
export function setPageTitle(titleKey) {
  try {
    const title = i18n.global.t(titleKey)
    
    if (title && title !== titleKey) {
      uni.setNavigationBarTitle({
        title: title
      })
    }
  } catch (error) {
    console.error('设置页面标题失败:', error)
  }
}

// 获取页面标题
export function getPageTitle(titleKey) {
  try {
    return i18n.global.t(titleKey)
  } catch (error) {
    console.error('获取页面标题失败:', error)
    return ''
  }
}
