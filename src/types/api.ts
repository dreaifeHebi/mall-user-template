export interface CommonResult<T = unknown> {
  code?: number | string
  message?: string
  data?: T
  [key: string]: unknown
}

export interface QueryParams {
  [key: string]: string | number | boolean | null | undefined
}

export interface Product {
  id: number | string
  brandId?: number | string
  name: string
  subTitle?: string
  pic?: string
  albumPics?: string
  price?: number | string
  originalPrice?: number | string
  stock?: number
  sale?: number
  productCategoryId?: number | string
  productCategoryName?: string
  brandName?: string
  description?: string
  detailDesc?: string
  [key: string]: unknown
}

export interface ProductDetailPayload {
  product?: Product
  brand?: Brand
  [key: string]: unknown
}

export interface Brand {
  id: number | string
  name: string
  firstLetter?: string
  logo?: string
  bigPic?: string
  brandStory?: string
  subTitle?: string
  productCount?: number
  factoryStatus?: number
  showStatus?: number
  sort?: number
  [key: string]: unknown
}

export interface Category {
  id: number | string
  name: string
  icon?: string
  imageUrl?: string
  productCount?: number
  children?: Category[]
  [key: string]: unknown
}

export interface Banner {
  id: number | string
  name?: string
  title?: string
  url?: string
  pic?: string
  imageUrl?: string
  [key: string]: unknown
}

export interface CartItem {
  id: string
  productId: number | string
  productName: string
  productPic?: string
  price: number
  quantity: number
  checked: boolean
}

export interface CartPromotionItem {
  id?: number | string
  productId?: number | string
  productSkuId?: number | string
  productName?: string
  productPic?: string
  productSubTitle?: string
  productSkuCode?: string
  productBrand?: string
  productSn?: string
  productAttr?: string
  price?: number | string
  quantity?: number
  reduceAmount?: number | string
  promotionMessage?: string
  realStock?: number
  integration?: number
  growth?: number
  [key: string]: unknown
}

export interface MemberProfile {
  id?: number | string
  username?: string
  nickname?: string
  icon?: string
  email?: string
  phone?: string
  [key: string]: unknown
}

export interface ReceiveAddress {
  id?: number | string
  memberId?: number | string
  name: string
  phoneNumber: string
  defaultStatus?: number
  postCode?: string
  province?: string
  city?: string
  region?: string
  detailAddress: string
  country?: string
  countryCode?: string
  prefixAddress?: string
  [key: string]: unknown
}

export interface MemberProductInteraction {
  id?: number | string
  memberId?: number | string
  memberNickname?: string
  memberIcon?: string
  productId: number | string
  productName: string
  productPic?: string
  productSubTitle?: string
  productPrice?: number | string
  createTime?: string
  [key: string]: unknown
}

export interface MemberBrandAttention {
  id?: number | string
  memberId?: number | string
  memberNickname?: string
  memberIcon?: string
  brandId: number | string
  brandName: string
  brandLogo?: string
  brandCity?: string
  createTime?: string
  [key: string]: unknown
}

export interface OrderItem {
  id?: number | string
  orderId?: number | string
  orderSn?: string
  productId?: number | string
  productPic?: string
  productName?: string
  productBrand?: string
  productSn?: string
  productPrice?: number | string
  productQuantity?: number
  productSkuCode?: string
  productAttr?: string
  promotionAmount?: number | string
  couponAmount?: number | string
  integrationAmount?: number | string
  realAmount?: number | string
  [key: string]: unknown
}

export interface OrderDetail {
  id: number | string
  memberId?: number | string
  orderSn?: string
  createTime?: string
  paymentTime?: string
  deliveryTime?: string
  receiveTime?: string
  totalAmount?: number | string
  payAmount?: number | string
  freightAmount?: number | string
  promotionAmount?: number | string
  couponAmount?: number | string
  integrationAmount?: number | string
  discountAmount?: number | string
  payType?: number | string
  status?: number | string
  receiverName?: string
  receiverPhone?: string
  receiverCountry?: string
  receiverCountryCode?: string
  receiverPostCode?: string
  receiverProvince?: string
  receiverCity?: string
  receiverRegion?: string
  receiverDetailAddress?: string
  deliveryCompany?: string
  deliverySn?: string
  note?: string
  confirmStatus?: number | string
  orderItemList?: OrderItem[]
  [key: string]: unknown
}

export interface ConfirmOrderAmount {
  totalAmount?: number | string
  freightAmount?: number | string
  promotionAmount?: number | string
  payAmount?: number | string
  [key: string]: unknown
}

export interface ConfirmOrderResult {
  cartPromotionItemList?: CartPromotionItem[]
  memberReceiveAddressList?: ReceiveAddress[]
  calcAmount?: ConfirmOrderAmount
  memberIntegration?: number
  couponHistoryDetailList?: unknown[]
  integrationConsumeSetting?: unknown
  [key: string]: unknown
}

export interface OrderCreateParam {
  memberReceiveAddressId: number | string
  couponId?: number | string | null
  useIntegration?: number
  payType?: number
  cartIds: Array<number | string>
  note?: string
}

export interface GenerateOrderResult {
  order?: OrderDetail
  orderItemList?: OrderItem[]
  [key: string]: unknown
}

export interface PaymentMethod {
  id: number | string
  methodCode: string
  methodName: string
  channel?: string
  type?: string
  iconUrl?: string
  status?: number
  minAmount?: number | string
  maxAmount?: number | string
  supportedCurrency?: string
  description?: string
  [key: string]: unknown
}

export interface H5PaymentRequest {
  orderId: number | string
  orderSn: string
  totalAmount: number | string
  currency: string
  paymentChannel: string
  subject: string
}

export interface H5PaymentResponse {
  success?: boolean
  paymentId?: number | string
  orderSn?: string
  paymentChannel?: string
  paymentAmount?: number | string
  paymentUrl?: string
  paymentStatus?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | string
  provider?: string
  redirectRequired?: boolean
  errorMessage?: string
  [key: string]: unknown
}

export interface PaymentRecord {
  id?: number | string
  orderId?: number | string
  orderSn?: string
  paymentChannel?: string
  paymentMethod?: string
  paymentAmount?: number | string
  currency?: string
  paymentStatus?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | string
  paymentUrl?: string
  failureReason?: string
  paymentTime?: string
  createTime?: string
  updateTime?: string
  [key: string]: unknown
}

export type RefundStatus =
  | 'PENDING_AUDIT'
  | 'APPROVED'
  | 'REJECTED'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | string

export interface RefundApplyParam {
  orderId: number | string
  refundAmount: number | string
  refundReason: string
}

export interface RefundRequest {
  id?: number | string
  refundSn?: string
  orderId?: number | string
  orderSn?: string
  paymentRecordId?: number | string
  memberId?: number | string
  memberUsername?: string
  refundAmount?: number | string
  refundReason?: string
  status?: RefundStatus
  applyTime?: string
  auditTime?: string
  auditorId?: number | string
  auditorName?: string
  auditNote?: string
  thirdPartyRefundId?: string
  refundTime?: string
  createTime?: string
  updateTime?: string
  [key: string]: unknown
}

export interface LoginPayload {
  username: string
  password: string
}
