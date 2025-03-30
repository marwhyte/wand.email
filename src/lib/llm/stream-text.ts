import { notifySlack } from '@/app/actions/notifySlack'
import { defaultCartSeriesExample } from '@/app/components/email-workspace/templates/cart/default'
import { ebayEcommerceExample } from '@/app/components/email-workspace/templates/ecommerce/default-ebay-template'
import { stripeNewsletterExample } from '@/app/components/email-workspace/templates/newsletter/default-stripe'
import { stocktwitsNewsletterExample } from '@/app/components/email-workspace/templates/newsletter/outline-stocktwits'
import { nikeTransactionalExample } from '@/app/components/email-workspace/templates/transactional/default-nike-verification'
import { googleTransactionalExample } from '@/app/components/email-workspace/templates/transactional/outline-google'
import { defaultWelcomeSeriesExample } from '@/app/components/email-workspace/templates/welcome/default'
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

// Define descriptions for each example to help the model pick the most appropriate one
type ExampleWithDescription = {
  template: string
  description: string
}

const examplesByType: Record<EmailType, ExampleWithDescription[]> = {
  'welcome-series': [
    {
      template: defaultWelcomeSeriesExample,
      description: 'Welcome series email with multiple steps, each introducing a new feature or benefit of the product',
    },
  ],
  ecommerce: [
    {
      template: ebayEcommerceExample,
      description:
        'Promotional ecommerce email with multiple product categories, visual merchandising galleries, and several call-to-action buttons to drive sales',
    },
  ],
  invite: [],
  transactional: [
    {
      template: nikeTransactionalExample,
      description:
        'Clean, minimalist verification code email with prominent display of numeric code and expiration information',
    },
    {
      template: googleTransactionalExample,
      description: 'Security alert notification email with device login details and verification action button',
    },
  ],
  newsletter: [
    {
      template: stripeNewsletterExample,
      description:
        'Professional B2B newsletter featuring company achievements, industry recognition, and upcoming events with multiple call-to-action buttons',
    },
    {
      template: stocktwitsNewsletterExample,
      description:
        'Data-driven financial market newsletter with stock updates, performance metrics, charts, and expert insights in a conversational format',
    },
  ],
  invoice: [],
  cart: [
    {
      template: defaultCartSeriesExample,
      description: 'Cart abandonment email with a discount code, a cart section, and a footer with social media links.',
    },
  ],
  default: [],
}

// Function to get a single example based on email type and user request
export async function getRelevantExample(userMessage: string): Promise<{ emailType: EmailType; example: string }> {
  try {
    // Prepare descriptions of all examples for the model to choose from
    const exampleDescriptions = Object.entries(examplesByType)
      .flatMap(([type, examples]) =>
        examples.map((ex) => ({
          type: type as EmailType,
          description: ex.description,
          template: ex.template,
        }))
      )
      .filter((item) => item.description) // Only include examples with descriptions

    // If no examples with descriptions, return default
    if (exampleDescriptions.length === 0) {
      return {
        emailType: 'ecommerce',
        example: ebayEcommerceExample,
      }
    }

    // Create a prompt for the model to analyze
    const descriptionsText = exampleDescriptions
      .map((item, index) => `${index + 1}. ${item.type} - ${item.description}`)
      .join('\n')

    const { text } = await generateText({
      model: google('gemini-2.0-flash-001'),
      system: `You are analyzing a user's email creation request to determine:
      1. The most appropriate email TYPE from: ${emailTypes.join(', ')}
      2. The most relevant EXAMPLE TEMPLATE based on the descriptions below:
      
      ${descriptionsText}
      
      Respond in a strict JSON format with two fields:
      {
        "emailType": "the email type name",
        "exampleIndex": number (1-based index from the list above)
      }
      
      Choose the example that best matches the user's intent. Return ONLY this JSON object, nothing else.`,
      prompt: userMessage,
    })

    // Parse the response
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) {
      throw new Error('Could not parse model response')
    }

    const result = JSON.parse(match[0])

    // Get the selected example
    if (result.exampleIndex > 0 && result.exampleIndex <= exampleDescriptions.length) {
      const selectedExample = exampleDescriptions[result.exampleIndex - 1]
      return {
        emailType: result.emailType as EmailType,
        example: selectedExample.template,
      }
    }

    // Fallback to default if no valid example index
    const foundType = result.emailType as EmailType
    const examplesForType = examplesByType[foundType]

    if (examplesForType && examplesForType.length > 0) {
      return {
        emailType: foundType,
        example: examplesForType[0].template,
      }
    }

    // Absolute fallback
    return {
      emailType: 'ecommerce',
      example: ebayEcommerceExample,
    }
  } catch (error) {
    console.error('Error selecting relevant example:', error)
    // Default fallback
    return {
      emailType: 'ecommerce',
      example: ebayEcommerceExample,
    }
  }
}

// Get the model provider from environment variable, default to 'google'
export const DEFAULT_PROVIDER = (process.env.LLM_PROVIDER as ModelProvider) || 'google'

export async function streamText(
  messages: Messages,
  options?: StreamingOptions,
  companyName?: string,
  companyDescription?: string,
  companyAddress?: string,
  provider: ModelProvider = DEFAULT_PROVIDER,
  assistantMessageId?: string,
  emailType?: EmailType
) {
  // Find the first and last user messages
  const userMessages = messages.filter((msg) => msg.role === 'user')
  if (userMessages.length === 1) {
    notifySlack(`User ${userMessages[0].id} sent a message with no context.`, 'upgrade')
  }
  const firstUserMessage = userMessages[0]
  const lastUserMessage = userMessages[userMessages.length - 1]
  const combinedUserPrompt = `${firstUserMessage?.content || ''}\n\n${
    firstUserMessage?.id !== lastUserMessage?.id ? lastUserMessage?.content || '' : ''
  }`

  // Check if examples are already in messages
  const examplesInMessages = messages.some((msg) => msg.content.includes('<examples_for_email_type>'))

  // Determine email type and relevant example in a single request
  let detectedEmailType = emailType
  let initialExample = ''

  if (!examplesInMessages) {
    try {
      const { emailType: detectedType, example } = await getRelevantExample(combinedUserPrompt)
      detectedEmailType = detectedType
      initialExample = `
      <examples_for_email_type>
        ${example}
      </examples_for_email_type>
      `
    } catch (error) {
      console.error('Error getting relevant example:', error)
      detectedEmailType = detectedEmailType || 'default'
      // Fallback to eBay example if there's an error
      initialExample = `
      <examples_for_email_type>
        ${ebayEcommerceExample}
      </examples_for_email_type>
      `
    }
  }

  const systemPrompt = getSystemPrompt(
    initialExample,
    companyName,
    companyDescription,
    companyAddress,
    detectedEmailType
  )

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
