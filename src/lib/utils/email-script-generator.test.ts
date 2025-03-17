// Mock the image-service module directly
jest.mock('@/lib/utils/image-service', () => ({
  resolveImageSrc: jest.fn().mockResolvedValue('https://example.com/mock-image.jpg'),
}))

import { testingTemplateComplex } from '@/app/components/email-workspace/templates/testing-template-complex'
import { turbotaxTemplate, turbotaxTemplateScript } from '@/app/components/email-workspace/templates/turbotax-template'
import { createEmail } from './email-helpers'
import { generateEmailScript } from './email-script-generator'
import { parseEmailScript } from './email-script-parser'

// Helper function to normalize scripts for comparison
function normalizeScript(script: string): string {
  return script
    .trim()
    .split('\n')
    .map((line) => {
      // Handle quoted attributes and HTML tags properly
      const matches = line.trim().match(/^(\S+)(.*)$/)
      if (!matches) return line.trim()

      const [, component, attributesStr] = matches
      if (!attributesStr.trim()) return line.trim()

      // Parse attributes considering quotes and HTML tags
      const attributes: string[] = []
      let currentAttr = ''
      let inQuotes = false
      let inTag = false

      for (let i = 0; i < attributesStr.length; i++) {
        const char = attributesStr[i]

        if (char === '"') {
          inQuotes = !inQuotes
          currentAttr += char
        } else if (char === '<' && !inQuotes) {
          // Check if this is the start of an HTML tag by looking ahead
          const remainingText = attributesStr.substring(i)
          const tagMatch = remainingText.match(/^<\/?[a-z][a-z0-9]*(\s|\/?>)/i)
          if (tagMatch) {
            inTag = true
          }
          currentAttr += char
        } else if (char === '>' && !inQuotes && inTag) {
          inTag = false
          currentAttr += char
        } else if (char === ' ' && !inQuotes && !inTag) {
          if (currentAttr.trim()) {
            attributes.push(currentAttr.trim())
            currentAttr = ''
          }
        } else {
          currentAttr += char
        }
      }

      if (currentAttr.trim()) {
        attributes.push(currentAttr.trim())
      }

      const sortedAttributes = attributes.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      return `${component} ${sortedAttributes.join(' ')}`
    })
    .join('\n')
}

// Helper function to normalize attributes

// Helper function to remove ids and normalize values
function removeIds<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => removeIds(item)) as T
  }

  if (obj !== null && typeof obj === 'object') {
    const newObj = { ...obj } as { [K in keyof T]: T[K] }
    delete (newObj as any).id

    // // Normalize attributes if they exist
    // if ('attributes' in newObj) {
    //   ;(newObj as any).attributes = normalizeAttributes((newObj as any).attributes)
    // }

    for (const key in newObj) {
      if (newObj[key] && typeof newObj[key] === 'object') {
        newObj[key] = removeIds(newObj[key])
      }
    }
    return newObj
  }

  return obj
}

describe('Email Script Generator', () => {
  it('should generate script that parses back to the same email structure', () => {
    // Get the original email structure
    const originalEmail = turbotaxTemplate()

    // Generate script from the email structure
    const generatedScript = generateEmailScript(originalEmail)

    // Parse the generated script back to an email structure
    const parsedRows = parseEmailScript(generatedScript)
    const parsedEmail = createEmail(
      parsedRows,
      originalEmail.color,
      originalEmail.linkColor,
      originalEmail.fontFamily,
      originalEmail.bgColor,
      originalEmail.rowBgColor,
      originalEmail.width
    )

    // Compare the structures without ids
    expect(removeIds(parsedEmail)).toEqual(removeIds(originalEmail))
  })

  it('should generate equivalent script to the original template', () => {
    const email = turbotaxTemplate()
    const generatedScript = generateEmailScript(email)

    // Compare normalized versions of the scripts
    const normalizedGenerated = normalizeScript(generatedScript)
    const normalizedTemplate = normalizeScript(turbotaxTemplateScript)

    expect(normalizedGenerated).toEqual(normalizedTemplate)
  })

  it('should handle complex templates in both directions', () => {
    // Parse the original script to get an email structure
    const parsedRows = parseEmailScript(testingTemplateComplex)
    const originalEmail = createEmail(
      parsedRows,
      '#333333', // color
      '#0066cc', // linkColor
      'Arial, sans-serif', // fontFamily
      '#f7f7f7', // bgColor
      '#f7f7f7', // rowBgColor
      '600' // width
    )

    // Generate script from the parsed email structure
    const generatedScript = generateEmailScript(originalEmail)

    // Parse the generated script back to an email structure
    const reparsedRows = parseEmailScript(generatedScript)
    const reparsedEmail = createEmail(
      reparsedRows,
      originalEmail.color,
      originalEmail.linkColor,
      originalEmail.fontFamily,
      originalEmail.bgColor,
      originalEmail.rowBgColor,
      originalEmail.width
    )

    // Compare the structures without ids
    expect(removeIds(reparsedEmail)).toEqual(removeIds(originalEmail))

    // Compare normalized versions of the scripts
    const normalizedGenerated = normalizeScript(generatedScript)
    const normalizedOriginal = normalizeScript(testingTemplateComplex)

    expect(normalizedGenerated).toEqual(normalizedOriginal)
  })
})
