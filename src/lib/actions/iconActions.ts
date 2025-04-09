'use server'

import { generateIconPng } from '@/lib/utils/icon-generator'

/**
 * Server action to generate and return a base64-encoded icon
 * This bypasses browser caching issues by returning the icon data directly
 */
export async function generateIconAction(icon: string, theme: string, size: number = 64) {
  try {
    console.log('Server action: generating icon', { icon, theme, size })

    // Generate the icon
    const iconBuffer = await generateIconPng(icon, theme, size)

    // Convert to base64 for direct embedding in img src
    const base64Icon = Buffer.from(iconBuffer).toString('base64')

    // Return as a data URL
    return `data:image/png;base64,${base64Icon}`
  } catch (error) {
    console.error('Error in generateIconAction:', error)

    // Return a simple error icon as fallback
    const errorSvg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#ffeeee" />
        <text x="${size / 2}" y="${size / 2 + 5}" font-family="Arial" font-size="${size / 3}" text-anchor="middle" fill="#ff0000">!</text>
      </svg>
    `

    return `data:image/svg+xml;base64,${Buffer.from(errorSvg).toString('base64')}`
  }
}
