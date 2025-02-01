'use server'

import { createClient } from 'pexels'

// Initialize the Pexels client
const pexels = createClient(process.env.PEXELS_API_KEY || '')

export async function resolveImageSrc(src: string): Promise<string> {
  // Check if this is a service-based image request
  const match = src.match(/^(\w+):(.+)$/)
  if (!match) return src // Return as-is if not a service request

  const [_, service, keyword] = match

  switch (service.toLowerCase()) {
    case 'pexels':
      try {
        const result = await pexels.photos.search({
          query: keyword,
          per_page: 1,
        })

        if ('error' in result) {
          console.error('Pexels API error:', result.error)
          return src
        }

        const photo = result.photos[0]
        return photo?.src.large || src
      } catch (error) {
        console.error('Error fetching Pexels image:', error)
        return src
      }

    default:
      return src
  }
}
