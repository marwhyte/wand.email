import { Email } from '@/app/components/email-workspace/types'
import { updateChat } from '@/lib/database/queries/chats'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import debounce from 'lodash.debounce'
import { useCallback } from 'react'

export function useEmailSave() {
  const { setEmail } = useEmailStore()
  const { chatId } = useChatStore()
  const debouncedUpdateChat = useCallback(
    debounce((updatedTemplate: Email) => {
      if (chatId) {
        updateChat(chatId, { email: updatedTemplate })
      }
    }, 300),
    [chatId]
  )

  const saveEmail = useCallback(
    (updatedTemplate: Email) => {
      setEmail(updatedTemplate)
      debouncedUpdateChat(updatedTemplate)
    },
    [debouncedUpdateChat, setEmail]
  )

  return saveEmail
}
