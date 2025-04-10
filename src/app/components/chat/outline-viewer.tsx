import { Chat } from '@/lib/database/types'
import { motion } from 'motion/react'
import { Heading } from '../heading'
import { OutlineHeader } from './outline-header'

interface OutlineSection {
  title: string
  items: string[]
}

interface Outline {
  emailType: string
  sections: OutlineSection[]
}

interface OutlineViewerProps {
  content: string
  isStreaming: boolean
  chat: Chat | null | undefined
}

function parseOutline(content: string): Outline {
  try {
    const lines = content.split('\n')
    const outline: Outline = {
      emailType: '',
      sections: [],
    }

    let currentSection: OutlineSection | null = null
    let currentItems: string[] = []

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue

      // Parse header information
      if (trimmedLine.startsWith('Email Type:')) {
        outline.emailType = trimmedLine.replace('Email Type:', '').trim()
        continue
      }

      // Parse sections
      if (/^\d+\./.test(trimmedLine)) {
        if (currentSection) {
          currentSection.items = currentItems
          outline.sections.push(currentSection)
          currentItems = []
        }
        currentSection = {
          title: trimmedLine.replace(/^\d+\.\s*/, '').trim(),
          items: [],
        }
        continue
      }

      // Parse bullet points
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
        const item = trimmedLine.replace(/^[•*]\s*/, '').trim()
        if (item) {
          currentItems.push(item)
        }
        continue
      }

      // Handle indented bullet points
      if (trimmedLine.startsWith('  •') || trimmedLine.startsWith('  *')) {
        const item = trimmedLine.replace(/^  [•*]\s*/, '').trim()
        if (item) {
          currentItems.push(item)
        }
        continue
      }
    }

    // Add the last section if exists
    if (currentSection) {
      currentSection.items = currentItems
      outline.sections.push(currentSection)
    }

    return outline
  } catch (error) {
    console.error('Error parsing outline:', error)
    return {
      emailType: 'Error',
      sections: [{ title: 'Error', items: ['Failed to parse outline'] }],
    }
  }
}

export function OutlineViewer({ content, chat, isStreaming }: OutlineViewerProps) {
  const outline = parseOutline(content)

  return (
    <div className="prose prose-sm max-w-none">
      <div className="mb-3">
        <Heading className="!text-lg font-semibold text-gray-900" level={2}>
          Here&apos;s what I&apos;m thinking for your email
        </Heading>
        <p className="mt-0.5 text-sm text-gray-600">
          I&apos;ve outlined the key sections and points below. Let me know if you&apos;d like to adjust anything before
          we proceed.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <ol className="list-decimal space-y-2 pl-4">
          {outline.sections.map((section, index) => (
            <li key={index} className="text-sm">
              <span className="font-medium text-gray-900">{section.title}</span>
              <ul className="mt-1 list-none space-y-1 pl-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start text-gray-600">
                    <span className="mr-1.5 mt-1 h-1 w-1 rounded-full bg-gray-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      {!isStreaming && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
            className="mb-2 mt-4 rounded-md border border-violet-200 bg-violet-100 p-2 shadow-md ring-1 ring-violet-200/50"
          >
            <p className="text-sm text-violet-800">
              <span className="font-medium">Customize your email:</span> You can update the theme colors and branding by
              clicking the options below.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
            className="mt-3"
          >
            <OutlineHeader emailType={outline.emailType} chat={chat} />
          </motion.div>
        </>
      )}
    </div>
  )
}
