import { MAX_TOKENS } from '@/constants'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { streamText as _streamText, convertToCoreMessages, Message } from 'ai'
import { v4 as uuidv4 } from 'uuid'
import { getSystemPrompt } from './prompts'
interface ToolResult<Name extends string, Args, Result> {
  toolCallId: string
  toolName: Name
  args: Args
  result: Result
  state: 'result'
}

export type Messages = Message[]

export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], 'model'>

export type ModelProvider = 'openai' | 'anthropic' | 'google'

// Get the model provider from environment variable, default to 'google'
export const DEFAULT_PROVIDER = (process.env.LLM_PROVIDER as ModelProvider) || 'google'

export async function streamText(
  messages: Messages,
  options?: StreamingOptions,
  companyName?: string,
  provider: ModelProvider = DEFAULT_PROVIDER,
  assistantMessageId?: string
) {
  const systemPrompt = getSystemPrompt(companyName)

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
    ...options,
  })
}
