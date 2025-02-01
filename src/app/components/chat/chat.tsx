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
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid'
import type { Message } from 'ai'
import { useChat } from 'ai/react'
import { useAnimate } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { cssTransition, toast, ToastContainer } from 'react-toastify'
import { Dialog, DialogBody, DialogDescription, DialogTitle } from '../dialog'
import { Header } from '../header'
import { BaseChat } from './base-chat'

const toastAnimation = cssTransition({
  enter: 'animated fadeInRight',
  exit: 'animated fadeOutRight',
})

const logger = createScopedLogger('Chat')

export function Chat() {
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
      <Header chatStarted={chatStarted} />
      <div className="flex flex-1">
        {ready && (
          <ChatImpl
            initialMessages={initialMessages}
            storeMessageHistory={storeMessageHistory}
            chatStarted={chatStarted}
            setChatStarted={setChatStarted}
          />
        )}
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

  const [showSignUpDialog, setShowSignUpDialog] = useState(false)
  const [stepType, setStepType] = useState<'login' | 'signup'>('signup')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>()

  useEffect(() => {
    if (session.data?.user) {
      setShowSignUpDialog(false)
    }
  }, [session.status])

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const showChat = chatStore((state) => state.showChat)
  const setKey = chatStore((state) => state.setKey)

  const [animationScope, animate] = useAnimate()

  const { messages, isLoading, input, handleInputChange, setInput, stop, append } = useChat({
    api: '/api/chat',
    body: {
      template: initialMessages.length === 0 ? JSON.stringify(selectedTemplate?.template) : undefined,
    },
    onError: (error) => {
      logger.error('Request failed\n\n', error)
      toast.error('There was an error processing your request')
    },
    onFinish: () => {
      logger.debug('Finished streaming')
    },
    initialMessages,
  })

  const { parsedMessages, parseMessages, processingStates } = useMessageParser(messages)

  useEffect(() => {
    parseMessages(messages, isLoading)
  }, [messages, isLoading, parseMessages])

  const { enhancingPrompt, promptEnhanced, enhancePrompt, resetEnhancer } = usePromptEnhancer()

  const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200

  useEffect(() => {
    setKey('started', initialMessages.length > 0)
  }, [])

  useEffect(() => {
    if (!isLoading && messages.length > initialMessages.length) {
      storeMessageHistory(messages, selectedTemplate?.template).catch((error) => toast.error(error.message))
    }
  }, [messages, isLoading])

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
  }, [input, textareaRef])

  const runAnimation = async () => {
    if (chatStarted) {
      return
    }

    await Promise.all([
      animate('#examples', { opacity: 0, display: 'none' }, { duration: 0.1 }),
      animate('#intro', { opacity: 0, flex: 1 }, { duration: 0.2, ease: cubicEasingFn }),
    ])

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

    append({ role: 'user', content: _input })

    if (selectedTemplate) {
      setEmail(selectedTemplate.template)
    }

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
        processingStates={processingStates}
        enhancingPrompt={enhancingPrompt}
        promptEnhanced={promptEnhanced}
        sendMessage={sendMessage}
        messageRef={messageRef}
        scrollRef={scrollRef}
        handleInputChange={handleInputChange}
        handleStop={abort}
        messages={messages.map((message, index) => ({
          ...message,
          content: message.role === 'assistant' ? parsedMessages[index] || message.content : message.content,
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
          {stepType === 'signup' && (
            <RegistrationForm redirectToInitialProject onSwitchType={() => setStepType('login')} />
          )}
        </DialogBody>
      </Dialog>
    </>
  )
}
