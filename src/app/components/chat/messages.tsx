'use client'

import { CheckCircleIcon } from '@heroicons/react/24/solid'
import type { Message } from 'ai'
import { motion } from 'framer-motion'
import React from 'react'

import { classNames } from '@/lib/utils/misc'
import { AssistantMessage } from './assistant-message'
import { UserMessage } from './user-message'

interface MessagesProps {
  id?: string
  className?: string
  isStreaming?: boolean
  messages?: Message[]
  processingStates?: { [key: number]: { isProcessing: boolean; isDone: boolean } }
}

export const Messages = React.forwardRef<HTMLDivElement, MessagesProps>((props: MessagesProps, ref) => {
  const { id, isStreaming = false, messages = [], processingStates = {} } = props

  return (
    <div id={id} ref={ref} className={props.className}>
      {messages.length > 0
        ? messages.map((message, index) => {
            const { role, content } = message
            const isUserMessage = role === 'user'
            const isFirst = index === 0
            const isLast = index === messages.length - 1
            const messageState = processingStates[index]

            return (
              <motion.div
                key={index}
                layout
                initial={isFirst ? { opacity: 0, y: 20 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                }}
                className="space-y-2"
              >
                <div
                  className={classNames('flex w-full gap-4 rounded-[calc(0.75rem-1px)] p-6', {
                    'bg-gray-100': isUserMessage || !isStreaming || (isStreaming && !isLast),
                    'bg-gradient-to-b from-gray-100 from-30% to-transparent': isStreaming && isLast,
                    'mt-4': !isFirst,
                  })}
                >
                  {isUserMessage && (
                    <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center self-start overflow-hidden rounded-full bg-white text-gray-600">
                      <div className="i-ph:user-fill text-xl"></div>
                    </div>
                  )}
                  <div className="grid-col-1 grid w-full">
                    {isUserMessage ? <UserMessage content={content} /> : <AssistantMessage content={content} />}
                  </div>
                </div>
                {messageState && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-600"
                  >
                    {messageState.isProcessing ? (
                      <>
                        <div className="i-svg-spinners:dot-revolve h-4 w-4" />
                        <span>Applying email changes...</span>
                      </>
                    ) : messageState.isDone ? (
                      <>
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>Email changes applied</span>
                      </>
                    ) : null}
                  </motion.div>
                )}
              </motion.div>
            )
          })
        : null}
      {isStreaming && <div className="i-svg-spinners:3-dots-fade mt-4 w-full text-center text-4xl text-gray-600"></div>}
    </div>
  )
})

Messages.displayName = 'Messages'
