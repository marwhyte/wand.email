'use client'

import { classNames } from '@/lib/utils/misc'
import type { Message } from 'ai'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'
import { Logo } from '../Logo'
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
  const { data } = useSession()

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
                  className={classNames('flex w-full gap-3 rounded-[calc(0.75rem-1px)] p-4', {
                    'bg-gray-100': isUserMessage || !isStreaming || (isStreaming && !isLast),
                    'bg-gradient-to-b from-gray-100 from-30% to-transparent': isStreaming && isLast,
                    'mt-4': !isFirst,
                  })}
                >
                  <div className="flex h-[24px] w-[24px] shrink-0 items-center justify-center self-start overflow-hidden rounded-full text-gray-600">
                    {isUserMessage ? (
                      data?.user?.image ? (
                        <Image
                          width={24}
                          height={24}
                          src={data?.user?.image}
                          alt={data?.user?.name || 'User'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-blue-500 font-medium text-white">
                          {data?.user?.name ? (
                            data.user.name.charAt(0).toUpperCase()
                          ) : (
                            <div className="i-ph:user-fill text-xl"></div>
                          )}
                        </div>
                      )
                    ) : (
                      <Logo width={24} height={24} text={false} />
                    )}
                  </div>
                  <div className="grid-col-1 grid w-full text-sm">
                    {isUserMessage ? (
                      <UserMessage content={content} />
                    ) : (
                      <AssistantMessage content={content} message={message} messages={messages} />
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
