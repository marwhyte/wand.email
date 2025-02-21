'use client'

import LoginForm from '@/app/forms/login-form'
import RegistrationForm from '@/app/forms/registration-form'
import { usePromptEnhancer, useSnapScroll } from '@/app/hooks'
import { useChatHistory } from '@/app/hooks/useChatHistory'
import { useMessageParser } from '@/app/hooks/useMessageParser'
import { chatStore } from '@/lib/stores/chat'
import { useEmailStore } from '@/lib/stores/emailStore'
import { cubicEasingFn } from '@/lib/utils/easings'
import { createScopedLogger, renderLogger } from '@/lib/utils/logger'
import { useChat } from '@ai-sdk/react'
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid'
import type { Message } from 'ai'
import { useAnimate } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { cssTransition, toast, ToastContainer } from 'react-toastify'
import { Dialog, DialogBody, DialogDescription, DialogTitle } from '../dialog'
import { Email, Template } from '../email-workspace/types'
import { Header } from '../header'
import UpgradeDialog from '../payment/upgrade-dialog'
import { BaseChat } from './base-chat'

const toastAnimation = cssTransition({
  enter: 'animated fadeInRight',
  exit: 'animated fadeOutRight',
})

const logger = createScopedLogger('Chat')

type Props = {
  monthlyExportCount: number | null
}

export function Chat({ monthlyExportCount }: Props) {
  renderLogger.trace('Chat')

  const { ready, initialMessages, storeMessageHistory } = useChatHistory()
  const [chatStarted, setChatStarted] = useState(false)

  useEffect(() => {
    if (ready) {
      setChatStarted(initialMessages.length > 0)
    }
  }, [ready, initialMessages.length])

  return (
    <div className="mx-auto w-full">
      <Header monthlyExportCount={monthlyExportCount} chatStarted={chatStarted} />
      <div className="flex flex-1">
        {ready && <ChatImpl initialMessages={initialMessages} storeMessageHistory={storeMessageHistory} chatStarted={chatStarted} setChatStarted={setChatStarted} />}
        <ToastContainer
          closeButton={({ closeToast }) => {
            return (
              <button className="Toastify__close-button" onClick={closeToast}>
                <div className="i-ph:x text-lg" />
              </button>
            )
          }}
          icon={({ type }) => {
            /**
             * @todo Handle more types if we need them. This may require extra color palettes.
             */
            switch (type) {
              case 'success': {
                return <CheckIcon className="h-5 w-5 text-green-500" />
              }
              case 'error': {
                return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              }
            }

            return undefined
          }}
          position="bottom-right"
          pauseOnFocusLoss
          transition={toastAnimation}
        />
      </div>
    </div>
  )
}

interface ChatProps {
  initialMessages: Message[]
  storeMessageHistory: (messages: Message[], email?: Email) => Promise<void>
  chatStarted: boolean
  setChatStarted: (started: boolean) => void
}

export function ChatImpl({ initialMessages, storeMessageHistory, chatStarted, setChatStarted }: ChatProps) {
  const session = useSession()
  const { setEmail } = useEmailStore()

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isUpgradeDialogOpen = searchParams.get('upgrade') === 'true'

  const openUpgradeDialog = () => {
    router.push(`${pathname}?upgrade=true&plan=starter`, { scroll: false })
  }

  const closeUpgradeDialog = () => {
    router.push(pathname, { scroll: false })
  }

  const [showSignUpDialog, setShowSignUpDialog] = useState(false)
  const [stepType, setStepType] = useState<'login' | 'signup'>('signup')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>()

  useEffect(() => {
    if (session.data?.user) {
      setShowSignUpDialog(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status])

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const showChat = chatStore((state) => state.showChat)
  const setKey = chatStore((state) => state.setKey)

  const [animationScope, animate] = useAnimate()

  const { messages, status, input, handleInputChange, setInput, stop, append } = useChat({
    api: '/api/chat',
    // body: {
    //   template: initialMessages.length === 0 ? JSON.stringify(selectedTemplate?.template) : undefined,
    // },
    onFinish: () => {
      logger.debug('Finished streaming')
    },
    initialMessages,
  })

  // Get the latest assistant message
  const latestAssistantMessage = messages.findLast((m) => m.role === 'assistant')

  // Add message parser hook with empty content if no message exists
  useMessageParser(latestAssistantMessage ?? { role: 'assistant', content: '', id: '' })

  const { enhancingPrompt, promptEnhanced, enhancePrompt, resetEnhancer } = usePromptEnhancer()

  const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200

  const isLoading = status === 'streaming'

  useEffect(() => {
    setKey('started', initialMessages.length > 0)
  }, [])

  useEffect(() => {
    if (!isLoading && messages.length > initialMessages.length) {
      storeMessageHistory(messages, selectedTemplate?.template).catch((error) => toast.error(error.message))
    }
  }, [messages.length, initialMessages.length, isLoading])

  const scrollTextArea = () => {
    const textarea = textareaRef.current

    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight
    }
  }

  const abort = () => {
    stop()
    setKey('aborted', true)
  }

  useEffect(() => {
    const textarea = textareaRef.current

    if (textarea) {
      textarea.style.height = 'auto'

      const scrollHeight = textarea.scrollHeight

      textarea.style.height = `${Math.min(scrollHeight, TEXTAREA_MAX_HEIGHT)}px`
      textarea.style.overflowY = scrollHeight > TEXTAREA_MAX_HEIGHT ? 'auto' : 'hidden'
    }
  }, [TEXTAREA_MAX_HEIGHT, input, textareaRef])

  const runAnimation = async () => {
    if (chatStarted) {
      return
    }

    await Promise.all([animate('#examples', { opacity: 0, display: 'none' }, { duration: 0.1 }), animate('#intro', { opacity: 0, flex: 1 }, { duration: 0.2, ease: cubicEasingFn })])

    setKey('started', true)

    setChatStarted(true)
  }

  const sendMessage = async (_event: React.UIEvent, messageInput?: string) => {
    if (!session.data?.user?.id) {
      setShowSignUpDialog(true)
      return
    }

    const _input = messageInput || input

    if (_input.length === 0 || isLoading) {
      return
    }

    setKey('aborted', false)

    runAnimation()

    if (messages.length === 0) {
      await storeMessageHistory(messages, selectedTemplate?.template).catch((error) => toast.error(error.message))
    }

    append({ role: 'user', content: _input })

    setInput('')

    resetEnhancer()

    textareaRef.current?.blur()
  }

  const [messageRef, scrollRef] = useSnapScroll()

  return (
    <>
      <BaseChat
        ref={animationScope}
        textareaRef={textareaRef}
        input={input}
        showChat={showChat}
        chatStarted={chatStarted}
        isStreaming={isLoading}
        enhancingPrompt={enhancingPrompt}
        promptEnhanced={promptEnhanced}
        sendMessage={sendMessage}
        messageRef={messageRef}
        scrollRef={scrollRef}
        handleInputChange={handleInputChange}
        handleStop={abort}
        messages={messages.map((message) => ({
          ...message,
          content: message === latestAssistantMessage ? message.content : message.content,
        }))}
        enhancePrompt={() => {
          enhancePrompt(input, (input) => {
            setInput(input)
            scrollTextArea()
          })
        }}
        selectedTemplate={selectedTemplate}
        onTemplateSelect={setSelectedTemplate}
      />
      <Dialog open={showSignUpDialog} onClose={() => setShowSignUpDialog(false)} className="z-50">
        <DialogTitle>{`${stepType === 'login' ? 'Log in' : 'Sign up'} to start creating emails`}</DialogTitle>
        <DialogBody className="!mt-2">
          <DialogDescription className="mb-4">Access and edit your saved emails anytime, anywhere.</DialogDescription>
          {stepType === 'login' && <LoginForm redirectToInitialProject onSwitchType={() => setStepType('signup')} />}
          {stepType === 'signup' && <RegistrationForm redirectToInitialProject onSwitchType={() => setStepType('login')} />}
        </DialogBody>
      </Dialog>
      <UpgradeDialog open={isUpgradeDialogOpen} onClose={closeUpgradeDialog} />
    </>
  )
}
