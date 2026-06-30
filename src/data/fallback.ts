import type { Banner, Category, Product } from '@/types/api'

const templateAsset = (name: string) => `/template-assets/${name}`

export const fallbackBanners: Banner[] = [
  {
    id: 1,
    title: 'Template Launch',
    name: 'Lightweight Mall Starter',
    pic: templateAsset('banner.svg')
  },
  {
    id: 2,
    title: 'Daily Picks',
    name: 'Curated starter catalog',
    pic: templateAsset('banner.svg')
  }
]

export const fallbackCategories: Category[] = [
  { id: 1, name: 'Electronics', imageUrl: templateAsset('category-1.svg'), productCount: 2 },
  { id: 2, name: 'Home Goods', imageUrl: templateAsset('category-2.svg'), productCount: 0 },
  { id: 3, name: 'Everyday Carry', imageUrl: templateAsset('category-3.svg'), productCount: 1 }
]

export const fallbackProducts: Product[] = [
  {
    id: 1,
    name: 'Nova Keys Wireless Keyboard',
    subTitle: 'Hot-swappable keys for work and gaming desks',
    pic: templateAsset('product-1.svg'),
    albumPics: [templateAsset('product-1.svg'), templateAsset('category-1.svg')].join(','),
    price: 79,
    originalPrice: 99,
    stock: 120,
    sale: 42,
    brandId: 1,
    brandName: 'Nova Supply',
    productCategoryId: 1,
    productCategoryName: 'Electronics',
    description: 'A compact wireless keyboard with quiet switches and multi-device pairing.',
    detailDesc: 'Compact layout, wireless pairing, and replaceable keys for everyday productivity.'
  },
  {
    id: 2,
    name: 'Urban Sound Mini Speaker',
    subTitle: 'Portable Bluetooth audio for rooms and trips',
    pic: templateAsset('product-2.svg'),
    albumPics: [templateAsset('product-2.svg'), templateAsset('category-1.svg')].join(','),
    price: 49,
    originalPrice: 69,
    stock: 96,
    sale: 35,
    brandId: 2,
    brandName: 'Urban Nest',
    productCategoryId: 1,
    productCategoryName: 'Electronics',
    description: 'A small speaker with long battery life and clean tabletop styling.',
    detailDesc: 'Bluetooth pairing, durable shell, and a compact footprint for home or travel.'
  },
  {
    id: 3,
    name: 'Luma Commuter Backpack',
    subTitle: 'Water-resistant bag with laptop organization',
    pic: templateAsset('product-3.svg'),
    albumPics: [templateAsset('product-3.svg'), templateAsset('category-3.svg')].join(','),
    price: 89,
    originalPrice: 119,
    stock: 64,
    sale: 28,
    brandId: 3,
    brandName: 'Luma Works',
    productCategoryId: 3,
    productCategoryName: 'Everyday Carry',
    description: 'A daily backpack with a protected laptop sleeve and quick-access pockets.',
    detailDesc: 'Water-resistant fabric, laptop storage, and balanced shoulder straps.'
  }
]
