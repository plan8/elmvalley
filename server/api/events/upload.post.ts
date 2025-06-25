import { events } from '@/server/database/schema'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()
  const body = await readBody(event)
  if (!Array.isArray(body)) {
    return { error: true, message: 'Expected an array of events' }
  }
  let totalUpserted = 0
  for (const eventData of body) {
    await db.insert(events).values(eventData).onConflictDoUpdate({
      target: events.id,
      set: eventData,
    })
    totalUpserted++
  }
  return { ok: true, totalUpserted }
  // TODO: Add authentication for production use!
}) 