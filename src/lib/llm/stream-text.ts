import { MAX_TOKENS } from '@/constants'
import { anthropic } from '@ai-sdk/anthropic'
import { streamText as _streamText, convertToCoreMessages } from 'ai'
import { getSystemPrompt } from './prompts'

interface ToolResult<Name extends string, Args, Result> {
  toolCallId: string
  toolName: Name
  args: Args
  result: Result
  state: 'result'
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  toolInvocations?: ToolResult<string, unknown, unknown>[]
}

export type Messages = Message[]

export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], 'model'>

export function streamText(messages: Messages, options?: StreamingOptions) {
  return _streamText({
    model: anthropic('claude-3-5-sonnet-20240620'),
    system: getSystemPrompt(),
    maxTokens: MAX_TOKENS,
    headers: {
      'anthropic-beta': 'max-tokens-3-5-sonnet-2024-07-15',
    },
    messages: convertToCoreMessages(messages),
    ...options,
  })
}
