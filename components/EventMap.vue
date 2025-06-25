<template>
  <div class="w-full h-[400px] rounded overflow-hidden">
    <client-only>
      <LMap
        v-if="eventMarkers.length"
        :zoom="zoom"
        :center="mapCenter"
        style="height: 100%; width: 100%"
        :bounds="bounds"
        :options="{ zoomControl: true }"
      >
        <LTileLayer :url="tileUrl" :attribution="attribution" />
        <LMarker v-for="marker in eventMarkers" :key="marker.id" :lat-lng="marker.latlng">
          <LPopup>
            <div class="font-bold">
              {{ marker.title }}
            </div>
            <div class="text-xs text-gray-500">
              {{ marker.topic }}
            </div>
            <NuxtLink :to="`/${marker.id}`" class="text-blue-600 underline mt-2 inline-block">
              Visa detaljer
            </NuxtLink>
          </LPopup>
        </LMarker>
      </LMap>
      <LMap
        v-else
        :zoom="5"
        :center="[62, 15]"
        style="height: 100%; width: 100%"
        :options="{ zoomControl: true }"
      >
        <LTileLayer :url="tileUrl" :attribution="attribution" />
      </LMap>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useEventStore } from '@/stores/eventStore'

const store = useEventStore()
const { events } = storeToRefs(store)

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const attribution
  = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

const eventMarkers = computed(() =>
  events.value
    .filter(
      e =>
        e.location
        && typeof e.location.latitude === 'number'
        && typeof e.location.longitude === 'number',
    )
    .map(e => ({
      id: e.id,
      latlng: [e.location.latitude, e.location.longitude],
      title: e.title,
      topic: e.topic,
    })),
)

const bounds = computed(() => {
  if (!eventMarkers.value.length) return undefined
  return eventMarkers.value.map(m => m.latlng)
})

const mapCenter = computed(() => {
  if (bounds.value && bounds.value.length) {
    return bounds.value[0]
  }
  return [62, 15]
})

const zoom = computed(() => (eventMarkers.value.length ? 12 : 5))
</script> 