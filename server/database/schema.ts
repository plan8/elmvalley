import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const events = sqliteTable('events', {
  // Core fields
  id: text('id').primaryKey(),
  eventId: text('eventId'),
  title: text('title'),
  description: text('description'),
  socialIssue: text('socialIssue'),
  status: text('status'),
  lastChange: text('lastChange'),

  // Time and Date
  date: text('date'),
  dateISO: text('dateISO'),
  shortDate: text('shortDate'),
  startTime: text('startTime'),
  endTime: text('endTime'),
  weekDay: integer('weekDay'),
  weekDayName: text('weekDayName'),

  // Categorization
  topic: text('topic'),
  topic2: text('topic2'),
  category: text('category'),
  eventType: text('eventType'),

  // Location and People
  location: text('location'),             // JSON stringified object
  organizer: text('organizer'),           // JSON stringified array
  persons: text('persons'),               // JSON stringified array
  contactPerson1: text('contactPerson1'), // JSON stringified object
  contactPerson2: text('contactPerson2'), // JSON stringified object

  // Digital and URLs
  url: text('url'),
  uri: text('uri'),
  urls: text('urls'),                     // JSON stringified object
  digitalStream: text('digitalStream'),
  digitalStreamUrl: text('digitalStreamUrl'),
  digitalArchiveUrl: text('digitalArchiveUrl'),
  digitalMeeting: text('digitalMeeting'),

  // Display and Accessibility
  color: text('color'),                   // JSON stringified object
  showEmail: text('showEmail'),
  showPhone: text('showPhone'),
  languages: text('languages'),
  accessibility: text('accessibility'),   // JSON stringified array
  environmental: text('environmental'),   // JSON stringified object

  // Other
  interactiveLink: text('interactiveLink'),
  interactiveLinkDescription: text('interactiveLinkDescription'),
  streamService: text('streamService'),
}) 
