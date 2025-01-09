import { type Messages } from '@/lib/llm/stream-text'
import SwitchableStream from '@/lib/llm/switchable-stream'

export async function POST(request: Request) {
  try {
    const { messages } = (await request.json()) as { messages: Messages }
    const stream = new SwitchableStream()

    // const options: StreamingOptions = {
    //   toolChoice: 'none',
    //   onFinish: async ({ text: content, finishReason }) => {
    //     if (finishReason !== 'length') {
    //       return stream.close()
    //     }

    //     if (stream.switches >= MAX_RESPONSE_SEGMENTS) {
    //       throw Error('Cannot continue message: Maximum segments reached')
    //     }

    //     const switchesLeft = MAX_RESPONSE_SEGMENTS - stream.switches

    //     console.log(`Reached max token limit (${MAX_TOKENS}): Continuing message (${switchesLeft} switches left)`)

    //     messages.push({ role: 'assistant', content })
    //     messages.push({ role: 'user', content: CONTINUE_PROMPT })

    //     const result = await streamText(messages, options)

    //     return stream.switchSource(result.toDataStream())
    //   },
    // }

    console.log('happens')

    // const result = await streamText(messages, options)

    // stream.switchSource(result.toDataStream())

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
