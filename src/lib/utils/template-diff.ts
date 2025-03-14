import { Email } from '@/app/components/email-workspace/types'
import { generateEmailScript } from './email-script-generator'
import { stripIndents } from './stripIndent'

/**
 * Generates a change log between two email templates using Gemini
 */
export async function generateChangeLog(previousEmail: Email, currentEmail: Email): Promise<string> {
  // Convert emails to their script representation
  const previousTemplate = generateEmailScript(previousEmail)
  const currentTemplate = generateEmailScript(currentEmail)

  // Skip if templates are identical
  if (previousTemplate === currentTemplate) {
    return ''
  }

  const prompt = stripIndents`
    You are analyzing changes between two versions of an email template.
    
    <previous_template>
    ${previousTemplate}
    </previous_template>
    
    <current_template>
    ${currentTemplate}
    </current_template>
    
    Generate a concise, structured change log that describes what was modified.
    Focus on meaningful changes like:
    - Added/removed/modified components
    - Content changes (text, images, links)
    - Structure changes (rows, columns)
    - Style changes
    
    Format your response as a list of changes, each on a new line, starting with "- ".
    Be specific but concise. Only include the change log, no introduction or explanation.
  `

  try {
    // Call Gemini API
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    return data.text || ''
  } catch (error) {
    console.error('Error generating email change log:', error)
    return ''
  }
}
