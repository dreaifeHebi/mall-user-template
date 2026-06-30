export default {
  // 公共部分
  common: {
    confirm: '確認',
    cancel: '取消',
    loading: '加載中...',
    noData: '暫無數據',
    networkError: '網絡錯誤，請重試',
    success: '操作成功',
    failed: '操作失敗',
    submit: '提交',
    save: '保存',
    edit: '編輯',
    delete: '刪除',
    clear: '清空',
    search: '搜索',
    back: '返回',
    home: '首頁',
    category: '分類',
    cart: '購物車',
    profile: '個人中心',
    login: '登錄',
    logout: '退出登錄',
    register: '註冊',
    refresh: '刷新',
    more: '更多',
    all: '全部',
    noTime: '暫無時間',
    timeFormatError: '時間格式錯誤',
    timeParseError: '時間解析失敗',
    refreshSuccess: '刷新成功',
    refreshFailed: '刷新失敗,請重試',
    tips: '提示',
    tip: '提示',
    pleaseWait: '請稍後',
    update: '更新',
    updating: '更新中...',
    retry: '重試',
    retryPrompt: '是否重新加載?',
    underConstruction: '建設中',
    // 後台API標準消息映射
    apiMessages: {
      '操作成功': '操作成功',
      '操作失敗': '操作失敗',
      '參數檢驗失敗': '參數檢驗失敗',
      '暫未登錄或token已經過期': '暫未登錄或token已經過期',
      '沒有相關權限': '沒有相關權限'
    }
  },

  // 分享相關
  share: {
    wechatFriend: '微信好友',
    wechatMoment: '朋友圈',
    qqFriend: 'QQ好友',
    qqZone: 'QQ空間'
  },

  // 首頁
  index: {
    searchPlaceholder: '輸入商品名稱',
    enterProductName: '請輸入商品名稱',
    allProducts: '全部商品',
    topSales: '銷量前{rank}',
    aboutUs: '關於我們',
    contactService: '聯繫客服',
    helpCenter: '幫助中心',
    wechatService: '微信客服',
    scanQrcode: '掃描下方二維碼添加客服微信',
    workingHours: '工作時間：週一至週日 9:00-22:00',
    noQrcode: '暫無客服二維碼',
    browseMore: '瀏覽更多>',
    afterSalesNotice: {
      title: '售後及責任說明',
      item1: '1.如因海關原因導致貨物被扣留，本公司承諾免費進行一次補發。（客戶無需承擔任何費用）',
      item2: '2.如海關產生稅費，客戶需先行墊付相關費用，本公司將在核實後全額予以補償。',
      item3: '3.本公司除個別特殊標註商品外，所售香煙均為日本本土正規渠道商品（非免稅版）。',
      item4: '4.本公司鄭重承諾，所有商品均為正品香煙，如經核實為假貨，假一賠十。'
    }
  },

  // 用戶相關
  user: {
    profile: '個人資料',
    settings: '設置',
    orders: '我的訂單',
    favorites: '我的收藏',
    address: '收貨地址',
    points: '積分',
    feedback: '意見反饋',
    about: '關於我們',
    language: 'Language 語言設置',
    languageTitle: '選擇語言 Select Language',
    chinese: '中文 Chinese',
    english: 'English 英文',
    
    // 側邊欄菜單
    sidebarMenu: {
      language: '語言設置',
      contactService: '聯繫客服',
      helpCenter: '幫助中心',
      categories: '分類',
      aboutUs: '關於我們'
    },
    allOrders: '全部訂單',
    pendingPayment: '待付款',
    pendingDelivery: '待發貨',
    refundAfterSale: '退款/售後',
    myFootprint: '我的足跡',
    myCollection: '我的收藏',
    myAttention: '我的關注',
    guest: '遊客',
    username: '用戶名',
    nickname: '暱稱',
    phone: '手機號',
    email: '郵箱',
    notSet: '未設置',
    verified: '已驗證',
    unverified: '未驗證',
    sending: '發送中...',
    verify: '驗證',
    clearHistoryConfirm: '是否要清空所有瀏覽記錄？',
    profileAction: '個人資料',
    profileTagline: '點擊查看個人資料',
    noticePageDesc: '這裡集中展示客戶下單須知與免責說明。',
    menu: {
      currentOrders: '當前訂單狀態',
      currentOrdersDesc: '優先定位到當前有訂單的狀態',
      historyOrders: '歷史訂單記錄',
      historyOrdersDesc: '查看已完成訂單',
      commonAddress: '常用地址',
      commonAddressDesc: '進入地址管理',
      points: '我的積分',
      pointsDesc: '積分頁建設中',
      notice: '注意事項',
      noticeDesc: '查看下單須知和免責說明',
      contact: '聯繫我們',
      contactDesc: '彈出客服二維碼'
    }
  },

  // 商品相關
  product: {
    detail: '商品詳情',
    price: '價格',
    stock: '庫存',
    sales: '銷量',
    views: '瀏覽',
    addToCart: '加入購物車',
    buyNow: '立即購買',
    specifications: '規格參數',
    description: '商品介紹',
    reviews: '商品評價',
    brand: '品牌',
    model: '型號',
    outOfStock: '庫存不足',
    selectSpec: '請選擇商品規格',
    loadFailedMessage: '加載商品詳情失敗',
    unfavoriteSuccess: '取消收藏成功！',
    favoriteSuccess: '收藏成功！',
    buyFromCartOnly: '暫時只支持從購物車下單！',
    maxQuantityExceeded: '該商品最多購買12件，當前購物車已有{current}件',
    stockInsufficient: '商品庫存不足，當前庫存{stock}件',
    addToCartFailed: '添加到購物車失敗',
    unitPrice: '單支價格',
    packageQuantity: '包裝數量',
    nicotineContent: '尼古丁含量',
    tarContent: '焦油量'
  },

  // 訂單相關
  order: {
    list: '訂單列表',
    detail: '訂單詳情',
    status: {
      pending: '待付款',
      paid: '已付款',
      shipped: '待發貨',
      delivered: '待收貨',
      completed: '已完成',
      cancelled: '已取消',
      unknown: '狀態未知',
      '0': '等待付款',
      '1': '待發貨',
      '2': '已發貨',
      '3': '已完成',
      '4': '已關閉'
    },
    create: '創建訂單',
    createSuccessConfirm: '訂單創建成功，是否立即支付？',
    createSuccessAction: '添加客服💁',
    pay: '立即付款',
    cancel: '取消訂單',
    confirm: '確認收貨',
    total: '訂單總計',
    totalAmount: '小計',
    shipping: '運費',
    discount: '折扣',
    actualPay: '實付款',
    productInfo: '商品信息',
    submitOrder: '提交訂單',
    actualPayment: '實付款',
    note: '備註',
    notePlaceholder: '備註信息（選填）',
    goodsInfo: '商品信息',
    goodsTotal: '商品合計',
    freight: '運費',
    noNote: '無',
    orderNumber: '訂單編號',
    submitTime: '提交時間',
    payMethod: '支付方式',
    paidAmount: '實付金額',
    payTime: '付款時間',
    totalPayable: '應付金額',
    cancelOrder: '取消訂單',
    payNow: '立即付款',
    modifyAddress: '修改地址',
    viewLogistics: '查看物流',
    confirmReceipt: '確認收貨',
    applyRefund: '申請退款',
    contactService: '聯繫客服',
    wechatService: '微信客服',
    scanQrCode: '掃描下方二維碼，添加客服微信',
    qrCodeError: '二維碼加載失敗',
    qrCodeLoading: '加載中...',
    noQrCode: '暫無客服二維碼',
    workingHours: '工作時間：週一至週日 9:00-22:00',
    cancelConfirm: '是否要取消該訂單？',
    receiveConfirm: '是否要確認收貨？',
    payType: {
      unknown: '支付方式未知',
      unpaid: '未支付',
      alipay: '支付寶支付',
      wechat: '微信支付',
      bankCard: '銀行卡支付',
      other: '其他支付方式'
    },
    refund: {
      amount: '退款金額：',
      applyTime: '申請時間：',
      processTime: '處理時間：'
    },
    note: '備註',
    notePlaceholder: '請輸入備註信息',
    submitOrder: '提交訂單',
    allOrders: '全部',
    waitingShipment: '待發貨',
    waitingReceive: '待收貨',
    totalItems: '共',
    itemsActualPay: '件商品 實付款',
    modifyAddress: '修改地址',
    viewLogistics: '查看物流',
    insufficientPoints: '您的積分只有{points}',
    copy: '複製',
    deleteConfirm: '是否要刪除該訂單？',
    orderNotice: {
      title: '客戶下單須知',
      item1: '1.客戶須如實填寫完整、真實、有效的收貨地址及聯繫電話。',
      item2: '2.訂單確認後3個工作日內，本公司將通過電子郵件發送物流單號回執，請客戶自行關注物流狀態，並於第一時間完成簽收。',
      item3: '3.如客戶對包裹內容或運輸狀況存在任何疑問，請務必全程錄製開箱視頻，並在第一時間聯繫客戶服務人員處理。',
      item4: '4.問題地址請勿重複使用。'
    },
    disclaimer: {
      title: '免責及責任說明',
      content: '若因客戶提供的收貨地址或聯繫電話不真實、不完整或無效，導致包裹發生丟失、退運、損壞、延誤或無法簽收等情況，由此產生的一切費用及損失均由客戶自行承擔，本公司不承擔相關責任。'
    }
  },

  // 退款相關
  refund: {
    status: {
      pendingReviewDesc: '您的退款申請已提交，正在等待商家審核',
      approvedDesc: '退款申請已通過審核，正在為您處理退款',
      rejectedDesc: '退款申請被拒絕，請查看拒絕原因',
      processingDesc: '退款正在處理中，請耐心等待',
      completedDesc: '退款已完成，請注意查收',
      failedDesc: '退款處理失敗，請聯繫客服',
      cancelledDesc: '退款申請已取消',
      unknown: '狀態未知'
    },
    // 退款申請頁面
    orderInfo: '訂單信息',
    orderNumber: '訂單號',
    orderAmount: '訂單金額',
    paymentTime: '支付時間',
    refundInfo: '退款信息',
    refundAmount: '退款金額',
    enterRefundAmount: '請輸入退款金額',
    maxRefundAmount: '最多可退款',
    refundReason: '退款原因',
    selectReason: '請選擇退款原因',
    detailDescription: '詳細說明',
    descriptionPlaceholder: '請詳細描述退款原因，以便我們更好地為您處理（選填）',
    refundNotice: '退款須知',
    noticeItem1: '退款申請提交後，我們將在1-3個工作日內進行審核',
    noticeItem2: '審核通過後，退款將在3-7個工作日內到賬',
    noticeItem3: '退款將原路返回到您的支付賬戶',
    noticeItem4: '如有疑問，請聯繫客服',
    submitApplication: '提交退款申請',
    confirmRefundContent: '確認申請退款 ¥{amount} 嗎？',
    reasons: {
      qualityIssue: '商品質量問題',
      descriptionMismatch: '商品描述不符',
      shippingIssue: '物流配送問題',
      dontLike: '不喜歡/不想要',
      duplicateOrder: '重複下單',
      other: '其他原因'
    },
    loadOrderFailed: '加載訂單信息失敗',
    completeInfo: '請完善退款信息',
    amountMustPositive: '退款金額必須大於0',
    amountExceedsOrder: '退款金額不能超過訂單金額',
    confirmSubmit: '確認提交',
    submitting: '提交中...',
    submitSuccess: '申請提交成功',
    submitFailed: '申請提交失敗',
    loadFailed: '加載失敗',
    networkError: '網絡錯誤，請重試',
    confirmCancel: '確認取消',
    cancelConfirmContent: '確認取消退款申請嗎？取消後不可恢復',
    confirmCancelBtn: '確認取消',
    dontCancel: '不取消',
    cancelling: '取消中...',
    cancelSuccess: '取消成功',
    cancelFailed: '取消失敗'
  },

  // 購物車相關
  cart: {
    empty: '購物車為空',
    browseMore: '去逛逛>',
    clearCart: '清空購物車',
    checkout: '去結算',
    totalAmount: '合計',
    deleteItem: '刪除商品',
    quantity: '數量',
    loadFailed: '加載購物車失敗',
    updateQuantityFailed: '更新商品數量失敗',
    deleteFailed: '刪除商品失敗',
    confirmClear: '清空購物車？',
    clearFailed: '清空失敗',
    noSelectedItems: '您還未選擇要下單的商品！',
    invalidData: '購物車數據異常，請刷新頁面重試',
    needMoreItems: '還差{count}件即可結賬',
    // 本地購物車工具函數消息
    localCart: {
      addSuccess: '已添加到購物車',
      addFailed: '添加到購物車失敗',
      empty: '本地購物車為空',
      syncFailed: '購物車同步失敗',
      syncSuccess: '購物車同步成功',
      syncPartial: '購物車同步完成，{success}件成功，{fail}件失敗'
    }
  },

  // 用戶信息相關
  userinfo: {
    emailRequired: '請先設置郵箱',
    editNickname: '編輯暱稱',
    editPhone: '編輯電話',
    enterNickname: '請輸入暱稱',
    countryCode: '區號',
    phoneNumber: '電話號碼',
    nicknameRequired: '暱稱不能為空',
    phoneRequired: '請填寫完整的電話號碼',
    phoneFormatError: '電話號碼格式錯誤',
    updateSuccess: '更新成功',
    updateFailed: '更新失敗'
  },

  // 地址管理
  address: {
    manage: '地址管理',
    add: '添加地址',
    addNew: '新增收貨地址',
    edit: '編輯地址',
    delete: '刪除地址',
    deleteConfirm: '確定要刪除這個地址嗎？',
    loginRequired: '請先登錄查看地址管理',
    goLogin: '去登錄',
    back: '返回',
    setDefault: '設為默認',
    default: '默認',
    name: '收貨人',
    phone: '手機號碼',
    region: '所在地區',
    detail: '詳細地址',
    namePlaceholder: '請輸入收貨人姓名',
    phonePlaceholder: '請輸入手機號碼',
    detailPlaceholder: '街道、門牌號等',
    changeConfirm: '確認要將訂單地址改為',
    updating: '修改中...',
    updateSuccess: '地址修改成功',
    updateFailed: '修改失敗',
    updateRetry: '修改失敗，請稍後重試',
    country: '國家/地區',
    selectCountry: '選擇國家/地區',
    selectCountryCode: '選擇國家區號',
    postCode: '郵政編碼',
    postCodePlaceholder: '收貨人郵政編碼',
    regionPlaceholder: '省/州、城市（用逗號分隔）',
    ukOnly: '當前僅支持英國地址',
    ukAddressRequired: '請先添加英國收貨地址',
    ukPhoneFormatError: '請輸入正確的英國手機號碼'
  },

  // 品牌頁面
  brand: {
    favoriteSuccess: '收藏成功！',
    favoriteFailed: '收藏失敗',
    unfavoriteSuccess: '取消收藏成功！',
    unfavoriteFailed: '取消收藏失敗',
    loginPrompt: '你還沒登錄，是否要登錄？',
    productCount: '商品數量：{count}'
  },

  // 分類頁面
  category: {
    title: '商品分類',
    productList: '商品列表',
    hot: '熱銷',
    new: '新品',
    sale: '特價',
    sortDefault: '默認',
    priceLowToHigh: '價格↑',
    priceHighToLow: '價格↓',
    sortBySales: '銷量',
    pageInfo: '第{current}頁 / 共{total}頁，共{count}件商品',
    prevPage: '上一頁',
    nextPage: '下一頁',
    productCount: '商品數量：{count}',
    backToCategory: '返回分類',
    backToBrandList: '返回品牌列表'
  },

  // 設置頁面
  settings: {
    title: '設置',
    account: '賬戶設置',
    privacy: '隱私設置',
    notification: '通知設置',
    cache: '清除緩存',
    version: '版本信息',
    logout: '退出登錄',
    about: '關於我們',
    feedback: '意見反饋',
    help: '幫助中心'
  },

  // TabBar
  tabBar: {
    home: '首頁',
    category: '分類',
    cart: '購物車',
    profile: '我的'
  },

  // 頁面標題
  pageTitle: {
    home: 'Bananaman',
    category: '分類',
    cart: '購物車',
    profile: '我的',
    productDetail: '商品詳情',
    orderList: '我的訂單',
    refundApply: '申請退款',
    addressList: '地址管理',
    settings: '設置',
    personalInfo: '個人資料',
    myFootprint: '我的足跡',
    login: '登錄',
    register: '註冊',
    forgotPassword: '忘記密碼',
    createOrder: '確認訂單',
    orderDetail: '訂單詳情',
    about: '關於我們',
    help: '幫助中心',
    notice: '注意事項',
    contact: '聯繫客服',
    points: '我的積分',
    paySuccess: '支付成功',
    h5Pay: 'H5支付'
  },

  money: {
    title: '我的積分',
    comingSoon: '建設中',
    comingSoonDesc: '積分功能仍在開發，後續會在這裡展示累計積分、可兌換權益與使用記錄。'
  },

  // 支付相關
  payment: {
    viewOrder: '查看訂單',
    backHome: '返回首頁'
  },

  // 郵箱驗證
  emailVerify: {
    verifying: '正在驗證郵箱...',
    verifySuccess: '郵箱驗證成功！',
    verifyFailed: '郵箱驗證失敗',
    backToProfile: '返回個人中心',
    resendEmail: '重新發送驗證郵件',
    tokenMissing: '確認令牌缺失，請重新發送驗證郵件',
    confirmSuccess: '郵箱確認成功，您的賬戶已激活',
    confirmFailed: '郵箱確認失敗',
    confirmFailedRetry: '郵箱確認失敗，請稍後重試',
    emailSent: '驗證郵件已發送，請檢查您的郵箱',
    sendFailed: '發送失敗',
    sendFailedRetry: '發送失敗，請稍後重試'
  },

  // H5支付
  h5Pay: {
    paymentAmount: '支付金額',
    selectPaymentMethod: '添加客服微信',
    alipayH5: '支付寶H5支付',
    alipayDesc: '推薦使用支付寶支付，安全便捷',
    wechatH5: '微信H5支付',
    wechatDesc: '使用微信支付，方便快捷',
    creditCard: '信用卡支付',
    creditCardDesc: '支持主流信用卡支付',
    orderNumber: '訂單號：',
    receiver: '收貨人：',
    productDesc: '商品描述：',
    confirmPayment: '確認支付',
    copyWechatId: '複製微信號',
    scanToAddService: '掃描二維碼添加客服',
    queryingPayment: '正在查詢支付結果...',
    doNotClose: '請稍候，不要關閉頁面',
    cancelQuery: '取消查詢',
    loadOrderFailed: '加載訂單信息失敗',
    selectPaymentRequired: '請選擇支付方式',
    paymentSuccess: '支付成功',
    paymentCancelled: '支付已取消',
    paymentFailed: '支付失敗',
    paymentStatusUnknown: '支付狀態未知',
    queryPaymentFailed: '查詢支付結果失敗',
    orderSuffix: '的商品訂單',
    creatingOrder: '創建支付訂單...',
    redirectToPayment: '將在新窗口打開支付頁面，請完成支付。支付完成後會自動返回結果',
    goToPay: '去支付'
  },

  // 關於我們
  about: {
    title: '關於我們',
    companyIntro: '公司簡介',
    companyDescription: '我們致力於為用戶提供優質的購物體驗，匯集全球精選商品，為您帶來便捷、安全、可靠的購物服務。',
    contact: '聯繫方式',
    wechat: '微信客服：',
    wechatValue: '點擊查看二維碼',
    whatsapp: 'WhatsApp：',
    whatsappValue: '點擊聯繫',
    email: '郵箱：',
    emailCopied: '郵箱地址已複製',
    viewContactPage: '查看聯繫方式',
    serviceTime: '服務時間',
    serviceTimeValue: '週一至週日 9:00-22:00'
  },

  // 幫助中心
  help: {
    title: '幫助中心',
    faq: '常見問題',
    shoppingGuide: '購物指南',
    contactUs: '聯繫我們',
    contactDesc: '如果您的問題未能得到解決,請聯繫我們的客服團隊',
    contactService: '聯繫客服',
    orderNotice: {
      title: '客戶下單須知',
      item1: '1.客戶須如實填寫完整、真實、有效的收貨地址及聯繫電話。',
      item2: '2.訂單確認後3個工作日內,本公司將通過電子郵件發送物流單號回執,請客戶自行關注物流狀態,並於第一時間完成簽收。',
      item3: '3.如客戶對包裹內容或運輸狀況存在任何疑問,請務必全程錄製開箱視頻,並在第一時間聯繫客戶服務人員處理。',
      item4: '4.問題地址請勿重複使用。'
    },
    faq1: {
      question: '如何下單購買商品？',
      answer: '選擇您喜歡的商品，點擊"立即購買"或"加入購物車"，然後按照提示完成訂單信息填寫和支付。'
    },
    faq2: {
      question: '支持哪些支付方式？',
      answer: '我們支持微信支付、支付寶、銀行卡等多種支付方式，您可以選擇最方便的方式進行支付。'
    },
    faq3: {
      question: '如何查看訂單狀態？',
      answer: '登錄賬戶後，在"我的訂單"頁面可以查看所有訂單的詳細信息和物流狀態。'
    },
    faq4: {
      question: '退換貨政策是什麼？',
      answer: '商品支持7天無理由退換貨，商品需保持原包裝完好。具體退換貨流程請聯繫客服。'
    },
    faq5: {
      question: '多久能收到商品？',
      answer: '一般情況下，付款後1-3個工作日內發貨，具體配送時間根據您的地址而定。'
    },
    guide1: {
      name: '購物流程',
      desc: '選擇商品 → 加入購物車 → 確認訂單 → 支付完成'
    },
    guide2: {
      name: '支付說明',
      desc: '支持多種支付方式，安全便捷'
    },
    guide3: {
      name: '物流配送',
      desc: '全國包郵，快速配送到家'
    },
    guide4: {
      name: '售後服務',
      desc: '7天無理由退換貨，貼心服務'
    }
  },

  // 手勢返回
  swipeBack: {
    releaseToReturn: '鬆手返回'
  },

  // 聯繫客服
  contact: {
    title: '聯繫客服',
    wechatService: '微信客服',
    scanQrcode: '掃描下方二維碼，添加客服微信',
    loading: '加載中...',
    noQrcode: '暫無客服二維碼',
    workingHours: '工作時間：週一至週日 9:00-22:00',
    otherMethods: '其他聯繫方式',
    wechatContact: '微信客服',
    wechatDesc: '查看上方二維碼添加',
    whatsappContact: 'WhatsApp客服',
    whatsappDesc: '點擊聯繫客服',
    emailContact: '郵箱聯繫',
    emailCopied: '郵箱地址已複製',
    scanWechatQrcode: '請查看上方微信二維碼'
  },

  // 錯誤信息
  error: {
    loginRequired: '請先登錄',
    networkError: '網絡連接失敗',
    serverError: '服務器錯誤',
    paramError: '參數錯誤',
    notFound: '頁面未找到',
    permissionDenied: '權限不足'
  },

  // 提示信息
  tips: {
    addCartSuccess: '已加入購物車',
    deleteSuccess: '刪除成功',
    saveSuccess: '保存成功',
    updateSuccess: '更新成功',
    loginSuccess: '登錄成功',
    registerSuccess: '註冊成功',
    logoutSuccess: '退出成功',
    copySuccess: '複製成功',
    loading: '加載中，請稍候...',
    noMore: '沒有更多了'
  },

  // 認證
  auth: {
    login: '登錄',
    register: '註冊',
    logout: '退出登錄',
    loginTitle: 'LOGIN',
    registerTitle: 'REGISTER',
    welcomeBack: '歡迎回來！',
    createAccount: '創建您的賬戶',
    username: '用戶名',
    password: '密碼',
    confirmPassword: '確認密碼',
    email: '郵箱',
    phone: '手機',
    usernamePlaceholder: '請輸入用戶名',
    passwordPlaceholder: '請輸入密碼',
    confirmPasswordPlaceholder: '請確認密碼',
    emailPlaceholder: '請輸入郵箱*',
    phonePlaceholder: '請輸入手機號（可選）',
    loginBtn: '登錄',
    registerBtn: '註冊',
    loggingIn: '登錄中...',
    registering: '註冊中...',
    forgetPassword: '忘記密碼?',
    noAccount: '還沒有賬號?',
    hasAccount: '已有賬號?',
    registerNow: '馬上註冊',
    loginNow: '馬上登錄',
    required: '必填項',
    usernameRequired: '請輸入用戶名',
    passwordRequired: '請輸入密碼',
    emailRequired: '請輸入郵箱',
    confirmPasswordRequired: '請確認密碼',
    passwordMismatch: '兩次輸入的密碼不一致',
    emailInvalid: '郵箱格式不正確',
    phoneInvalid: '請輸入正確的手機號格式',
    usernameLength: '用戶名長度應在3-20個字符之間',
    passwordLength: '密碼長度應在6-20個字符之間',
    resetPassword: '找回您的密碼',
    resetEmailPlaceholder: '請輸入註冊時的郵箱',
    sending: '發送中...',
    loginRequired: '你還沒登錄，是否要登錄？',
    goLogin: '去登錄',
    logoutConfirm: '確定要退出登錄麼',
    emailSent: '郵件已發送',
    sendResetEmail: '發送重置郵件',
    resetTipEmail: '我們將向您的郵箱發送重置密碼的鏈接',
    resetTipTime: '重置鏈接有效期為24小時',
    resetTipSpam: '請檢查垃圾郵件文件夾',
    resetEmailSuccess: '密碼重置郵件已發送到您的郵箱，請查收並按照郵件中的指示重置密碼。',
    rememberPassword: '想起密碼了?',
    backToLogin: '返回登錄'
  }
}
