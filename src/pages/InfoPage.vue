<script setup lang="ts">
import { computed, type Component } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  ClipboardList,
  CreditCard,
  HelpCircle,
  Info,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Truck
} from '@lucide/vue'

interface InfoSection {
  title: string
  body?: string
  items?: string[]
}

interface InfoAction {
  label: string
  description: string
  href?: string
  to?: string
  icon: Component
}

interface InfoContent {
  eyebrow: string
  title: string
  summary: string
  icon: Component
  sections: InfoSection[]
  actions?: InfoAction[]
}

const route = useRoute()

const pages: Record<string, InfoContent> = {
  about: {
    eyebrow: 'About',
    title: 'About Mall',
    summary: 'A lightweight mall template with storefront, member, checkout, and admin foundations for secondary development.',
    icon: Info,
    sections: [
      {
        title: 'Template Positioning',
        body: 'This template extracts the admin, storefront, and core services from the original mall system and runs by default with PostgreSQL, Redis, local uploads, and Docker Compose.'
      },
      {
        title: 'Service Hours',
        body: 'Weekday support hours are shown as 09:00 - 18:00 for orders, payment, and after-sales questions. Replace this with real support information in production.'
      }
    ],
    actions: [
      { label: 'Contact Support', description: 'View email and chat entry points', to: '/contact', icon: MessageCircle },
      { label: 'Help Center', description: 'Read order, payment, and after-sales notes', to: '/help', icon: HelpCircle }
    ]
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Contact Us',
    summary: 'Default support entry points are included for the template. Replace them with your real email, WhatsApp, or business chat before production.',
    icon: MessageCircle,
    sections: [
      {
        title: 'Support Channels',
        items: ['Email: service@mall.com', 'WhatsApp: +86 188 8888 8888', 'Business chat: replace with your real account or QR code']
      },
      {
        title: 'Support Scope',
        items: ['Order and payment questions', 'Shipping address and delivery progress', 'Refund, after-sales, and account security questions']
      }
    ],
    actions: [
      { label: 'Send Email', description: 'service@mall.com', href: 'mailto:service@mall.com', icon: Mail },
      { label: 'WhatsApp', description: '+86 188 8888 8888', href: 'https://wa.me/8618888888888', icon: Phone }
    ]
  },
  help: {
    eyebrow: 'Help',
    title: 'Help Center',
    summary: 'Basic order, payment, delivery, and after-sales notes are included so the template can be extended after adoption.',
    icon: HelpCircle,
    sections: [
      {
        title: 'Order Flow',
        items: ['Add products to the cart and select items', 'Choose a shipping address on checkout', 'Submit the order and continue to payment', 'Wait for shipment after payment or admin confirmation']
      },
      {
        title: 'Common Questions',
        items: [
          'Visitors can browse products and use the local cart before signing in. Checkout requires a member account.',
          'The local template creates H5 payment records by default. Real third-party payment requires additional provider configuration.',
          'Refund requests require admin review before later processing steps.'
        ]
      }
    ],
    actions: [
      { label: 'Order Guide', description: 'Read order rules and disclaimers', to: '/notice', icon: ClipboardList },
      { label: 'Contact Support', description: 'View support entry points', to: '/contact', icon: MessageCircle }
    ]
  },
  notice: {
    eyebrow: 'Notice',
    title: 'Order Guide',
    summary: 'Confirm shipping information, item quantities, and payment method before submitting an order.',
    icon: ClipboardList,
    sections: [
      {
        title: 'Before Ordering',
        items: ['Confirm product names, quantities, and amount', 'Confirm recipient, phone, address, and postcode', 'Avoid sensitive or invalid text in order notes', 'Check order status again before payment']
      },
      {
        title: 'Service Notes',
        body: 'The template only provides a basic mall workflow example. Production payment redirects, logistics, original-route refunds, and support promises should follow the services you actually connect.'
      }
    ],
    actions: [
      { label: 'Shopping Flow', description: 'Start an order from product browsing', to: '/products', icon: ShoppingBag },
      { label: 'Payment Notes', description: 'View pending payment orders', to: '/orders', icon: CreditCard }
    ]
  }
}

const content = computed(() => pages[String(route.meta.contentKey || 'about')] || pages.about)
const guideIcons = [ShoppingBag, CreditCard, Truck, ShieldCheck]
</script>

<template>
  <section class="info-page">
    <div class="info-hero">
      <component :is="content.icon" :size="38" />
      <div>
        <p>{{ content.eyebrow }}</p>
        <h1>{{ content.title }}</h1>
        <span>{{ content.summary }}</span>
      </div>
    </div>

    <div class="info-grid">
      <article v-for="(section, index) in content.sections" :key="section.title" class="info-panel">
        <div class="info-panel-head">
          <component :is="guideIcons[index] || Info" :size="22" />
          <h2>{{ section.title }}</h2>
        </div>
        <p v-if="section.body">{{ section.body }}</p>
        <ul v-if="section.items?.length" class="info-list">
          <li v-for="item in section.items" :key="item">{{ item }}</li>
        </ul>
      </article>
    </div>

    <div v-if="content.actions?.length" class="info-actions">
      <component
        :is="action.href ? 'a' : RouterLink"
        v-for="action in content.actions"
        :key="action.label"
        class="info-action"
        :href="action.href"
        :to="action.to"
        :target="action.href ? '_blank' : undefined"
        :rel="action.href ? 'noreferrer' : undefined"
      >
        <component :is="action.icon" :size="22" />
        <span>
          <strong>{{ action.label }}</strong>
          <small>{{ action.description }}</small>
        </span>
      </component>
    </div>
  </section>
</template>
