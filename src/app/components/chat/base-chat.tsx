'use client'

import { Menu } from '@/app/components/sidebar/menu'
import type { Message } from 'ai'
import { motion } from 'framer-motion'
import React, { type RefCallback, useEffect, useState } from 'react'

import { templates } from '@/lib/data/templates'
import { classNames } from '@/lib/utils/misc'
import { ArrowDownCircleIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom'
import EmblaCarousel from '../carousel/EmblaCarousel'
import Workspace from '../email-workspace/email-workspace'
import TemplateCard from '../email-workspace/template-card'
import { IconButton } from '../icon-button'
import Loading from '../loading'
import { Messages } from './messages'
import { SendButton } from './send-button'

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined
  messageRef?: RefCallback<HTMLDivElement> | undefined
  scrollRef?: RefCallback<HTMLDivElement> | undefined
  showChat?: boolean
  chatStarted?: boolean
  isStreaming?: boolean
  messages?: Message[]
  enhancingPrompt?: boolean
  promptEnhanced?: boolean
  input?: string
  handleStop?: () => void
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  enhancePrompt?: () => void
  selectedTemplate?: Template
  onTemplateSelect?: (template: Template) => void
}

const EXAMPLE_PROMPTS = templates

const TEXTAREA_MIN_HEIGHT = 76
const TEXTAREA_MAX_HEIGHT = 200

function AutoScroller({ input }: { input: string }) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext()

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom()
    }
  }, [input, isAtBottom, scrollToBottom])

  return null
}

export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(({ textareaRef, messageRef, scrollRef, showChat = true, chatStarted = false, isStreaming = false, messages, enhancingPrompt = false, promptEnhanced = false, input = '', sendMessage, handleInputChange, enhancePrompt, handleStop, selectedTemplate, onTemplateSelect }, ref) => {
  const session = useSession()
  const [textareaHeight, setTextareaHeight] = useState(TEXTAREA_MIN_HEIGHT)

  return (
    <div ref={ref} className="relative mx-auto flex w-full items-center overflow-hidden" data-chat-visible={showChat}>
      {session.data?.user?.id && <Menu />}
      <div
        className={classNames(`flex w-full justify-center`, {
          '-mb-2': chatStarted,
        })}
      >
        <div
          className={classNames('flex min-w-[400px] shrink-[2] flex-col', {
            'max-w-[600px]': chatStarted,
            'border-r border-gray-200': chatStarted,
          })}
        >
          {!chatStarted && (
            <div id="intro" className="mx-auto mt-[2vh] max-w-[552px]">
              <h1 className="mb-2 animate-animate-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-[size:200%] !bg-clip-text text-center text-4xl font-bold !text-transparent">Beautiful emails in seconds</h1>
              <p className="mb-4 text-center text-gray-600">Create stunning, responsive emails that look great across all devices.</p>
            </div>
          )}
          <div
            className={classNames('px-6 pt-6', {
              'flex flex-col': chatStarted,
            })}
          >
            <StickToBottom
              className={classNames('relative flex flex-col justify-end pb-6', {
                'h-[calc(100vh-100px)]': chatStarted,
              })}
              resize="smooth"
              initial="smooth"
            >
              <StickToBottom.Content className="relative flex-grow overflow-auto">
                <AutoScroller input={input} />
                <Messages ref={messageRef} className="z-1 mx-auto flex h-full w-full max-w-[552px] flex-col px-4 pb-6" messages={messages} isStreaming={isStreaming} />
              </StickToBottom.Content>
              <ScrollToBottom textareaHeight={textareaHeight} />

              <motion.div
                layout
                transition={{
                  layout: { duration: 0.3, ease: 'easeInOut' },
                }}
                className="z-40 mx-auto w-full max-w-[552px] flex-shrink-0"
              >
                <div className={classNames('overflow-hidden rounded-lg border border-blue-200 bg-white shadow-sm backdrop-blur-[8px] backdrop-filter', 'relative w-full')}>
                  <textarea
                    ref={textareaRef}
                    className={`text-md w-full resize-none bg-transparent pl-4 pr-16 pt-4 text-gray-500 focus:outline-none`}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        if (event.shiftKey) {
                          return
                        }

                        event.preventDefault()

                        sendMessage?.(event)
                      }
                    }}
                    value={input}
                    onChange={(event) => {
                      handleInputChange?.(event)
                      if (textareaRef?.current) {
                        setTextareaHeight(textareaRef.current.scrollHeight)
                      }
                    }}
                    style={{
                      minHeight: TEXTAREA_MIN_HEIGHT,
                      maxHeight: TEXTAREA_MAX_HEIGHT,
                    }}
                    placeholder={chatStarted ? 'Describe your perfect email' : 'Describe your perfect email, and optionally select a template to start from'}
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

                      sendMessage?.(event)
                    }}
                  />
                  <div className="flex justify-between p-4 pt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <IconButton title="Enhance prompt" disabled={input.length === 0 || enhancingPrompt} onClick={() => enhancePrompt?.()}>
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
                        Use <kbd className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold">Shift</kbd> + <kbd className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold">Return</kbd> for a new line
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            </StickToBottom>
          </div>
          {!chatStarted && (
            <div id="examples" className="relative mx-auto mt-8 w-full">
              <div className="flex w-full flex-col space-y-4">
                <TemplateCarousel templates={EXAMPLE_PROMPTS} selectedTemplate={selectedTemplate} onTemplateSelect={onTemplateSelect} />
              </div>
            </div>
          )}
        </div>
        {chatStarted && (
          <div className="w-full min-w-[920px] flex-1">
            <Workspace chatStarted={chatStarted} isStreaming={isStreaming} />
          </div>
        )}
      </div>
    </div>
  )
})

function ScrollToBottom({ textareaHeight }: { textareaHeight: number }) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext()

  const bottomPosition = Math.min(166 + (textareaHeight - TEXTAREA_MIN_HEIGHT), 300)

  return (
    !isAtBottom && (
      <button className="absolute left-[50%] translate-x-[-50%] rounded-lg text-gray-500 hover:text-gray-700" style={{ bottom: bottomPosition }} onClick={() => scrollToBottom()}>
        <ArrowDownCircleIcon className="h-8 w-8" />
      </button>
    )
  )
}

function TemplateCarousel({ templates, selectedTemplate, onTemplateSelect }: { templates: Template[]; selectedTemplate?: Template; onTemplateSelect?: (template: Template) => void }) {
  return (
    <div className="mx-auto">
      <EmblaCarousel
        slides={templates.map((template, index) => (
          <div className="flex-[0_0_200px]" key={`${template.id}-${index}`}>
            <TemplateCard template={template} isSelected={selectedTemplate?.id === template.id} onSelect={onTemplateSelect} />
          </div>
        ))}
        options={{
          align: 'start',
          containScroll: 'trimSnaps',
          loop: true,
        }}
      />
    </div>
  )
}

BaseChat.displayName = 'BaseChat'
