<script setup lang="ts">
import type { EventResponse } from '~/types'

const { data: events } = await useFetch<EventResponse>('/api/events')

console.log(events)
</script>

<template>
  <div>
    <Searchbar />
    <RagSearchBar />
    <ColorMode />

    <h1>Hello Worldsdf</h1>
  </div>
</template>
