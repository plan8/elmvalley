<template>
  <UCard>
    <form class="flex flex-col gap-4" @submit.prevent="onSearch">
      <UInput
        v-model="title"
        placeholder="Sök efter titel..."
        icon="i-heroicons-magnifying-glass"
        label="Titel"
      />
      <UInput
        v-model="startDate"
        type="date"
        label="Startdatum"
      />
      <UButton type="submit" :loading="pending">
        Sök
      </UButton>
    </form>
    <div v-if="error" class="text-red-500 mt-2">
      {{ error.message }}
    </div>
    <!-- <pre>
      {{ data }}
    </pre> -->
  </UCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEvents } from '@/composables/events'

const title = ref('')
const startDate = ref('')
const params = ref<Record<string, string>>({})

const { pending, error, refresh, data } = useEvents(params.value)

function onSearch() {
  params.value = {}
  if (title.value) params.value.title = title.value
  if (startDate.value) params.value.startDate = startDate.value
  refresh()
}

// Optionally emit results to parent
// defineEmits(['update:results'])
// watch(data, val => emit('update:results', val))
</script>
