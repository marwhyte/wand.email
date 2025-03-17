'use server'

import { generateEmailScript } from '@/lib/utils/email-script-generator'
import { stripIndents } from '@/lib/utils/stripIndent'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { Email } from '../components/email-workspace/types'

export async function generateTitleFromUserMessage({ message }: { message: string }) {
  const { text: title } = await generateText({
    model: openai('gpt-4-turbo'),
    system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - do not use quotes or colons`,
    prompt: message,
  })

  return title
}

export async function generateChangeLog(previousEmail: Email, currentEmail: Email): Promise<string> {
  // Convert emails to their script representation
  const previousTemplate = generateEmailScript(previousEmail)
  const currentTemplate = generateEmailScript(currentEmail)

  // Skip if templates are identical
  if (previousTemplate === currentTemplate) {
    return ''
  }

  const prompt = stripIndents`
    <previous_template>
    ${previousTemplate}
    </previous_template>
    
    <current_template>
    ${currentTemplate}
    </current_template>
  `

  try {
    const { text } = await generateText({
      model: google('gemini-2.0-flash-001'),
      system: `\n
        You are analyzing changes between two versions of an email template.
        Generate a concise, structured change log that describes what was modified.
        Focus on meaningful changes like:
        - Added/removed/modified components
        - Content changes (text, images, links)
        - Structure changes (rows, columns)
        - Style changes
        
        Format your response as a list of changes, each on a new line, starting with "- ".
        Be specific but concise. Only include the change log, no introduction or explanation.`,
      prompt,
    })

    return text || ''
  } catch (error) {
    console.error('Error generating email change log:', error)
    return ''
  }
}
