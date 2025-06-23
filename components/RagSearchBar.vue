<template>
  <UCard>
    <form class="flex flex-col gap-4" @submit.prevent="onSearch">
      <UInput
        v-model="query"
        placeholder="Sök med RAG..."
        icon="i-heroicons-magnifying-glass"
        label="RAG-sökfråga"
      />
      <UButton type="submit">
        Sök
      </UButton>
    </form>
    <div v-if="error" class="text-red-500 mt-2">
      {{ error.message }}
    </div>
    <pre v-if="data && !pending && !error" class="mt-2 whitespace-pre-wrap">
      {{ data }}
    </pre>
  </UCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '#app'

const query = ref('')
const params = ref<{ query: string }>({ query: '' })
const { data, pending, error, execute } = useFetch('/api/events/rag', {
  method: 'GET',
  params,
  immediate: false,
})

function onSearch() {
  params.value.query = query.value
  execute()
}
</script>
