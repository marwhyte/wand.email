'use client'

import { generateTitleFromUserMessage } from '@/app/(chat)/actions'
import { usePlan } from '@/app/components/payment/plan-provider'
import { useOpener, usePromptEnhancer, useSnapScroll } from '@/app/hooks'
import { useChatHistory } from '@/app/hooks/useChatHistory'
import { useMessageParser } from '@/app/hooks/useMessageParser'
import { updateChat } from '@/lib/database/queries/chats'
import { deleteCompany } from '@/lib/database/queries/companies'
import { Chat as ChatType, Company } from '@/lib/database/types'
import { chatStore } from '@/lib/stores/chat'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { cubicEasingFn } from '@/lib/utils/easings'
import { generateEmailScript } from '@/lib/utils/email-script-generator'
import { createScopedLogger, renderLogger } from '@/lib/utils/logger'
import { classNames } from '@/lib/utils/misc'
import { Message, useChat } from '@ai-sdk/react'
import { Header } from '@components/header'
import { Menu } from '@components/sidebar/menu'
import {
  ArrowDownCircleIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  NewspaperIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/solid'
import { useAnimate } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { useSWRConfig } from 'swr'
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom'
import { v4 as uuidv4 } from 'uuid'
import { BackgroundGradients } from '../background-gradients'
import { AuthDialog } from '../dialogs/auth-dialog'
import CompanyDialog from '../dialogs/company-dialog'
import { DeleteCompanyDialog } from '../dialogs/delete-company-dialog'
import UpgradeDialog from '../dialogs/upgrade-dialog'
import Workspace from '../email-workspace/email-workspace'
import { ChatToastContainer } from '../toast/chat-toast-container'
import { ChatInput } from './chat-input'
import { ChatIntro } from './chat-intro'
import { CompanySection } from './company-section'
import { Messages } from './messages'

const logger = createScopedLogger('Chat')

type Props = {
  id: string
  chat?: ChatType
  companies: Company[] | null
  chatCompany?: Company | null
  monthlyExportCount: number | null
  initialMessages: Message[]
}

const TEXTAREA_MIN_HEIGHT = 76
const TEXTAREA_MAX_HEIGHT = 200

function AutoScroller({ input }: { input: string }) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext()
  const initialRenderRef = useRef(true)

  useEffect(() => {
    // Skip scrolling on initial render since StickToBottom handles it
    if (initialRenderRef.current) {
      initialRenderRef.current = false
      return
    }

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

export function Chat({ id, companies, chatCompany, monthlyExportCount, initialMessages, chat }: Props) {
  // Add email store access
  const { email } = useEmailStore()

  const { mutate } = useSWRConfig()
  const { setTitle, setCompany, company, title } = useChatStore()
  useChatHistory({ chat: chat, chatId: id, company: chatCompany })

  // Chat state and handlers
  const { messages, status, input, handleInputChange, setInput, stop, append } = useChat({
    id,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: () => {
      return uuidv4()
    },
    body: {
      id,
      companyName: company?.name,
      companyId: company?.id,
      emailType: email?.type,
    },
    onFinish: () => {
      logger.debug('Finished streaming')
      mutate('/api/history')
    },
    initialMessages,
  })

  const messagesWithoutSystem = messages.filter((m) => m.role !== 'system')

  const latestAssistantMessage = messagesWithoutSystem.findLast((m) => m.role === 'assistant')
  useMessageParser(latestAssistantMessage ?? { role: 'assistant', content: '', id: '' })

  const [generatingChangeLog, setGeneratingChangeLog] = useState(false)
  const isLoading = status === 'streaming' || status === 'submitted' || generatingChangeLog

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
    type: 'send-message' | 'open-company-dialog' | 'enhance-prompt'
    messageInput?: string
  } | null>(null)

  // Company management
  const [activeCompany, setActiveCompany] = useState<Company | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Dialog openers
  const companyOpener = useOpener()
  const deleteOpener = useOpener()

  const [chatStarted, setChatStarted] = useState(initialMessages.length > 0)

  // Get upgrade dialog state from plan provider
  const { upgradeDialogOpen, setUpgradeDialogOpen } = usePlan()

  // Global state
  const showChat = chatStore((state) => state.showChat)
  const setKey = chatStore((state) => state.setKey)

  // Prompt enhancement
  const { enhancingPrompt, promptEnhanced, enhancePrompt, resetEnhancer } = usePromptEnhancer()

  // Add a state for content loading
  const [contentReady, setContentReady] = useState(false)

  renderLogger.trace('Chat')

  useEffect(() => {
    if (chat) return

    if (companies?.length && !company) {
      setCompany(companies[0])
    } else if (!companies?.length) {
      setCompany(undefined)
    }
    if (company && !companies?.find((c) => c.id === company.id)) {
      setCompany(undefined)
    }
  }, [companies, company])

  useEffect(() => {
    if (session.data?.user) {
      setShowSignUpDialog(false)
      // Execute pending action after successful authentication
      if (pendingAction) {
        if (pendingAction.type === 'send-message') {
          sendMessage(pendingAction.messageInput)
        } else if (pendingAction.type === 'open-company-dialog') {
          companyOpener.open()
        } else if (pendingAction.type === 'enhance-prompt') {
          enhancePrompt(input, (input) => {
            setInput(input)
            scrollTextArea()
          })
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

    window.history.replaceState({}, '', `/chat/${id}`)

    let messageContent = _input

    setInput('')
    resetEnhancer()
    textareaRef.current?.blur()

    if (email) {
      const emailScript = generateEmailScript(email)
      // Include the current email state with the message
      messageContent = `<email_state>\n${emailScript}\n</email_state>\n\n${_input}`
    }

    // Append the message
    append({ role: 'user', content: messageContent })

    if (!title) {
      const title = await generateTitleFromUserMessage({
        message: _input,
      })

      setTitle(title)

      await updateChat(id, { title })
    }
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
      if (company?.id === activeCompany?.id) {
        setCompany(undefined)
      }

      setActiveCompany(null)

      deleteOpener.close()
    }
  }

  const handleSelectCompany = (company: Company) => {
    setCompany(company)
  }

  const examplePrompts = [
    {
      label: 'Welcome',
      prompt: 'I want to create a welcome series for my new customers',
      icon: EnvelopeIcon,
    },
    {
      label: 'E-commerce',
      prompt: 'I want to create an email for my ecommerce store',
      icon: ShoppingCartIcon,
    },
    {
      label: 'Transactional',
      prompt: 'I want to create a transactional email for my business',
      icon: DocumentTextIcon,
    },
    {
      label: 'Newsletter',
      prompt: 'I want to create a newsletter for my business',
      icon: NewspaperIcon,
    },
    {
      label: 'Cart',
      prompt: 'I want to create an invoice for my business',
      icon: ShoppingCartIcon,
    },
  ]

  // A more reliable implementation of the text streaming function
  const streamTextToInput = (text: string) => {
    // Clear the input first
    setInput('')

    let fullText = ''
    let currentIndex = 0

    // Set up an interval to add characters one by one
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        // Build the string directly without depending on previous state
        fullText += text[currentIndex]
        setInput(fullText)
        currentIndex++
      } else {
        clearInterval(interval)
        // Focus the textarea after streaming
        textareaRef.current?.focus()
      }
    }, 15)
  }

  // Add an effect to delay showing content until positioning is complete
  useEffect(() => {
    if (initialMessages.length > 0) {
      // Use a short timeout to ensure scroll positioning is complete
      const timer = setTimeout(() => {
        setContentReady(true)
      }, 100)

      return () => clearTimeout(timer)
    } else {
      setContentReady(true)
    }
  }, [initialMessages.length])

  return (
    <div className="mx-auto w-full">
      <BackgroundGradients inputDisabled={chatStarted} />
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
                'mt-[3vh] px-4 sm:mt-[7vh] sm:px-0': !chatStarted,
              })}
            >
              <div
                className={classNames('flex shrink-0 flex-col', {
                  'border-r border-gray-200': chatStarted,
                  'w-full sm:w-[370px] sm:min-w-[370px] sm:max-w-[370px]': chatStarted,
                  'w-full max-w-[500px]': !chatStarted,
                })}
              >
                {!chatStarted && <ChatIntro />}
                <div
                  className={classNames('', {
                    'flex flex-col': chatStarted,
                  })}
                >
                  <StickToBottom
                    className={classNames('relative flex flex-col justify-end', {
                      'h-[calc(100vh-100px)]': chatStarted,
                    })}
                    resize="smooth"
                    initial="instant"
                  >
                    <StickToBottom.Content className="relative flex-grow overflow-auto px-4 pt-4">
                      <AutoScroller input={input} />
                      <div style={{ opacity: contentReady ? 1 : 0, transition: 'opacity 0.1s' }}>
                        <Messages
                          ref={messageRef}
                          className="z-1 mx-auto flex h-full w-full max-w-[552px] flex-col pb-3"
                          messages={messagesWithoutSystem}
                          isStreaming={isLoading}
                        />
                      </div>
                    </StickToBottom.Content>
                    <ScrollToBottom textareaHeight={textareaHeight} />

                    <div className="px-0 sm:px-4">
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
                          if (!session.data?.user?.id) {
                            setPendingAction({ type: 'enhance-prompt', messageInput: input })
                            setShowSignUpDialog(true)
                            return
                          }

                          enhancePrompt(input, (input) => {
                            setInput(input)
                            scrollTextArea()
                          })
                        }}
                      />
                    </div>
                  </StickToBottom>
                </div>
                {!chatStarted && (
                  <div
                    id="examples"
                    className="max-w-l relative mt-8 flex w-full flex-wrap justify-center gap-2 px-0 sm:px-4"
                  >
                    {examplePrompts.map((examplePrompt, index) => {
                      const Icon = examplePrompt.icon
                      return (
                        <button
                          key={index}
                          className="group relative mb-2 inline-flex h-8 items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium shadow transition-colors hover:bg-gray-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 disabled:pointer-events-none disabled:opacity-50"
                          style={{ color: 'rgb(82,82,82)' }}
                          onClick={() => streamTextToInput(examplePrompt.prompt)}
                        >
                          <div className="absolute inset-x-0 -top-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <Icon className="mr-1.5 h-3.5 w-3.5" style={{ color: 'rgb(82,82,82)' }} />
                          {examplePrompt.label}
                        </button>
                      )
                    })}
                  </div>
                )}
                {!chatStarted && (
                  <CompanySection
                    companies={companies}
                    selectedCompany={company}
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
                <div className="w-full overflow-auto">
                  <Workspace isStreaming={isLoading} />
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

          <UpgradeDialog />

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

          <ChatToastContainer />
        </>
      </div>
    </div>
  )
}
