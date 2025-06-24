<template>
  <UCard>
    <form class="flex flex-col gap-4" @submit.prevent="onSearch">
      <UInput
        v-model="title"
        placeholder="Sök efter titel..."
        icon="i-heroicons-magnifying-glass"
        label="Titel"
      />
      <UInput
        v-model="description"
        placeholder="Sök efter beskrivning..."
        icon="i-heroicons-document-text"
        label="Beskrivning"
      />
      <UInput
        v-model="topic"
        placeholder="Sök efter ämne..."
        icon="i-heroicons-tag"
        label="Ämne (topic)"
      />
      <UInput
        v-model="weekDayName"
        placeholder="Veckodag (t.ex. Måndag)"
        icon="i-heroicons-calendar"
        label="Veckodag"
      />
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
import { ref, computed } from 'vue'
import { useGeolocation } from '@vueuse/core'
import { useEventStore } from '@/stores/eventStore'

const title = ref('')
const description = ref('')
const topic = ref('')
const weekDayName = ref('')
const startDate = ref('')
const endDate = ref('')
const radius = ref(5)

const store = useEventStore()

const { coords, error: geoError, isSupported, resume } = useGeolocation({ immediate: false })
const locating = ref(false)

const hasLocation = computed(() =>
  coords.value.latitude !== null && coords.value.longitude !== null
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

async function onSearch() {
  const params: Record<string, string> = {}
  if (title.value) params.title = title.value
  if (description.value) params.description = description.value
  if (topic.value) params.topic = topic.value
  if (weekDayName.value) params.weekDayName = weekDayName.value
  if (startDate.value) params.startDate = startDate.value
  if (endDate.value) params.endDate = endDate.value
  if (hasLocation.value) {
    params.near = `${coords.value.longitude},${coords.value.latitude}`
    params.radius = String(radius.value)
  }
  await store.search(params)
}

function onPageChange(newPage: number) {
  store.setPage(newPage)
}
</script>
