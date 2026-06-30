import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import StoreLayout from '@/layout/StoreLayout.vue'
import AccountPage from '@/pages/AccountPage.vue'
import AccountProductListPage from '@/pages/AccountProductListPage.vue'
import AccountSettingsPage from '@/pages/AccountSettingsPage.vue'
import AddressEditPage from '@/pages/AddressEditPage.vue'
import AddressListPage from '@/pages/AddressListPage.vue'
import AuthPage from '@/pages/AuthPage.vue'
import BrandListPage from '@/pages/BrandListPage.vue'
import BrandDetailPage from '@/pages/BrandDetailPage.vue'
import CartPage from '@/pages/CartPage.vue'
import CategoryPage from '@/pages/CategoryPage.vue'
import CheckoutPage from '@/pages/CheckoutPage.vue'
import EmailConfirmPage from '@/pages/EmailConfirmPage.vue'
import HomePage from '@/pages/HomePage.vue'
import InfoPage from '@/pages/InfoPage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import OrderDetailPage from '@/pages/OrderDetailPage.vue'
import OrderPage from '@/pages/OrderPage.vue'
import PaymentPage from '@/pages/PaymentPage.vue'
import PasswordResetPage from '@/pages/PasswordResetPage.vue'
import ProductDetailPage from '@/pages/ProductDetailPage.vue'
import ProductListPage from '@/pages/ProductListPage.vue'
import RefundApplyPage from '@/pages/RefundApplyPage.vue'
import RefundDetailPage from '@/pages/RefundDetailPage.vue'
import RefundListPage from '@/pages/RefundListPage.vue'
import { setLocalizedDocumentTitle } from '@/i18n'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: StoreLayout,
    children: [
      { path: '', name: 'home', component: HomePage, meta: { title: 'Home' } },
      { path: 'products', name: 'products', component: ProductListPage, meta: { title: 'Products' } },
      { path: 'products/new', name: 'products-new', component: ProductListPage, meta: { title: 'New Arrivals', productMode: 'new' } },
      { path: 'products/hot', name: 'products-hot', component: ProductListPage, meta: { title: 'Popular Picks', productMode: 'hot' } },
      { path: 'products/:id', name: 'product-detail', component: ProductDetailPage, meta: { title: 'Product Details' } },
      { path: 'brands', name: 'brands', component: BrandListPage, meta: { title: 'Recommended Brands' } },
      { path: 'brands/:id', name: 'brand-detail', component: BrandDetailPage, meta: { title: 'Brand Details' } },
      { path: 'categories', name: 'categories', component: CategoryPage, meta: { title: 'Categories' } },
      { path: 'cart', name: 'cart', component: CartPage, meta: { title: 'Cart' } },
      { path: 'checkout', name: 'checkout', component: CheckoutPage, meta: { title: 'Checkout' } },
      { path: 'orders', name: 'orders', component: OrderPage, meta: { title: 'Orders' } },
      { path: 'orders/:id/pay', name: 'order-payment', component: PaymentPage, meta: { title: 'Payment' } },
      { path: 'orders/:id/refund', name: 'order-refund-apply', component: RefundApplyPage, meta: { title: 'Request Refund' } },
      { path: 'orders/:id', name: 'order-detail', component: OrderDetailPage, meta: { title: 'Order Details' } },
      { path: 'refunds', name: 'refunds', component: RefundListPage, meta: { title: 'Refunds' } },
      { path: 'refunds/:id', name: 'refund-detail', component: RefundDetailPage, meta: { title: 'Refund Details' } },
      { path: 'account', name: 'account', component: AccountPage, meta: { title: 'Account' } },
      { path: 'account/settings', name: 'account-settings', component: AccountSettingsPage, meta: { title: 'Account Settings' } },
      {
        path: 'account/addresses',
        name: 'addresses',
        component: AddressListPage,
        meta: { title: 'Addresses' }
      },
      {
        path: 'account/addresses/new',
        name: 'address-new',
        component: AddressEditPage,
        meta: { title: 'Add Address' }
      },
      {
        path: 'account/addresses/:id',
        name: 'address-edit',
        component: AddressEditPage,
        meta: { title: 'Edit Address' }
      },
      {
        path: 'account/brand-attentions',
        name: 'brand-attentions',
        component: AccountProductListPage,
        meta: { title: 'Following' }
      },
      {
        path: 'account/collections',
        name: 'collections',
        component: AccountProductListPage,
        meta: { title: 'Favorites' }
      },
      {
        path: 'account/history',
        name: 'read-history',
        component: AccountProductListPage,
        meta: { title: 'History' }
      },
      { path: 'about', name: 'about', component: InfoPage, meta: { title: 'About', contentKey: 'about' } },
      { path: 'contact', name: 'contact', component: InfoPage, meta: { title: 'Contact', contentKey: 'contact' } },
      { path: 'help', name: 'help', component: InfoPage, meta: { title: 'Help Center', contentKey: 'help' } },
      { path: 'notice', name: 'notice', component: InfoPage, meta: { title: 'Order Guide', contentKey: 'notice' } }
    ]
  },
  { path: '/auth', name: 'auth', component: AuthPage, meta: { title: 'Sign In' } },
  { path: '/auth/forgot-password', name: 'forgot-password', component: PasswordResetPage, meta: { title: 'Reset Password' } },
  { path: '/auth/reset-password', name: 'reset-password', component: PasswordResetPage, meta: { title: 'Reset Password' } },
  { path: '/auth/email-confirm', name: 'email-confirm', component: EmailConfirmPage, meta: { title: 'Email Verification' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage, meta: { title: 'Page Not Found' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.afterEach(to => {
  setLocalizedDocumentTitle(to.meta.title || 'Mall', 'Mall Storefront')
})

export default router
