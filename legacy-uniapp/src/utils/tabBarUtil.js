import { getCurrentLocale } from '@/utils/i18nUtil.js'

// TabBar国际化处理
export function updateTabBarI18n() {
  const locale = getCurrentLocale()
  
  const tabBarTexts = {
    'zh-CN': ['首页', '分类', '购物车', '我的'],
    'en-US': ['Home', 'Category', 'Cart', 'Profile']
  }
  
  const texts = tabBarTexts[locale] || tabBarTexts['zh-CN']
  
  console.log(`更新TabBar语言为: ${locale}`, texts);
  
  try {
    // 检查当前页面是否为TabBar页面
    const pages = getCurrentPages();
    if (pages.length === 0) return;
    
    const currentPage = pages[pages.length - 1];
    const route = currentPage.route;
    
    // TabBar页面列表
    const tabBarPages = [
      'pages/index/index',
      'pages/category/category', 
      'pages/cart/cart',
      'pages/user/user'
    ];
    
    // 只有在TabBar页面才更新TabBar
    if (!tabBarPages.includes(route)) {
      console.log('当前页面不是TabBar页面，跳过更新:', route);
      return;
    }
    
    // 更新每个TabBar项的文本
    texts.forEach((text, index) => {
      uni.setTabBarItem({
        index: index,
        text: text
      })
    })
    console.log('TabBar国际化更新成功');
  } catch (error) {
    console.error('更新TabBar国际化失败:', error)
    // 不再抛出错误，避免影响其他功能
  }
}

// 在语言切换时调用此函数
export function onLanguageChanged() {
  updateTabBarI18n()
}
