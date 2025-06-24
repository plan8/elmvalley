import { and, eq, gte, lte, sql } from 'drizzle-orm'
import { events } from '@/server/database/schema'
import type { EventResponse } from '@/types'

export default defineEventHandler(async (event): Promise<EventResponse> => {
  const db = useDrizzle()
  const query = getQuery(event)
  const page = parseInt(String(query.page || '1'), 10)
  const perPage = parseInt(String(query.perPage || query.limit || '100'), 10)
  const start = query.start ? parseInt(String(query.start), 10) : (page - 1) * perPage
  const limit = perPage

  // Build filters and WHERE clause
  const whereClauses: string[] = []
  const whereBinds: any[] = []
  if (query.topic) {
    whereClauses.push('topic = ?')
    whereBinds.push(String(query.topic))
  }
  if (query.weekDayName) {
    whereClauses.push('weekDayName = ?')
    whereBinds.push(String(query.weekDayName))
  }
  if (query.title) {
    whereClauses.push('title LIKE ?')
    whereBinds.push(`%${String(query.title)}%`)
  }
  if (query.description) {
    whereClauses.push('description LIKE ?')
    whereBinds.push(`%${String(query.description)}%`)
  }
  if (query.startDate) {
    whereClauses.push('date >= ?')
    whereBinds.push(String(query.startDate))
  }
  if (query.endDate) {
    whereClauses.push('date <= ?')
    whereBinds.push(String(query.endDate))
  }
  // Add more filters as needed

  const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : ''

  // Count total using D1's prepare
  const countStmt = db.$client.prepare(
    `SELECT COUNT(*) as count FROM events ${whereSQL}`
  ).bind(...whereBinds)
  const countResult = await countStmt.first()
  const total = countResult?.count ?? 0

  // Get paginated results using Drizzle ORM
  const dataStmt = db.$client.prepare(
    `SELECT * FROM events ${whereSQL} LIMIT ? OFFSET ?`
  ).bind(...whereBinds, limit, start)
  const dataRows = await dataStmt.all()

  // Parse JSON fields if needed
  const parseJsonField = (field: unknown) => {
    try {
      return field ? JSON.parse(String(field)) : null
    } catch {
      return null
    }
  }
  const data = dataRows.results.map(item => ({
    ...item,
    eventId: item.eventId ?? '',
    title: item.title ?? '',
    description: item.description ?? '',
    location: parseJsonField(item.location),
    organizer: parseJsonField(item.organizer),
    persons: parseJsonField(item.persons),
    contactPerson1: parseJsonField(item.contactPerson1),
    contactPerson2: parseJsonField(item.contactPerson2),
    urls: parseJsonField(item.urls),
    color: parseJsonField(item.color),
    accessibility: parseJsonField(item.accessibility),
    environmental: parseJsonField(item.environmental),
  }))

  return {
    data,
    pagination: {
      perPage: limit,
      page,
      total,
      totalPages: Math.ceil(Number(total) / Number(limit)),
    }
  }
})
