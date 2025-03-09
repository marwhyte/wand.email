import { classNames } from '@/lib/utils/misc'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import React from 'react'
import { IconButton } from '../icon-button'
import Loading from '../loading'
import { SendButton } from './send-button'

const TEXTAREA_MIN_HEIGHT = 76
const TEXTAREA_MAX_HEIGHT = 200

interface ChatInputProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>
  input: string
  isStreaming: boolean
  enhancingPrompt: boolean
  promptEnhanced: boolean
  sendMessage?: (messageInput?: string) => void
  handleInputChange?: (input: string) => void
  enhancePrompt?: () => void
  handleStop?: () => void
}

export function ChatInput({
  textareaRef,
  input,
  isStreaming,
  enhancingPrompt,
  promptEnhanced,
  sendMessage,
  handleInputChange,
  enhancePrompt,
  handleStop,
}: ChatInputProps) {
  // useEffect(() => {
  //   const textarea = textareaRef.current
  //   if (textarea) {
  //     const selectionStart = textarea.selectionStart
  //     const selectionEnd = textarea.selectionEnd

  //     textarea.style.height = 'auto'

  //     const scrollHeight = textarea.scrollHeight
  //     textarea.style.height = `${Math.min(scrollHeight, TEXTAREA_MAX_HEIGHT)}px`
  //     textarea.style.overflowY = scrollHeight > TEXTAREA_MAX_HEIGHT ? 'auto' : 'hidden'

  //     textarea.setSelectionRange(selectionStart, selectionEnd)
  //   }
  // }, [input, textareaRef])

  return (
    <motion.div
      layout
      transition={{
        layout: { duration: 0.3, ease: 'easeInOut' },
      }}
      className="z-40 mx-auto w-full max-w-[552px] flex-shrink-0"
    >
      <div
        className={classNames(
          'overflow-hidden rounded-lg border border-blue-200 bg-white shadow-sm backdrop-blur-[8px] backdrop-filter',
          'relative w-full'
        )}
      >
        <textarea
          ref={textareaRef}
          className={`text-md w-full resize-none bg-transparent pl-4 pr-16 pt-4 text-gray-500 focus:outline-none`}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              if (event.shiftKey) {
                return
              }

              event.preventDefault()

              sendMessage?.()
            }
          }}
          value={input}
          onChange={(event) => {
            handleInputChange?.(event.target.value)
          }}
          style={{
            minHeight: TEXTAREA_MIN_HEIGHT,
            maxHeight: TEXTAREA_MAX_HEIGHT,
          }}
          placeholder="Describe your perfect email"
          translate="no"
        />
        <SendButton
          show={input.length > 0 || isStreaming}
          isStreaming={isStreaming}
          onClick={(event) => {
            if (isStreaming) {
              handleStop?.()
              return
            }

            sendMessage?.()
          }}
        />
        <div className="flex justify-between p-4 pt-2 text-sm">
          <div className="flex items-center gap-1">
            <IconButton
              title="Enhance prompt"
              disabled={input.length === 0 || enhancingPrompt}
              onClick={() => enhancePrompt?.()}
            >
              {enhancingPrompt ? (
                <div className="flex items-center">
                  <Loading height={16} width={16} />
                  <div className="i-svg-spinners:90-ring-with-bg text-xl text-gray-500"></div>
                  <div className="ml-1.5">Enhancing prompt...</div>
                </div>
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5 text-gray-500" />
                  {promptEnhanced && <div className="ml-1.5">Prompt enhanced</div>}
                </>
              )}
            </IconButton>
          </div>
          {input.length > 3 ? (
            <div className="text-xs text-gray-500">
              Use <kbd className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold">Shift</kbd> +{' '}
              <kbd className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold">Return</kbd> for a new line
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}
