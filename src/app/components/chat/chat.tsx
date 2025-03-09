'use client'

import { useOpener, usePromptEnhancer, useSnapScroll } from '@/app/hooks'
import { useChatHistory } from '@/app/hooks/useChatHistory'
import { deleteCompany } from '@/lib/database/queries/companies'
import { Chat as ChatType, Company } from '@/lib/database/types'
import { chatStore } from '@/lib/stores/chat'
import { cubicEasingFn } from '@/lib/utils/easings'
import { createScopedLogger, renderLogger } from '@/lib/utils/logger'
import { classNames } from '@/lib/utils/misc'
import { Message, useChat } from '@ai-sdk/react'
import { AuthDialog } from '@components/dialogs/auth-dialog'
import CompanyDialog from '@components/dialogs/company-dialog'
import { DeleteCompanyDialog } from '@components/dialogs/delete-company-dialog'
import UpgradeDialog from '@components/dialogs/upgrade-dialog'
import { Header } from '@components/header'
import { Menu } from '@components/sidebar/menu'
import { ChatToastContainer } from '@components/toast/chat-toast-container'
import { ArrowDownCircleIcon } from '@heroicons/react/24/solid'
import { useAnimate } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useSWRConfig } from 'swr'
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom'
import { v4 as uuidv4 } from 'uuid'
import Workspace from '../email-workspace/email-workspace'
import { ChatInput } from './chat-input'
import { ChatIntro } from './chat-intro'
import { CompanySection } from './company-section'
import { Messages } from './messages'

const logger = createScopedLogger('Chat')

type Props = {
  id: string
  chat?: ChatType
  companies: Company[] | null
  monthlyExportCount: number | null
  initialMessages: Message[]
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

export function Chat({ id, companies, monthlyExportCount, initialMessages, chat }: Props) {
  const { mutate } = useSWRConfig()
  useChatHistory({ chat: chat })

  // Chat state and handlers
  const { messages, status, input, handleInputChange, setInput, stop, append, reload, handleSubmit, setMessages } =
    useChat({
      id,
      experimental_throttle: 100,
      sendExtraMessageFields: true,
      generateId: uuidv4,
      body: {
        id,
        companyName: companies?.find((c) => c.id === selectedCompanyId)?.name,
        companyId: companies?.find((c) => c.id === selectedCompanyId)?.id,
      },
      onFinish: () => {
        logger.debug('Finished streaming')
        mutate('/api/history')
      },
      initialMessages,
    })
  const isLoading = status === 'streaming' || status === 'submitted'

  // UI and animation refs/state
  const textareaRef = useRef<HTMLTextAreaElement>(null) as React.RefObject<HTMLTextAreaElement>
  const TEXTAREA_MAX_HEIGHT = initialMessages.length > 0 ? 400 : 200
  const [animationScope, animate] = useAnimate()
  const [messageRef, scrollRef] = useSnapScroll()
  const [textareaHeight, setTextareaHeight] = useState(TEXTAREA_MIN_HEIGHT)

  // Auth and session
  const session = useSession()
  const [showSignUpDialog, setShowSignUpDialog] = useState(false)
  const [stepType, setStepType] = useState<'login' | 'signup'>('signup')
  const [pendingAction, setPendingAction] = useState<{
    type: 'send-message' | 'open-company-dialog'
    messageInput?: string
  } | null>(null)

  // Company management
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(companies?.length ? companies[0].id : null)
  const [activeCompany, setActiveCompany] = useState<Company | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Dialog openers
  const companyOpener = useOpener()
  const deleteOpener = useOpener()

  // Navigation and routing
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isUpgradeDialogOpen = searchParams.get('upgrade') === 'true'
  const [chatStarted, setChatStarted] = useState(initialMessages.length > 0)

  // Add the closeUpgradeDialog function
  const closeUpgradeDialog = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('upgrade')
    router.replace(`${pathname}?${params.toString()}`)
  }

  // Global state
  const showChat = chatStore((state) => state.showChat)
  const setKey = chatStore((state) => state.setKey)

  // Prompt enhancement
  const { enhancingPrompt, promptEnhanced, enhancePrompt, resetEnhancer } = usePromptEnhancer()

  renderLogger.trace('Chat')

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

    append({ role: 'user', content: _input })

    setInput('')

    resetEnhancer()

    textareaRef.current?.blur()
  }

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
    <div className="mx-auto w-full">
      {session.data?.user?.id && <Menu />}
      <Header monthlyExportCount={monthlyExportCount} chatStarted={chatStarted} />
      <div className="flex flex-1">
        <>
          <div
            ref={animationScope}
            className="relative mx-auto flex w-full items-center overflow-hidden"
            data-chat-visible={showChat}
          >
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
                {!chatStarted && <ChatIntro />}
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
                        isStreaming={isLoading}
                      />
                    </StickToBottom.Content>
                    <ScrollToBottom textareaHeight={textareaHeight} />

                    <ChatInput
                      textareaRef={textareaRef}
                      input={input}
                      isStreaming={isLoading}
                      enhancingPrompt={enhancingPrompt}
                      promptEnhanced={promptEnhanced}
                      sendMessage={sendMessage}
                      handleInputChange={(event) => {
                        handleInputChange?.(event)
                        if (textareaRef?.current) {
                          setTextareaHeight(textareaRef.current.scrollHeight)
                        }
                      }}
                      handleStop={abort}
                      enhancePrompt={() => {
                        enhancePrompt(input, (input) => {
                          setInput(input)
                          scrollTextArea()
                        })
                      }}
                    />
                  </StickToBottom>
                </div>
                {!chatStarted && (
                  <CompanySection
                    companies={companies}
                    selectedCompanyId={selectedCompanyId}
                    showCompanyDialog={(company) => {
                      setPendingAction({ type: 'open-company-dialog' })
                      if (session.data?.user?.id) {
                        setActiveCompany(company ?? null)
                        companyOpener.open()
                      } else {
                        setShowSignUpDialog(true)
                      }
                    }}
                    handleSelectCompany={handleSelectCompany}
                    handleDeleteCompany={handleDeleteCompany}
                  />
                )}
              </div>
              {chatStarted && (
                <div className="w-full min-w-[920px] flex-1">
                  <Workspace chatStarted={chatStarted} isStreaming={isLoading} />
                </div>
              )}
            </div>
          </div>

          <AuthDialog
            open={showSignUpDialog}
            onClose={() => setShowSignUpDialog(false)}
            stepType={stepType}
            onSwitchType={(type) => setStepType(type)}
          />

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

          <DeleteCompanyDialog
            open={deleteOpener.isOpen}
            onClose={() => {
              deleteOpener.close()
              setActiveCompany(null)
            }}
            company={activeCompany}
            isDeleting={isDeleting}
            onConfirmDelete={confirmDeleteCompany}
          />
        </>

        <ChatToastContainer />
      </div>
    </div>
  )
}
