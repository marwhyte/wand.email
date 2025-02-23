'use client'

import { Menu } from '@/app/components/sidebar/menu'
import type { Message } from 'ai'
import { motion } from 'framer-motion'
import React, { type RefCallback, useEffect, useState } from 'react'

import { Company } from '@/lib/database/types'
import { classNames, getImgFromKey } from '@/lib/utils/misc'
import {
  ArrowDownCircleIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  SparklesIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom'
import { Badge } from '../badge'
import { Button } from '../button'
import { Divider } from '../divider'
import Workspace from '../email-workspace/email-workspace'
import { Heading } from '../heading'
import { IconButton } from '../icon-button'
import Loading from '../loading'
import { Messages } from './messages'
import { SendButton } from './send-button'

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined
  messageRef?: RefCallback<HTMLDivElement> | undefined
  showChat?: boolean
  chatStarted?: boolean
  isStreaming?: boolean
  companies?: Company[] | null
  showCompanyDialog?: (company?: Company) => void
  messages?: Message[]
  enhancingPrompt?: boolean
  promptEnhanced?: boolean
  input?: string
  handleStop?: () => void
  sendMessage?: (messageInput?: string) => void
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  enhancePrompt?: () => void
  selectedCompanyId?: string | null
  handleSelectCompany?: (company: Company) => void
  handleDeleteCompany?: (companyId: string) => void
}

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

export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      textareaRef,
      companies,
      messageRef,
      showChat = true,
      chatStarted = false,
      isStreaming = false,
      messages,
      enhancingPrompt = false,
      showCompanyDialog,
      promptEnhanced = false,
      input = '',
      sendMessage,
      handleInputChange,
      enhancePrompt,
      handleStop,
      handleDeleteCompany,
      handleSelectCompany,
      selectedCompanyId,
    },
    ref
  ) => {
    const session = useSession()
    const [textareaHeight, setTextareaHeight] = useState(TEXTAREA_MIN_HEIGHT)

    return (
      <div ref={ref} className="relative mx-auto flex w-full items-center overflow-hidden" data-chat-visible={showChat}>
        {session.data?.user?.id && <Menu />}
        <div
          className={classNames(`flex w-full justify-center`, {
            '-mb-2': chatStarted,
            'mt-[7vh]': !chatStarted,
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
                <h1 className="mb-2 animate-animate-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-[size:200%] !bg-clip-text text-center text-4xl font-bold !text-transparent">
                  Beautiful emails in seconds
                </h1>
                <p className="mb-4 text-center text-gray-600">
                  Create stunning, responsive emails that look great across all devices.
                </p>
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
                  <Messages
                    ref={messageRef}
                    className="z-1 mx-auto flex h-full w-full max-w-[552px] flex-col px-4 pb-6"
                    messages={messages}
                    isStreaming={isStreaming}
                  />
                </StickToBottom.Content>
                <ScrollToBottom textareaHeight={textareaHeight} />

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
                        handleInputChange?.(event)
                        if (textareaRef?.current) {
                          setTextareaHeight(textareaRef.current.scrollHeight)
                        }
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
                          <kbd className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold">Return</kbd> for a new
                          line
                        </div>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              </StickToBottom>
            </div>
            {!chatStarted && (
              <motion.div
                id="companyDetails"
                className="relative mx-auto w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative mb-10 mt-10">
                  <Divider className="absolute inset-3 flex items-center" aria-hidden="true" />
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-white px-6 text-gray-600">
                      {companies?.length ? 'Your companies' : 'Optionally'}
                    </span>
                  </div>
                </div>

                {companies?.length ? (
                  <div className="mx-auto max-w-[600px] space-y-4 px-4">
                    {companies.map((company) => (
                      <div
                        key={company.id}
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest('button')) return
                          handleSelectCompany?.(company)
                        }}
                        className={classNames(
                          'flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50',
                          {
                            'border-blue-500 bg-blue-50/50': selectedCompanyId === company.id,
                            'border-gray-200': selectedCompanyId !== company.id,
                          }
                        )}
                      >
                        <div className="flex items-center space-x-4">
                          {company.logo_image_key && (
                            <img
                              src={getImgFromKey(company.logo_image_key)}
                              alt={`${company.name} logo`}
                              className="h-8 min-w-8 max-w-[70px] bg-white object-contain"
                            />
                          )}
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{company.name}</span>
                            {company.primary_color && (
                              <div
                                className="h-4 w-4 rounded-full border border-gray-200"
                                style={{ backgroundColor: company.primary_color }}
                                title={`Primary color: ${company.primary_color}`}
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {selectedCompanyId === company.id && <Badge color="blue">Selected</Badge>}

                          <Button plain tooltip="Edit company" onClick={() => showCompanyDialog?.(company)}>
                            <PencilSquareIcon className="h-5 w-5 !text-gray-500" />
                          </Button>
                          <Button plain tooltip="Delete company" onClick={() => handleDeleteCompany?.(company.id)}>
                            <TrashIcon className="h-5 w-5 !text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button outline className="mt-4" onClick={() => showCompanyDialog?.()}>
                      <PlusCircleIcon className="h-5 w-5" />
                      <span>Add another company</span>
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col items-center space-y-4 pb-4">
                    <Heading className="max-w-[440px] text-center text-gray-600" level={4}>
                      Add your logo, company name, and brand colors to create personalized emails
                    </Heading>
                    <button
                      onClick={() => showCompanyDialog?.()}
                      className="relative inline-flex h-12 w-48 overflow-hidden rounded-full p-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
                    >
                      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3B82F6_0%,#A855F7_50%,#EC4899_100%)]" />
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 blur-sm" />
                      <span className="relative inline-flex h-full w-full items-center justify-center rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-gray-600 transition-all hover:bg-white/80">
                        Get started
                      </span>
                    </button>
                  </div>
                )}
              </motion.div>
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
  }
)

function ScrollToBottom({ textareaHeight }: { textareaHeight: number }) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext()

  const bottomPosition = Math.min(166 + (textareaHeight - TEXTAREA_MIN_HEIGHT), 300)

  return (
    !isAtBottom && (
      <button
        className="absolute left-[50%] translate-x-[-50%] rounded-lg text-gray-500 hover:text-gray-700"
        style={{ bottom: bottomPosition }}
        onClick={() => scrollToBottom()}
      >
        <ArrowDownCircleIcon className="h-8 w-8" />
      </button>
    )
  )
}

BaseChat.displayName = 'BaseChat'
