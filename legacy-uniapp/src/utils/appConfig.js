// appConfig.js

// 环境配置
const isDev = process.env.NODE_ENV === 'development';

//配置API请求的基础路径
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (isDev ? '/portal' : 'http://localhost:8085/portal');

//是否启用支付宝支付
export const USE_ALIPAY = false;

//是否启用新的H5支付系统
export const USE_H5_PAYMENT = true;

//支付成功跳转地址 - 使用中转页面处理回调
export const PAYMENT_RETURN_URL = `${import.meta.env.VITE_FRONTEND_BASE_URL || 
  'http://localhost:8060'}/payment-callback.html`;

//支付异步通知地址  
export const PAYMENT_NOTIFY_URL = `${import.meta.env.VITE_BACKEND_BASE_URL || 
  'http://localhost:8085'}/portal/payment/h5/notify/globepay`;
