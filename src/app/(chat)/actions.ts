'use server'

import { updateMessage } from '@/lib/database/queries/chats'
import { generateEmailScript } from '@/lib/utils/email-script-generator'
import { openai } from '@ai-sdk/openai'
import { generateText, Message } from 'ai'
import { Email } from '../components/email-workspace/types'
export async function updateEmailForMessage(chatId: string, message: Message, email: Email) {
  if (message.role !== 'assistant') return

  updateMessage(message.id, chatId, { email: generateEmailScript(email) })
}

export async function generateTitleFromUserMessage({ message }: { message: string }) {
  const { text: title } = await generateText({
    model: openai('gemini-2.0-flash-001'),
    system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - do not use quotes or colons`,
    prompt: message,
  })

  return title
}
