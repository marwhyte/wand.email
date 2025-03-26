import { classNames } from '@/lib/utils/misc'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { motion } from 'motion/react'
import React from 'react'
import { IconButton } from '../icon-button'
import Loading from '../loading'
import { SendButton } from './send-button'

const TEXTAREA_MIN_HEIGHT = 76
const TEXTAREA_MAX_HEIGHT = 200

interface ChatInputProps {
  chatStarted: boolean
  textareaRef: React.RefObject<HTMLTextAreaElement>
  input: string
  isStreaming: boolean
  enhancingPrompt: boolean
  promptEnhanced: boolean
  sendMessage?: (messageInput?: string) => void
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  enhancePrompt?: () => void
  handleStop?: () => void
}

export function ChatInput({
  chatStarted,
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
  // Function to clear input from localStorage
  const clearInput = () => {
    // Clear both the generic input and any specific chat inputs
    localStorage.removeItem('input')
    // Get all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      // Remove any key that starts with 'chat-input-'
      if (key?.startsWith('chat-input-')) {
        localStorage.removeItem(key)
      }
    }
  }

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
              clearInput()
              sendMessage?.()
            }
          }}
          value={input}
          onChange={handleInputChange}
          style={{
            minHeight: TEXTAREA_MIN_HEIGHT,
            maxHeight: TEXTAREA_MAX_HEIGHT,
          }}
          placeholder={!chatStarted ? 'What email do you want to build?' : 'What changes do you want to make?'}
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

            clearInput()
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
