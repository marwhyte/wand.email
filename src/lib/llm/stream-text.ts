import { ebayEcommerceExample } from '@/app/components/email-workspace/templates/ecommerce/default-ebay-template'
import { stripeNewsletterExample } from '@/app/components/email-workspace/templates/newsletter/default-stripe'
import { stocktwitsNewsletterExample } from '@/app/components/email-workspace/templates/newsletter/outline-stocktwits'
import { nikeTransactionalExample } from '@/app/components/email-workspace/templates/transactional/default-nike-verification'
import { googleTransactionalExample } from '@/app/components/email-workspace/templates/transactional/outline-google'
import { EmailType, emailTypes } from '@/app/components/email-workspace/types'
import { MAX_TOKENS } from '@/constants'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { streamText as _streamText, convertToCoreMessages, generateText, Message } from 'ai'
import { v4 as uuidv4 } from 'uuid'
import { getSystemPrompt } from './prompts'

export type Messages = Message[]

// Define a specialized StreamingOptions type that includes our tool
export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], 'model' | 'tools' | 'toolChoice'>

export type ModelProvider = 'openai' | 'anthropic' | 'google'

const examplesByType: Record<EmailType, string[]> = {
  'welcome-series': [],
  ecommerce: [ebayEcommerceExample],
  invite: [],
  transactional: [nikeTransactionalExample, googleTransactionalExample],
  newsletter: [stripeNewsletterExample, stocktwitsNewsletterExample],
  invoice: [],
  cart: [],
  default: [],
}

// Function to get examples based on email type
export function getExamplesByType(emailType: EmailType) {
  const examples: string[] = examplesByType[emailType] || examplesByType['default']

  return `
  <examples_for_email_type>
    ${examples.join('\n')}
  </examples_for_email_type>
  `
}

// Get the model provider from environment variable, default to 'google'
export const DEFAULT_PROVIDER = (process.env.LLM_PROVIDER as ModelProvider) || 'google'

export async function streamText(
  messages: Messages,
  options?: StreamingOptions,
  companyName?: string,
  provider: ModelProvider = DEFAULT_PROVIDER,
  assistantMessageId?: string,
  emailType?: EmailType
) {
  // Determine email type from user message if not provided
  let detectedEmailType = emailType

  console.log('detectedEmailType1', detectedEmailType)

  if (!detectedEmailType && messages.length > 0) {
    // Find the first user message
    const firstUserMessage = messages.find((msg) => msg.role === 'user')

    if (firstUserMessage) {
      try {
        const { text } = await generateText({
          model: google('gemini-2.0-flash-001'),
          system: `You are analyzing a user request to determine what type of email they want to create.
          Classify the request into one of the following email types: ${emailTypes.join(', ')}.
          Respond with ONLY the email type, nothing else.`,
          prompt: firstUserMessage.content,
        })

        const lowerText = text.toLowerCase()
        const foundType = emailTypes.find((type) => lowerText.includes(type))

        // Use the found type or default to 'default'
        detectedEmailType = foundType || 'default'
      } catch (error) {
        console.error('Error detecting email type:', error)
        detectedEmailType = 'default'
      }
    }
  }

  // Check if examples are already in messages
  const examplesInMessages = messages.some((msg) => msg.content.includes('<examples_for_email_type>'))

  // Fetch examples at the start if email type is provided or detected
  let initialExamples = ''
  if (detectedEmailType && !examplesInMessages) {
    initialExamples = getExamplesByType(detectedEmailType)
  }

  const systemPrompt = getSystemPrompt(initialExamples, companyName, detectedEmailType)

  // Process messages to only include email states from the 2 most recent user messages
  const processedMessages = messages.map((msg, index) => {
    if (msg.role !== 'user') return msg

    const emailStateMatch = msg.content.match(/<email_state>\n(.*?)\n<\/email_state>/s)
    if (!emailStateMatch) return msg

    // Find the two most recent user messages
    const userMessages = messages.filter((m) => m.role === 'user')
    const isRecentMessage = userMessages.slice(-2).includes(msg)

    // Remove email state from older messages
    return {
      ...msg,
      content: isRecentMessage ? msg.content : msg.content.replace(/<email_state>\n.*?\n<\/email_state>\n\n/s, ''),
    }
  })

  const model =
    provider === 'openai'
      ? openai('gpt-4o-mini')
      : provider === 'anthropic'
        ? anthropic('claude-3-haiku-20240307')
        : google('gemini-2.0-flash-001')

  console.log('gets here')

  return _streamText({
    experimental_generateMessageId: () => {
      const messageId = assistantMessageId || uuidv4()
      return messageId
    },
    model,
    system: systemPrompt,
    maxTokens: MAX_TOKENS,
    messages: convertToCoreMessages(processedMessages),
    // tools: {
    //   getExamples: tool({
    //     description:
    //       'Fetch example email templates based on the specified email type. Only use this if the current email type is different from what was initially provided, or if no email type was initially provided.',
    //     parameters: z.object({
    //       emailType: z.string().describe('The type of email template to fetch examples for'),
    //     }),
    //     execute: async ({ emailType }: { emailType: string }) => {
    //       console.log('Tool executed with email type:', emailType)
    //       return getExamplesByType(emailType as EmailType)
    //     },
    //   }),
    // },
    // maxSteps: 5,
    ...options,
  })
}
