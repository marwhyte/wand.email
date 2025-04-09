'use client'

import { Chat } from '@/lib/database/types'
import { classNames } from '@/lib/utils/misc'
import type { Message } from 'ai'
import React from 'react'
import { Logo } from '../Logo'
import { UserAvatar } from '../user-avatar'
import { AssistantMessage } from './assistant-message'
import { UserMessage } from './user-message'

interface MessagesProps {
  id?: string
  className?: string
  isStreaming?: boolean
  messages?: Message[]
  chat: Chat | null | undefined
}

export const Messages = React.forwardRef<HTMLDivElement, MessagesProps>((props: MessagesProps, ref) => {
  const { id, isStreaming = false, messages = [], chat } = props

  return (
    <div id={id} ref={ref} className={props.className + ' w-full'}>
      {messages.length > 0
        ? messages.map((message, index) => {
            const { role, content } = message
            const isUserMessage = role === 'user'
            const isFirst = index === 0
            const isLast = index === messages.length - 1

            return (
              <div key={index} className="space-y-2">
                <div
                  className={classNames('flex w-full gap-3 rounded-[calc(0.75rem-1px)] px-3 py-4', {
                    'bg-gray-100': isUserMessage || !isStreaming || (isStreaming && !isLast),
                    'bg-gradient-to-b from-gray-100 from-30% to-transparent': isStreaming && isLast,
                    'mt-4': !isFirst,
                  })}
                >
                  <div className="flex h-[24px] w-[24px] shrink-0 items-center justify-center self-start overflow-hidden rounded-full text-gray-600">
                    {isUserMessage ? <UserAvatar size={24} /> : <Logo width={24} height={24} icon />}
                  </div>
                  <div className="grid-col-1 grid w-full text-sm">
                    {isUserMessage ? (
                      <UserMessage content={content} />
                    ) : (
                      <AssistantMessage
                        isStreaming={isStreaming}
                        content={content}
                        message={message}
                        messages={messages}
                        chat={chat}
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          })
        : null}
      {isStreaming && (
        <div className="mt-4 flex w-full justify-center">
          <div className="flex items-center justify-center space-x-2 bg-white dark:invert">
            <span className="sr-only">Loading...</span>
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-600 [animation-delay:-0.3s] [animation-duration:0.7s] [animation-height:1.8rem]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-600 [animation-delay:-0.15s] [animation-duration:0.7s] [animation-height:1.8rem]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-600 [animation-duration:0.7s] [animation-height:1.8rem]"></div>
          </div>
        </div>
      )}
    </div>
  )
})

Messages.displayName = 'Messages'
