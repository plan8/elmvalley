// Usage: node scripts/scrape-events.js [output.json]
// Example: node scripts/scrape-events.js events.json

import fs from 'fs'
import fetch from 'node-fetch'

const BATCH_SIZE = 30
const START_DATE = '2025-06-23'
const END_DATE = '2025-06-27'
const outputFile = process.argv[2] || 'events.json'

let start = 0
let done = false
let allEvents = []

while (!done) {
  const url = `https://gotland.se/appresource/4.4e8c940c1946e1ba5811593f/12.4e8c940c1946e1ba581159d0/items?start=${start}&startDate=${START_DATE}&endDate=${END_DATE}`
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; AlmedalenScraper/1.0)',
    },
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    console.error('Failed to parse JSON', url)
    process.exit(1)
  }
  if (!json.items || !Array.isArray(json.items) || json.items.length === 0) {
    done = true
    break
  }
  for (const item of json.items) {
    const eventData = {
      id: item.id,
      eventId: item.eventId ?? '',
      title: item.title ?? '',
      description: item.description ?? '',
      socialIssue: item.socialIssue ?? '',
      status: item.status ?? '',
      lastChange: item.lastChange ?? '',
      date: item.date ?? '',
      dateISO: item.dateISO ?? '',
      shortDate: item.shortDate ?? '',
      startTime: item.startTime ?? '',
      endTime: item.endTime ?? '',
      weekDay: item.weekDay ?? 0,
      weekDayName: item.weekDayName ?? '',
      topic: item.topic ?? '',
      topic2: item.topic2 ?? '',
      category: item.category ?? '',
      eventType: item.eventType ?? '',
      location: JSON.stringify(item.location ?? {}),
      organizer: JSON.stringify(item.organizer ?? []),
      persons: JSON.stringify(item.persons ?? []),
      contactPerson1: JSON.stringify(item.contactPerson1 ?? {}),
      contactPerson2: JSON.stringify(item.contactPerson2 ?? {}),
      url: item.url ?? '',
      uri: item.uri ?? '',
      urls: JSON.stringify(item.urls ?? {}),
      digitalStream: item.digitalStream ?? '',
      digitalStreamUrl: item.digitalStreamUrl ?? '',
      digitalArchiveUrl: item.digitalArchiveUrl ?? '',
      digitalMeeting: item.digitalMeeting ?? '',
      color: JSON.stringify(item.color ?? {}),
      showEmail: item.showEmail ?? '',
      showPhone: item.showPhone ?? '',
      languages: item.languages ?? '',
      accessibility: JSON.stringify(item.accessibility ?? []),
      environmental: JSON.stringify(item.environmental ?? {}),
      interactiveLink: item.interactiveLink ?? '',
      interactiveLinkDescription: item.interactiveLinkDescription ?? '',
      streamService: item.streamService ?? '',
    }
    allEvents.push(eventData)
  }
  if (json.items.length < BATCH_SIZE) {
    done = true
  } else {
    start += BATCH_SIZE
  }
}

fs.writeFileSync(outputFile, JSON.stringify(allEvents, null, 2))
console.log(`Wrote ${allEvents.length} events to ${outputFile}`) 