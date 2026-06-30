/**
 * 本地购物车工具类
 * 用于处理未登录用户的购物车数据
 */

import { addCartItem } from '@/api/cart.js';
import { t } from '@/utils/i18nUtil.js';

const LOCAL_CART_KEY = 'LOCAL_CART';

/**
 * 获取本地购物车列表
 */
export function getLocalCartList() {
	try {
		const cartList = uni.getStorageSync(LOCAL_CART_KEY) || [];
		return cartList.map(item => ({
			...item,
			checked: true,
			loaded: "loaded"
		}));
	} catch (error) {
		console.error('获取本地购物车失败:', error);
		return [];
	}
}

/**
 * 添加商品到本地购物车
 */
export function addToLocalCart(cartItem) {
	try {
		const cartList = getLocalCartList();
		
		// 查找相同的商品（根据商品ID和SKU ID匹配）
		const existingIndex = cartList.findIndex(item => {
			return item.productId === cartItem.productId && 
				   item.productSkuId === cartItem.productSkuId;
		});
		
		if (existingIndex !== -1) {
			// 商品已存在，更新数量
			cartList[existingIndex].quantity += cartItem.quantity;
		} else {
			// 新商品，添加到购物车
			const newItem = {
				...cartItem,
				id: Date.now(), // 生成临时ID
				checked: true,
				loaded: "loaded"
			};
			cartList.push(newItem);
		}
		
		uni.setStorageSync(LOCAL_CART_KEY, cartList);
		return { success: true, message: t('cart.localCart.addSuccess') };
	} catch (error) {
		console.error('添加到本地购物车失败:', error);
		return { success: false, message: t('cart.localCart.addFailed') };
	}
}

/**
 * 从本地购物车删除商品
 */
export function removeFromLocalCart(index) {
	try {
		const cartList = getLocalCartList();
		cartList.splice(index, 1);
		uni.setStorageSync(LOCAL_CART_KEY, cartList);
		return { success: true };
	} catch (error) {
		console.error('删除本地购物车商品失败:', error);
		return { success: false };
	}
}

/**
 * 更新本地购物车商品数量
 */
export function updateLocalCartQuantity(index, quantity) {
	try {
		const cartList = getLocalCartList();
		if (cartList[index]) {
			cartList[index].quantity = quantity;
			uni.setStorageSync(LOCAL_CART_KEY, cartList);
		}
		return { success: true };
	} catch (error) {
		console.error('更新本地购物车数量失败:', error);
		return { success: false };
	}
}

/**
 * 清空本地购物车
 */
export function clearLocalCart() {
	try {
		uni.removeStorageSync(LOCAL_CART_KEY);
		return { success: true };
	} catch (error) {
		console.error('清空本地购物车失败:', error);
		return { success: false };
	}
}

/**
 * 同步本地购物车到服务器
 */
export async function syncLocalCartToServer() {
	try {
		const localCartList = getRawLocalCartList(); // 获取原始数据，包含完整商品信息
		
		if (localCartList.length === 0) {
			return { success: true, message: t('cart.localCart.empty') };
		}
		
		console.log('开始同步本地购物车到服务器，商品数量:', localCartList.length);
		
		let successCount = 0;
		let failCount = 0;
		
		// 逐个添加到服务器购物车，传递完整的商品信息
		for (const item of localCartList) {
			// 验证必要的商品信息
			if (!item.productId) {
				console.error('商品ID缺失，跳过同步:', item);
				failCount++;
				continue;
			}
			
			// 构建完整的购物车商品信息，就像在商品页面添加一样
			const cartItem = {
				price: item.price || 0,
				productAttr: item.productAttr || '',
				productBrand: item.productBrand || '',
				productCategoryId: item.productCategoryId || null,
				productId: item.productId,
				productName: item.productName || '',
				productPic: item.productPic || '',
				productSkuCode: item.productSkuCode || '',
				productSkuId: item.productSkuId || 0,
				productSn: item.productSn || '',
				productSubTitle: item.productSubTitle || '',
				quantity: item.quantity || 1
			};
			
			try {
				const response = await addCartItem(cartItem);
				console.log('同步商品成功:', cartItem, response);
				successCount++;
			} catch (error) {
				console.error('同步购物车商品失败:', cartItem, error);
				failCount++;
			}
		}
		
		console.log(`购物车同步完成，成功: ${successCount}, 失败: ${failCount}`);
		
		// 只有在至少有一个商品同步成功时，才清空本地购物车
		if (successCount > 0) {
			clearLocalCart();
			
			// 发送事件通知购物车数据已更新
			uni.$emit('cartDataUpdated');
		}
		
		if (failCount > 0 && successCount === 0) {
			return { success: false, message: t('cart.localCart.syncFailed') };
		}
		
		return { 
			success: true, 
			message: failCount > 0 ? t('cart.localCart.syncPartial', { success: successCount, fail: failCount }) : t('cart.localCart.syncSuccess')
		};
	} catch (error) {
		console.error('同步本地购物车失败:', error);
		return { success: false, message: t('cart.localCart.syncFailed') };
	}
}

/**
 * 获取本地购物车商品数量
 */
export function getLocalCartCount() {
	try {
		const cartList = getLocalCartList();
		return cartList.reduce((count, item) => count + item.quantity, 0);
	} catch (error) {
		console.error('获取本地购物车数量失败:', error);
		return 0;
	}
}

/**
 * 获取原始本地购物车数据（不添加额外属性）
 */
export function getRawLocalCartList() {
	try {
		return uni.getStorageSync(LOCAL_CART_KEY) || [];
	} catch (error) {
		console.error('获取原始本地购物车数据失败:', error);
		return [];
	}
}
