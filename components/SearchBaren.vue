<template>
  <UCard>
    <form class="flex flex-col gap-4" @submit.prevent="onSearch">
      <UInput
        v-model="query"
        placeholder="Sök efter titel eller beskrivning..."
        icon="i-heroicons-magnifying-glass"
        label="Sök"
      />
      <TopicSelect v-model="topic" />
      <UInput
        v-model="startDate"
        type="date"
        label="Startdatum"
      />
      <UInput
        v-model="endDate"
        type="date"
        label="Slutdatum"
      />
      <div class="flex flex-col gap-2">
        {{isSupported}}
        <UButton @click.prevent="getLocation" :loading="locating">
          {{ locating ? 'Hämtar plats...' : 'Använd min plats' }}
        </UButton>
        <div v-if="hasLocation">
          <label for="radius" class="block mb-1">
            Radie (km):
          </label>
          <UInput
            id="radius"
            type="number"
            v-model.number="radius"
            min="1"
            max="100"
            class="mb-2"
          />
        </div>
        <div v-if="locationError" class="text-red-500 mt-2">
          {{ locationError }}
        </div>
      </div>
      <UButton type="submit" :loading="store.loading">
        Sök
      </UButton>
    </form>
    <UPagination
      v-model:page="store.page"
      :items-per-page="store.perPage"
      :total="store.total"
      class="mt-4"
      @update:page="onPageChange"
    />
    <div v-if="store.error" class="text-red-500 mt-2">
      {{ store.error }}
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGeolocation } from '@vueuse/core'
import { useEventStore } from '@/stores/eventStore'
import { useRouter, useRoute } from '#imports'
import TopicSelect from '@/components/TopicSelect.vue'

function getToday() {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

const query = ref('')
const topic = ref('')
const startDate = ref(getToday())
const endDate = ref('')
const radius = ref(5)

const store = useEventStore()
const router = useRouter()
const route = useRoute()

const { coords, error: geoError, isSupported, resume } = useGeolocation({ immediate: false })
const locating = ref(false)

const hasLocation = computed(() =>
  coords.value.latitude !== null && coords.value.longitude !== null,
)

const locationError = computed(() => {
  if (!isSupported.value) return 'Geolocation stöds inte av din webbläsare.'
  if (geoError.value) return 'Kunde inte hämta plats: ' + geoError.value.message
  return ''
})

function getLocation() {
  locating.value = true
  resume()
  // Wait for coords or error to update
  const stop = watch(
    [() => coords.value.latitude, () => coords.value.longitude, geoError],
    () => {
      locating.value = false
      stop()
    },
  )
}

function buildParamsFromFields() {
  const params: Record<string, string> = {}
  if (query.value) {
    params.title = query.value
    params.description = query.value
  }
  if (topic.value) params.topic = topic.value
  if (startDate.value) params.startDate = startDate.value
  if (endDate.value) params.endDate = endDate.value
  if (hasLocation.value) {
    params.near = `${coords.value.longitude},${coords.value.latitude}`
    params.radius = String(radius.value)
  }
  return params
}

function hydrateFieldsFromQuery(q: Record<string, unknown>) {
  // Combine title/description into query if either is present
  if (typeof q.title === 'string' && q.title) {
    query.value = q.title
  }
  else if (typeof q.description === 'string' && q.description) {
    query.value = q.description
  }
  else {
    query.value = ''
  }
  topic.value = typeof q.topic === 'string' ? q.topic : ''
  startDate.value = typeof q.startDate === 'string' ? q.startDate : getToday()
  endDate.value = typeof q.endDate === 'string' ? q.endDate : ''
  radius.value = typeof q.radius === 'string' ? Number(q.radius) : 5
  // Skipping location hydration for now
}

function buildParamsFromQuery(q: Record<string, unknown>) {
  const params: Record<string, string> = {}
  if (typeof q.title === 'string' && q.title) {
    params.title = q.title
    params.description = q.title
  }
  else if (typeof q.description === 'string' && q.description) {
    params.title = q.description
    params.description = q.description
  }
  if (typeof q.topic === 'string' && q.topic) params.topic = q.topic
  if (typeof q.startDate === 'string' && q.startDate) params.startDate = q.startDate
  if (typeof q.endDate === 'string' && q.endDate) params.endDate = q.endDate
  if (typeof q.near === 'string' && q.near) params.near = q.near
  if (typeof q.radius === 'string' && q.radius) params.radius = q.radius
  return params
}

function onSearch() {
  const params = buildParamsFromFields()
  router.push({ query: { ...params, page: '1' } })
}

function onPageChange(newPage: number) {
  const params = buildParamsFromFields()
  router.push({ query: { ...params, page: String(newPage) } })
}

watch(
  () => route.query,
  (q) => {
    hydrateFieldsFromQuery(q)
    const params = buildParamsFromQuery(q)
    const page = typeof q.page === 'string' && !isNaN(Number(q.page)) ? Number(q.page) : 1
    store.page = page
    store.search(params)
  },
  { immediate: true },
)
</script>
