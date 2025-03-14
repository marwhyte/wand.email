// Mock the image-service module directly
jest.mock('@/lib/utils/image-service', () => ({
  resolveImageSrc: jest.fn().mockResolvedValue('https://example.com/mock-image.jpg'),
}))

import { turbotaxTemplate, turbotaxTemplateScript } from '@/app/components/email-workspace/templates/turbotax-template'
import { createEmail } from './email-helpers'
import { generateEmailScript } from './email-script-generator'
import { parseEmailScript } from './email-script-parser'

// Helper function to normalize scripts for comparison
function normalizeScript(script: string): string {
  return script.trim()
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

    // Normalize attributes if they exist
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
      originalEmail.width,
      originalEmail.bgImage,
      originalEmail.bgPosition,
      originalEmail.bgRepeat,
      originalEmail.bgSize
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
})
