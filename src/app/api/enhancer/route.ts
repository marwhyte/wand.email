export const maxDuration = 60

import { stripIndents } from '@/lib/utils/stripIndent'
import { openai } from '@ai-sdk/openai'
import { parseDataStreamPart, streamText } from 'ai'

const encoder = new TextEncoder()
const decoder = new TextDecoder()
export async function POST(request: Request) {
  try {
    const { message } = (await request.json()) as { message: string }
    const content = stripIndents`
          I want you to improve the user prompt that is wrapped in \`<original_prompt>\` tags.

          IMPORTANT: Only respond with the improved prompt and nothing else!

          <original_prompt>
            ${message}
          </original_prompt>
        `

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'user',
          content,
        },
      ],
    })
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = decoder.decode(chunk)
        const lines = text.split('\n').filter((line) => line.trim() !== '')

        for (const line of lines) {
          try {
            const parsed = parseDataStreamPart(line)
            if (parsed.type === 'text') {
              controller.enqueue(encoder.encode(parsed.value))
            }
          } catch (error) {
            // Skip invalid lines
            continue
          }
        }
      },
    })

    const stream = result.toDataStream()
    return new Response(stream.pipeThrough(transformStream), {
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
