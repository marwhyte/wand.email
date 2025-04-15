import { useIsMobile } from '@/app/hooks'
import { Chat } from '@/lib/database/types'
import { classNames } from '@/lib/utils/misc'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { motion } from 'motion/react'
import React from 'react'
import { ExportTypePickerPopover } from '../export-type-picker-popover'
import { IconButton } from '../icon-button'
import Loading from '../loading'
import { ThemeColorPickerPopover } from '../theme-color-picker-popover'
import { CompanySection } from './company-section'
import { SendButton } from './send-button'

const TEXTAREA_MIN_HEIGHT = 76
const TEXTAREA_MAX_HEIGHT = 200
// Add a smaller min height for mobile when chat has started
const MOBILE_CHAT_STARTED_MIN_HEIGHT = 50

interface ChatInputProps {
  chat: Chat | null
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
  hasConfirmedOutline: boolean
  onThemeChange?: (theme: any) => void
  onColorChange?: (color: string) => void
  onBorderRadiusChange?: (radius: any) => void
}

export function ChatInput({
  chat,
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
  hasConfirmedOutline,
  onThemeChange,
  onColorChange,
  onBorderRadiusChange,
}: ChatInputProps) {
  const isMobile = useIsMobile()

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
      className={classNames(
        'z-40 mx-auto w-full flex-shrink-0',
        isMobile && chatStarted && hasConfirmedOutline ? 'max-w-[95%] pb-3' : 'max-w-[552px]'
      )}
    >
      <div
        className={classNames(
          'rounded-lg border border-blue-200 bg-white shadow-sm backdrop-blur-[8px] backdrop-filter',
          'relative w-full',
          isMobile && chatStarted ? 'scale-90 transform' : ''
        )}
      >
        <textarea
          ref={textareaRef}
          className={classNames(
            'w-full resize-none bg-transparent pr-16 text-gray-500 focus:outline-none',
            isMobile && chatStarted ? 'pl-3 pt-3 text-xs' : isMobile ? 'pl-4 pt-4 text-sm' : 'text-md pl-4 pt-4'
          )}
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
            minHeight:
              isMobile && chatStarted
                ? MOBILE_CHAT_STARTED_MIN_HEIGHT
                : isMobile
                  ? TEXTAREA_MIN_HEIGHT - 10
                  : TEXTAREA_MIN_HEIGHT,
            maxHeight: isMobile && chatStarted ? TEXTAREA_MAX_HEIGHT - 50 : TEXTAREA_MAX_HEIGHT,
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
        <div
          className={classNames(
            'flex justify-between',
            isMobile && chatStarted ? 'p-1.5 pt-0.5 text-xs' : isMobile ? 'p-3 pt-2 text-xs' : 'p-4 pt-2 text-sm'
          )}
        >
          <div className="flex items-center gap-1">
            {!(isMobile && chatStarted) && (
              <IconButton
                title="Enhance prompt"
                disabled={input.length === 0 || enhancingPrompt}
                onClick={() => enhancePrompt?.()}
                tooltip="Improve your prompt"
                tooltipPosition="top"
                tooltipId="enhance-prompt-tooltip"
              >
                {enhancingPrompt ? (
                  <div className="flex items-center">
                    <Loading height={isMobile ? 12 : 16} width={isMobile ? 12 : 16} />
                    <div className="i-svg-spinners:90-ring-with-bg text-xl text-gray-500"></div>
                    <div className={isMobile && chatStarted ? 'ml-1 text-xs' : isMobile ? 'ml-1.5 text-xs' : 'ml-1.5'}>
                      {isMobile && chatStarted ? 'Enhancing...' : 'Enhancing prompt...'}
                    </div>
                  </div>
                ) : (
                  <>
                    <SparklesIcon
                      className={
                        isMobile && chatStarted
                          ? 'h-3 w-3 text-gray-500'
                          : isMobile
                            ? 'h-4 w-4 text-gray-500'
                            : 'h-5 w-5 text-gray-500'
                      }
                    />
                    {promptEnhanced && (
                      <div
                        className={isMobile && chatStarted ? 'ml-1 text-xs' : isMobile ? 'ml-1.5 text-xs' : 'ml-1.5'}
                      >
                        {isMobile && chatStarted ? 'Enhanced' : 'Prompt enhanced'}
                      </div>
                    )}
                  </>
                )}
              </IconButton>
            )}
          </div>

          {!chatStarted && (
            <div className="flex items-center gap-2">
              <ThemeColorPickerPopover tooltip="Select theme" tooltipPosition="top" popoverDirection="down" />
              <ExportTypePickerPopover tooltip="Export format" tooltipPosition="top" popoverDirection="down" />
              <CompanySection chat={chat} tooltip="Select branding" tooltipPosition="top" popoverDirection="down" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
