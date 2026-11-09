import type { MemberProductInteraction, Product } from '@/types/api'
import { createReadHistory } from '@/api/memberReadHistory'

const STORAGE_KEY = 'mall.session.history'
const MAX_ITEMS = 24

function readRows(): MemberProductInteraction[] {
  const raw = sessionStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as MemberProductInteraction[]) : []
  } catch {
    sessionStorage.removeItem(STORAGE_KEY)
    return []
  }
}

function writeRows(rows: MemberProductInteraction[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rows.slice(0, MAX_ITEMS)))
}

export function addSessionReadHistory(product: Product) {
  if (!product.id) {
    return
  }

  const row: MemberProductInteraction = {
    id: `session-${product.id}`,
    productId: product.id,
    productName: product.name,
    productPic: product.pic,
    productSubTitle: product.subTitle,
    productPrice: product.price,
    createTime: new Date().toISOString()
  }
  const rows = readRows().filter(item => String(item.productId) !== String(product.id))
  writeRows([row, ...rows])
}

export function listSessionReadHistory() {
  return readRows()
}

export function removeSessionReadHistory(productId: number | string) {
  writeRows(readRows().filter(item => String(item.productId) !== String(productId)))
}

export function clearSessionReadHistory() {
  sessionStorage.removeItem(STORAGE_KEY)
}

export async function syncSessionReadHistoryToAccount() {
  const rows = readRows()

  if (!rows.length) {
    return
  }

  await Promise.all(
    rows.map(row =>
      createReadHistory({
        productId: row.productId,
        productName: row.productName,
        productPic: row.productPic,
        productSubTitle: row.productSubTitle,
        productPrice: row.productPrice
      })
    )
  )
  clearSessionReadHistory()
}
