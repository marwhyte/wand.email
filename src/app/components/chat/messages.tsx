'use client'

import { classNames } from '@/lib/utils/misc'
import type { Message } from 'ai'
import { motion } from 'framer-motion'
import React from 'react'
import { AssistantMessage } from './assistant-message'
import { UserMessage } from './user-message'

interface MessagesProps {
  id?: string
  className?: string
  isStreaming?: boolean
  messages?: Message[]
}

export const Messages = React.forwardRef<HTMLDivElement, MessagesProps>((props: MessagesProps, ref) => {
  const { id, isStreaming = false, messages = [] } = props

  return (
    <div id={id} ref={ref} className={props.className + ' w-full'}>
      {messages.length > 0
        ? messages.map((message, index) => {
            const { role, content } = message
            const isUserMessage = role === 'user'
            const isFirst = index === 0
            const isLast = index === messages.length - 1

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
                  <div className="grid-col-1 grid">{isUserMessage ? <UserMessage content={content} /> : <AssistantMessage content={content} />}</div>
                </div>
              </motion.div>
            )
          })
        : null}
      {isStreaming && <div className="i-svg-spinners:3-dots-fade mt-4 w-full text-center text-4xl text-gray-600"></div>}
    </div>
  )
})

Messages.displayName = 'Messages'
