export default {
  // Common
  common: {
    checkout: 'Checkout',
    totalAmount: 'Total',
    deleteItem: 'Delete Item',
    quantity: 'Quantity',
    confirm: 'Confirm',
    cancel: 'Cancel',
    loading: 'Loading...',
    noData: 'No data',
    networkError: 'Network error, please retry',
    success: 'Success',
    failed: 'Failed',
    submit: 'Submit',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    clear: 'Clear',
    search: 'Search',
    back: 'Back',
    home: 'Home',
    category: 'Category',
    cart: 'Cart',
    profile: 'Profile',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    refresh: 'Refresh',
    more: 'More',
    all: 'All',
    noTime: 'No time available',
    timeFormatError: 'Time format error',
    timeParseError: 'Time parsing failed',
    refreshSuccess: 'Refresh successful',
    refreshFailed: 'Refresh failed, please try again',
    tips: 'Tips',
    tip: 'Tip',
    pleaseWait: 'Please wait',
    update: 'Update',
    updating: 'Updating...',
    retry: 'Retry',
    retryPrompt: 'Reload data?',
    underConstruction: 'Under Construction',
    // Backend API standard message mapping
    apiMessages: {
      '操作成功': 'Operation successful',
      '操作失败': 'Operation failed',
      '参数检验失败': 'Parameter validation failed',
      '暂未登录或token已经过期': 'Not logged in or token expired',
      '没有相关权限': 'Insufficient permissions'
    }
  },

  // Share related
  share: {
    wechatFriend: 'WeChat Friend',
    wechatMoment: 'WeChat Moment',
    qqFriend: 'QQ Friend',
    qqZone: 'QQ Zone'
  },

  // Cart related
  cart: {
    empty: 'Empty cart',
    browseMore: 'Browse more>',
    clearCart: 'Clear',
    checkout: 'Checkout',
    totalAmount: 'Total',
    deleteItem: 'Delete item',
    quantity: 'Quantity',
    loadFailed: 'Failed to load cart',
    updateQuantityFailed: 'Failed to update quantity',
    deleteFailed: 'Failed to delete item',
    confirmClear: 'Clear shopping cart?',
    clearFailed: 'Clear failed',
    noSelectedItems: 'You have not selected any items to order!',
    invalidData: 'Invalid cart data, please refresh and try again',
    needMoreItems: 'Need {count} more to checkout',
    // Local cart utility messages
    localCart: {
      addSuccess: 'Added to cart',
      addFailed: 'Failed to add to cart',
      empty: 'Local cart is empty',
      syncFailed: 'Cart sync failed',
      syncSuccess: 'Cart synced successfully',
      syncPartial: 'Cart sync completed, {success} successful, {fail} failed'
    }
  },

  // User info related
  userinfo: {
    emailRequired: 'Please set email first',
    editNickname: 'Edit Nickname',
    editPhone: 'Edit Phone',
    enterNickname: 'Please enter nickname',
    countryCode: 'Code',
    phoneNumber: 'Phone Number',
    nicknameRequired: 'Nickname is required',
    phoneRequired: 'Please enter complete phone number',
    phoneFormatError: 'Invalid phone format',
    updateSuccess: 'Update successful',
    updateFailed: 'Update failed'
  },

  // Homepage
  index: {
    searchPlaceholder: 'Enter product name',
    allProducts: 'All Products',
    topSales: 'Top {rank} Sales',
    aboutUs: 'About Us',
    contactService: 'Contact Service',
    helpCenter: 'Help Center',
    wechatService: 'WeChat Service',
    scanQrcode: 'Scan the QR code below to add customer service WeChat',
    workingHours: 'Working Hours: Monday to Sunday 9:00-22:00',
    noQrcode: 'No customer service QR code available',
    browseMore: 'Browse more>',
    afterSalesNotice: {
      title: 'After-Sales and Liability Statement',
      item1: '1. If goods are detained by customs, we promise one free reshipment at no cost to the customer.',
      item2: '2. If customs duties are incurred, customers should pay them first, and we will fully reimburse after verification.',
      item3: '3. Except for specially marked items, all cigarettes sold are from regular Japanese domestic channels (non-duty-free version).',
      item4: '4. We solemnly promise that all products are genuine cigarettes. If proven to be counterfeit, we will compensate ten times the value.'
    }
  },



  // User Related
  user: {
    profile: 'Profile',
    settings: 'Settings',
    orders: 'My Orders',
    favorites: 'My Favorites',
    address: 'Shipping Address',
    points: 'Points',
    feedback: 'Feedback',
    about: 'About Us',
    language: 'Language 语言设置',
    languageTitle: 'Select Language 选择语言',
    chinese: 'Chinese 中文',
    english: 'English 英文',
    
    // Sidebar menu
    sidebarMenu: {
      language: 'Language',
      contactService: 'Contact Service',
      helpCenter: 'Help Center',
      categories: 'Categories',
      aboutUs: 'About Us'
    },
    allOrders: 'All Orders',
    pendingPayment: 'Pending Payment',
    pendingDelivery: 'Pending Delivery',
    refundAfterSale: 'Refund/After-sale',
    myFootprint: 'My Footprint',
    myCollection: 'My Collection',
    myAttention: 'My Following',
    guest: 'Guest',
    username: 'Username',
    nickname: 'Nickname',
    phone: 'Phone',
    email: 'Email',
    notSet: 'Not Set',
    verified: 'Verified',
    unverified: 'Unverified',
    sending: 'Sending...',
    verify: 'Verify',
    clearHistoryConfirm: 'Are you sure you want to clear all browsing history?',
    profileAction: 'Profile Details',
    profileTagline: 'Tap to view and edit your profile',
    noticePageDesc: 'Order notice and disclaimer are collected here.',
    menu: {
      currentOrders: 'Current Orders',
      currentOrdersDesc: 'Open the first active order status',
      historyOrders: 'Order History',
      historyOrdersDesc: 'View completed orders',
      commonAddress: 'Saved Addresses',
      commonAddressDesc: 'Manage your addresses',
      points: 'My Points',
      pointsDesc: 'Points page is coming soon',
      notice: 'Notes',
      noticeDesc: 'Read ordering notes and disclaimer',
      contact: 'Contact Us',
      contactDesc: 'Open the service QR code'
    }
  },

  // Product Related
  product: {
    detail: 'Product Details',
    price: 'Price',
    stock: 'Stock',
    sales: 'Sales',
    views: 'Views',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    specifications: 'Specifications',
    description: 'Product Description',
    reviews: 'Reviews',
    brand: 'Brand',
    model: 'Model',
    outOfStock: 'Out of Stock',
    selectSpec: 'Please select specifications',
    loadFailedMessage: 'Failed to load product details',
    unfavoriteSuccess: 'Unfavorited successfully!',
    favoriteSuccess: 'Favorited successfully!',
    buyFromCartOnly: 'Currently only supports ordering from cart!',
    maxQuantityExceeded: 'Maximum 12 items allowed, cart already has {current} items',
    stockInsufficient: 'Insufficient stock, current stock: {stock} items',
    addToCartFailed: 'Failed to add to cart',
    unitPrice: 'Unit Price',
    packageQuantity: 'Package Quantity',
    nicotineContent: 'Nicotine Content',
    tarContent: 'Tar Content'
  },

  // Order Related
  order: {
    list: 'Order List',
    detail: 'Order Details',
    status: {
      pending: 'Pending Payment',
      paid: 'Paid',
      shipped: 'Awaiting Shipment',
      delivered: 'Awaiting Receipt',
      completed: 'Completed',
      cancelled: 'Cancelled',
      unknown: 'Status Unknown',
      '0': 'Pending Payment',
      '1': 'Awaiting Shipment',
      '2': 'Shipped',
      '3': 'Completed',
      '4': 'Closed'
    },
    create: 'Create Order',
    createSuccessConfirm: 'Order created successfully, would you like to pay now?',
    createSuccessAction: 'Add Customer Service 💁',
    pay: 'Pay Now',
    cancel: 'Cancel Order',
    confirm: 'Confirm Receipt',
    total: 'Order Total',
    totalAmount: 'Subtotal',
    shipping: 'Shipping Fee',
    discount: 'Discount',
    actualPay: 'Amount to Pay',
    productInfo: 'Product Information',
    submitOrder: 'Submit Order',
    actualPayment: 'Amount to Pay',
    note: 'Note',
    notePlaceholder: 'Note information (optional)',
    goodsInfo: 'Product Information',
    goodsTotal: 'Product Total',
    freight: 'Shipping Fee',
    noNote: 'None',
    orderNumber: 'Order Number',
    submitTime: 'Submit Time',
    payMethod: 'Payment Method',
    paidAmount: 'Paid Amount',
    payTime: 'Payment Time',
    totalPayable: 'Total Payable',
    cancelOrder: 'Cancel Order',
    payNow: 'Pay Now',
    modifyAddress: 'Modify Address',
    viewLogistics: 'View Logistics',
    confirmReceipt: 'Confirm Receipt',
    applyRefund: 'Apply Refund',
    contactService: 'Contact Service',
    wechatService: 'WeChat Service',
    scanQrCode: 'Scan the QR code below to add customer service WeChat',
    qrCodeError: 'QR code loading failed',
    qrCodeLoading: 'Loading...',
    noQrCode: 'No customer service QR code available',
    workingHours: 'Working Hours: Monday to Sunday 9:00-22:00',
    cancelConfirm: 'Do you want to cancel this order?',
    receiveConfirm: 'Do you want to confirm receipt?',
    payType: {
      unknown: 'Payment method unknown',
      unpaid: 'Unpaid',
      alipay: 'Alipay Payment',
      wechat: 'WeChat Payment',
      bankCard: 'Bank Card Payment',
      other: 'Other Payment Method'
    },
    refund: {
      amount: 'Refund Amount: ',
      applyTime: 'Apply Time: ',
      processTime: 'Process Time: '
    },
    note: 'Note',
    notePlaceholder: 'Please enter note information',
    submitOrder: 'Submit Order',
    allOrders: 'All',
    waitingShipment: 'Awaiting Shipment',
    waitingReceive: 'Awaiting Receipt',
    totalItems: 'Total',
    itemsActualPay: 'items, Amount to Pay',
    modifyAddress: 'Modify Address',
    viewLogistics: 'View Logistics',
    insufficientPoints: 'You only have {points} points',
    copy: 'Copy',
    deleteConfirm: 'Are you sure to delete this order?',
    orderNotice: {
      title: 'Customer Order Notice',
      item1: '1. Customers must truthfully fill in complete, authentic, and valid delivery address and contact phone number.',
      item2: '2. Within 3 working days after order confirmation, our company will send the tracking number receipt via email. Please monitor the logistics status and complete the receipt as soon as possible.',
      item3: '3. If customers have any questions about the package contents or shipping conditions, please record the entire unboxing video and contact customer service immediately.',
      item4: '4. Please do not reuse problematic addresses.'
    },
    disclaimer: {
      title: 'Disclaimer and Liability Statement',
      content: 'If the delivery address or contact phone number provided by the customer is untrue, incomplete or invalid, resulting in package loss, return, damage, delay or inability to receive, all costs and losses arising therefrom shall be borne by the customer, and our company shall not be liable for related responsibilities.'
    }
  },

  // Refund Related
  refund: {
    status: {
      pendingReviewDesc: 'Your refund request has been submitted and is waiting for merchant review',
      approvedDesc: 'Refund request has been approved and is being processed',
      rejectedDesc: 'Refund request has been rejected, please check the reason',
      processingDesc: 'Refund is being processed, please wait patiently',
      completedDesc: 'Refund has been completed, please check your account',
      failedDesc: 'Refund processing failed, please contact customer service',
      cancelledDesc: 'Refund request has been cancelled',
      unknown: 'Status unknown'
    },
    // Refund application page
    orderInfo: 'Order Information',
    orderNumber: 'Order Number',
    orderAmount: 'Order Amount',
    paymentTime: 'Payment Time',
    refundInfo: 'Refund Information',
    refundAmount: 'Refund Amount',
    enterRefundAmount: 'Please enter refund amount',
    maxRefundAmount: 'Maximum refund amount',
    refundReason: 'Refund Reason',
    selectReason: 'Please select refund reason',
    detailDescription: 'Detail Description',
    descriptionPlaceholder: 'Please describe the refund reason in detail for better processing (optional)',
    refundNotice: 'Refund Notice',
    noticeItem1: 'After submitting the refund request, we will review it within 1-3 business days',
    noticeItem2: 'After approval, the refund will be processed within 3-7 business days',
    noticeItem3: 'The refund will be returned to your original payment account',
    noticeItem4: 'If you have any questions, please contact customer service',
    submitApplication: 'Submit Refund Application',
    confirmRefundContent: 'Confirm to apply for refund ¥{amount}?',
    reasons: {
      qualityIssue: 'Product Quality Issue',
      descriptionMismatch: 'Product Description Mismatch',
      shippingIssue: 'Shipping Issue',
      dontLike: 'Don\'t Like/Don\'t Want',
      duplicateOrder: 'Duplicate Order',
      other: 'Other Reason'
    },
    loadOrderFailed: 'Failed to load order information',
    completeInfo: 'Please complete refund information',
    amountMustPositive: 'Refund amount must be greater than 0',
    amountExceedsOrder: 'Refund amount cannot exceed order amount',
    confirmSubmit: 'Confirm Submit',
    submitting: 'Submitting...',
    submitSuccess: 'Application submitted successfully',
    submitFailed: 'Application submission failed',
    loadFailed: 'Load failed',
    networkError: 'Network error, please try again',
    confirmCancel: 'Confirm Cancel',
    cancelConfirmContent: 'Are you sure to cancel the refund request? This action cannot be undone',
    confirmCancelBtn: 'Confirm Cancel',
    dontCancel: 'Don\'t Cancel',
    cancelling: 'Cancelling...',
    cancelSuccess: 'Cancelled successfully',
    cancelFailed: 'Cancel failed'
  },

  // Address Management
  address: {
    manage: 'Address Management',
    add: 'Add Address',
    addNew: 'Add New Address',
    edit: 'Edit Address',
    delete: 'Delete Address',
    deleteConfirm: 'Are you sure you want to delete this address?',
    loginRequired: 'Please login to view address management',
    goLogin: 'Go to Login',
    back: 'Back',
    setDefault: 'Set as Default',
    default: 'Default',
    name: 'Recipient',
    phone: 'Phone Number',
    region: 'Region',
    detail: 'Detailed Address',
    namePlaceholder: 'Enter recipient name',
    phonePlaceholder: 'Enter phone number',
    detailPlaceholder: 'Street, house number and other details',
    changeConfirm: 'Are you sure you want to change the order address to',
    updating: 'Updating...',
    updateSuccess: 'Address updated successfully',
    updateFailed: 'Update failed',
    updateRetry: 'Update failed, please try again later',
    country: 'Country/Region',
    selectCountry: 'Select Country/Region',
    selectCountryCode: 'Select Country Code',
    postCode: 'Postal Code',
    postCodePlaceholder: 'Recipient postal code',
    regionPlaceholder: 'Province/State, City (separated by commas)',
    ukOnly: 'Only UK addresses are supported currently',
    ukAddressRequired: 'Please add a UK shipping address first',
    ukPhoneFormatError: 'Please enter a valid UK mobile number'
  },

  // Brand Page
  brand: {
    favoriteSuccess: 'Added to favorites!',
    favoriteFailed: 'Failed to add to favorites',
    unfavoriteSuccess: 'Removed from favorites!',
    unfavoriteFailed: 'Failed to remove from favorites',
    loginPrompt: 'You are not logged in. Would you like to log in?',
    productCount: 'Product Count: {count}'
  },

  // Category Page
  category: {
    title: 'Product Categories',
    productList: 'Product List',
    hot: 'Hot',
    new: 'New',
    sale: 'Sale',
    sortDefault: 'Default',
    priceLowToHigh: 'Price↑',
    priceHighToLow: 'Price↓',
    sortBySales: 'Sales',
    pageInfo: 'Page {current} / {total}, Total {count} products',
    prevPage: 'Previous',
    nextPage: 'Next',
    productCount: 'Products: {count}',
    backToCategory: 'Back to Categories',
    backToBrandList: 'Back to Brand List'
  },

  // Settings Page
  settings: {
    title: 'Settings',
    account: 'Account Settings',
    privacy: 'Privacy Settings',
    notification: 'Notification Settings',
    cache: 'Clear Cache',
    version: 'Version Info',
    logout: 'Logout',
    about: 'About Us',
    feedback: 'Feedback',
    help: 'Help Center'
  },

  // TabBar
  tabBar: {
    home: 'Home',
    category: 'Category',
    cart: 'Cart',
    profile: 'Profile'
  },

  // Page Titles
  pageTitle: {
    home: 'Bananaman',
    category: 'Category',
    cart: 'Shopping Cart',
    profile: 'Profile',
    productDetail: 'Product Details',
    orderList: 'My Orders',
    refundApply: 'Apply Refund',
    addressList: 'Address Management',
    settings: 'Settings',
    personalInfo: 'Personal Info',
    myFootprint: 'My Footprint',
    login: 'Login',
    register: 'Register',
    forgotPassword: 'Forgot Password',
    createOrder: 'Confirm Order',
    orderDetail: 'Order Details',
    about: 'About Us',
    help: 'Help Center',
    notice: 'Notes',
    contact: 'Contact Service',
    points: 'My Points',
    paySuccess: 'Payment Success',
    h5Pay: 'H5 Payment'
  },

  money: {
    title: 'My Points',
    comingSoon: 'Under Construction',
    comingSoonDesc: 'The points feature is still being built. Your balance, redeemable perks, and usage records will appear here later.'
  },

  // Payment Related
  payment: {
    viewOrder: 'View Order',
    backHome: 'Back Home'
  },

  // Email Verification
  emailVerify: {
    verifying: 'Verifying email...',
    verifySuccess: 'Email verification successful!',
    verifyFailed: 'Email verification failed',
    backToProfile: 'Back to Profile',
    resendEmail: 'Resend verification email',
    tokenMissing: 'Confirmation token missing, please resend verification email',
    confirmSuccess: 'Email confirmation successful, your account has been activated',
    confirmFailed: 'Email confirmation failed',
    confirmFailedRetry: 'Email confirmation failed, please try again later',
    emailSent: 'Verification email has been sent, please check your inbox',
    sendFailed: 'Send failed',
    sendFailedRetry: 'Send failed, please try again later'
  },

  // H5 Payment
  h5Pay: {
    paymentAmount: 'Payment Amount',
    selectPaymentMethod: 'Add Customer Service WeChat',
    alipayH5: 'Alipay H5 Payment',
    alipayDesc: 'Recommended to use Alipay, safe and convenient',
    wechatH5: 'WeChat H5 Payment',
    wechatDesc: 'Use WeChat Pay, convenient and fast',
    creditCard: 'Credit Card Payment',
    creditCardDesc: 'Support mainstream credit card payments',
    orderNumber: 'Order Number: ',
    receiver: 'Receiver: ',
    productDesc: 'Product Description: ',
    confirmPayment: 'Confirm Payment',
    copyWechatId: 'Copy WeChat ID',
    scanToAddService: 'Scan QR Code to Add Customer Service',
    queryingPayment: 'Querying payment result...',
    doNotClose: 'Please wait, do not close the page',
    cancelQuery: 'Cancel Query',
    loadOrderFailed: 'Failed to load order information',
    selectPaymentRequired: 'Please select a payment method',
    paymentSuccess: 'Payment successful',
    paymentCancelled: 'Payment cancelled',
    paymentFailed: 'Payment failed',
    paymentStatusUnknown: 'Payment status unknown',
    queryPaymentFailed: 'Failed to query payment result',
    orderSuffix: '\'s product order',
    creatingOrder: 'Creating payment order...',
    redirectToPayment: 'Payment page will open in a new window. Please complete the payment, and the result will be returned automatically',
    goToPay: 'Go to Pay'
  },

  // About Us
  about: {
    title: 'About Us',
    companyIntro: 'Company Introduction',
    companyDescription: 'We are committed to providing users with high-quality shopping experience, bringing together selected global products to provide you with convenient, safe and reliable shopping services.',
    contact: 'Contact Information',
    wechat: 'WeChat: ',
    wechatValue: 'Click to view QR code',
    whatsapp: 'WhatsApp: ',
    whatsappValue: 'Click to contact',
    email: 'Email: ',
    emailCopied: 'Email address copied',
    viewContactPage: 'View contact information',
    serviceTime: 'Service Hours',
    serviceTimeValue: 'Monday to Sunday 9:00-22:00'
  },

  // Help Center
  help: {
    title: 'Help Center',
    faq: 'Frequently Asked Questions',
    shoppingGuide: 'Shopping Guide',
    contactUs: 'Contact Us',
    contactDesc: 'If your problem cannot be resolved, please contact our customer service team',
    contactService: 'Contact Service',
    orderNotice: {
      title: 'Customer Order Notice',
      item1: '1. Customers must truthfully fill in complete, authentic, and valid delivery address and contact phone number.',
      item2: '2. Within 3 working days after order confirmation, our company will send the tracking number receipt via email. Please monitor the logistics status and complete the receipt as soon as possible.',
      item3: '3. If customers have any questions about the package contents or shipping conditions, please record the entire unboxing video and contact customer service immediately.',
      item4: '4. Please do not reuse problematic addresses.'
    },
    faq1: {
      question: 'How to place an order?',
      answer: 'Select the product you like, click "Buy Now" or "Add to Cart", then follow the prompts to complete order information and payment.'
    },
    faq2: {
      question: 'What payment methods are supported?',
      answer: 'We support WeChat Pay, Alipay, bank cards and other payment methods. You can choose the most convenient way to pay.'
    },
    faq3: {
      question: 'How to check order status?',
      answer: 'After logging in, you can view detailed information and logistics status of all orders on the "My Orders" page.'
    },
    faq4: {
      question: 'What is the return policy?',
      answer: 'Products support 7-day no-reason return and exchange. Products need to keep original packaging intact. Please contact customer service for specific return process.'
    },
    faq5: {
      question: 'How long will it take to receive the goods?',
      answer: 'Generally, shipment will be made within 1-3 working days after payment. The specific delivery time depends on your address.'
    },
    guide1: {
      name: 'Shopping Process',
      desc: 'Select Product → Add to Cart → Confirm Order → Complete Payment'
    },
    guide2: {
      name: 'Payment Instructions',
      desc: 'Support multiple payment methods, safe and convenient'
    },
    guide3: {
      name: 'Logistics Delivery',
      desc: 'Free shipping nationwide, fast delivery to your home'
    },
    guide4: {
      name: 'After-sales Service',
      desc: '7-day no-reason return and exchange, considerate service'
    }
  },

  // Swipe Back
  swipeBack: {
    releaseToReturn: 'Release to return'
  },

  // Contact Service
  contact: {
    title: 'Contact Service',
    wechatService: 'WeChat Service',
    scanQrcode: 'Scan the QR code below to add service WeChat',
    loading: 'Loading...',
    noQrcode: 'No service QR code available',
    workingHours: 'Working Hours: Monday to Sunday 9:00-22:00',
    otherMethods: 'Other Contact Methods',
    wechatContact: 'WeChat Service',
    wechatDesc: 'Scan QR code above',
    whatsappContact: 'WhatsApp Service',
    whatsappDesc: 'Click to contact',
    emailContact: 'Email Contact',
    emailCopied: 'Email address copied',
    scanWechatQrcode: 'Please see WeChat QR code above'
  },

  // Error Messages
  error: {
    loginRequired: 'Please login first',
    networkError: 'Network connection failed',
    serverError: 'Server error',
    paramError: 'Parameter error',
    notFound: 'Page not found',
    permissionDenied: 'Permission denied'
  },

  // Tips
  tips: {
    addCartSuccess: 'Added to cart',
    deleteSuccess: 'Deleted successfully',
    saveSuccess: 'Saved successfully',
    updateSuccess: 'Updated successfully',
    loginSuccess: 'Login successful',
    registerSuccess: 'Registration successful',
    logoutSuccess: 'Logout successful',
    copySuccess: 'Copied successfully',
    loading: 'Loading, please wait...',
    noMore: 'No more items'
  },

  // Authentication
  auth: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    loginTitle: 'LOGIN',
    registerTitle: 'REGISTER',
    welcomeBack: 'Welcome back!',
    createAccount: 'Create your account',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    email: 'Email',
    phone: 'Phone',
    usernamePlaceholder: 'Enter username',
    passwordPlaceholder: 'Enter password',
    confirmPasswordPlaceholder: 'Confirm password',
    emailPlaceholder: 'Enter email*',
    phonePlaceholder: 'Enter phone (optional)',
    loginBtn: 'Login',
    registerBtn: 'Register',
    loggingIn: 'Logging in...',
    registering: 'Registering...',
    forgetPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    registerNow: 'Register now',
    loginNow: 'Login now',
    required: 'Required',
    usernameRequired: 'Please enter username',
    passwordRequired: 'Please enter password',
    emailRequired: 'Please enter email',
    confirmPasswordRequired: 'Please confirm password',
    passwordMismatch: 'Passwords do not match',
    emailInvalid: 'Invalid email format',
    phoneInvalid: 'Please enter a valid phone number',
    usernameLength: 'Username should be 3-20 characters long',
    passwordLength: 'Password should be 6-20 characters long',
    resetPassword: 'Reset your password',
    resetEmailPlaceholder: 'Enter your registered email',
    sending: 'Sending...',
    emailSent: 'Email sent',
    sendResetEmail: 'Send reset email',
    resetTipEmail: 'We will send a password reset link to your email',
    resetTipTime: 'Reset link is valid for 24 hours',
    resetTipSpam: 'Please check your spam folder',
    resetEmailSuccess: 'Password reset email has been sent to your email address. Please check your inbox and follow the instructions in the email to reset your password.',
    rememberPassword: 'Remember your password?',
    backToLogin: 'Back to Login',
    loginRequired: 'You are not logged in. Would you like to login?',
    goLogin: 'Go Login',
    logoutConfirm: 'Are you sure you want to logout?'
  }
}
