// import { z } from 'zod'
import type { EventResponse } from '@/types'

export default defineEventHandler(async (event): Promise<EventResponse> => {
  // const query = getQuery(event)

  // const environmentalBools = [
  //   'food', 'battery', 'disposable', 'plastic', 'recycling', 'serviceTravel',
  //   'serviceCooking', 'serviceElectricity', 'print', 'stationary', 'water', 'flyer',
  // ]

  // Build Zod schema dynamically for environmental booleans
  // const envBoolSchema = environmentalBools.reduce(
  //   (acc, key) => ({ ...acc, [key]: z.string().optional() }),
  //   {},
  // )

  // const querySchema = z.object({
  //   page: z.string().optional(),
  //   perPage: z.string().optional(),
  //   limit: z.string().optional(),
  //   start: z.string().optional(),
  //   topic: z.string().optional(),
  //   weekDayName: z.string().optional(),
  //   title: z.string().optional(),
  //   description: z.string().optional(),
  //   near: z.string().optional(),
  //   radius: z.string().optional(),
  //   startDate: z.string().optional(),
  //   endDate: z.string().optional(),
  //   startTime: z.string().optional(),
  //   endTime: z.string().optional(),
   
  // })

  // const parsed = querySchema.safeParse(query)
  // if (!parsed.success) {
  //   throw createError({ statusCode: 400, statusMessage: 'Invalid query parameters' })
  // }

  // // Only pass defined params to the API
  // const apiQuery: Record<string, string> = {}
  // for (const [key, value] of Object.entries(parsed.data)) {
  //   if (typeof value === 'string' && value.length > 0) {
  //     apiQuery[key] = value
  //   }
  // }

  const url = 'https://gotland.se/appresource/4.4e8c940c1946e1ba5811593f/12.4e8c940c1946e1ba581159d0/items?start=0&day%5B%5D=M%C3%A5ndag&day%5B%5D=Tisdag&day%5B%5D=Onsdag&day%5B%5D=Torsdag&day%5B%5D=Fredag&time%5B%5D=10.00%20-%2011.00&certified%5B%5D=Ja&startDate=2025-06-23&endDate=2025-06-27'

  const oldUrl = 'https://almedalen-api.sparkling-rain-0bd6.workers.dev/event'
  const events = await $fetch<EventResponse>(url)

  return events
})
