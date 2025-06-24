<template>
  <div class="flex justify-between items-center my-4">
    <div class="font-bold text-lg">
      Elmvalley
    </div>
    <div class="flex items-center gap-4">
        <ColorMode />
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to">
        {{ link.label }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script logic needed for basic nav

const links = [
  {
    label: 'Hem',
    to: '/'
  },
  {
    label: 'Nära mig',
    to: '/closeby'
  },
  
]
</script> 