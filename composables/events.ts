import { useFetch } from '#app'
import type { EventResponse } from '~/types'

export function useEvents(params: Record<string, string | undefined> = {}) {
  return useFetch<EventResponse>('/api/almevents', {
    params,
  })
}

export default useEvents
