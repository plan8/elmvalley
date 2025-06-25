<script setup lang="ts">
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'

const route = useRoute()

const router = useRouter()
const eventId = route.params.eventId as string
const { data, pending, error } = await useFetch(`/api/events/${eventId}`)
</script>

<template>
  <div>
    <div class="mb-4">
      <NuxtLink @click="router.back()">
        Tillbaka
      </NuxtLink>
    </div>
    <div v-if="pending">
      Laddar...
    </div>
    <div v-else-if="error || data?.error" class="text-red-500">
      Kunde inte hitta evenemanget.
    </div>
    <div v-else-if="data">
      <h1 class="text-2xl font-bold mb-2">
        {{ data.title }}
      </h1>
      <div class="mb-2 text-gray-600">
        {{ data.date }} {{ data.startTime }} - {{ data.endTime }}
      </div>
      <div class="mb-4">
        {{ data.description }}
      </div>
      <div v-if="data.location && data.location.description">
        <strong>Plats:</strong> {{ data.location.description }}
      </div>
      <div v-if="data.topic">
        <strong>Ämne:</strong> {{ data.topic }}
      </div>
      <div v-if="data.organizer && data.organizer.length">
        <strong>Arrangör:</strong> {{ data.organizer.join(', ') }}
      </div>
      <div v-if="data.persons && data.persons.length">
        <strong>Personer:</strong> {{ data.persons.map((p: any) => p.name || p).join(', ') }}
      </div>
      <div v-if="data.urls && (data.urls.url1 || data.urls.facebookUrl)">
        <strong>Länkar:</strong>
        <a v-if="data.urls.url1" :href="data.urls.url1" target="_blank" class="text-blue-600 underline">Hemsida</a>
        <a v-if="data.urls.facebookUrl" :href="data.urls.facebookUrl" target="_blank" class="text-blue-600 underline ml-2">Facebook</a>
      </div>
      <div v-if="data.location && typeof data.location.latitude === 'number' && typeof data.location.longitude === 'number'">
        <div class="my-6 w-full h-[300px] rounded overflow-hidden">
          <client-only>
            <LMap :zoom="15" :center="[data.location.latitude, data.location.longitude]" style="height: 100%; width: 100%">
              <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LMarker :lat-lng="[data.location.latitude, data.location.longitude]">
                <LPopup>{{ data.title }}</LPopup>
              </LMarker>
            </LMap>
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>