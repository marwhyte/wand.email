import { Email } from '@/app/components/email-workspace/types'
import { Message } from '@ai-sdk/react'
import parse from 'html-react-parser'
import { v4 as uuidv4 } from 'uuid'
import { Company } from '../database/types'
import { parseEmailScript } from './email-script-parser'

import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shouldUseDarkText(backgroundColor: string) {
  // Convert hex to RGB
  const hex = backgroundColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Use dark text if background is light (luminance > 0.65)
  return luminance > 0.65
}

// export const renderSocialIcons = () => {
//   return FOLDERS.map(({ name, title }) => (
//     <div key={name} className="flex flex-col items-center gap-8">
//       <p className="mx-2 text-xs">{title}</p>
//       {Object.entries(COMMON_SOCIAL_ICONS).map(([platform]) => (
//         <div key={`${name}-${platform}`} className="flex flex-col items-center gap-4">
//           <img
//             key={`${name}-${platform}`}
//             src={getPhotoUrl(COMMON_SOCIAL_ICONS[platform as keyof typeof COMMON_SOCIAL_ICONS], name)}
//             alt={`${title} ${platform} icon`}
//             className="m-2 h-8 w-8"
//           />
//         </div>
//       ))}
//     </div>
//   ))
// }

export function ensurePx(value: string): string {
  // If value already has px or % suffix, return as is
  if (value.endsWith('px') || value.endsWith('%')) {
    return value
  }

  // Otherwise, append px∂
  return `${value}px`
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
  createdAt: Date
}

export const chunk = <T>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size))

export function sortByCreatedAt<T extends ObjectWithCreatedAt>(projects: T[]): T[] {
  return projects.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

export function getPhotoUrl(name: string, template: string) {
  return `https://${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${template}/${name}`
}

export function getImgFromKey(imageKey: string, thumbnail = false) {
  return `https://${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${imageKey}`
}

export const parseText = (text: string, linkColor: string) => {
  const options = {
    replace: (domNode: any) => {
      if (domNode.name === 'a' && (!domNode.attribs.style || !domNode.attribs.style.includes('color'))) {
        domNode.attribs.style = `color: ${linkColor};`
        return domNode
      }
    },
  }

  return parse(text, options)
}

export function getEmailFromMessage(email: Email | null, message: Message) {
  const hasOpenTag = message.content.includes('<EMAIL') && message.content.match(/<EMAIL\s+[^>]*>/)
  const hasCloseTag = message.content.includes('</EMAIL>')

  if (hasOpenTag && hasCloseTag) {
    const emailRegex = /<EMAIL\s+[^>]*>[\s\S]*?<\/EMAIL>/i
    const emailMatch = message.content.match(emailRegex)

    if (emailMatch) {
      const emailString = emailMatch[0] // This gets the entire match including tags
      const emailObject = parseEmailScript(emailString, email)
      return emailObject
    }
  }

  return null
}

export function getImgSrc(src: string, company?: Company | null) {
  return src === 'logo'
    ? company?.logoImageKey
      ? getImgFromKey(company.logoImageKey)
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
