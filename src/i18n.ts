import { computed, nextTick, reactive } from 'vue'

export type Locale = 'en' | 'zh'

const STORAGE_KEY = 'mall.locale'
const textNodes = new WeakMap<Text, string>()
const attrValues = new WeakMap<Element, Map<string, string>>()
const translatedAttrs = ['placeholder', 'title', 'aria-label', 'alt', 'empty-text']

let observer: MutationObserver | null = null
let applying = false

const localeState = reactive({
  locale: readInitialLocale()
})

const dictionary: Record<string, string> = {
  '首页': 'Home',
  '商品': 'Products',
  '商品列表': 'Products',
  '商品详情': 'Product Details',
  '分类': 'Categories',
  '商品分类': 'Product Categories',
  '订单': 'Orders',
  '我的订单': 'My Orders',
  '订单详情': 'Order Details',
  '订单支付': 'Payment',
  '购物车': 'Cart',
  '确认订单': 'Checkout',
  '我的': 'Account',
  '账户设置': 'Account Settings',
  '收货地址': 'Addresses',
  '新增地址': 'Add Address',
  '编辑地址': 'Edit Address',
  '我的关注': 'Following',
  '我的收藏': 'Favorites',
  '我的足迹': 'History',
  '关于商城': 'About',
  '联系我们': 'Contact',
  '帮助中心': 'Help Center',
  '帮助': 'Help',
  '联系': 'Contact',
  '下单须知': 'Order Guide',
  '新鲜好物': 'New Arrivals',
  '人气推荐': 'Popular Picks',
  '推荐品牌': 'Recommended Brands',
  '品牌详情': 'Brand Details',
  '品牌故事': 'Brand Story',
  '相关商品': 'Related Products',
  '精选品牌': 'Featured Brand',
  '品牌首字母': 'Brand initial',
  '暂无品牌介绍': 'No brand description yet',
  '关注品牌': 'Follow Brand',
  '已关注品牌': 'Following Brand',
  '查看商品': 'View Products',
  '查看全部': 'View All',
  '查看全部商品': 'View All Products',
  '更多商品': 'More Products',
  '立即选购': 'Shop Now',
  '热门分类': 'Popular Categories',
  '精选商品': 'Featured Products',
  '暂无相关商品': 'No related products',
  '页面不存在': 'Page Not Found',
  '未找到页面': 'Page Not Found',
  '返回首页': 'Back Home',
  '返回我的': 'Back to Account',
  '返回订单': 'Back to Orders',
  '返回': 'Back',
  '登录': 'Sign In',
  '退出登录': 'Sign Out',
  '会员登录': 'Member Sign In',
  '注册': 'Sign Up',
  '注册会员': 'Create Account',
  '创建新账号': 'Create Account',
  '已有账号，去登录': 'Already have an account? Sign in',
  '忘记密码': 'Forgot password',
  '找回密码': 'Reset Password',
  '重置密码': 'Reset Password',
  '邮箱验证': 'Email Verification',
  '用户名': 'Username',
  '密码': 'Password',
  '邮箱': 'Email',
  '手机号': 'Phone',
  '昵称': 'Nickname',
  '当前密码': 'Current Password',
  '新密码': 'New Password',
  '确认新密码': 'Confirm New Password',
  '保存资料': 'Save Profile',
  '保存中...': 'Saving...',
  '修改密码': 'Change Password',
  '修改中...': 'Updating...',
  '发送验证邮件': 'Send Verification Email',
  '发送中...': 'Sending...',
  '验证邮件已发送': 'Verification email sent',
  '当前账号没有邮箱': 'This account has no email address',
  '操作成功': 'Success',
  '操作失败': 'Operation failed',
  '参数检验失败': 'Invalid request parameters',
  '用户名或密码错误': 'Username or password is incorrect',
  '旧密码错误': 'Current password is incorrect',
  '原密码错误': 'Current password is incorrect',
  '密码不能为空': 'Password is required',
  '参数不能为空': 'Parameters are required',
  '用户不存在': 'User not found',
  '用户未登录': 'User is not signed in',
  '会员不存在': 'Member not found',
  '分类不存在': 'Category not found',
  '商品不存在': 'Product not found',
  '订单不存在': 'Order not found',
  '退款申请不存在': 'Refund request not found',
  '未找到支付记录': 'Payment record not found',
  '支付方式不可用': 'Payment method is unavailable',
  '订单号不匹配': 'Order number does not match',
  '支付金额不匹配': 'Payment amount does not match',
  '当前订单状态不可支付': 'The current order status cannot be paid',
  '无权支付该订单': 'No permission to pay this order',
  '无权限操作该订单': 'No permission to operate this order',
  '无权操作此退款申请': 'No permission to operate this refund request',
  '无权查看此退款申请': 'No permission to view this refund request',
  '订单状态不允许申请退款': 'The order status does not allow refund requests',
  '退款金额不能超过订单金额': 'Refund amount cannot exceed the order amount',
  '累计退款金额不能超过订单金额': 'Total refund amount cannot exceed the order amount',
  '当前状态不允许审核': 'The current status does not allow review',
  '当前状态不允许处理退款': 'The current status does not allow refund processing',
  '当前状态不允许取消': 'The current status does not allow cancellation',
  '当前状态不允许重试': 'The current status does not allow retry',
  '退款申请ID列表不能为空': 'Refund request ID list is required',
  '部分退款申请不存在': 'Some refund requests were not found',
  '订单ID不能为空': 'Order ID is required',
  '订单ID列表不能为空': 'Order ID list is required',
  '重置链接无效或已过期': 'Reset link is invalid or expired',
  '验证链接无效或已过期': 'Verification link is invalid or expired',
  '邮箱已验证，无需重复验证': 'Email is already verified',
  '昵称和电话号码不能同时为空': 'Nickname and phone cannot both be empty',
  '该电话号码已被使用': 'This phone number is already used',
  'token已经过期！': 'Token has expired',
  'token已经过期': 'Token has expired',
  '资料已更新': 'Profile updated',
  '资料更新失败': 'Profile update failed',
  '密码已修改': 'Password updated',
  '密码修改失败': 'Password update failed',
  '两次输入的新密码不一致': 'The two new passwords do not match',
  '用户名 / 邮箱': 'Username / Email',
  '搜索商品': 'Search products',
  '搜索': 'Search',
  '清除筛选': 'Clear Filters',
  '排序': 'Sort',
  '销量': 'Sales',
  '价格': 'Price',
  '新品': 'New',
  '库存': 'Stock',
  '刷新中': 'Refreshing',
  '全部': 'All',
  '待付款': 'Pending Payment',
  '待发货': 'Awaiting Shipment',
  '已发货': 'Shipped',
  '已完成': 'Completed',
  '已关闭': 'Closed',
  '无效订单': 'Invalid',
  '处理中': 'Processing',
  '未支付': 'Unpaid',
  '支付宝': 'Alipay',
  '微信': 'WeChat',
  '银行卡': 'Bank Card',
  '测试支付': 'Test Payment',
  '其他': 'Other',
  '支付': 'Pay',
  '取消订单': 'Cancel Order',
  '确认收货': 'Confirm Receipt',
  '删除订单': 'Delete Order',
  '申请售后': 'Request Refund',
  '订单状态': 'Order Status',
  '收货信息': 'Shipping Information',
  '收货人': 'Recipient',
  '电话': 'Phone',
  '地址': 'Address',
  '邮编': 'Postcode',
  '订单信息': 'Order Information',
  '下单时间': 'Order Time',
  '支付方式': 'Payment Method',
  '支付时间': 'Payment Time',
  '备注': 'Note',
  '商品信息': 'Items',
  '金额明细': 'Amount Details',
  '商品合计': 'Subtotal',
  '运费': 'Freight',
  '活动优惠': 'Promotion',
  '优惠券': 'Coupon',
  '实付': 'Paid',
  '物流信息': 'Logistics',
  '物流公司': 'Carrier',
  '物流单号': 'Tracking No.',
  '发货时间': 'Shipped At',
  '收货时间': 'Received At',
  '订单详情加载失败': 'Order details failed to load',
  '操作失败，请刷新后重试': 'Action failed. Refresh and try again.',
  '确认取消该订单？': 'Cancel this order?',
  '确认已收到商品？': 'Confirm that you received the goods?',
  '确认删除该订单？': 'Delete this order?',
  '地址加载失败': 'Addresses failed to load',
  '确认删除这个收货地址？': 'Delete this address?',
  '暂无收货地址': 'No addresses yet',
  '设为默认': 'Set Default',
  '默认': 'Default',
  '编辑': 'Edit',
  '删除': 'Delete',
  '保存': 'Save',
  '取消': 'Cancel',
  '新增': 'Add',
  '请先登录': 'Please sign in',
  '加载中...': 'Loading...',
  '加载更多': 'Load More',
  '提交中...': 'Submitting...',
  '请求失败': 'Request failed',
  '去逛逛': 'Browse Products',
  '暂无订单': 'No orders yet',
  '暂无商品': 'No products yet',
  '暂无商品明细': 'No item details',
  '暂无浏览记录': 'No browsing history',
  '暂无关注品牌': 'No followed brands',
  '暂无收藏商品': 'No favorite products',
  '清空': 'Clear',
  '确认清空我的足迹？': 'Clear browsing history?',
  '确认清空我的关注？': 'Clear followed brands?',
  '确认清空我的收藏？': 'Clear favorites?',
  '确认取消关注这个品牌？': 'Unfollow this brand?',
  '确认移除这个商品？': 'Remove this product?',
  '列表加载失败': 'List failed to load',
  '移除': 'Remove',
  '品牌': 'Brand',
  '收藏': 'Favorite',
  '浏览': 'View',
  '加入购物车': 'Add to Cart',
  '收藏商品': 'Favorite Product',
  '已收藏': 'Favorited',
  '立即购买': 'Buy Now',
  '商品已加入购物车': 'Added to cart',
  '加入购物车失败': 'Failed to add to cart',
  '商品加载失败': 'Product failed to load',
  '品牌不存在': 'Brand not found',
  '品牌信息加载失败': 'Brand failed to load',
  '数量': 'Quantity',
  '小计': 'Subtotal',
  '结算': 'Checkout',
  '提交订单': 'Place Order',
  '购物车为空': 'Your cart is empty',
  '去选购': 'Shop Now',
  '已选择': 'Selected',
  '件商品': 'items',
  '确认下单': 'Confirm Order',
  '选择收货地址': 'Select Address',
  '新增收货地址': 'Add Address',
  '订单备注': 'Order Note',
  '选填，给商家留言': 'Optional message for the merchant',
  '确认单加载失败': 'Checkout failed to load',
  '请选择收货地址': 'Please select a shipping address',
  '请选择商品': 'Please select items',
  '订单创建失败': 'Order creation failed',
  '支付方式选择': 'Choose Payment Method',
  '创建支付订单': 'Create Payment',
  '本地支付已自动确认，订单已进入待发货流程。': 'Local payment confirmed automatically. The order is now awaiting shipment.',
  '支付记录加载失败': 'Payment record failed to load',
  '支付状态查询失败': 'Payment status failed to load',
  '支付创建失败': 'Payment creation failed',
  '取消支付失败': 'Payment cancellation failed',
  '确认取消支付？': 'Cancel this payment?',
  '取消支付': 'Cancel Payment',
  '待审核': 'Pending Review',
  '已同意': 'Approved',
  '已拒绝': 'Rejected',
  '退款中': 'Refunding',
  '退款成功': 'Refunded',
  '退款失败': 'Refund Failed',
  '已取消': 'Cancelled',
  '退款申请': 'Refund Request',
  '退款列表加载失败': 'Refund list failed to load',
  '确认取消该退款申请？': 'Cancel this refund request?',
  '取消退款申请失败': 'Failed to cancel refund request',
  '查看订单': 'View Orders',
  '退款金额': 'Refund Amount',
  '退款原因': 'Refund Reason',
  '补充说明': 'Additional Details',
  '补充商品、物流或订单问题': 'Add product, logistics, or order details',
  '提交退款申请': 'Submit Refund Request',
  '退款须知': 'Refund Notes',
  '退款申请提交后进入待审核状态，可在审核前取消。': 'Refund requests enter pending review and can be cancelled before review.',
  '退款金额不能超过订单实付金额，累计退款也不能超过订单金额。': 'The refund amount cannot exceed the order payment, including cumulative refunds.',
  '本地模板只创建退款申请记录，真实原路退款需要后台审核和支付环境配置。': 'This local template only creates refund records. Original-route refunds require admin review and payment configuration.',
  '中文': 'Chinese',
  '英文': 'English',
  '语言': 'Language',
  '工作台': 'Dashboard',
  '管理端工作台': 'Admin Dashboard',
  '当前迁移状态': 'Current Migration Status',
  '前端框架': 'Frontend Stack',
  '接口协议': 'API Contract',
  '迁移方式': 'Migration Mode',
  '部署输出': 'Deployment Output',
  '模块逐页迁移': 'Module-by-module migration',
  '商品、品牌、分类、用户、轮播图和系统设置已迁移到 Vue 3 专用页面。': 'Products, brands, categories, users, banners, and system settings have been migrated to dedicated Vue 3 pages.',
  '订单列表、订单详情、高级操作、确认收款、发货、备注和退款审核已迁移到 Vue 3 页面。': 'Order list, order detail, advanced operations, payment confirmation, delivery, notes, and refund review have been migrated to Vue 3 pages.',
  '角色权限和邮件模板已迁移到 Vue 3 页面，菜单/资源分配与模板启停可直接操作。': 'Roles, permissions, and email templates have been migrated to Vue 3 pages with menu/resource assignment and template status operations.',
  '后端 template 已切到 PostgreSQL 和本地上传，前端默认通过 VITE_BASE_API 指向 admin 服务。': 'The backend template now uses PostgreSQL and local uploads; the frontend points to the admin service through VITE_BASE_API by default.',
  'Actions 保留手动 S3 同步开关，默认只构建，不自动部署。': 'Actions keep a manual S3 sync switch and only build by default.',
  '概览': 'Overview',
  '运营': 'Operations',
  '系统': 'System',
  '迁移计划': 'Migration Plan',
  'Vue2 页面迁移计划': 'Vue 2 Page Migration Plan',
  '保留接口契约': 'Keep API Contracts',
  '请求路径、登录 token 和分页参数沿用旧 admin，减少后端改动。': 'Reuse legacy admin request paths, login tokens, and pagination parameters to reduce backend changes.',
  '先迁移通用列表': 'Migrate common lists first',
  '核心列表和复杂表单已从 ResourceListPage 迁到专用页面，继续保留旧 admin 接口契约。': 'Core lists and complex forms have moved from ResourceListPage to dedicated pages while keeping legacy admin API contracts.',
  '再迁移复杂表单': 'Then migrate complex forms',
  '商品、品牌分类、订单高级操作、退款审核、用户/管理员、轮播图、系统设置、角色权限和邮件模板已迁出，后续进入最终缺口审计。': 'Products, brand categories, advanced order operations, refund review, users/admins, banners, settings, roles, permissions, and email templates have been migrated; final gap audit follows.',
  '抽项目定制层': 'Extract project customization',
  '菜单、字段、上传、静态部署和主题作为模板配置扩展，不再绑定原 mall 项目。': 'Menus, fields, uploads, static deployment, and theme are template extensions and no longer tied to the original mall project.',
  '商品管理': 'Product Management',
  '管理商品资料、价格库存、上下架、新品推荐和删除状态。': 'Manage product data, prices, stock, publish status, new/recommended flags, and deletion status.',
  '新增商品': 'New Product',
  '编辑商品': 'Edit Product',
  '导出当前筛选': 'Export Current Filter',
  '商品名称关键字': 'Product name keyword',
  '货号': 'SKU',
  '上架状态': 'Publish Status',
  '审核状态': 'Review Status',
  '图片': 'Image',
  '上架': 'Published',
  '下架': 'Unpublished',
  '已审核': 'Approved',
  '未审核': 'Unreviewed',
  '非新品': 'Not New',
  '不推荐': 'Not Recommended',
  '已设为推荐': 'Marked as recommended',
  '已取消推荐': 'Recommendation removed',
  '已设为新品': 'Marked as new',
  '已取消新品': 'New flag removed',
  '商品已上架': 'Product published',
  '商品已下架': 'Product unpublished',
  '商品已删除': 'Product deleted',
  '品牌管理': 'Brand Management',
  '品牌列表': 'Brands',
  '品牌和前台展示字段保留原后端接口，表单迁移时可复用同一请求层。': 'Brand and storefront display fields keep the original backend API so forms can reuse the same request layer.',
  '新增品牌': 'New Brand',
  '编辑品牌': 'Edit Brand',
  '品牌名称': 'Brand Name',
  '首字母': 'Initial',
  '显示': 'Visible',
  '制造商': 'Manufacturer',
  '品牌副标题': 'Brand Subtitle',
  '大图': 'Hero Image',
  'Logo': 'Logo',
  '商品分类管理': 'Category Management',
  '默认读取一级分类，二级分类和前台分类编辑可继续从旧页面迁移。': 'Level-one categories are loaded by default; level-two categories and storefront category editing can continue from legacy pages.',
  '分类名称': 'Category Name',
  '商品数': 'Product Count',
  '导航栏': 'Navigation',
  '图标': 'Icon',
  '订单管理': 'Order Management',
  '保留订单分页查询入口，详情、发货、导出等操作后续逐步迁移。': 'Keep paged order queries while detail, delivery, export, and other operations are migrated gradually.',
  '订单列表': 'Orders',
  '订单号': 'Order No.',
  '用户': 'User',
  '用户列表': 'Users',
  '订单金额': 'Order Amount',
  '创建时间': 'Created At',
  '最后登录': 'Last Login',
  '确认收款': 'Confirm Payment',
  '发货': 'Ship',
  '关闭': 'Close',
  '修改收货信息': 'Edit Shipping Info',
  '修改费用': 'Edit Amount',
  '退款审核': 'Refund Review',
  '退款单号': 'Refund No.',
  '审核通过': 'Approve',
  '审核拒绝': 'Reject',
  '处理退款': 'Process Refund',
  '商城用户': 'Mall Users',
  '商城用户管理入口，冻结、角色分配等操作在后续页面迁移中补齐。': 'Mall user management entry; freeze and role assignment are completed in later page migration.',
  '头像': 'Avatar',
  '手机': 'Phone',
  '冻结': 'Freeze',
  '批量冻结': 'Freeze Selected',
  '管理员': 'Administrators',
  '新增管理员': 'New Admin',
  '编辑管理员': 'Edit Admin',
  '管理后台账号、启停状态、基础资料和角色分配。': 'Manage admin accounts, enabled status, profile data, and role assignments.',
  '账号': 'Account',
  '姓名': 'Name',
  '启用': 'Enabled',
  '初始密码': 'Initial Password',
  '编辑时留空则不修改': 'Leave blank while editing to keep unchanged',
  '分配角色': 'Assign Roles',
  '角色': 'Roles',
  '请选择角色': 'Select roles',
  '管理员已更新': 'Admin updated',
  '管理员已创建': 'Admin created',
  '管理员已删除': 'Admin deleted',
  '角色分配已保存': 'Role assignment saved',
  '请填写账号': 'Please enter an account',
  '请填写初始密码': 'Please enter an initial password',
  '邮箱格式不正确': 'Invalid email format',
  '确认修改该管理员状态？': 'Change this admin status?',
  '管理员状态': 'Admin Status',
  '角色权限': 'Roles & Permissions',
  '角色名称': 'Role Name',
  '角色描述': 'Role Description',
  '菜单分配': 'Assign Menus',
  '资源分配': 'Assign Resources',
  '邮件模板': 'Email Templates',
  '添加模板': 'Add Template',
  '编辑邮件模板': 'Edit Email Template',
  '添加邮件模板': 'Add Email Template',
  '维护订单通知、单号通知、注册确认、修改订单和找回密码等邮件内容。': 'Maintain email content for order notices, tracking notices, registration confirmation, order changes, and password recovery.',
  '模板名称': 'Template Name',
  '触发场景': 'Trigger Scene',
  '邮件标题': 'Email Subject',
  '邮件内容': 'Email Body',
  '订单通知': 'Order Notice',
  '单号通知': 'Tracking Notice',
  '注册确认': 'Registration Confirmation',
  '修改订单': 'Order Change',
  '禁用': 'Disabled',
  '邮件模板已更新': 'Email template updated',
  '邮件模板已创建': 'Email template created',
  '邮件模板已删除': 'Email template deleted',
  '请选择要删除的模板': 'Select templates to delete',
  '已批量删除': 'Batch delete complete',
  '批量删除': 'Batch Delete',
  '请填写模板名称': 'Please enter a template name',
  '请选择触发场景': 'Please select a trigger scene',
  '请填写邮件标题': 'Please enter an email subject',
  '请填写邮件内容': 'Please enter email content',
  '系统设置': 'System Settings',
  '系统配置项列表，适合模板化后按项目扩展配置中心。': 'System configuration list, suitable for template-level project configuration.',
  '说明': 'Description',
  '轮播图': 'Banners',
  '营销轮播图列表，上传和编辑表单迁移时会接入后端本地上传能力。': 'Marketing banner list; upload and edit forms use backend local upload capabilities.',
  '名称': 'Name',
  '链接': 'Link',
  '上传图片': 'Upload Image',
  '上传成功但未返回图片地址': 'Upload succeeded but no image URL was returned',
  '查询': 'Search',
  '重置': 'Reset',
  '刷新': 'Refresh',
  '操作': 'Actions',
  '确认': 'Confirm',
  '状态已更新': 'Status updated',
  '返回工作台': 'Back to Dashboard',
  '退出': 'Sign Out',
  '切换侧边栏': 'Toggle Sidebar',
  '暂无管理员': 'No administrators',
  '暂无邮件模板': 'No email templates'
}

const fragments: Record<string, string> = {
  '全部': 'All',
  '待付款': 'pending payment',
  '待发货': 'awaiting shipment',
  '已发货': 'shipped',
  '已完成': 'completed',
  '已关闭': 'closed',
  '退款': 'refunds',
  '订单': 'orders',
  '商品': 'products',
  '地址': 'addresses',
  '记录': 'records',
  '品牌': 'brands',
  '用户': 'users',
  '状态': 'status',
  '列表': 'list',
  '详情': 'details',
  '加载': 'load'
}

const substitutionPairs = Object.entries({
  '支付方式列表': 'Payment methods',
  '支付订单': 'Payment order',
  '支付状态': 'Payment status',
  '支付确认': 'Payment confirmation',
  '支付记录': 'Payment record',
  '退款申请ID列表': 'Refund request ID list',
  '退款申请': 'Refund request',
  '累计退款金额': 'Total refund amount',
  '退款金额': 'Refund amount',
  '订单金额': 'Order amount',
  '订单状态': 'Order status',
  '邮箱验证邮件': 'Email verification message',
  '邮箱验证': 'Email verification',
  '密码重置邮件': 'Password reset email',
  '密码重置': 'Password reset',
  '密码修改': 'Password update',
  '邮件发送': 'Email send',
  '会员信息更新': 'Member profile update',
  '地址修改': 'Address update',
  '支付金额': 'Payment amount',
  '订单号': 'Order number',
  '订单ID列表': 'Order ID list',
  '订单ID': 'Order ID',
  '原密码': 'Current password',
  '旧密码': 'Current password',
  '重置链接': 'Reset link',
  '验证链接': 'Verification link',
  '电话号码': 'Phone number',
  '客服微信图片': 'customer service WeChat image',
  '文件路径': 'file path',
  '上传文件': 'upload file',
  '当前状态': 'Current status',
  '当前订单状态': 'Current order status',
  '暂无': 'No ',
  '确认': 'Confirm ',
  '请选择': 'Please select ',
  '请使用': 'Please use ',
  '不能为空': 'is required',
  '不存在': 'not found',
  '不匹配': 'does not match',
  '不可': 'cannot ',
  '不允许': 'does not allow',
  '无权限': 'No permission',
  '无权': 'No permission',
  '无效': 'Invalid',
  '非法': 'Invalid',
  '过期': 'expired',
  '已经': 'already',
  '无需': 'no need to',
  '重复': 'repeat',
  '申请': 'Apply',
  '查询': 'Query',
  '获取': 'Get',
  '创建': 'Create',
  '更新': 'Update',
  '修改': 'Update',
  '删除': 'Delete',
  '处理': 'Process',
  '审核': 'Review',
  '发送': 'Send',
  '验证': 'Verify',
  '保存': 'Save',
  '加载失败': 'failed to load',
  '失败': 'failed',
  '异常': 'error',
  '错误': 'error',
  '成功': 'success',
  '已': '',
  '中': 'in progress',
  '全部': 'All',
  '待付款': 'Pending payment',
  '待发货': 'Awaiting shipment',
  '已发货': 'Shipped',
  '已完成': 'Completed',
  '已关闭': 'Closed',
  '退款': 'Refund',
  '订单': 'Order',
  '支付': 'Payment',
  '密码': 'Password',
  '邮箱': 'Email',
  '邮件': 'Email',
  '参数': 'Parameters',
  '文件': 'File',
  '图片': 'Image',
  '客服': 'Customer service',
  '商品': 'Product',
  '品牌': 'Brand',
  '分类': 'Category',
  '用户': 'User',
  '会员': 'Member',
  '账户': 'Account',
  '地址': 'Address',
  '列表': 'List',
  '详情': 'Details',
  '状态': 'Status',
  '时间': 'Time',
  '金额': 'Amount',
  '信息': 'Information'
}).sort((a, b) => b[0].length - a[0].length)

function readInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'zh' ? 'zh' : 'en'
}

function hasHan(value: string) {
  return /[\u3400-\u9fff]/.test(value)
}

function normalizeSpaces(value: string) {
  return value.replace(/\s+/g, ' ').replace(/\s+([,.?!:;])/g, '$1').trim()
}

function translateFragment(value: string) {
  return dictionary[value] || fragments[value] || translateCore(value).toLowerCase()
}

function sentenceCase(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value
}

function translateSubject(value: string) {
  return normalizeSpaces(translateCore(value)).toLowerCase()
}

function translateCore(value: string): string {
  const trimmed = value.trim()

  if (!hasHan(trimmed)) {
    return trimmed
  }

  if (dictionary[trimmed]) {
    return dictionary[trimmed]
  }

  const maxRefund = trimmed.match(/^最高可退 ¥(.+) JPY$/)
  if (maxRefund) {
    return `Refundable up to ¥${maxRefund[1]} JPY`
  }

  const emptyOrders = trimmed.match(/^暂无(.+)订单$/)
  if (emptyOrders) {
    return `No ${translateFragment(emptyOrders[1])} orders`
  }

  const emptyRefunds = trimmed.match(/^暂无(.+)退款$/)
  if (emptyRefunds) {
    return `No ${translateFragment(emptyRefunds[1])} refunds`
  }

  const totalItems = trimmed.match(/^共\s*(\d+)\s*件商品$/)
  if (totalItems) {
    return `${totalItems[1]} items`
  }

  const selectedItems = trimmed.match(/^已选择\s*(\d+)\s*件商品$/)
  if (selectedItems) {
    return `${selectedItems[1]} selected items`
  }

  const orderNo = trimmed.match(/^订单号[:：]\s*(.+)$/)
  if (orderNo) {
    return `Order No.: ${orderNo[1]}`
  }

  const brandInitial = trimmed.match(/^品牌首字母\s*(.+)$/)
  if (brandInitial) {
    return `Brand initial ${brandInitial[1]}`
  }

  const failureWithDetail = trimmed.match(/^(.+?)(失败|异常|错误)[:：]\s*(.+)$/)
  if (failureWithDetail) {
    const status = failureWithDetail[2] === '失败' ? 'failed' : 'error'
    return `${sentenceCase(translateSubject(failureWithDetail[1]))} ${status}: ${translateCore(failureWithDetail[3])}`
  }

  const successWithExtra = trimmed.match(/^(.+?)成功[，,]\s*(.+)$/)
  if (successWithExtra) {
    return `${sentenceCase(translateSubject(successWithExtra[1]))} succeeded. ${translateCore(successWithExtra[2])}`
  }

  const required = trimmed.match(/^(.+)不能为空$/)
  if (required) {
    return `${sentenceCase(translateSubject(required[1]))} is required`
  }

  const notFound = trimmed.match(/^(.+)不存在$/) || trimmed.match(/^未找到(.+)$/)
  if (notFound) {
    return `${sentenceCase(translateSubject(notFound[1]))} not found`
  }

  const incorrect = trimmed.match(/^(.+?)(错误|不正确)$/)
  if (incorrect) {
    return `${sentenceCase(translateSubject(incorrect[1]))} is incorrect`
  }

  const failed = trimmed.match(/^(.+)失败$/)
  if (failed) {
    return `${sentenceCase(translateSubject(failed[1]))} failed`
  }

  const succeeded = trimmed.match(/^(.+)成功$/)
  if (succeeded) {
    return `${sentenceCase(translateSubject(succeeded[1]))} succeeded`
  }

  const expired = trimmed.match(/^(.+)已经?过期[！!]?$/)
  if (expired) {
    return `${sentenceCase(translateSubject(expired[1]))} has expired`
  }

  const invalidOrExpired = trimmed.match(/^(.+)无效或已过期$/)
  if (invalidOrExpired) {
    return `${sentenceCase(translateSubject(invalidOrExpired[1]))} is invalid or expired`
  }

  const mismatch = trimmed.match(/^(.+)不匹配$/)
  if (mismatch) {
    return `${sentenceCase(translateSubject(mismatch[1]))} does not match`
  }

  const cannotExceed = trimmed.match(/^(.+)不能超过(.+)$/)
  if (cannotExceed) {
    return `${sentenceCase(translateSubject(cannotExceed[1]))} cannot exceed ${translateSubject(cannotExceed[2])}`
  }

  const currentStatusNotAllowed = trimmed.match(/^当前状态不允许(.+)$/)
  if (currentStatusNotAllowed) {
    return `The current status does not allow ${translateSubject(currentStatusNotAllowed[1])}`
  }

  const orderStatusNotAllowed = trimmed.match(/^订单状态不允许(.+)$/)
  if (orderStatusNotAllowed) {
    return `The order status does not allow ${translateSubject(orderStatusNotAllowed[1])}`
  }

  const currentOrderCannot = trimmed.match(/^当前订单状态不可(.+)$/)
  if (currentOrderCannot) {
    return `The current order status cannot ${translateSubject(currentOrderCannot[1])}`
  }

  const noPermission = trimmed.match(/^无权(.+)$/) || trimmed.match(/^无权限(.+)$/)
  if (noPermission) {
    return `No permission to ${translateSubject(noPermission[1])}`
  }

  const alreadyVerified = trimmed.match(/^(.+)已验证，无需重复验证$/)
  if (alreadyVerified) {
    return `${sentenceCase(translateSubject(alreadyVerified[1]))} is already verified`
  }

  const existsOrFailed = trimmed.match(/^(.+)已存在或保存失败$/)
  if (existsOrFailed) {
    return `${sentenceCase(translateSubject(existsOrFailed[1]))} already exists or failed to save`
  }

  let translated = trimmed
  for (const [source, target] of substitutionPairs) {
    translated = translated.split(source).join(` ${target} `)
  }

  return normalizeSpaces(translated)
}

export function translateText(value: string, locale: Locale = localeState.locale) {
  if (locale === 'zh') {
    return value
  }

  const leading = value.match(/^\s*/)?.[0] || ''
  const trailing = value.match(/\s*$/)?.[0] || ''
  const core = value.trim()

  if (!core) {
    return value
  }

  return `${leading}${translateCore(core)}${trailing}`
}

export function translateApiMessage(value: string, fallback = 'Request failed') {
  if (localeState.locale === 'zh') {
    return value
  }

  const translated = translateText(value)
  return hasHan(translated) ? fallback : translated
}

function translateAttr(element: Element, name: string) {
  const current = element.getAttribute(name)
  if (!current) {
    return
  }

  let originals = attrValues.get(element)
  if (!originals) {
    originals = new Map()
    attrValues.set(element, originals)
  }

  const previous = originals.get(name)

  if (localeState.locale === 'zh') {
    if (previous && current !== previous) {
      element.setAttribute(name, previous)
    }
    return
  }

  let source = previous || current
  const previousTranslation = previous ? translateText(previous, 'en') : null

  if (!previous) {
    originals.set(name, current)
  } else if (current !== previousTranslation) {
    source = current
    originals.set(name, current)
  }

  const translated = translateText(source, 'en')
  if (translated !== current) {
    element.setAttribute(name, translated)
  }
}

function translateTextNode(node: Text) {
  const current = node.data
  if (!current.trim()) {
    return
  }

  const previous = textNodes.get(node)

  if (localeState.locale === 'zh') {
    if (previous && current !== previous) {
      node.data = previous
    }
    return
  }

  let source = previous || current
  const previousTranslation = previous ? translateText(previous, 'en') : null

  if (!previous) {
    textNodes.set(node, current)
  } else if (current !== previousTranslation) {
    source = current
    textNodes.set(node, current)
  }

  const translated = translateText(source, 'en')
  if (translated !== current) {
    node.data = translated
  }
}

function shouldSkip(element: Element) {
  const tag = element.tagName.toLowerCase()
  return tag === 'script' || tag === 'style' || tag === 'svg' || element.hasAttribute('data-no-translate')
}

function applyTranslations(root: ParentNode = document.body) {
  if (typeof document === 'undefined' || applying) {
    return
  }

  applying = true

  try {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE && shouldSkip(node as Element)) {
          return NodeFilter.FILTER_REJECT
        }
        return NodeFilter.FILTER_ACCEPT
      }
    })

    let node: Node | null = walker.currentNode
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        translateTextNode(node as Text)
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (const attr of translatedAttrs) {
          translateAttr(node as Element, attr)
        }
      }
      node = walker.nextNode()
    }
  } finally {
    applying = false
  }
}

function scheduleTranslations() {
  window.requestAnimationFrame(() => applyTranslations())
}

function patchDialogs() {
  const win = window as Window & {
    __mallLocaleDialogsPatched?: boolean
    __mallOriginalConfirm?: typeof window.confirm
    __mallOriginalAlert?: typeof window.alert
  }

  if (win.__mallLocaleDialogsPatched) {
    return
  }

  win.__mallLocaleDialogsPatched = true
  win.__mallOriginalConfirm = window.confirm.bind(window)
  win.__mallOriginalAlert = window.alert.bind(window)

  window.confirm = message => win.__mallOriginalConfirm?.(translateText(String(message))) ?? false
  window.alert = message => win.__mallOriginalAlert?.(translateText(String(message)))
}

export function installLocale() {
  if (typeof window === 'undefined') {
    return
  }

  document.documentElement.lang = localeState.locale
  patchDialogs()

  nextTick(() => {
    applyTranslations()
    observer = new MutationObserver(() => {
      if (!applying) {
        scheduleTranslations()
      }
    })
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: translatedAttrs
    })
  })
}

export function setLocale(locale: Locale) {
  localeState.locale = locale
  window.localStorage.setItem(STORAGE_KEY, locale)
  document.documentElement.lang = locale
  applyTranslations()
}

export function setLocalizedDocumentTitle(title: unknown, suffix: string) {
  const pageTitle = String(title || suffix)
  document.title = `${translateText(pageTitle)} | ${suffix}`
}

export function useLocale() {
  const locale = computed(() => localeState.locale)
  const isEnglish = computed(() => localeState.locale === 'en')

  return {
    locale,
    isEnglish,
    setLocale,
    toggleLocale: () => setLocale(localeState.locale === 'en' ? 'zh' : 'en'),
    t: translateText
  }
}
