import { getPageTitle } from '@/config/i18nConfig.js'

export default {
  methods: {
    // 设置页面标题
    setPageTitle(titleKey) {
      if (titleKey) {
        uni.setNavigationBarTitle({
          title: this.$t(titleKey)
        })
      } else {
        // 根据当前页面路径自动设置标题
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]
        const route = currentPage.route
        const title = getPageTitle(route, this.$i18n.locale)
        if (title) {
          uni.setNavigationBarTitle({
            title: title
          })
        }
      }
    }
  },
  
  onShow() {
    // 页面显示时自动更新标题
    this.setPageTitle()
  }
}
