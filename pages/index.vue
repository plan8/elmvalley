<script setup lang="ts">
import type { EventResponse } from '~/types';

const { data: events } = await useFetch<EventResponse>('/api/events');
</script>

<template>
  <div>
    <Searchbar />
    <ColorMode />
  
    <h1>Hello Worldsdf</h1>
  </div>
</template>
