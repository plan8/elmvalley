import { defineStore } from 'pinia'
import type { Event, EventResponse } from '@/types'

export const useEventStore = defineStore('events', () => {
  const events = ref<Event[]>([])
  const searchParams = ref<Record<string, string | number | boolean | undefined>>({})
  const page = ref(1)
  const perPage = ref(10)
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Main fetch function, always uses current searchParams, page, perPage
  const fetchEvents = async () => {
    loading.value = true
    error.value = null
    const queryObj = { ...searchParams.value, page: page.value, perPage: perPage.value }
    const stringQueryObj: Record<string, string> = {}
    for (const [key, value] of Object.entries(queryObj)) {
      if (value !== undefined) stringQueryObj[key] = String(value)
    }
    const query = new URLSearchParams(stringQueryObj).toString()
    const url = `/api/events?${query}`
    try {
      const response = await useFetch<EventResponse>(url)
      events.value = response.data.value?.data ?? []
      total.value = response.data.value?.pagination.total ?? 0
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'message' in e) {
        error.value = (e as { message?: string }).message || 'Något gick fel.'
      }
      else {
        error.value = 'Något gick fel.'
      }
    }
    finally {
      loading.value = false
    }
  }

  // Called when a new search is performed (from the search bar)
  const search = async (params: Record<string, string>) => {
    searchParams.value = { ...params }
    await fetchEvents()
  }

  // Called when pagination changes
  const setPage = async (newPage: number) => {
    page.value = newPage
    searchParams.value = { ...searchParams.value, page: newPage }
    await fetchEvents()
  }

  // Called when perPage changes
  const setPerPage = async (newPerPage: number) => {
    perPage.value = newPerPage
    page.value = 1
    await fetchEvents()
  }

  return { events, fetchEvents, searchParams, page, perPage, total, setPage, setPerPage, search, loading, error }
})
