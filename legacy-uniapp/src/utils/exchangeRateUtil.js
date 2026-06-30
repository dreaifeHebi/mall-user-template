/**
 * 汇率工具类
 * 提供日元到美元/人民币的汇率转换功能，自动缓存24小时
 * 根据当前语言自动选择显示美元或人民币
 */

// 汇率存储键名
const EXCHANGE_RATE_USD_KEY = 'JPY_USD_EXCHANGE_RATE';
const EXCHANGE_RATE_USD_TIMESTAMP_KEY = 'JPY_USD_EXCHANGE_RATE_TIMESTAMP';
const EXCHANGE_RATE_CNY_KEY = 'JPY_CNY_EXCHANGE_RATE';
const EXCHANGE_RATE_CNY_TIMESTAMP_KEY = 'JPY_CNY_EXCHANGE_RATE_TIMESTAMP';

// 缓存过期时间：24小时（毫秒）
const CACHE_EXPIRE_TIME = 24 * 60 * 60 * 1000;

/**
 * 获取当前的日元对美元汇率
 * @returns {Promise<number>} 汇率值
 */
export async function getJPYToUSDRate() {
  try {
    // 检查缓存是否有效
    const cachedRate = getCachedRate(EXCHANGE_RATE_USD_KEY, EXCHANGE_RATE_USD_TIMESTAMP_KEY);
    if (cachedRate !== null) {
      console.log('使用缓存的美元汇率:', cachedRate);
      return cachedRate;
    }

    // 缓存已过期或不存在，获取新的汇率
    console.log('缓存已过期，获取新的美元汇率数据...');
    const newRate = await fetchUSDExchangeRate();
    
    // 缓存新的汇率
    cacheRate(newRate, EXCHANGE_RATE_USD_KEY, EXCHANGE_RATE_USD_TIMESTAMP_KEY);
    
    return newRate;
  } catch (error) {
    console.error('获取美元汇率失败:', error);
    
    // 如果获取失败，尝试使用过期的缓存数据
    const expiredRate = getExpiredCachedRate(EXCHANGE_RATE_USD_KEY);
    if (expiredRate !== null) {
      console.log('使用过期的缓存美元汇率:', expiredRate);
      return expiredRate;
    }
    
    // 如果都没有，使用默认汇率
    console.log('使用默认美元汇率: 0.0067');
    return 0.0067;
  }
}

/**
 * 获取当前的日元对人民币汇率
 * @returns {Promise<number>} 汇率值
 */
export async function getJPYToCNYRate() {
  try {
    // 检查缓存是否有效
    const cachedRate = getCachedRate(EXCHANGE_RATE_CNY_KEY, EXCHANGE_RATE_CNY_TIMESTAMP_KEY);
    if (cachedRate !== null) {
      console.log('使用缓存的人民币汇率:', cachedRate);
      return cachedRate;
    }

    // 缓存已过期或不存在，获取新的汇率
    console.log('缓存已过期，获取新的人民币汇率数据...');
    const newRate = await fetchCNYExchangeRate();
    
    // 缓存新的汇率
    cacheRate(newRate, EXCHANGE_RATE_CNY_KEY, EXCHANGE_RATE_CNY_TIMESTAMP_KEY);
    
    return newRate;
  } catch (error) {
    console.error('获取人民币汇率失败:', error);
    
    // 如果获取失败，尝试使用过期的缓存数据
    const expiredRate = getExpiredCachedRate(EXCHANGE_RATE_CNY_KEY);
    if (expiredRate !== null) {
      console.log('使用过期的缓存人民币汇率:', expiredRate);
      return expiredRate;
    }
    
    // 如果都没有，使用默认汇率 (大约的汇率值)
    console.log('使用默认人民币汇率: 0.052');
    return 0.052;
  }
}

/**
 * 从缓存中获取有效的汇率
 * @param {string} rateKey 汇率键名
 * @param {string} timestampKey 时间戳键名
 * @returns {number|null} 汇率值，如果缓存无效返回null
 */
function getCachedRate(rateKey, timestampKey) {
  try {
    const cachedRate = uni.getStorageSync(rateKey);
    const cachedTimestamp = uni.getStorageSync(timestampKey);
    
    if (!cachedRate || !cachedTimestamp) {
      return null;
    }
    
    const currentTime = Date.now();
    const cacheAge = currentTime - cachedTimestamp;
    
    // 检查缓存是否在有效期内
    if (cacheAge < CACHE_EXPIRE_TIME) {
      return parseFloat(cachedRate);
    }
    
    return null;
  } catch (error) {
    console.error('读取缓存汇率失败:', error);
    return null;
  }
}

/**
 * 获取过期的缓存汇率（作为备用）
 * @param {string} rateKey 汇率键名
 * @returns {number|null} 汇率值
 */
function getExpiredCachedRate(rateKey) {
  try {
    const cachedRate = uni.getStorageSync(rateKey);
    return cachedRate ? parseFloat(cachedRate) : null;
  } catch (error) {
    console.error('读取过期缓存汇率失败:', error);
    return null;
  }
}

/**
 * 缓存汇率数据
 * @param {number} rate 汇率值
 * @param {string} rateKey 汇率键名
 * @param {string} timestampKey 时间戳键名
 */
function cacheRate(rate, rateKey, timestampKey) {
  try {
    uni.setStorageSync(rateKey, rate.toString());
    uni.setStorageSync(timestampKey, Date.now());
    console.log('汇率已缓存:', rate);
  } catch (error) {
    console.error('缓存汇率失败:', error);
  }
}

/**
 * 从API获取最新美元汇率
 * @returns {Promise<number>} 汇率值
 */
async function fetchUSDExchangeRate() {
  // 使用多个免费的汇率API作为备选
  const apis = [
    {
      name: 'Exchange Rate API',
      url: 'https://api.exchangerate-api.com/v4/latest/JPY',
      parseResponse: (data) => data.rates.USD
    },
    {
      name: 'CurrencyAPI (Free)',
      url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/jpy/usd.json',
      parseResponse: (data) => data.usd
    },
    {
      name: 'Free Currency Converter',
      url: 'https://free.currconv.com/api/v7/convert?q=JPY_USD&compact=ultra&apiKey=sample-api-key',
      parseResponse: (data) => data.JPY_USD
    }
  ];

  // 逐个尝试API
  for (const api of apis) {
    try {
      console.log(`尝试从 ${api.name} 获取汇率...`);
      
      const response = await fetch(api.url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        timeout: 10000 // 10秒超时
      });

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }

      const data = await response.json();
      const rate = api.parseResponse(data);
      
      if (rate && typeof rate === 'number' && rate > 0) {
        console.log(`从 ${api.name} 获取汇率成功:`, rate);
        return rate;
      } else {
        throw new Error('无效的汇率数据');
      }
      
    } catch (error) {
      console.warn(`从 ${api.name} 获取汇率失败:`, error.message);
      continue;
    }
  }

  // 如果所有API都失败了，抛出错误
  throw new Error('所有美元汇率API都无法访问');
}

/**
 * 从API获取最新人民币汇率
 * @returns {Promise<number>} 汇率值
 */
async function fetchCNYExchangeRate() {
  // 使用多个免费的汇率API作为备选
  const apis = [
    {
      name: 'Exchange Rate API',
      url: 'https://api.exchangerate-api.com/v4/latest/JPY',
      parseResponse: (data) => data.rates.CNY
    },
    {
      name: 'CurrencyAPI (Free)',
      url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/jpy/cny.json',
      parseResponse: (data) => data.cny
    }
  ];

  // 逐个尝试API
  for (const api of apis) {
    try {
      console.log(`尝试从 ${api.name} 获取人民币汇率...`);
      
      const response = await fetch(api.url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        timeout: 10000 // 10秒超时
      });

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }

      const data = await response.json();
      const rate = api.parseResponse(data);
      
      if (rate && typeof rate === 'number' && rate > 0) {
        console.log(`从 ${api.name} 获取人民币汇率成功:`, rate);
        return rate;
      } else {
        throw new Error('无效的汇率数据');
      }
      
    } catch (error) {
      console.warn(`从 ${api.name} 获取人民币汇率失败:`, error.message);
      continue;
    }
  }

  // 如果所有API都失败了，抛出错误
  throw new Error('所有人民币汇率API都无法访问');
}

/**
 * 将日元金额转换为美元
 * @param {number|string} jpyAmount 日元金额
 * @param {number} exchangeRate 汇率
 * @returns {string} 格式化的美元金额
 */
export function convertJPYToUSD(jpyAmount, exchangeRate) {
  try {
    const jpy = parseFloat(jpyAmount);
    if (isNaN(jpy) || jpy <= 0) {
      return '0.00';
    }
    
    const usd = jpy * exchangeRate;
    return usd.toFixed(2);
  } catch (error) {
    console.error('转换货币失败:', error);
    return '0.00';
  }
}

/**
 * 将日元金额转换为人民币
 * @param {number|string} jpyAmount 日元金额
 * @param {number} exchangeRate 汇率
 * @returns {string} 格式化的人民币金额
 */
export function convertJPYToCNY(jpyAmount, exchangeRate) {
  try {
    const jpy = parseFloat(jpyAmount);
    if (isNaN(jpy) || jpy <= 0) {
      return '0.00';
    }
    
    const cny = jpy * exchangeRate;
    return cny.toFixed(2);
  } catch (error) {
    console.error('转换货币失败:', error);
    return '0.00';
  }
}

/**
 * 格式化美元显示
 * @param {number|string} usdAmount 美元金额
 * @returns {string} 格式化的显示文本
 */
export function formatUSDDisplay(usdAmount) {
  const amount = parseFloat(usdAmount);
  if (isNaN(amount) || amount <= 0) {
    return 'USD 0.00';
  }
  
  return `USD ${amount.toFixed(2)}`;
}

/**
 * 格式化人民币显示
 * @param {number|string} cnyAmount 人民币金额
 * @returns {string} 格式化的显示文本
 */
export function formatCNYDisplay(cnyAmount) {
  const amount = parseFloat(cnyAmount);
  if (isNaN(amount) || amount <= 0) {
    return 'RMB 0.00';
  }
  
  return `RMB ${amount.toFixed(2)}`;
}

/**
 * 根据当前语言获取对应的汇率
 * @param {string} locale 当前语言 (zh-CN, zh-TW, en-US)
 * @returns {Promise<number>} 汇率值
 */
export async function getExchangeRateByLocale(locale) {
  // 中文（简体/繁体）显示人民币，英文显示美元
  if (locale === 'zh-CN' || locale === 'zh-TW') {
    return await getJPYToCNYRate();
  } else {
    return await getJPYToUSDRate();
  }
}

/**
 * 根据当前语言将日元转换为对应货币并格式化显示
 * @param {number|string} jpyAmount 日元金额
 * @param {number} exchangeRate 汇率
 * @param {string} locale 当前语言
 * @returns {string} 格式化的显示文本
 */
export function formatPriceByLocale(jpyAmount, exchangeRate, locale) {
  if (!exchangeRate || !jpyAmount) {
    return '';
  }
  
  // 中文（简体/繁体）显示人民币，英文显示美元
  if (locale === 'zh-CN' || locale === 'zh-TW') {
    const cnyAmount = convertJPYToCNY(jpyAmount, exchangeRate);
    return formatCNYDisplay(cnyAmount);
  } else {
    const usdAmount = convertJPYToUSD(jpyAmount, exchangeRate);
    return formatUSDDisplay(usdAmount);
  }
}

/**
 * 手动清除汇率缓存（用于调试或强制刷新）
 */
export function clearExchangeRateCache() {
  try {
    uni.removeStorageSync(EXCHANGE_RATE_USD_KEY);
    uni.removeStorageSync(EXCHANGE_RATE_USD_TIMESTAMP_KEY);
    uni.removeStorageSync(EXCHANGE_RATE_CNY_KEY);
    uni.removeStorageSync(EXCHANGE_RATE_CNY_TIMESTAMP_KEY);
    console.log('汇率缓存已清除');
  } catch (error) {
    console.error('清除汇率缓存失败:', error);
  }
}