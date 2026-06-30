// 全局国际化配置
export const AppI18nConfig = {
  // 页面标题国际化映射
  pageTitles: {
    'pages/index/index': {
      'zh-CN': 'Mall商城',
      'en-US': 'Mall Store'
    },
    'pages/cart/cart': {
      'zh-CN': '购物车',
      'en-US': 'Shopping Cart'
    },
    'pages/category/category': {
      'zh-CN': '分类',
      'en-US': 'Category'
    },
    'pages/user/user': {
      'zh-CN': '我的',
      'en-US': 'Profile'
    },
    'pages/product/product': {
      'zh-CN': '商品详情',
      'en-US': 'Product Details'
    },
    'pages/order/order': {
      'zh-CN': '我的订单',
      'en-US': 'My Orders'
    },
    'pages/address/address': {
      'zh-CN': '地址管理',
      'en-US': 'Address Management'
    },
    'pages/set/set': {
      'zh-CN': '设置',
      'en-US': 'Settings'
    },
    'pages/userinfo/userinfo': {
      'zh-CN': '个人信息',
      'en-US': 'Personal Info'
    },
    'pages/public/login': {
      'zh-CN': '登录',
      'en-US': 'Login'
    },
    'pages/public/register': {
      'zh-CN': '注册',
      'en-US': 'Register'
    },
    'pages/money/pay': {
      'zh-CN': '支付',
      'en-US': 'Payment'
    },
    'pages/money/h5Pay': {
      'zh-CN': 'H5支付',
      'en-US': 'H5 Payment'
    },
    'pages/money/paySuccess': {
      'zh-CN': '支付成功',
      'en-US': 'Payment Success'
    },
    'pages/refund/refundApply': {
      'zh-CN': '申请退款',
      'en-US': 'Apply Refund'
    }
  },

  // tabBar国际化
  tabBar: {
    list: [
      {
        text: {
          'zh-CN': '首页',
          'en-US': 'Home'
        }
      },
      {
        text: {
          'zh-CN': '分类',
          'en-US': 'Category'
        }
      },
      {
        text: {
          'zh-CN': '购物车',
          'en-US': 'Cart'
        }
      },
      {
        text: {
          'zh-CN': '我的',
          'en-US': 'Profile'
        }
      }
    ]
  }
}

// 根据当前语言获取页面标题
export function getPageTitle(path, locale = 'zh-CN') {
  const titles = AppI18nConfig.pageTitles[path]
  return titles ? titles[locale] || titles['zh-CN'] : ''
}

// 根据当前语言获取tabBar文本
export function getTabBarText(index, locale = 'zh-CN') {
  const tabBarItem = AppI18nConfig.tabBar.list[index]
  return tabBarItem ? tabBarItem.text[locale] || tabBarItem.text['zh-CN'] : ''
}
