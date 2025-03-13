import { Message } from '@ai-sdk/react'
import { v4 as uuidv4 } from 'uuid'
import { Company } from '../database/types'
export function shouldUseDarkText(backgroundColor: string) {
  // Convert hex to RGB
  const hex = backgroundColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Use dark text if background is light (luminance > 0.5)
  return luminance > 0.5
}

export function getFirstTwoInitials(name: string) {
  // Split the name by spaces
  const words = name.trim().split(/\s+/)

  // Get the first letter of the first two words
  const initials = words.slice(0, 2).map((word) => word[0].toUpperCase())

  // Join the initials
  return initials.join('')
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

type ObjectWithCreatedAt = {
  created_at: Date
}

export const chunk = <T>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size))

export function sortByCreatedAt<T extends ObjectWithCreatedAt>(projects: T[]): T[] {
  return projects.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function getPhotoUrl(name: string, template: string) {
  return `https://${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${template}/${name}`
}

export function getImgFromKey(imageKey: string, thumbnail = false) {
  return `https://${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${imageKey}`
}

export function getImgSrc(src: string, company?: Company | null) {
  return src === 'logo'
    ? company?.logo_image_key
      ? getImgFromKey(company.logo_image_key)
      : getImgFromKey('dummy-logo.png')
    : src
}

export function truncate(string: string, length: number) {
  return string.length > length ? string.substring(0, length) + '...' : string
}

export function formatFileSize(sizeBytes: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = sizeBytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`
}

export function isValidHttpUrl(string: string) {
  let url

  try {
    url = new URL(string)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

type ClassNamesArg = undefined | string | Record<string, boolean> | ClassNamesArg[]

export function classNames(...args: ClassNamesArg[]): string {
  let classes = ''

  for (const arg of args) {
    classes = appendClass(classes, parseValue(arg))
  }

  return classes
}

function appendClass(value: string, newClass: string | undefined) {
  if (!newClass) {
    return value
  }

  if (value) {
    return value + ' ' + newClass
  }

  return value + newClass
}

function parseValue(arg: ClassNamesArg) {
  if (typeof arg === 'string' || typeof arg === 'number') {
    return arg
  }

  if (typeof arg !== 'object') {
    return ''
  }

  if (Array.isArray(arg)) {
    return classNames(...arg)
  }

  let classes = ''

  for (const key in arg) {
    if (arg[key]) {
      classes = appendClass(classes, key)
    }
  }

  return classes
}

/**
 * Safely parses a value to an integer, handling undefined, null, and existing numbers.
 * Returns the default value if parsing fails.
 *
 * @param value - The value to parse
 * @param defaultValue - The value to return if parsing fails (defaults to 0)
 * @returns The parsed integer or default value
 */
export function safeParseInt(value: string | number | undefined | null, defaultValue = 0): number {
  // Return default for null/undefined
  if (value == null) return defaultValue

  // Already a number, just round it
  if (typeof value === 'number') return Math.round(value)

  // Try to parse string
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

export function getMostRecentUserMessage(messages: Array<Message>) {
  const userMessages = messages.filter((message) => message.role === 'user')
  return userMessages.at(-1)
}

export function generateUUID() {
  return uuidv4()
}

interface ApplicationError extends Error {
  info: string
  status: number
}

export const fetcher = async (url: string) => {
  const res = await fetch(url)

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.') as ApplicationError

    error.info = await res.json()
    error.status = res.status

    throw error
  }

  return res.json()
}
