import { parseEmailScript } from '../utils/email-script-parser'
import { resolveImageSrc } from '../utils/image-service'

const EMAIL_TAG_OPEN = '<EMAIL'
const EMAIL_TAG_CLOSE = '</EMAIL>'

export interface EmailCallbackData {
  messageId: string
  name: string
  rows: RowBlock[]
}

export type EmailCallback = (data: EmailCallbackData) => void

export interface ParserCallbacks {
  callbacks?: {
    onEmailOpen?: EmailCallback
    onEmailClose?: EmailCallback
  }
}

interface MessageState {
  position: number
  insideEmail: boolean
  currentContent: string
  bufferedOutput: string
}

export class EmailScriptParser {
  private _messages = new Map<string, MessageState>()
  private _callbacks?: ParserCallbacks['callbacks']
  private _processedEmails = new Set<string>()

  constructor(options?: ParserCallbacks) {
    this._callbacks = options?.callbacks
  }

  async parse(messageId: string, input: string) {
    // Resolve any Pexels image URLs first
    const pexelsMatches = input.match(/pexels:[^\s"')]+/g)
    let processedInput = input

    if (pexelsMatches) {
      for (const match of pexelsMatches) {
        const resolvedUrl = await resolveImageSrc(match)
        processedInput = processedInput.replace(match, resolvedUrl)
      }
    }

    let state = this._messages.get(messageId)

    if (!state) {
      state = {
        position: 0,
        insideEmail: false,
        currentContent: '',
        bufferedOutput: '',
      }
      this._messages.set(messageId, state)
    }

    let output = ''
    let i = 0

    while (i < processedInput.length) {
      if (processedInput.slice(i).startsWith(EMAIL_TAG_OPEN)) {
        // Skip everything between EMAIL tags
        const closeIndex = processedInput.indexOf(EMAIL_TAG_CLOSE, i)
        if (closeIndex !== -1) {
          // Found complete EMAIL tag pair
          const emailContent = processedInput.slice(i, closeIndex + EMAIL_TAG_CLOSE.length)
          this._processEmailContent(messageId, emailContent)
          i = closeIndex + EMAIL_TAG_CLOSE.length
        } else {
          // Incomplete EMAIL tag, wait for more content
          state.insideEmail = true
          state.currentContent = processedInput.slice(i)
          break
        }
      } else if (state.insideEmail) {
        // Inside an incomplete EMAIL tag, accumulate content
        state.currentContent += processedInput[i]
        i++
      } else {
        // Regular content outside EMAIL tags
        output += processedInput[i]
        i++
      }
    }

    state.position = i
    return output
  }

  private _processEmailContent(messageId: string, content: string) {
    const name = this._extractName(content)
    const emailId = `${messageId}:${name}`

    if (!this._processedEmails.has(emailId)) {
      // Process opening tag
      this._callbacks?.onEmailOpen?.({
        messageId,
        name: name || 'unnamed_template',
        rows: [],
      })

      // If we have a complete email, process closing tag
      if (content.includes(EMAIL_TAG_CLOSE)) {
        const rows = parseEmailScript(
          content.substring(content.indexOf('>') + 1, content.indexOf(EMAIL_TAG_CLOSE)).trim()
        )

        this._callbacks?.onEmailClose?.({
          messageId,
          name,
          rows,
        })
        this._processedEmails.add(emailId)
      }
    }
  }

  reset() {
    this._messages.clear()
    this._processedEmails.clear()
  }

  private _extractName(content: string): string {
    const nameMatch = content.match(/name="([^"]*)"/)
    return nameMatch?.[1] || 'unnamed_template'
  }

  private _extractAttribute(tag: string, attributeName: string): string | undefined {
    const match = tag.match(new RegExp(`${attributeName}="([^"]*)"`, 'i'))
    return match ? match[1] : undefined
  }
}
