import { MAX_TOKENS } from '@/constants'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { streamText as _streamText, convertToCoreMessages, Message } from 'ai'
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
const DEFAULT_PROVIDER = (process.env.LLM_PROVIDER as ModelProvider) || 'google'

export async function streamText(
  messages: Messages,
  options?: StreamingOptions,
  companyName?: string,
  provider: ModelProvider = DEFAULT_PROVIDER
) {
  const systemPrompt = getSystemPrompt(companyName)

  const model =
    provider === 'openai'
      ? openai('gpt-4o-mini')
      : provider === 'anthropic'
        ? anthropic('claude-3-haiku-20240307')
        : google('gemini-2.0-flash-001')

  return _streamText({
    model,
    system: systemPrompt,
    maxTokens: MAX_TOKENS,
    messages: convertToCoreMessages(messages),
    ...options,
  })
}
