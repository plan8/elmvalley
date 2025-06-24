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
        v-model="description"
        placeholder="Sök efter beskrivning..."
        icon="i-heroicons-document-text"
        label="Beskrivning"
      />
      <UInput
        v-model="topic"
        placeholder="Sök efter ämne..."
        icon="i-heroicons-tag"
        label="Ämne (topic)"
      />
      <UInput
        v-model="weekDayName"
        placeholder="Veckodag (t.ex. Måndag)"
        icon="i-heroicons-calendar"
        label="Veckodag"
      />
      <UInput
        v-model="startDate"
        type="date"
        label="Startdatum"
      />
      <UInput
        v-model="endDate"
        type="date"
        label="Slutdatum"
      />
      <UButton type="submit" :loading="pending">
        Sök
      </UButton>
    </form>
    <div v-if="error" class="text-red-500 mt-2">
      {{ error }}
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { fetchEvents } from '@/composables/events'

const title = ref('')
const description = ref('')
const topic = ref('')
const weekDayName = ref('')
const startDate = ref('')
const endDate = ref('')
const pending = ref(false)
const error = ref('')

async function onSearch() {
  pending.value = true
  error.value = ''
  const params: Record<string, string> = {}
  if (title.value) params.title = title.value
  if (description.value) params.description = description.value
  if (topic.value) params.topic = topic.value
  if (weekDayName.value) params.weekDayName = weekDayName.value
  if (startDate.value) params.startDate = startDate.value
  if (endDate.value) params.endDate = endDate.value
  try {
    await fetchEvents(params)
  }
  catch (e: any) {
    error.value = e?.message || 'Något gick fel.'
  }
  finally {
    pending.value = false
  }
}
</script>
