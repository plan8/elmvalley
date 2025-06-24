<script setup lang="ts">
import { useEventsResult } from '@/composables/events'

const eventsResult = useEventsResult()

console.log(eventsResult.value)
</script>

<template>
  <div>
    <SearchBar />
    <RagSearchBar />
    <ColorMode />

    <h1>Hello Worldsdf</h1>

    <!-- <div v-if="eventsResult.value?.data?.length" class="mt-8">
      <div
        v-for="event in eventsResult.value.data"
        :key="event.id"
        class="mb-4 p-4 border rounded"
      >
        <div class="font-bold">
          {{ event.title }}
        </div>
        <div class="text-sm text-gray-500">
          {{ event.date }}
        </div>
      </div>
    </div>
    <div v-else-if="eventsResult.value && eventsResult.value.data && !eventsResult.value.data.length" class="mt-8 text-gray-500">
      Inga evenemang hittades.
    </div> -->
  </div>
</template>
