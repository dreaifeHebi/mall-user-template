export default {
  // 公共部分
  common: {
    confirm: '确认',
    cancel: '取消',
    loading: '加载中...',
    noData: '暂无数据',
    networkError: '网络错误，请重试',
    success: '操作成功',
    failed: '操作失败',
    submit: '提交',
    save: '保存',
    edit: '编辑',
    delete: '删除',
    clear: '清空',
    search: '搜索',
    back: '返回',
    home: '首页',
    category: '分类',
    cart: '购物车',
    profile: '个人中心',
    login: '登录',
    logout: '退出登录',
    register: '注册',
    refresh: '刷新',
    more: '更多',
    all: '全部',
    noTime: '暂无时间',
    timeFormatError: '时间格式错误',
    timeParseError: '时间解析失败',
    refreshSuccess: '刷新成功',
    refreshFailed: '刷新失败,请重试',
    tips: '提示',
    tip: '提示',
    pleaseWait: '请稍后',
    update: '更新',
    updating: '更新中...',
    retry: '重试',
    retryPrompt: '是否重新加载?',
    underConstruction: '建设中',
    // 后台API标准消息映射
    apiMessages: {
      '操作成功': '操作成功',
      '操作失败': '操作失败',
      '参数检验失败': '参数检验失败',
      '暂未登录或token已经过期': '暂未登录或token已经过期',
      '没有相关权限': '没有相关权限'
    }
  },

  // 分享相关
  share: {
    wechatFriend: '微信好友',
    wechatMoment: '朋友圈',
    qqFriend: 'QQ好友',
    qqZone: 'QQ空间'
  },

  // 首页
  index: {
    searchPlaceholder: '输入商品名称',
    enterProductName: '请输入商品名称',
    allProducts: '全部商品',
    topSales: '销量前{rank}',
    aboutUs: '关于我们',
    contactService: '联系客服',
    helpCenter: '帮助中心',
    wechatService: '微信客服',
    scanQrcode: '扫描下方二维码添加客服微信',
    workingHours: '工作时间：周一至周日 9:00-22:00',
    noQrcode: '暂无客服二维码',
    browseMore: '浏览更多>',
    afterSalesNotice: {
      title: '售后及责任说明',
      item1: '1.如因海关原因导致货物被扣留，本公司承诺免费进行一次补发。（客户无需承担任何费用）',
      item2: '2.如海关产生税费，客户需先行垫付相关费用，本公司将在核实后全额予以补偿。',
      item3: '3.本公司除个别特殊标注商品外，所售香烟均为日本本土正规渠道商品（非免税版）。',
      item4: '4.本公司郑重承诺，所有商品均为正品香烟，如经核实为假货，假一赔十。'
    }
  },

  // 用户相关
  user: {
    profile: '个人资料',
    settings: '设置',
    orders: '我的订单',
    favorites: '我的收藏',
    address: '收货地址',
    points: '积分',
    feedback: '意见反馈',
    about: '关于我们',
    language: 'Language 语言设置',
    languageTitle: '选择语言 Select Language',
    chinese: '中文 Chinese',
    english: 'English 英文',
    
    // 侧边栏菜单
    sidebarMenu: {
      language: '语言设置',
      contactService: '联系客服',
      helpCenter: '帮助中心',
      categories: '分类',
      aboutUs: '关于我们'
    },
    allOrders: '全部订单',
    pendingPayment: '待付款',
    pendingDelivery: '待发货',
    refundAfterSale: '退款/售后',
    myFootprint: '我的足迹',
    myCollection: '我的收藏',
    myAttention: '我的关注',
    guest: '游客',
    username: '用户名',
    nickname: '昵称',
    phone: '手机号',
    email: '邮箱',
    notSet: '未设置',
    verified: '已验证',
    unverified: '未验证',
    sending: '发送中...',
    verify: '验证',
    clearHistoryConfirm: '是否要清空所有浏览记录？',
    profileAction: '个人资料',
    profileTagline: '点击查看个人资料',
    noticePageDesc: '这里集中展示客户下单须知与免责说明。',
    menu: {
      currentOrders: '当前订单状态',
      currentOrdersDesc: '优先定位到当前有订单的状态',
      historyOrders: '历史订单记录',
      historyOrdersDesc: '查看已完成订单',
      commonAddress: '常用地址',
      commonAddressDesc: '进入地址管理',
      points: '我的积分',
      pointsDesc: '积分页建设中',
      notice: '注意事项',
      noticeDesc: '查看下单须知和免责说明',
      contact: '联系我们',
      contactDesc: '弹出客服二维码'
    }
  },

  // 商品相关
  product: {
    detail: '商品详情',
    price: '价格',
    stock: '库存',
    sales: '销量',
    views: '浏览',
    addToCart: '加入购物车',
    buyNow: '立即购买',
    specifications: '规格参数',
    description: '商品介绍',
    reviews: '商品评价',
    brand: '品牌',
    model: '型号',
    outOfStock: '库存不足',
    selectSpec: '请选择商品规格',
    loadFailedMessage: '加载商品详情失败',
    unfavoriteSuccess: '取消收藏成功！',
    favoriteSuccess: '收藏成功！',
    buyFromCartOnly: '暂时只支持从购物车下单！',
    maxQuantityExceeded: '该商品最多购买12件，当前购物车已有{current}件',
    stockInsufficient: '商品库存不足，当前库存{stock}件',
    addToCartFailed: '添加到购物车失败',
    unitPrice: '单支价格',
    packageQuantity: '包装数量',
    nicotineContent: '尼古丁含量',
    tarContent: '焦油量'
  },

  // 订单相关
  order: {
    list: '订单列表',
    detail: '订单详情',
    status: {
      pending: '待付款',
      paid: '已付款',
      shipped: '待发货',
      delivered: '待收货',
      completed: '已完成',
      cancelled: '已取消',
      unknown: '状态未知',
      '0': '等待付款',
      '1': '待发货',
      '2': '已发货',
      '3': '已完成',
      '4': '已关闭'
    },
    create: '创建订单',
    createSuccessConfirm: '订单创建成功，是否立即支付？',
    createSuccessAction: '添加客服💁',
    pay: '立即付款',
    cancel: '取消订单',
    confirm: '确认收货',
    total: '订单总计',
    totalAmount: '小计',
    shipping: '运费',
    discount: '折扣',
    actualPay: '实付款',
    productInfo: '商品信息',
    submitOrder: '提交订单',
    actualPayment: '实付款',
    note: '备注',
    notePlaceholder: '备注信息（选填）',
    goodsInfo: '商品信息',
    goodsTotal: '商品合计',
    freight: '运费',
    noNote: '无',
    orderNumber: '订单编号',
    submitTime: '提交时间',
    payMethod: '支付方式',
    paidAmount: '实付金额',
    payTime: '付款时间',
    totalPayable: '应付金额',
    cancelOrder: '取消订单',
    payNow: '立即付款',
    modifyAddress: '修改地址',
    viewLogistics: '查看物流',
    confirmReceipt: '确认收货',
    applyRefund: '申请退款',
    contactService: '联系客服',
    wechatService: '微信客服',
    scanQrCode: '扫描下方二维码，添加客服微信',
    qrCodeError: '二维码加载失败',
    qrCodeLoading: '加载中...',
    noQrCode: '暂无客服二维码',
    workingHours: '工作时间：周一至周日 9:00-22:00',
    cancelConfirm: '是否要取消该订单？',
    receiveConfirm: '是否要确认收货？',
    payType: {
      unknown: '支付方式未知',
      unpaid: '未支付',
      alipay: '支付宝支付',
      wechat: '微信支付',
      bankCard: '银行卡支付',
      other: '其他支付方式'
    },
    refund: {
      amount: '退款金额：',
      applyTime: '申请时间：',
      processTime: '处理时间：'
    },
    note: '备注',
    notePlaceholder: '请输入备注信息',
    submitOrder: '提交订单',
    allOrders: '全部',
    waitingShipment: '待发货',
    waitingReceive: '待收货',
    totalItems: '共',
    itemsActualPay: '件商品 实付款',
    modifyAddress: '修改地址',
    viewLogistics: '查看物流',
    insufficientPoints: '您的积分只有{points}',
    copy: '复制',
    deleteConfirm: '是否要删除该订单？',
    orderNotice: {
      title: '客户下单须知',
      item1: '1.客户须如实填写完整、真实、有效的收货地址及联系电话。',
      item2: '2.订单确认后3个工作日内，本公司将通过电子邮件发送物流单号回执，请客户自行关注物流状态，并于第一时间完成签收。',
      item3: '3.如客户对包裹内容或运输状况存在任何疑问，请务必全程录制开箱视频，并在第一时间联系客户服务人员处理。',
      item4: '4.问题地址请勿重复使用。'
    },
    disclaimer: {
      title: '免责及责任说明',
      content: '若因客户提供的收货地址或联系电话不真实、不完整或无效，导致包裹发生丢失、退运、损坏、延误或无法签收等情况，由此产生的一切费用及损失均由客户自行承担，本公司不承担相关责任。'
    }
  },

  // 退款相关
  refund: {
    status: {
      pendingReviewDesc: '您的退款申请已提交，正在等待商家审核',
      approvedDesc: '退款申请已通过审核，正在为您处理退款',
      rejectedDesc: '退款申请被拒绝，请查看拒绝原因',
      processingDesc: '退款正在处理中，请耐心等待',
      completedDesc: '退款已完成，请注意查收',
      failedDesc: '退款处理失败，请联系客服',
      cancelledDesc: '退款申请已取消',
      unknown: '状态未知'
    },
    // 退款申请页面
    orderInfo: '订单信息',
    orderNumber: '订单号',
    orderAmount: '订单金额',
    paymentTime: '支付时间',
    refundInfo: '退款信息',
    refundAmount: '退款金额',
    enterRefundAmount: '请输入退款金额',
    maxRefundAmount: '最多可退款',
    refundReason: '退款原因',
    selectReason: '请选择退款原因',
    detailDescription: '详细说明',
    descriptionPlaceholder: '请详细描述退款原因，以便我们更好地为您处理（选填）',
    refundNotice: '退款须知',
    noticeItem1: '退款申请提交后，我们将在1-3个工作日内进行审核',
    noticeItem2: '审核通过后，退款将在3-7个工作日内到账',
    noticeItem3: '退款将原路返回到您的支付账户',
    noticeItem4: '如有疑问，请联系客服',
    submitApplication: '提交退款申请',
    confirmRefundContent: '确认申请退款 ¥{amount} 吗？',
    reasons: {
      qualityIssue: '商品质量问题',
      descriptionMismatch: '商品描述不符',
      shippingIssue: '物流配送问题',
      dontLike: '不喜欢/不想要',
      duplicateOrder: '重复下单',
      other: '其他原因'
    },
    loadOrderFailed: '加载订单信息失败',
    completeInfo: '请完善退款信息',
    amountMustPositive: '退款金额必须大于0',
    amountExceedsOrder: '退款金额不能超过订单金额',
    confirmSubmit: '确认提交',
    submitting: '提交中...',
    submitSuccess: '申请提交成功',
    submitFailed: '申请提交失败',
    loadFailed: '加载失败',
    networkError: '网络错误，请重试',
    confirmCancel: '确认取消',
    cancelConfirmContent: '确认取消退款申请吗？取消后不可恢复',
    confirmCancelBtn: '确认取消',
    dontCancel: '不取消',
    cancelling: '取消中...',
    cancelSuccess: '取消成功',
    cancelFailed: '取消失败'
  },

  // 购物车相关（合并两个cart部分）
  cart: {
    empty: '购物车为空',
    browseMore: '去逛逛>',
    clearCart: '清空购物车',
    checkout: '去结算',
    totalAmount: '合计',
    deleteItem: '删除商品',
    quantity: '数量',
    loadFailed: '加载购物车失败',
    updateQuantityFailed: '更新商品数量失败',
    deleteFailed: '删除商品失败',
    confirmClear: '清空购物车？',
    clearFailed: '清空失败',
    noSelectedItems: '您还未选择要下单的商品！',
    invalidData: '购物车数据异常，请刷新页面重试',
    needMoreItems: '还差{count}件即可结账',
    // 本地购物车工具函数消息
    localCart: {
      addSuccess: '已添加到购物车',
      addFailed: '添加到购物车失败',
      empty: '本地购物车为空',
      syncFailed: '购物车同步失败',
      syncSuccess: '购物车同步成功',
      syncPartial: '购物车同步完成，{success}件成功，{fail}件失败'
    }
  },

  // 用户信息相关
  userinfo: {
    emailRequired: '请先设置邮箱',
    editNickname: '编辑昵称',
    editPhone: '编辑电话',
    enterNickname: '请输入昵称',
    countryCode: '区号',
    phoneNumber: '电话号码',
    nicknameRequired: '昵称不能为空',
    phoneRequired: '请填写完整的电话号码',
    phoneFormatError: '电话号码格式错误',
    updateSuccess: '更新成功',
    updateFailed: '更新失败'
  },

  // 地址管理
  address: {
    manage: '地址管理',
    add: '添加地址',
    addNew: '新增收货地址',
    edit: '编辑地址',
    delete: '删除地址',
    deleteConfirm: '确定要删除这个地址吗？',
    loginRequired: '请先登录查看地址管理',
    goLogin: '去登录',
    back: '返回',
    setDefault: '设为默认',
    default: '默认',
    name: '收货人',
    phone: '手机号码',
    region: '所在地区',
    detail: '详细地址',
    namePlaceholder: '请输入收货人姓名',
    phonePlaceholder: '请输入手机号码',
    detailPlaceholder: '街道、门牌号等',
    changeConfirm: '确认要将订单地址改为',
    updating: '修改中...',
    updateSuccess: '地址修改成功',
    updateFailed: '修改失败',
    updateRetry: '修改失败，请稍后重试',
    country: '国家/地区',
    selectCountry: '选择国家/地区',
    selectCountryCode: '选择国家区号',
    postCode: '邮政编码',
    postCodePlaceholder: '收货人邮政编码',
    regionPlaceholder: '省/州、城市（用逗号分隔）',
    ukOnly: '当前仅支持英国地址',
    ukAddressRequired: '请先添加英国收货地址',
    ukPhoneFormatError: '请输入正确的英国手机号码'
  },

  // 品牌页面
  brand: {
    favoriteSuccess: '收藏成功！',
    favoriteFailed: '收藏失败',
    unfavoriteSuccess: '取消收藏成功！',
    unfavoriteFailed: '取消收藏失败',
    loginPrompt: '你还没登录，是否要登录？',
    productCount: '商品数量：{count}'
  },

  // 分类页面
  category: {
    title: '商品分类',
    productList: '商品列表',
    hot: '热销',
    new: '新品',
    sale: '特价',
    sortDefault: '默认',
    priceLowToHigh: '价格↑',
    priceHighToLow: '价格↓',
    sortBySales: '销量',
    pageInfo: '第{current}页 / 共{total}页，共{count}件商品',
    prevPage: '上一页',
    nextPage: '下一页',
    productCount: '商品数量：{count}',
    backToCategory: '返回分类',
    backToBrandList: '返回品牌列表'
  },

  // 设置页面
  settings: {
    title: '设置',
    account: '账户设置',
    privacy: '隐私设置',
    notification: '通知设置',
    cache: '清除缓存',
    version: '版本信息',
    logout: '退出登录',
    about: '关于我们',
    feedback: '意见反馈',
    help: '帮助中心'
  },

  // TabBar
  tabBar: {
    home: '首页',
    category: '分类',
    cart: '购物车',
    profile: '我的'
  },

  // 页面标题
  pageTitle: {
    home: 'Bananaman',
    category: '分类',
    cart: '购物车',
    profile: '我的',
    productDetail: '商品详情',
    orderList: '我的订单',
    refundApply: '申请退款',
    addressList: '地址管理',
    settings: '设置',
    personalInfo: '个人资料',
    myFootprint: '我的足迹',
    login: '登录',
    register: '注册',
    forgotPassword: '忘记密码',
    createOrder: '确认订单',
    orderDetail: '订单详情',
    about: '关于我们',
    help: '帮助中心',
    notice: '注意事项',
    contact: '联系客服',
    points: '我的积分',
    paySuccess: '支付成功',
    h5Pay: 'H5支付',
    h5Pay: 'H5支付'
  },

  money: {
    title: '我的积分',
    comingSoon: '建设中',
    comingSoonDesc: '积分功能还在开发，后续会在这里展示累计积分、可兑换权益和使用记录。'
  },

  // 支付相关
  payment: {
    viewOrder: '查看订单',
    backHome: '返回首页'
  },

  // 邮箱验证
  emailVerify: {
    verifying: '正在验证邮箱...',
    verifySuccess: '邮箱验证成功！',
    verifyFailed: '邮箱验证失败',
    backToProfile: '返回个人中心',
    resendEmail: '重新发送验证邮件',
    tokenMissing: '确认令牌缺失，请重新发送验证邮件',
    confirmSuccess: '邮箱确认成功，您的账户已激活',
    confirmFailed: '邮箱确认失败',
    confirmFailedRetry: '邮箱确认失败，请稍后重试',
    emailSent: '验证邮件已发送，请检查您的邮箱',
    sendFailed: '发送失败',
    sendFailedRetry: '发送失败，请稍后重试'
  },

  // H5支付
  h5Pay: {
    paymentAmount: '支付金额',
    selectPaymentMethod: '添加客服微信',
    alipayH5: '支付宝H5支付',
    alipayDesc: '推荐使用支付宝支付，安全便捷',
    wechatH5: '微信H5支付',
    wechatDesc: '使用微信支付，方便快捷',
    creditCard: '信用卡支付',
    creditCardDesc: '支持主流信用卡支付',
    orderNumber: '订单号：',
    receiver: '收货人：',
    productDesc: '商品描述：',
    confirmPayment: '确认支付',
    copyWechatId: '复制微信号',
    scanToAddService: '扫描二维码添加客服',
    queryingPayment: '正在查询支付结果...',
    doNotClose: '请稍候，不要关闭页面',
    cancelQuery: '取消查询',
    loadOrderFailed: '加载订单信息失败',
    selectPaymentRequired: '请选择支付方式',
    paymentSuccess: '支付成功',
    paymentCancelled: '支付已取消',
    paymentFailed: '支付失败',
    paymentStatusUnknown: '支付状态未知',
    queryPaymentFailed: '查询支付结果失败',
    orderSuffix: '的商品订单',
    creatingOrder: '创建支付订单...',
    redirectToPayment: '将在新窗口打开支付页面，请完成支付。支付完成后会自动返回结果',
    goToPay: '去支付'
  },

  // 关于我们
  about: {
    title: '关于我们',
    companyIntro: '公司简介',
    companyDescription: '我们致力于为用户提供优质的购物体验，汇集全球精选商品，为您带来便捷、安全、可靠的购物服务。',
    contact: '联系方式',
    wechat: '微信客服：',
    wechatValue: '点击查看二维码',
    whatsapp: 'WhatsApp：',
    whatsappValue: '点击联系',
    email: '邮箱：',
    emailCopied: '邮箱地址已复制',
    viewContactPage: '查看联系方式',
    serviceTime: '服务时间',
    serviceTimeValue: '周一至周日 9:00-22:00'
  },

  // 帮助中心
  help: {
    title: '帮助中心',
    faq: '常见问题',
    shoppingGuide: '购物指南',
    contactUs: '联系我们',
    contactDesc: '如果您的问题未能得到解决,请联系我们的客服团队',
    contactService: '联系客服',
    orderNotice: {
      title: '客户下单须知',
      item1: '1.客户须如实填写完整、真实、有效的收货地址及联系电话。',
      item2: '2.订单确认后3个工作日内,本公司将通过电子邮件发送物流单号回执,请客户自行关注物流状态,并于第一时间完成签收。',
      item3: '3.如客户对包裹内容或运输状况存在任何疑问,请务必全程录制开箱视频,并在第一时间联系客户服务人员处理。',
      item4: '4.问题地址请勿重复使用。'
    },
    faq1: {
      question: '如何下单购买商品？',
      answer: '选择您喜欢的商品，点击"立即购买"或"加入购物车"，然后按照提示完成订单信息填写和支付。'
    },
    faq2: {
      question: '支持哪些支付方式？',
      answer: '我们支持微信支付、支付宝、银行卡等多种支付方式，您可以选择最方便的方式进行支付。'
    },
    faq3: {
      question: '如何查看订单状态？',
      answer: '登录账户后，在"我的订单"页面可以查看所有订单的详细信息和物流状态。'
    },
    faq4: {
      question: '退换货政策是什么？',
      answer: '商品支持7天无理由退换货，商品需保持原包装完好。具体退换货流程请联系客服。'
    },
    faq5: {
      question: '多久能收到商品？',
      answer: '一般情况下，付款后1-3个工作日内发货，具体配送时间根据您的地址而定。'
    },
    guide1: {
      name: '购物流程',
      desc: '选择商品 → 加入购物车 → 确认订单 → 支付完成'
    },
    guide2: {
      name: '支付说明',
      desc: '支持多种支付方式，安全便捷'
    },
    guide3: {
      name: '物流配送',
      desc: '全国包邮，快速配送到家'
    },
    guide4: {
      name: '售后服务',
      desc: '7天无理由退换货，贴心服务'
    }
  },

  // 手势返回
  swipeBack: {
    releaseToReturn: '松手返回'
  },

  // 联系客服
  contact: {
    title: '联系客服',
    wechatService: '微信客服',
    scanQrcode: '扫描下方二维码，添加客服微信',
    loading: '加载中...',
    noQrcode: '暂无客服二维码',
    workingHours: '工作时间：周一至周日 9:00-22:00',
    otherMethods: '其他联系方式',
    wechatContact: '微信客服',
    wechatDesc: '查看上方二维码添加',
    whatsappContact: 'WhatsApp客服',
    whatsappDesc: '点击联系客服',
    emailContact: '邮箱联系',
    emailCopied: '邮箱地址已复制',
    scanWechatQrcode: '请查看上方微信二维码'
  },

  // 错误信息
  error: {
    loginRequired: '请先登录',
    networkError: '网络连接失败',
    serverError: '服务器错误',
    paramError: '参数错误',
    notFound: '页面未找到',
    permissionDenied: '权限不足'
  },

  // 提示信息
  tips: {
    addCartSuccess: '已加入购物车',
    deleteSuccess: '删除成功',
    saveSuccess: '保存成功',
    updateSuccess: '更新成功',
    loginSuccess: '登录成功',
    registerSuccess: '注册成功',
    logoutSuccess: '退出成功',
    copySuccess: '复制成功',
    loading: '加载中，请稍候...',
    noMore: '没有更多了'
  },

  // 认证
  auth: {
    login: '登录',
    register: '注册',
    logout: '退出登录',
    loginTitle: 'LOGIN',
    registerTitle: 'REGISTER',
    welcomeBack: '欢迎回来！',
    createAccount: '创建您的账户',
    username: '用户名',
    password: '密码',
    confirmPassword: '确认密码',
    email: '邮箱',
    phone: '手机',
    usernamePlaceholder: '请输入用户名',
    passwordPlaceholder: '请输入密码',
    confirmPasswordPlaceholder: '请确认密码',
    emailPlaceholder: '请输入邮箱*',
    phonePlaceholder: '请输入手机号（可选）',
    loginBtn: '登录',
    registerBtn: '注册',
    loggingIn: '登录中...',
    registering: '注册中...',
    forgetPassword: '忘记密码?',
    noAccount: '还没有账号?',
    hasAccount: '已有账号?',
    registerNow: '马上注册',
    loginNow: '马上登录',
    required: '必填项',
    usernameRequired: '请输入用户名',
    passwordRequired: '请输入密码',
    emailRequired: '请输入邮箱',
    confirmPasswordRequired: '请确认密码',
    passwordMismatch: '两次输入的密码不一致',
    emailInvalid: '邮箱格式不正确',
    phoneInvalid: '请输入正确的手机号格式',
    usernameLength: '用户名长度应在3-20个字符之间',
    passwordLength: '密码长度应在6-20个字符之间',
    resetPassword: '找回您的密码',
    resetEmailPlaceholder: '请输入注册时的邮箱',
    sending: '发送中...',
    loginRequired: '你还没登录，是否要登录？',
    goLogin: '去登录',
    logoutConfirm: '确定要退出登录么',
    emailSent: '邮件已发送',
    sendResetEmail: '发送重置邮件',
    resetTipEmail: '我们将向您的邮箱发送重置密码的链接',
    resetTipTime: '重置链接有效期为24小时',
    resetTipSpam: '请检查垃圾邮件文件夹',
    resetEmailSuccess: '密码重置邮件已发送到您的邮箱，请查收并按照邮件中的指示重置密码。',
    rememberPassword: '想起密码了?',
    backToLogin: '返回登录'
  }
}
