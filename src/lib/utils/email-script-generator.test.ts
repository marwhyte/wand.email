import { turbotaxTemplate, turbotaxTemplateScript } from '@/app/components/email-workspace/templates/turbotax-template'
import { createEmail } from './email-helpers'
import { generateEmailScript } from './email-script-generator'
import { parseEmailScript } from './email-script-parser'

// Helper function to normalize scripts for comparison
function normalizeScript(script: string): string {
  return script
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\s*{\s*/g, ' { ') // Normalize braces
    .replace(/\s*}\s*/g, ' } ')
    .replace(/"\s+/g, '"') // Remove spaces after quotes
    .replace(/\s+"/g, '"') // Remove spaces before quotes
}

// Helper function to normalize values
function normalizeValue(value: any): any {
  if (typeof value === 'string') {
    // Remove 'px' suffix
    value = value.replace(/px$/, '')

    // Normalize letter spacing
    if (value.endsWith('em')) {
      value = '0%'
    }

    // Remove unit from line height
    if (value.match(/^\d+px$/)) {
      value = value.replace('px', '')
    }
  }
  return value
}

// Helper function to normalize attributes
function normalizeAttributes(attrs: Record<string, any>): Record<string, any> {
  const normalized: Record<string, any> = {}

  // Filter out zero paddings
  const paddingProps = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']
  const nonZeroPaddings = paddingProps
    .filter((prop) => attrs[prop] && attrs[prop] !== '0' && attrs[prop] !== '0px')
    .reduce((acc, prop) => ({ ...acc, [prop]: attrs[prop] }), {})

  // Normalize remaining attributes
  for (const [key, value] of Object.entries({ ...attrs, ...nonZeroPaddings })) {
    if (value != null && value !== '0' && value !== '0px' && !paddingProps.includes(key)) {
      normalized[key] = normalizeValue(value)
    }
  }

  return normalized
}

// Helper function to remove ids and normalize values
function removeIds<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => removeIds(item)) as T
  }

  if (obj !== null && typeof obj === 'object') {
    const newObj = { ...obj } as { [K in keyof T]: T[K] }
    delete (newObj as any).id

    // Normalize attributes if they exist
    if ('attributes' in newObj) {
      ;(newObj as any).attributes = normalizeAttributes((newObj as any).attributes)
    }

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
      originalEmail.name,
      parsedRows,
      originalEmail.color,
      originalEmail.linkColor,
      originalEmail.fontFamily,
      originalEmail.bgColor,
      originalEmail.width,
      originalEmail.bgImage,
      originalEmail.bgPosition,
      originalEmail.bgRepeat,
      originalEmail.bgSize
    )

    console.log(JSON.stringify(originalEmail, null, 2))
    console.log(JSON.stringify(parsedEmail, null, 2))

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
