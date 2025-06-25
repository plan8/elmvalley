<script setup lang="ts">
import { ref } from 'vue'
import { useEventStore } from '@/stores/eventStore'
import EventMap from '@/components/EventMap.vue'
import TopicSelect from '@/components/TopicSelect.vue'

const store = useEventStore()
const loading = ref(false)
const error = ref<string | null>(null)

const selectedTopic = ref<string | null>(null)

async function fetchNearbyEvents() {
  loading.value = true
  error.value = null
  if (!navigator.geolocation) {
    error.value = 'Geolocation stöds inte av din webbläsare.'
    loading.value = false
    return
  }
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords
    // Calculate time window: now to now + 3 hours
    const now = new Date()
    const end = new Date(now.getTime() + 3 * 60 * 60 * 1000)
    const pad = (n: number) => n.toString().padStart(2, '0')
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
    const startTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`
    const endTime = `${pad(end.getHours())}:${pad(end.getMinutes())}`
    // Build params for the store
    const params: Record<string, string> = {
      near: `${longitude},${latitude}`,
      radius: '5', // 5km default
      startDate: today,
      endDate: today,
      startTime,
      endTime,
    }
    if (selectedTopic.value) {
      params.topic = selectedTopic.value
    }
    await store.search(params)
    loading.value = false
  }, (err) => {
    error.value = 'Kunde inte hämta plats: ' + err.message
    loading.value = false
  })
}
</script>

<template>
  <div>
    <TopicSelect v-model="selectedTopic" class="mb-4" />
    <UButton @click="fetchNearbyEvents" :loading="loading">
      Visa evenemang nära mig (idag, nästa 3 timmar)
    </UButton>
    <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
    <EventMap class="mt-4" />
  </div>
</template>
