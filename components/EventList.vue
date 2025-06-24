<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-bold">
        Evenemang
      </h2>
    </template>
    <div v-if="loading" class="text-gray-500 py-4">
      Laddar...
    </div>
    <div v-else-if="events.length === 0" class="text-gray-500 py-4">
      Inga evenemang hittades.
    </div>
    <div v-else class="flex flex-col gap-4">
      <UCard v-for="event in events" :key="event.id" class="border">
        <NuxtLink :to="`/${event.id}`" class="block hover:bg-gray-50 rounded p-2 transition">
          <div class="flex flex-col gap-1">
            <span class="font-semibold">{{ event.title }}</span>
            <span class="text-sm text-gray-600">{{ event.description }}</span>
            <span class="text-xs text-gray-500">{{ event.date }} | {{ event.topic }}</span>
          </div>
        </NuxtLink>
      </UCard>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useEventStore } from '@/stores/eventStore'

const store = useEventStore()
const { events } = storeToRefs(store)
const loading = ref(false)

// Optionally, you can watch for fetchEvents to set loading state if you want
// For now, just expose loading for future use
</script> 