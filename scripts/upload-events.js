// Usage: node scripts/upload-events.js [events.json] [API_URL]
// Example: node scripts/upload-events.js events.json https://your-prod-domain/api/events/upload

import fs from 'fs'
import fetch from 'node-fetch'

const file = process.argv[2] || 'events.json'
const apiUrl = process.argv[3] || 'http://localhost:3000/api/events/upload'

if (!fs.existsSync(file)) {
  console.error('File not found:', file)
  process.exit(1)
}

const events = JSON.parse(fs.readFileSync(file, 'utf-8'))

fetch(apiUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(events),
})
  .then(res => res.json())
  .then(json => {
    console.log('Response:', json)
  })
  .catch(err => {
    console.error('Error:', err)
    process.exit(1)
  }) 