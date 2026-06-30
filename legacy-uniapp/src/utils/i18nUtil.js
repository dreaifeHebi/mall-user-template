import i18n from '@/i18n'
import store from '@/store'
import { updateTabBarI18n } from './tabBarUtil.js'

// 翻译函数
export function t(key, params) {
  return i18n.global.t(key, params)
}

// 获取当前语言
export function getCurrentLanguage() {
  return i18n.global.locale
}

// 切换语言
export function switchLanguage(locale) {
  const oldLocale = getCurrentLocale()
  
  // 更新i18n实例的语言
  i18n.global.locale = locale
  
  // 更新store中的语言状态
  store.dispatch('changeLocale', locale)
  
  // 存储到本地存储
  uni.setStorage({
    key: 'locale',
    data: locale
  })
  
  // 更新TabBar文字
  setTimeout(() => {
    updateTabBarI18n()
  }, 100)
  
  // 触发全局事件，通知页面刷新数据
  uni.$emit('languageChanged', {
    newLocale: locale,
    oldLocale: oldLocale
  })
  
  console.log(`语言切换完成: ${oldLocale} → ${locale}`)
}

// 获取当前语言 (别名函数，保持向后兼容)
export function getCurrentLocale() {
  return i18n.global.locale
}

// 获取支持的语言列表
export function getSupportedLocales() {
  const currentLocale = getCurrentLocale()
  
  if (currentLocale === 'zh-CN') {
    return [
      { code: 'zh-CN', name: '简体中文 Simplified Chinese' },
      { code: 'zh-TW', name: '繁體中文 Traditional Chinese' },
      { code: 'en-US', name: 'English 英文' }
    ]
  } else if (currentLocale === 'zh-TW') {
    return [
      { code: 'zh-CN', name: '简体中文 Simplified Chinese' },
      { code: 'zh-TW', name: '繁體中文 Traditional Chinese' },
      { code: 'en-US', name: 'English 英文' }
    ]
  } else {
    return [
      { code: 'zh-CN', name: 'Simplified Chinese 简体中文' },
      { code: 'zh-TW', name: 'Traditional Chinese 繁體中文' },
      { code: 'en-US', name: 'English 英文' }
    ]
  }
}

// 获取浏览器语言
export function getBrowserLanguage() {
  let browserLang = ''
  
  // #ifdef H5
  browserLang = navigator.language || navigator.userLanguage
  // #endif
  
  // #ifdef MP-WEIXIN
  browserLang = wx.getSystemInfoSync().language
  // #endif
  
  // #ifdef APP-PLUS
  browserLang = plus.os.language
  // #endif
  
  // 标准化语言代码
  if (browserLang) {
    if (browserLang.toLowerCase().includes('zh-tw') || browserLang.toLowerCase().includes('zh-hk') || browserLang.toLowerCase().includes('zh-mo')) {
      return 'zh-TW'
    } else if (browserLang.startsWith('zh')) {
      return 'zh-CN'
    } else if (browserLang.startsWith('en')) {
      return 'en-US'
    }
  }
  
  return 'zh-CN' // 默认返回中文
}

// 初始化语言设置
export function initLocale() {
  try {
    const savedLocale = uni.getStorageSync('locale')
    const hasInitialized = uni.getStorageSync('languageInitialized')
    let targetLocale = 'zh-CN'
    
    if (savedLocale && ['zh-CN', 'zh-TW', 'en-US'].includes(savedLocale)) {
      // 如果有保存的语言设置，使用保存的
      targetLocale = savedLocale
    } else {
      // 如果没有保存的语言设置，根据浏览器语言自动选择
      targetLocale = getBrowserLanguage()
      console.log('自动检测浏览器语言:', targetLocale)
      
      // 如果是首次初始化且检测到非中文语言，可以考虑显示提示
      if (!hasInitialized && targetLocale !== 'zh-CN') {
        // 延迟显示提示，让应用先完全加载
        setTimeout(() => {
          uni.showToast({
            title: targetLocale === 'en-US' ? 'Language auto-detected: English' : '自动检测语言',
            icon: 'none',
            duration: 2000
          })
        }, 1000)
      }
      
      // 标记已经初始化过
      uni.setStorage({
        key: 'languageInitialized',
        data: true
      })
    }
    
    i18n.global.locale = targetLocale
    store.commit('setLocale', targetLocale)
    
    // 保存到本地存储
    uni.setStorage({
      key: 'locale',
      data: targetLocale
    })
    
    // 延迟更新TabBar，确保i18n已经完全初始化
    setTimeout(() => {
      updateTabBarI18n()
    }, 200)
    
    console.log('语言初始化完成:', targetLocale)
  } catch (error) {
    console.error('语言初始化失败:', error)
    // 发生错误时使用默认中文
    const defaultLocale = 'zh-CN'
    i18n.global.locale = defaultLocale
    store.commit('setLocale', defaultLocale)
    uni.setStorage({
      key: 'locale',
      data: defaultLocale
    })
  }
}
