<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Edit3, MapPin, Plus, Star, Trash2 } from '@lucide/vue'
import { deleteAddress, fetchAddressList, updateAddress } from '@/api/address'
import { useAuthStore } from '@/stores/auth'
import type { ReceiveAddress } from '@/types/api'

const router = useRouter()
const auth = useAuthStore()
const addresses = ref<ReceiveAddress[]>([])
const loading = ref(false)
const error = ref('')

const ukAddresses = computed(() =>
  addresses.value.filter(address => address.country === 'GB' || address.countryCode === '+44')
)

function fullAddress(address: ReceiveAddress) {
  return [
    address.prefixAddress,
    !address.prefixAddress ? address.province : '',
    !address.prefixAddress ? address.city : '',
    !address.prefixAddress ? address.region : '',
    address.detailAddress
  ]
    .filter(Boolean)
    .join(' ')
}

function formattedPhone(address: ReceiveAddress) {
  return `${address.countryCode || '+44'} ${address.phoneNumber || ''}`.trim()
}

async function loadAddresses() {
  if (!auth.isLoggedIn) {
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await fetchAddressList()
    addresses.value = result.data || []
  } catch {
    error.value = '地址加载失败'
    addresses.value = []
  } finally {
    loading.value = false
  }
}

async function removeAddress(address: ReceiveAddress) {
  if (!address.id || !window.confirm('确认删除这个收货地址？')) {
    return
  }

  await deleteAddress(address.id)
  await loadAddresses()
}

async function markDefault(address: ReceiveAddress) {
  if (!address.id || address.defaultStatus === 1) {
    return
  }

  await updateAddress({ ...address, defaultStatus: 1 })
  await loadAddresses()
}

onMounted(() => {
  void loadAddresses()
})
</script>

<template>
  <section class="address-page">
    <div class="page-heading">
      <div>
        <p>Addresses</p>
        <h1>收货地址</h1>
      </div>
      <RouterLink v-if="auth.isLoggedIn" class="primary-link" to="/account/addresses/new">
        <Plus :size="18" />
        新增地址
      </RouterLink>
    </div>

    <div v-if="!auth.isLoggedIn" class="simple-empty">
      <MapPin :size="36" />
      <strong>请先登录</strong>
      <button class="primary-button" @click="router.push('/auth')">登录</button>
    </div>
    <div v-else-if="loading" class="loading-line">加载中...</div>
    <div v-else-if="error" class="loading-line">{{ error }}</div>
    <div v-else-if="!ukAddresses.length" class="simple-empty">
      <MapPin :size="36" />
      <strong>暂无收货地址</strong>
      <RouterLink class="primary-link" to="/account/addresses/new">新增地址</RouterLink>
    </div>
    <div v-else class="address-list">
      <article v-for="address in ukAddresses" :key="address.id" class="address-card">
        <div class="address-card-main">
          <div class="address-title">
            <strong>{{ address.name }}</strong>
            <span v-if="address.defaultStatus === 1">默认</span>
          </div>
          <p>{{ fullAddress(address) }}</p>
          <em>{{ formattedPhone(address) }}</em>
        </div>
        <div class="address-actions">
          <button
            class="icon-button"
            title="Set as default"
            :disabled="address.defaultStatus === 1"
            @click="markDefault(address)"
          >
            <Star :size="17" />
          </button>
          <RouterLink class="icon-button" title="Edit" :to="`/account/addresses/${address.id}`">
            <Edit3 :size="17" />
          </RouterLink>
          <button class="icon-button danger-action" title="Delete" @click="removeAddress(address)">
            <Trash2 :size="17" />
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
