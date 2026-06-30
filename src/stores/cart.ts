import { defineStore } from 'pinia'
import type { CartItem, Product } from '@/types/api'

const CART_KEY = 'mall_user_cart'
const LOCAL_PRODUCT_ASSET = '/template-assets/product-1.svg'

function productAsset(productId: number | string) {
  const numeric = Number(productId)
  const index = Number.isFinite(numeric) && numeric > 0 ? ((numeric - 1) % 3) + 1 : 1
  return `/template-assets/product-${index}.svg`
}

function isStaleImage(value: string) {
  return [
    'example.com',
    '/uploads/',
    '/assets/category-',
    '/assets/banner-',
    'category-1',
    'category-2',
    'category-3',
    'banner-1',
    'banner-2',
    'empty-cart',
    'zhonghua',
    'yuxi'
  ].some(pattern => value.includes(pattern))
}

function normalizeProductImage(productId: number | string, value: unknown) {
  if (typeof value !== 'string' || !value.trim()) {
    return productAsset(productId)
  }

  const image = value.trim()
  return isStaleImage(image) ? productAsset(productId) : image
}

function readCart(): CartItem[] {
  const raw = localStorage.getItem(CART_KEY)

  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      localStorage.removeItem(CART_KEY)
      return []
    }

    const normalized = parsed.map(item => normalizeCartItem(item as CartItem))
    if (JSON.stringify(normalized) !== raw) {
      localStorage.setItem(CART_KEY, JSON.stringify(normalized))
    }

    return normalized
  } catch {
    localStorage.removeItem(CART_KEY)
    return []
  }
}

function normalizePrice(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function normalizeCartItem(item: CartItem): CartItem {
  return {
    ...item,
    productPic: normalizeProductImage(item.productId, item.productPic || LOCAL_PRODUCT_ASSET),
    price: normalizePrice(item.price),
    quantity: Math.max(1, Number(item.quantity) || 1),
    checked: item.checked !== false
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: readCart()
  }),
  getters: {
    checkedItems: state => state.items.filter(item => item.checked),
    count: state => state.items.reduce((sum, item) => sum + item.quantity, 0),
    total: state =>
      state.items
        .filter(item => item.checked)
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
  },
  actions: {
    persist() {
      localStorage.setItem(CART_KEY, JSON.stringify(this.items))
    },
    addProduct(product: Product, quantity = 1) {
      const productId = product.id
      const existing = this.items.find(item => item.productId === productId)

      if (existing) {
        existing.quantity += quantity
      } else {
        this.items.push({
          id: `${productId}`,
          productId,
          productName: product.name,
          productPic: normalizeProductImage(productId, product.pic),
          price: normalizePrice(product.price),
          quantity,
          checked: true
        })
      }

      this.persist()
    },
    updateQuantity(id: string, quantity: number) {
      const item = this.items.find(current => current.id === id)

      if (!item) {
        return
      }

      item.quantity = Math.max(1, quantity)
      this.persist()
    },
    toggle(id: string) {
      const item = this.items.find(current => current.id === id)

      if (item) {
        item.checked = !item.checked
        this.persist()
      }
    },
    remove(id: string) {
      this.items = this.items.filter(item => item.id !== id)
      this.persist()
    },
    removeMany(ids: string[]) {
      const idSet = new Set(ids)
      this.items = this.items.filter(item => !idSet.has(item.id))
      this.persist()
    },
    clear() {
      this.items = []
      this.persist()
    }
  }
})
