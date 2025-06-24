import { and, eq, like, gte, lte, count } from 'drizzle-orm'
import { events } from '@/server/database/schema'
import type { EventResponse, Event } from '@/types'

export default defineEventHandler(async (event): Promise<EventResponse> => {
  const db = useDrizzle()
  const query = getQuery(event)
  const page = parseInt(String(query.page || '1'), 10)
  const perPage = parseInt(String(query.perPage || query.limit || '100'), 10)
  const start = query.start ? parseInt(String(query.start), 10) : (page - 1) * perPage
  const limit = perPage

  // Build Drizzle where conditions
  const whereConditions = []
  if (query.topic) whereConditions.push(eq(events.topic, String(query.topic)))
  if (query.weekDayName) whereConditions.push(eq(events.weekDayName, String(query.weekDayName)))
  if (query.title) whereConditions.push(like(events.title, `%${String(query.title)}%`))
  if (query.description) whereConditions.push(like(events.description, `%${String(query.description)}%`))
  if (query.startDate) whereConditions.push(gte(events.date, String(query.startDate)))
  if (query.endDate) whereConditions.push(lte(events.date, String(query.endDate)))

  const where = whereConditions.length ? and(...whereConditions) : undefined

  // Count total using Drizzle ORM
  // const [{ count: total }] = await db
  //   .select({ count: count() })
  //   .from(events)
  //   .where(where)

  // Get paginated results using Drizzle ORM
  const dataRows = await db
    .select()
    .from(events)
    .where(where)
    .limit(limit)
    .offset(start)

  // Parse JSON fields as needed for Event type
  const parseJson = <T>(field: unknown): T | null => {
    try {
      return field ? JSON.parse(String(field)) : null
    } catch {
      return null
    }
  }

  const data: Event[] = dataRows.map(item => ({
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
    location: parseJson<Event['location']>(item.location) ?? { description: '', longitude: 0, latitude: 0 },
    organizer: parseJson<Event['organizer']>(item.organizer) ?? [],
    persons: parseJson<Event['persons']>(item.persons),
    contactPerson1: parseJson<Event['contactPerson1']>(item.contactPerson1) ?? { name: '', title: '', org: '', phone: '', email: '' },
    contactPerson2: parseJson<Event['contactPerson2']>(item.contactPerson2),
    url: item.url ?? '',
    uri: item.uri ?? '',
    urls: parseJson<Event['urls']>(item.urls) ?? { facebookUrl: '', url1: '' },
    digitalStream: item.digitalStream ?? '',
    digitalStreamUrl: item.digitalStreamUrl ?? '',
    digitalArchiveUrl: item.digitalArchiveUrl ?? '',
    digitalMeeting: item.digitalMeeting ?? '',
    color: parseJson<Event['color']>(item.color) ?? { main: '', item: '', itemSecondary: '' },
    showEmail: item.showEmail ?? '',
    showPhone: item.showPhone ?? '',
    languages: item.languages ?? '',
    accessibility: parseJson<Event['accessibility']>(item.accessibility) ?? [],
    environmental: parseJson<Event['environmental']>(item.environmental) ?? { stationary: '', serviceTravel: '', serviceCooking: '', recycling: '', certified: '', battery: '', noFood: '', disposable: '', sourceSorting: '' },
    interactiveLink: item.interactiveLink ?? '',
    interactiveLinkDescription: item.interactiveLinkDescription ?? '',
    streamService: item.streamService ?? '',
  }))

  return {
    data,
    pagination: {
      perPage: limit,
      page,
      // total,
      // totalPages: Math.ceil(Number(total) / Number(limit)),
    },
  }
})
