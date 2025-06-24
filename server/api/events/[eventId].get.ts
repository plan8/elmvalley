import { eq } from 'drizzle-orm'
import { events } from '@/server/database/schema'
import type { Event } from '@/types'

export default defineEventHandler(async (event): Promise<Event | { error: string }> => {
  const db = useDrizzle()
  const eventId = event.context.params?.eventId
  if (!eventId) {
    return { error: 'Missing eventId' }
  }
  const dataRows = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1)

  if (!dataRows.length) {
    return { error: 'Event not found' }
  }
  const item = dataRows[0]
  const parseJson = <T>(field: unknown): T | null => {
    try {
      return field ? JSON.parse(String(field)) : null
    }
    catch {
      return null
    }
  }
  return {
    ...item,
    id: item.id ?? '',
    eventId: item.eventId ?? '',
    title: item.title ?? '',
    description: item.description ?? '',
    socialIssue: item.socialIssue ?? '',
    status: item.status ?? '',
    lastChange: item.lastChange ?? '',
    date: item.date ?? '',
    dateISO: item.dateISO ?? null,
    shortDate: item.shortDate ?? '',
    startTime: item.startTime ?? '',
    endTime: item.endTime ?? '',
    weekDay: item.weekDay ?? 0,
    weekDayName: item.weekDayName ?? '',
    topic: item.topic ?? '',
    topic2: item.topic2 ?? '',
    category: item.category ?? '',
    eventType: item.eventType ?? '',
    location: parseJson(item.location) ?? { description: '', longitude: 0, latitude: 0 },
    organizer: parseJson(item.organizer) ?? [],
    persons: parseJson(item.persons),
    contactPerson1: parseJson(item.contactPerson1) ?? { name: '', title: '', org: '', phone: '', email: '' },
    contactPerson2: parseJson(item.contactPerson2),
    url: item.url ?? '',
    uri: item.uri ?? '',
    urls: parseJson(item.urls) ?? { facebookUrl: '', url1: '' },
    digitalStream: item.digitalStream ?? '',
    digitalStreamUrl: item.digitalStreamUrl ?? '',
    digitalArchiveUrl: item.digitalArchiveUrl ?? '',
    digitalMeeting: item.digitalMeeting ?? '',
    color: parseJson(item.color) ?? { main: '', item: '', itemSecondary: '' },
    showEmail: item.showEmail ?? '',
    showPhone: item.showPhone ?? '',
    languages: item.languages ?? '',
    accessibility: parseJson(item.accessibility) ?? [],
    environmental: parseJson(item.environmental) ?? { stationary: '', serviceTravel: '', serviceCooking: '', recycling: '', certified: '', battery: '', noFood: '', disposable: '', sourceSorting: '' },
    interactiveLink: item.interactiveLink ?? '',
    interactiveLinkDescription: item.interactiveLinkDescription ?? '',
    streamService: item.streamService ?? '',
  }
}) 