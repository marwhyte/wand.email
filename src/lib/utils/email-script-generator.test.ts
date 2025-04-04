// Mock the image-service module directly
jest.mock('@/lib/utils/image-service', () => ({
  resolveImageSrc: jest.fn().mockResolvedValue('https://example.com/mock-image.jpg'),
}))

import {
  turbotaxTemplate,
  turbotaxTemplateScript,
} from '@/app/components/email-workspace/templates/marketing/turbotax-template'
import { createEmail } from './email-helpers'
import { generateEmailScript } from './email-script-generator'
import { parseEmailScript } from './email-script-parser'

// Helper function to normalize scripts for comparison
function normalizeScript(script: string): string {
  return (
    script
      .trim()
      .split('\n')
      .map((line) => {
        // Trim each line
        line = line.trim()

        // Handle white space in tags - standardize all LI and TD content
        line = line.replace(/<LI>\s*(.*?)\s*<\/LI>/g, '<LI>$1</LI>')
        line = line.replace(/<TD>\s*(.*?)\s*<\/TD>/g, '<TD>$1</TD>')

        // Normalize padding - convert "10,0,10,0" to "10,0" when top==bottom and right==left
        line = line.replace(/padding="(\d+),(\d+),\1,\2"/g, 'padding="$1,$2"')

        // Normalize icons array spacing
        line = line.replace(/icons="\[(.*?)\]"/g, (match, content) => {
          // Standardize spacing in the array
          const normalized = content.replace(/\s*,\s*/g, ',')
          return `icons="[${normalized}]"`
        })

        // Handle XML tags with attributes
        // Match: <TAG attr1="value1" attr2="value2">
        const matches = line.match(/^(<[\/]?\w+)(.*)(?:>|\/?>)$/)
        if (!matches) return line

        const [, tagWithBracket, attributesStr] = matches
        if (!attributesStr.trim()) return line + (line.includes('/>') ? '/>' : '>')

        // Parse attributes considering quotes and HTML tags
        const attributes: string[] = []
        let currentAttr = ''
        let inQuotes = false
        let inTag = false
        let skipCharacters = 0

        for (let i = 0; i < attributesStr.length; i++) {
          if (skipCharacters > 0) {
            skipCharacters--
            continue
          }

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
              currentAttr += tagMatch[0]
              skipCharacters = tagMatch[0].length - 1 // Skip the matched characters
            } else {
              currentAttr += char
            }
          } else if (char === '>' && !inQuotes && inTag) {
            inTag = false
            currentAttr += char
          } else if (char === ' ' && !inQuotes && !inTag) {
            if (currentAttr.trim()) {
              attributes.push(currentAttr.trim())
              currentAttr = ''
            }
          } else if (char === '/' && i === attributesStr.length - 1) {
            // Handle self-closing tag
            continue
          } else {
            currentAttr += char
          }
        }

        if (currentAttr.trim()) {
          attributes.push(currentAttr.trim())
        }

        // Sort attributes alphabetically for consistent comparison
        const sortedAttributes = attributes.sort((a, b) => {
          // Extract attribute names for sorting
          const nameA = a.split('=')[0].toLowerCase()
          const nameB = b.split('=')[0].toLowerCase()
          return nameA.localeCompare(nameB)
        })

        // Rebuild the tag with sorted attributes
        const isSelfClosing = line.trim().endsWith('/>')
        return `${tagWithBracket} ${sortedAttributes.join(' ')}${isSelfClosing ? ' />' : '>'}`
      })
      .join('\n')
      // Normalize consecutive blank lines to a single blank line
      .replace(/\n\s*\n\s*\n/g, '\n\n')
  )
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

    console.log('parsedRows', JSON.stringify(parsedRows, null, 2))
    const parsedEmail = createEmail(
      parsedRows,
      originalEmail.color ?? '#000000',
      originalEmail.linkColor ?? '#0066cc',
      originalEmail.fontFamily ?? 'Arial, sans-serif',
      originalEmail.backgroundColor ?? '#f7f7f7',
      originalEmail.rowBackgroundColor ?? '#f7f7f7',
      originalEmail.width ?? '600'
    )

    // Compare the structures without ids

    expect(removeIds(parsedEmail)).toEqual(removeIds(originalEmail))
  })

  it('should generate equivalent script to the original template', () => {
    const email = turbotaxTemplate()
    const generatedScript = generateEmailScript(email)

    // Compare normalized versions of the scripts
    const normalizedGenerated = generatedScript
    const normalizedTemplate = turbotaxTemplateScript

    expect(normalizedGenerated).toEqual(normalizedTemplate)
  })

  //   it('should handle complex templates in both directions', () => {
  //     // Parse the original script to get an email structure
  //     const parsedRows = parseEmailScript(testingTemplateComplex, {
  //       id: '1',
  //       rows: [],
  //     })

  //     const originalEmail = createEmail(
  //       parsedRows,
  //       '#333333', // color
  //       '#0066cc', // linkColor
  //       'Arial, sans-serif', // fontFamily
  //       '#f7f7f7', // backgroundColor
  //       '#f7f7f7', // rowBackgroundColor
  //       '600' // width
  //     )

  //     // Generate script from the parsed email structure
  //     const generatedScript = generateEmailScript(originalEmail)

  //     // Parse the generated script back to an email structure
  //     const reparsedRows = parseEmailScript(generatedScript, originalEmail)
  //     const reparsedEmail = createEmail(
  //       reparsedRows,
  //       originalEmail.color ?? '#000000',
  //       originalEmail.linkColor ?? '#0066cc',
  //       originalEmail.fontFamily ?? 'Arial, sans-serif',
  //       originalEmail.backgroundColor ?? '#f7f7f7',
  //       originalEmail.rowBackgroundColor ?? '#f7f7f7',
  //       originalEmail.width ?? '600'
  //     )

  //     // Compare the structures without ids
  //     expect(removeIds(reparsedEmail)).toEqual(removeIds(originalEmail))

  //     // Compare normalized versions of the scripts
  //     const normalizedGenerated = normalizeScript(generatedScript)
  //     const normalizedOriginal = normalizeScript(testingTemplateComplex)

  //     expect(normalizedGenerated).toEqual(normalizedOriginal)
  //   })
})
