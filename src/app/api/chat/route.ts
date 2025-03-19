export const maxDuration = 60

import { auth } from '@/auth'
import { MAX_RESPONSE_SEGMENTS, MAX_TOKENS } from '@/constants'
import { createChat, getChat, updateChat } from '@/lib/database/queries/chats'
import { CONTINUE_PROMPT } from '@/lib/llm/prompts'
import { DEFAULT_PROVIDER, StreamingOptions, streamText } from '@/lib/llm/stream-text'
import SwitchableStream from '@/lib/llm/switchable-stream'
import { getMostRecentUserMessage } from '@/lib/utils/misc'
import { Message } from 'ai'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    let {
      id,
      messages,
      companyName,
      companyId,
    }: { id: string; messages: Message[]; companyName?: string; companyId?: string } = await request.json()

    const userMessage = getMostRecentUserMessage(messages)

    if (!userMessage) {
      return new Response('No user message found', { status: 400 })
    }

    const chat = await getChat(id)

    if (!chat) {
      const email = { id: uuidv4(), rows: [] }

      await createChat({ messages, email, companyId, id })
    } else {
      if (chat.user_id !== session.user.id) {
        return new Response('Unauthorized', { status: 401 })
      }
    }

    await updateChat(id, {
      messages,
    })

    const stream = new SwitchableStream()

    let assistantMessageId = uuidv4()

    const options: StreamingOptions = {
      toolChoice: 'none',
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
        // Note: We already added the assistant message above
        messages.push({
          id: uuidv4(),
          role: 'user',
          content: CONTINUE_PROMPT,
        })

        const result = await streamText(messages, options, companyName, DEFAULT_PROVIDER, assistantMessageId)

        return stream.switchSource(result.toDataStream())
      },
    }

    const result = await streamText(messages, options, companyName, DEFAULT_PROVIDER, assistantMessageId)

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
