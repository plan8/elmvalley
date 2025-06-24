<script setup lang="ts">
import { ref, computed } from 'vue'
import SearchBar from '@/components/SearchBaren.vue'
import EventList from '@/components/EventList.vue'



</script>

<template>
  <div>
    <ClientOnly>
      
      <SearchBar />
    </ClientOnly>
    <EventMap />
    <EventList />
   
    <RagSearchBar />
  
  </div>
</template>
