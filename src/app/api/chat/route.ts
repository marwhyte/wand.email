export const maxDuration = 60

import { notifySlack } from '@/app/actions/notifySlack'
import { EmailTheme, EmailType } from '@/app/components/email-workspace/types'
import { auth } from '@/auth'
import { MAX_RESPONSE_SEGMENTS, MAX_TOKENS } from '@/constants'
import { createChat, getChat, getUserMessageCount, updateChat } from '@/lib/database/queries/chats'
import { CONTINUE_PROMPT } from '@/lib/llm/prompts'
import { DEFAULT_PROVIDER, StreamingOptions, streamText } from '@/lib/llm/stream-text'
import SwitchableStream from '@/lib/llm/switchable-stream'
import { getMostRecentUserMessage } from '@/lib/utils/misc'
import { Message } from 'ai'
import { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// Allow streaming responses up to 30 seconds

// Rate limit settings
const MAX_MESSAGES_PER_HOUR = 50

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Check rate limit
    const messageCount = await getUserMessageCount(session.user.id)
    console.log('messageCount', messageCount)

    if (messageCount >= MAX_MESSAGES_PER_HOUR) {
      return new Response('Rate limit exceeded. Please try again later.', {
        status: 429,
        headers: {
          'Retry-After': '3600', // 1 hour in seconds
        },
      })
    }

    let {
      id,
      messages,
      companyName,
      companyId,
      companyDescription,
      companyAddress,
      emailType,
      emailTheme,
      isGeneratingOutline = true,
    }: {
      id: string
      messages: Message[]
      companyName?: string
      companyId?: string
      companyDescription?: string
      companyAddress?: string
      emailType?: EmailType
      emailTheme: EmailTheme
      isGeneratingOutline?: boolean
    } = await req.json()

    const userMessage = getMostRecentUserMessage(messages)

    if (!userMessage) {
      return new Response('No user message found', { status: 400 })
    }

    const chat = await getChat(id)

    if (!chat) {
      await createChat({ messages, companyId, id })
      notifySlack(`User ${session.user.email} created a new chat.`, 'upgrade')
    } else {
      if (chat.userId !== session.user.id) {
        return new Response('Unauthorized', { status: 401 })
      }
    }

    // If we're not generating an outline and the outline hasn't been confirmed, return an error
    if (!isGeneratingOutline && !chat?.hasConfirmedOutline) {
      return new Response('Email outline must be confirmed before generating the email', { status: 400 })
    }

    await updateChat(id, {
      messages,
    })

    const stream = new SwitchableStream()

    let assistantMessageId = uuidv4()

    const options: StreamingOptions = {
      onError: (error) => {
        console.log('error', error)
      },
      onFinish: async ({ text: content, finishReason }) => {
        messages.push({
          id: assistantMessageId,
          role: 'assistant',
          content,
        })

        await updateChat(id, {
          messages,
        })

        if (finishReason !== 'length') {
          return stream.close()
        }

        if (stream.switches >= MAX_RESPONSE_SEGMENTS) {
          throw Error('Cannot continue message: Maximum segments reached')
        }

        const switchesLeft = MAX_RESPONSE_SEGMENTS - stream.switches

        console.log(`Reached max token limit (${MAX_TOKENS}): Continuing message (${switchesLeft} switches left)`)

        assistantMessageId = uuidv4()
        messages.push({
          id: uuidv4(),
          role: 'user',
          content: CONTINUE_PROMPT,
        })

        const result = await streamText({
          messages,
          options,
          companyName,
          companyDescription,
          companyAddress,
          provider: DEFAULT_PROVIDER,
          assistantMessageId,
          emailType,
          isGeneratingOutline,
          emailTheme,
        })

        return stream.switchSource(result.toDataStream())
      },
    }

    const result = await streamText({
      messages,
      options,
      companyName,
      companyDescription,
      companyAddress,
      provider: DEFAULT_PROVIDER,
      assistantMessageId,
      emailType,
      isGeneratingOutline,
      emailTheme,
    })

    stream.switchSource(result.toDataStream())

    return new Response(stream.readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    console.log(error)

    return new Response(null, {
      status: 500,
      statusText: 'Internal Server Error',
    })
  }
}
