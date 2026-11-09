<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, MapPin } from '@lucide/vue'
import { addAddress, fetchAddressDetail, updateAddress } from '@/api/address'
import { useAuthStore } from '@/stores/auth'
import type { ReceiveAddress } from '@/types/api'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const saving = ref(false)
const error = ref('')

const addressId = computed(() => String(route.params.id || ''))
const isEdit = computed(() => Boolean(addressId.value))

const countryOptions = [
  { code: 'US', label: 'United States', dialCode: '+1', placeholder: 'California, San Francisco, SOMA' },
  { code: 'GB', label: 'United Kingdom', dialCode: '+44', placeholder: 'England, London' },
  { code: 'JP', label: 'Japan', dialCode: '+81', placeholder: 'Tokyo, Shibuya' }
]

const form = reactive<ReceiveAddress>({
  name: '',
  phoneNumber: '',
  postCode: '',
  province: '',
  city: '',
  region: '',
  detailAddress: '',
  defaultStatus: 0,
  country: 'US',
  countryCode: '+1',
  prefixAddress: ''
})

const selectedCountry = computed(
  () => countryOptions.find(item => item.code === form.country) || countryOptions[0]
)

function syncDialCode() {
  form.countryCode = selectedCountry.value.dialCode
}

function assignAddress(address: ReceiveAddress) {
  const country = address.country || 'US'
  const countryOption = countryOptions.find(item => item.code === country) || countryOptions[0]
  Object.assign(form, {
    ...address,
    country,
    countryCode: address.countryCode || countryOption.dialCode,
    defaultStatus: address.defaultStatus || 0,
    prefixAddress:
      address.prefixAddress ||
      [address.province, address.city, address.region].filter(Boolean).join(' ')
  })
}

function parsePrefixAddress(value: string) {
  const parts = value
    .split(/[,，、]/)
    .map(part => part.trim())
    .filter(Boolean)

  if (parts.length > 0) {
    form.province = parts[0] || ''
    form.city = parts[1] || ''
    form.region = parts[2] || ''
    return
  }

  form.province = value.trim()
  form.city = ''
  form.region = ''
}

function validate() {
  if (!form.name.trim()) {
    return 'Enter the recipient name'
  }

  const normalizedPhone = String(form.phoneNumber || '').replace(/\D/g, '')
  if (!/^\d{7,15}$/.test(normalizedPhone)) {
    return 'Enter a valid phone number'
  }

  if (!String(form.prefixAddress || '').trim()) {
    return 'Enter the area'
  }

  if (!String(form.detailAddress || '').trim()) {
    return 'Enter the street address'
  }

  return ''
}

async function loadAddress() {
  if (!auth.isLoggedIn || !isEdit.value) {
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await fetchAddressDetail(addressId.value)
    if (result.data) {
      assignAddress(result.data)
    }
  } catch {
    error.value = 'Address details failed to load'
  } finally {
    loading.value = false
  }
}

async function submit() {
  error.value = validate()
  if (error.value) {
    return
  }

  parsePrefixAddress(String(form.prefixAddress || ''))

  const payload: ReceiveAddress = {
    ...form,
    id: isEdit.value ? addressId.value : form.id,
    name: form.name.trim(),
    phoneNumber: String(form.phoneNumber).replace(/\D/g, ''),
    postCode: form.postCode?.trim(),
    detailAddress: form.detailAddress.trim(),
    country: selectedCountry.value.code,
    countryCode: selectedCountry.value.dialCode,
    defaultStatus: form.defaultStatus === 1 ? 1 : 0,
    prefixAddress: String(form.prefixAddress || '').trim()
  }

  saving.value = true

  try {
    if (isEdit.value) {
      await updateAddress(payload)
    } else {
      await addAddress(payload)
    }

    await router.push('/account/addresses')
  } catch {
    error.value = 'Save failed'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  void loadAddress()
})
</script>

<template>
  <section class="address-page">
    <div class="page-heading">
      <div>
        <p>Address</p>
        <h1>{{ isEdit ? 'Edit Address' : 'Add Address' }}</h1>
      </div>
      <button class="text-button" @click="router.push('/account/addresses')">
        <ArrowLeft :size="18" />
        Back
      </button>
    </div>

    <div v-if="!auth.isLoggedIn" class="simple-empty">
      <MapPin :size="36" />
      <strong>Please sign in first</strong>
      <button class="primary-button" @click="router.push('/auth')">Sign In</button>
    </div>
    <div v-else-if="loading" class="loading-line">Loading...</div>
    <form v-else class="address-form" @submit.prevent="submit">
      <label>
        <span>Recipient</span>
        <input v-model="form.name" autocomplete="name" required />
      </label>

      <div class="form-row">
        <label>
          <span>Country</span>
          <select v-model="form.country" @change="syncDialCode">
            <option v-for="country in countryOptions" :key="country.code" :value="country.code">
              {{ country.label }}
            </option>
          </select>
        </label>
        <label>
          <span>Dial Code</span>
          <input :value="selectedCountry.dialCode" disabled />
        </label>
      </div>

      <label>
        <span>Phone</span>
        <input v-model="form.phoneNumber" inputmode="numeric" autocomplete="tel" required />
      </label>

      <div class="form-row">
        <label>
          <span>Postcode</span>
          <input v-model="form.postCode" autocomplete="postal-code" />
        </label>
        <label class="checkbox-row">
          <input v-model="form.defaultStatus" type="checkbox" :true-value="1" :false-value="0" />
          <span>Default Address</span>
        </label>
      </div>

      <label>
        <span>Area</span>
        <input v-model="form.prefixAddress" :placeholder="selectedCountry.placeholder" required />
      </label>

      <label>
        <span>Street Address</span>
        <input v-model="form.detailAddress" autocomplete="street-address" required />
      </label>

      <p v-if="error" class="form-error">{{ error }}</p>

      <button class="primary-button" :disabled="saving">
        {{ saving ? 'Saving...' : 'Save Address' }}
      </button>
    </form>
  </section>
</template>
