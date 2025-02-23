'use client'

import Loading from '@/app/components/loading'
import LoginForm from '@/app/forms/login-form'
import RegistrationForm from '@/app/forms/registration-form'
import { useOpener, usePromptEnhancer, useSnapScroll } from '@/app/hooks'
import { useChatHistory } from '@/app/hooks/useChatHistory'
import { useMessageParser } from '@/app/hooks/useMessageParser'
import { deleteCompany } from '@/lib/database/queries/companies'
import { Company } from '@/lib/database/types'
import { chatStore } from '@/lib/stores/chat'
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
import { Button } from '../button'
import CompanyDialog from '../company-dialog'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '../dialog'
import { Header } from '../header'
import UpgradeDialog from '../payment/upgrade-dialog'
import { BaseChat } from './base-chat'

const toastAnimation = cssTransition({
  enter: 'animated fadeInRight',
  exit: 'animated fadeOutRight',
})

const logger = createScopedLogger('Chat')

type Props = {
  companies: Company[] | null
  monthlyExportCount: number | null
}

export function Chat({ companies, monthlyExportCount }: Props) {
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
        {ready && (
          <ChatImpl
            companies={companies}
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
  companies: Company[] | null
  initialMessages: Message[]
  storeMessageHistory: (messages: Message[], companyId?: string | null) => Promise<void>
  chatStarted: boolean
  setChatStarted: (started: boolean) => void
}

export function ChatImpl({ companies, initialMessages, storeMessageHistory, chatStarted, setChatStarted }: ChatProps) {
  const session = useSession()
  const companyOpener = useOpener()

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
  const deleteOpener = useOpener()
  const [stepType, setStepType] = useState<'login' | 'signup'>('signup')
  const [pendingAction, setPendingAction] = useState<{
    type: 'send-message' | 'open-company-dialog'
    messageInput?: string
  } | null>(null)

  const [isDeleting, setIsDeleting] = useState(false)

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(companies?.length ? companies[0].id : null)
  const [activeCompany, setActiveCompany] = useState<Company | null>(null)

  useEffect(() => {
    if (companies?.length && !selectedCompanyId) {
      setSelectedCompanyId(companies[0].id)
    } else if (!companies?.length) {
      setSelectedCompanyId(null)
    }
    if (selectedCompanyId && !companies?.find((c) => c.id === selectedCompanyId)) {
      setSelectedCompanyId(null)
    }
  }, [companies, selectedCompanyId])

  useEffect(() => {
    if (session.data?.user) {
      setShowSignUpDialog(false)
      // Execute pending action after successful authentication
      if (pendingAction) {
        if (pendingAction.type === 'send-message') {
          sendMessage(pendingAction.messageInput)
        } else if (pendingAction.type === 'open-company-dialog') {
          companyOpener.open()
        }

        // Clear pending action
        setPendingAction(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status])

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const showChat = chatStore((state) => state.showChat)
  const setKey = chatStore((state) => state.setKey)

  const [animationScope, animate] = useAnimate()

  const { messages, status, input, handleInputChange, setInput, stop, append } = useChat({
    api: '/api/chat',
    body: {
      companyName: companies?.find((c) => c.id === selectedCompanyId)?.name,
    },
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

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    setKey('started', initialMessages.length > 0)
  }, [])

  useEffect(() => {
    if (!isLoading && messages.length > initialMessages.length) {
      console.log('this happenes when it should not')
      storeMessageHistory(messages).catch((error) => toast.error(error.message))
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

    await Promise.all([
      animate('#companyDetails', { opacity: 0, display: 'none' }, { duration: 0.1 }),
      animate('#intro', { opacity: 0, flex: 1 }, { duration: 0.2, ease: cubicEasingFn }),
    ])

    setKey('started', true)
    setChatStarted(true)
  }

  const sendMessage = async (messageInput?: string) => {
    if (!session.data?.user?.id) {
      setPendingAction({ type: 'send-message', messageInput: messageInput || input })
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
      storeMessageHistory(messages, selectedCompanyId).catch((error) => toast.error(error.message))
    }

    append({ role: 'user', content: _input })

    setInput('')

    resetEnhancer()

    textareaRef.current?.blur()
  }

  const [messageRef, scrollRef] = useSnapScroll()

  const handleDeleteCompany = async (companyId: string) => {
    setActiveCompany(companies?.find((c) => c.id === companyId) || null)
    deleteOpener.open()
  }

  const confirmDeleteCompany = async () => {
    if (!activeCompany) return

    try {
      setIsDeleting(true)
      await deleteCompany(activeCompany.id)

      setActiveCompany(null)
    } catch (error) {
    } finally {
      setIsDeleting(false)
      if (selectedCompanyId === activeCompany?.id) {
        setSelectedCompanyId(null)
      }

      setActiveCompany(null)

      deleteOpener.close()
    }
  }

  const handleSelectCompany = (company: Company) => {
    setSelectedCompanyId(company.id)
  }

  return (
    <>
      <BaseChat
        ref={animationScope}
        textareaRef={textareaRef}
        input={input}
        companies={companies}
        showChat={showChat}
        chatStarted={chatStarted}
        isStreaming={isLoading}
        enhancingPrompt={enhancingPrompt}
        promptEnhanced={promptEnhanced}
        sendMessage={sendMessage}
        messageRef={messageRef}
        handleInputChange={handleInputChange}
        showCompanyDialog={(company) => {
          setPendingAction({ type: 'open-company-dialog' })
          if (session.data?.user?.id) {
            setActiveCompany(company ?? null)
            companyOpener.open()
          } else {
            setShowSignUpDialog(true)
          }
        }}
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
        handleDeleteCompany={handleDeleteCompany}
        handleSelectCompany={handleSelectCompany}
        selectedCompanyId={selectedCompanyId}
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
      <CompanyDialog
        company={activeCompany}
        isOpen={companyOpener.isOpen}
        onClose={companyOpener.close}
        onSuccess={(company) => {
          companyOpener.close()
          setActiveCompany(null)
        }}
      />

      <UpgradeDialog open={isUpgradeDialogOpen} onClose={closeUpgradeDialog} />

      <Dialog
        darkBackdrop
        open={deleteOpener.isOpen}
        onClose={() => {
          deleteOpener.close()
          setActiveCompany(null)
        }}
      >
        <DialogBody>
          <DialogTitle>Delete Company</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {activeCompany?.name}? This action cannot be undone.
          </DialogDescription>
        </DialogBody>
        <DialogActions>
          <Button
            onClick={() => {
              deleteOpener.close()
              setActiveCompany(null)
            }}
            color="light"
          >
            Cancel
          </Button>
          <Button onClick={confirmDeleteCompany} color="red">
            {isDeleting ? <Loading height={16} width={16} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
