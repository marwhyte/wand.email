'use client'

import { useOpener } from '@/app/hooks'
import { deleteMessagesAfterId, getMessage, updateChat } from '@/lib/database/queries/chats'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { useChat } from '@ai-sdk/react'
import type { Message } from 'ai'
import React from 'react'
import { Button } from '../button'
import { RevertDialog } from '../dialogs/revert-dialog'

interface EmailProcessingStatusProps {
  isComplete: boolean
  hasContentBefore?: boolean
  hasContentAfter?: boolean
  message: Message
  messages: Message[]
  disabled?: boolean
}

export const EmailProcessingStatus: React.FC<EmailProcessingStatusProps> = ({
  isComplete,
  hasContentBefore = false,
  hasContentAfter = false,
  message,
  messages,
  disabled,
}) => {
  const revertOpener = useOpener()
  const { email, setEmail } = useEmailStore()
  const { chatId } = useChatStore()

  const { setMessages } = useChat({
    id: chatId,
  })

  // Find the index of the current message
  const currentMessageIndex = messages.findIndex((msg) => msg.id === message.id)

  // Count email versions before this message
  const version = messages
    .slice(0, currentMessageIndex) // Only look at messages before the current one
    .filter((msg) => msg.role === 'assistant' && msg.content.includes('<EMAIL')).length

  // Determine margin classes based on content before/after
  const marginClasses = `${hasContentBefore ? 'mt-4' : ''} ${hasContentAfter ? 'mb-4' : ''} max-w-sm rounded-lg border border-gray-200 bg-white p-3 shadow-sm`

  // Count total email versions for comparison
  const totalEmailVersions = messages.filter((msg) => msg.role === 'assistant' && msg.content.includes('<EMAIL')).length

  // Determine if the button should be disabled and its label
  const isMostRecentVersion = version === totalEmailVersions - 1
  const isOnlyAssistantMessage =
    messages.filter((msg) => msg.role === 'assistant' && msg.content.includes('<EMAIL')).length === 1
  const buttonLabel = isMostRecentVersion ? 'Undo' : 'Restore'
  const buttonDisabled = isOnlyAssistantMessage || disabled
  const buttonTooltip = isOnlyAssistantMessage ? 'Nothing to restore' : undefined

  const handleRevert = async () => {
    const revertedMessage = isMostRecentVersion
      ? messages
          .slice(0, currentMessageIndex)
          .reverse()
          .filter((msg) => msg.role === 'assistant' && msg.content.includes('<EMAIL'))[0]
      : message

    if (revertedMessage) {
      const newMessage = await getMessage(revertedMessage.id)

      if (newMessage?.email && chatId) {
        updateChat(chatId, {
          email: newMessage.email,
        })
          .then(() => {
            deleteMessagesAfterId(newMessage.id, chatId).then((messages) => {
              if (newMessage.email) {
                setEmail(parseEmailScript(newMessage.email))
              }
              setMessages(messages)
            })
          })
          .catch((error) => {
            console.error('Error processing things:', error)
          })
      }
    }
  }

  return (
    <div className={marginClasses}>
      <div className="flex items-center justify-between pb-3 pl-1">
        <span className="text-xs font-medium text-gray-900">Version {version + 1}</span>
        <Button
          onClick={revertOpener.open}
          size="small"
          outline
          disabled={buttonDisabled}
          tooltip={buttonTooltip}
          tooltipTransform="-top-9 -left-14"
        >
          {buttonLabel}
        </Button>
      </div>
      <div className="flex items-center">
        {isComplete ? (
          <svg
            className="me-2 h-4 w-4 shrink-0 text-green-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
        ) : (
          <div role="status">
            <svg
              aria-hidden="true"
              className="me-2 h-4 w-4 animate-spin fill-blue-600 text-gray-200"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
        <span className="text-xs font-medium text-gray-600">
          {isComplete ? 'Applied changes successfully' : 'Applying changes...'}
        </span>
      </div>
      <RevertDialog isOpen={revertOpener.isOpen} onClose={revertOpener.close} onConfirm={handleRevert} />
    </div>
  )
}
