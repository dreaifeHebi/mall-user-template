import { getCurrentLocale } from './i18nUtil.js'

/**
 * 处理商品名和分类名的多语言显示
 * @param {string} text - 原始文本
 * @returns {string} - 处理后的文本
 */
export function processMultiLanguageText(text) {
  if (!text || typeof text !== 'string') {
    return text || ''
  }

  const currentLocale = getCurrentLocale()
  
  // 处理特殊字符 = 换行
  let processedText = text.replace(/=/g, '\n')
  
  // 如果没有 / 分隔符，直接返回处理后的文本
  if (!processedText.includes('/')) {
    return processedText
  }

  // 按 / 分割文本
  const parts = processedText.split('/')
  
  if (parts.length === 1) {
    // 没有分隔符的情况已经在上面处理了
    return parts[0].trim()
  } else if (parts.length === 2) {
    // 一个 / 的情况：英文/中文
    const [english, chinese] = parts.map(part => part.trim())
    
    switch (currentLocale) {
      case 'en-US':
        return english || chinese // 如果英文为空，fallback到中文
      case 'zh-CN':
      case 'zh-TW':
        return chinese || english // 如果中文为空，fallback到英文
      default:
        return chinese || english
    }
  } else if (parts.length === 3) {
    // 两个 / 的情况：英文/繁体中文/简体中文
    const [english, traditional, simplified] = parts.map(part => part.trim())
    
    switch (currentLocale) {
      case 'en-US':
        return english || traditional || simplified
      case 'zh-TW':
        return traditional || simplified || english
      case 'zh-CN':
        return simplified || traditional || english
      default:
        return simplified || traditional || english
    }
  } else {
    // 超过两个 / 的情况，取前三个部分按照三段逻辑处理
    const [english, traditional, simplified] = parts.slice(0, 3).map(part => part.trim())
    
    switch (currentLocale) {
      case 'en-US':
        return english || traditional || simplified
      case 'zh-TW':
        return traditional || simplified || english
      case 'zh-CN':
        return simplified || traditional || english
      default:
        return simplified || traditional || english
    }
  }
}

/**
 * 处理商品名称
 * @param {string} productName - 商品名称
 * @returns {string} - 处理后的商品名称
 */
export function processProductName(productName) {
  return processMultiLanguageText(productName)
}

/**
 * 处理分类名称
 * @param {string} categoryName - 分类名称
 * @returns {string} - 处理后的分类名称
 */
export function processCategoryName(categoryName) {
  return processMultiLanguageText(categoryName)
}

/**
 * 处理品牌名称
 * @param {string} brandName - 品牌名称
 * @returns {string} - 处理后的品牌名称
 */
export function processBrandName(brandName) {
  return processMultiLanguageText(brandName)
}

/**
 * 批量处理商品列表的名称
 * @param {Array} products - 商品列表
 * @param {string} nameField - 名称字段，默认为 'name'
 * @returns {Array} - 处理后的商品列表
 */
export function processProductList(products, nameField = 'name') {
  if (!Array.isArray(products)) {
    return products
  }
  
  return products.map(product => ({
    ...product,
    [nameField]: processMultiLanguageText(product[nameField])
  }))
}

/**
 * 批量处理分类列表的名称
 * @param {Array} categories - 分类列表
 * @param {string} nameField - 名称字段，默认为 'name'
 * @returns {Array} - 处理后的分类列表
 */
export function processCategoryList(categories, nameField = 'name') {
  if (!Array.isArray(categories)) {
    return categories
  }
  
  return categories.map(category => ({
    ...category,
    [nameField]: processMultiLanguageText(category[nameField])
  }))
}

/**
 * 处理嵌套的分类数据（包含子分类）
 * @param {Array} categories - 分类列表
 * @param {string} nameField - 名称字段，默认为 'name'
 * @param {string} childrenField - 子分类字段，默认为 'children'
 * @returns {Array} - 处理后的分类列表
 */
export function processNestedCategories(categories, nameField = 'name', childrenField = 'children') {
  if (!Array.isArray(categories)) {
    return categories
  }
  
  return categories.map(category => {
    const processedCategory = {
      ...category,
      [nameField]: processMultiLanguageText(category[nameField])
    }
    
    // 递归处理子分类
    if (category[childrenField] && Array.isArray(category[childrenField])) {
      processedCategory[childrenField] = processNestedCategories(
        category[childrenField], 
        nameField, 
        childrenField
      )
    }
    
    return processedCategory
  })
}

/**
 * 处理订单列表中的商品名称
 * @param {Array} orders - 订单列表
 * @returns {Array} - 处理后的订单列表
 */
export function processOrderList(orders) {
  if (!Array.isArray(orders)) {
    return orders
  }
  
  return orders.map(order => processOrderDetail(order))
}

/**
 * 处理单个订单中的商品名称
 * @param {Object} order - 订单对象
 * @returns {Object} - 处理后的订单对象
 */
export function processOrderDetail(order) {
  if (!order || typeof order !== 'object') {
    return order
  }
  
  const processedOrder = { ...order }
  
  // 处理订单项中的商品名称
  if (order.orderItemList && Array.isArray(order.orderItemList)) {
    processedOrder.orderItemList = order.orderItemList.map(item => ({
      ...item,
      productName: processMultiLanguageText(item.productName)
    }))
  }
  
  // 处理直接在订单对象上的商品名称（如果有）
  if (order.productName) {
    processedOrder.productName = processMultiLanguageText(order.productName)
  }
  
  return processedOrder
}

/**
 * 处理购物车项目中的商品名称
 * @param {Array} cartItems - 购物车项目列表
 * @param {string} nameField - 商品名称字段，默认为 'productName'
 * @returns {Array} - 处理后的购物车项目列表
 */
export function processCartItems(cartItems, nameField = 'productName') {
  if (!Array.isArray(cartItems)) {
    return cartItems
  }
  
  return cartItems.map(item => ({
    ...item,
    [nameField]: processMultiLanguageText(item[nameField])
  }))
}

/**
 * 处理所有类型的商品数据（通用方法）
 * @param {Array|Object} data - 商品数据（数组或对象）
 * @param {string} nameField - 商品名称字段，默认为 'name'
 * @returns {Array|Object} - 处理后的数据
 */
export function processProductData(data, nameField = 'name') {
  if (Array.isArray(data)) {
    return processProductList(data, nameField)
  } else if (data && typeof data === 'object') {
    return {
      ...data,
      [nameField]: processMultiLanguageText(data[nameField])
    }
  }
  return data
}

/**
 * 批量处理品牌列表的名称
 * @param {Array} brands - 品牌列表
 * @param {string} nameField - 名称字段，默认为 'name'
 * @returns {Array} - 处理后的品牌列表
 */
export function processBrandList(brands, nameField = 'name') {
  if (!Array.isArray(brands)) {
    return brands
  }
  
  return brands.map(brand => ({
    ...brand,
    [nameField]: processMultiLanguageText(brand[nameField])
  }))
}

/**
 * 处理单个品牌的名称
 * @param {Object} brand - 品牌对象
 * @param {string} nameField - 名称字段，默认为 'name'
 * @returns {Object} - 处理后的品牌对象
 */
export function processBrandData(brand, nameField = 'name') {
  if (!brand || typeof brand !== 'object') {
    return brand
  }
  
  return {
    ...brand,
    [nameField]: processMultiLanguageText(brand[nameField])
  }
}