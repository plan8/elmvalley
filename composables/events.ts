import { ref } from 'vue'
import { useFetch } from '#app'
import type { EventResponse } from '~/types'

const eventsResult = ref<EventResponse | null>(null)

export async function fetchEvents(params: Record<string, string | undefined> = {}) {
  const { data, error, pending, refresh } = await useFetch<EventResponse>('/api/events', {
    params,
  })
  if (data.value) {
    eventsResult.value = data.value
  }
  return { data, error, pending, refresh }
}

export function useEventsResult() {
  return eventsResult
}

export default { fetchEvents, useEventsResult }
