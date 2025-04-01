'use client'

import { generateTitleFromUserMessage } from '@/app/(chat)/actions'
import { useIsMobile, useOpener, usePromptEnhancer, useSnapScroll } from '@/app/hooks'
import { useChatHistory } from '@/app/hooks/useChatHistory'
import { useLocalStorage } from '@/app/hooks/useLocalStorage'
import { useMessageParser } from '@/app/hooks/useMessageParser'
import { updateChat } from '@/lib/database/queries/chats'
import { deleteCompany } from '@/lib/database/queries/companies'
import { Chat as ChatType, Company } from '@/lib/database/types'
import { useAuthStore } from '@/lib/stores/authStore'
import { chatStore } from '@/lib/stores/chat'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { cubicEasingFn } from '@/lib/utils/easings'
import { generateEmailScript } from '@/lib/utils/email-script-generator'
import { createScopedLogger, renderLogger } from '@/lib/utils/logger'
import { classNames, fetcher } from '@/lib/utils/misc'
import { Message, useChat } from '@ai-sdk/react'
import { Header } from '@components/header'
import {
  ArrowDownCircleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  NewspaperIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/solid'
import { useAnimate } from 'motion/react'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom'
import { v4 as uuidv4 } from 'uuid'
import { BackgroundGradients } from '../background-gradients'
import { Button } from '../button'
import CompanyDialog from '../dialogs/company-dialog'
import { DeleteCompanyDialog } from '../dialogs/delete-company-dialog'
import { MobileWarningDialog } from '../dialogs/mobile-warning-dialog'
import UpgradeDialog from '../dialogs/upgrade-dialog'
import Workspace from '../email-workspace/email-workspace'
import { Menu } from '../sidebar/menu'
import { ChatInput } from './chat-input'
import { ChatIntro } from './chat-intro'
import { CompanySection } from './company-section'
import { Messages } from './messages'

const logger = createScopedLogger('Chat')

type Props = {
  id: string
  chat?: ChatType
  chatCompany?: Company | null
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

export function Chat({ id, chatCompany, initialMessages, chat }: Props) {
  // Add email store access
  const { email, setEmail } = useEmailStore()

  const session = useSession()

  const { data: monthlyExportCount } = useSWR<number | null>(
    session?.data?.user?.id ? '/api/exports/count' : null,
    fetcher,
    {
      fallbackData: null,
    }
  )

  const { data: companies } = useSWR<Company[]>(session?.data?.user?.id ? '/api/companies' : null, fetcher, {
    fallbackData: [],
  })

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
      companyDescription: company?.description,
      companyAddress: company?.address,
      emailType: email?.type,
    },
    onFinish: () => {
      logger.debug('Finished streaming')
      mutate('/api/history')
    },
    onError: (error) => {
      console.log('error', error)
      if (error.message.includes('Rate limit exceeded.')) {
        setRateLimitError("You've reached the message limit. Please try again later.")
      }
    },
    initialMessages,
  })

  const messagesWithoutSystem = messages.filter((m) => m.role !== 'system')

  const latestAssistantMessage = messagesWithoutSystem.findLast((m) => m.role === 'assistant')
  useMessageParser(latestAssistantMessage ?? { role: 'assistant', content: '', id: '' })

  const isLoading = status === 'streaming' || status === 'submitted'

  console.log(chat)

  // UI and animation refs/state
  const textareaRef = useRef<HTMLTextAreaElement>(null) as React.RefObject<HTMLTextAreaElement>
  const TEXTAREA_MAX_HEIGHT = initialMessages.length > 0 ? 400 : 200
  const [animationScope, animate] = useAnimate()
  const [messageRef, scrollRef] = useSnapScroll()
  const [textareaHeight, setTextareaHeight] = useState(TEXTAREA_MIN_HEIGHT)

  // Auth and session

  const [pendingAction, setPendingAction] = useState<{
    type: 'send-message' | 'open-company-dialog' | 'enhance-prompt'
    messageInput?: string
  } | null>(null)

  // Company management
  const [activeCompany, setActiveCompany] = useState<Company | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { showSignUpDialog, setShowSignUpDialog, stepType, setStepType } = useAuthStore()

  // Dialog openers
  const companyOpener = useOpener()
  const deleteOpener = useOpener()
  const mobileWarningOpener = useOpener()

  // Check if on mobile
  const isMobile = useIsMobile()

  // Add localStorage hook to track if mobile warning has been shown this session
  const [mobileWarningSeen, setMobileWarningSeen] = useLocalStorage('mobile-warning-seen', false)

  // Store pending message to be sent after mobile warning confirmation
  const [pendingMessage, setPendingMessage] = useState<string | undefined>()

  const { chatStarted, setChatStarted } = useChatStore()

  useEffect(() => {
    setChatStarted(initialMessages.length > 0)
  }, [])

  // Global state
  const showChat = chatStore((state) => state.showChat)
  const setKey = chatStore((state) => state.setKey)

  // Prompt enhancement
  const { enhancingPrompt, promptEnhanced, enhancePrompt, resetEnhancer } = usePromptEnhancer()

  // Add a state for content loading
  const [contentReady, setContentReady] = useState(false)

  // Add state for mobile view toggle
  const [showEmailPreview, setShowEmailPreview] = useState(false)

  // Add a new state to track if we've received an assistant message
  const [hasReceivedAssistantMessage, setHasReceivedAssistantMessage] = useState(false)

  // Add a state to track if this is the first assistant message
  const [isFirstAssistantMessageComplete, setIsFirstAssistantMessageComplete] = useState(
    initialMessages.filter((m) => m.role === 'assistant').length > 0
  )

  // Add a ref for the main container
  const containerRef = useRef<HTMLDivElement>(null)

  // Add a state to track the input container height
  const [inputContainerHeight, setInputContainerHeight] = useState(110)
  const inputContainerRef = useRef<HTMLDivElement>(null)

  // Add effect to measure the actual height of the input container
  useEffect(() => {
    if (!isMobile || !chatStarted) return

    const updateInputHeight = () => {
      if (inputContainerRef.current) {
        const height = inputContainerRef.current.offsetHeight
        setInputContainerHeight(height + 20) // Add a small buffer
      }
    }

    // Set up ResizeObserver to detect height changes
    const resizeObserver = new ResizeObserver(updateInputHeight)
    if (inputContainerRef.current) {
      resizeObserver.observe(inputContainerRef.current)
    }

    // Initial measurement
    updateInputHeight()

    // Also update when window resizes
    window.addEventListener('resize', updateInputHeight)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateInputHeight)
    }
  }, [isMobile, chatStarted, input.length, textareaHeight])

  // Add useEffect to handle viewport height on mobile
  useEffect(() => {
    if (!isMobile) return

    function updateContainerHeight() {
      // Set a custom property for the visible viewport height
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    }

    // Initial update
    updateContainerHeight()

    // Update on resize and orientation change
    window.addEventListener('resize', updateContainerHeight)
    window.addEventListener('orientationchange', updateContainerHeight)

    return () => {
      window.removeEventListener('resize', updateContainerHeight)
      window.removeEventListener('orientationchange', updateContainerHeight)
    }
  }, [isMobile])

  renderLogger.trace('Chat')

  useEffect(() => {
    if (chat) return // Early return if chat exists

    // Only update company if necessary to avoid infinite loops
    if (companies?.length && !company) {
      setCompany(companies[0])
    } else if (!companies?.length && company) {
      // Only clear company if companies is empty and we have a company set
      setCompany(undefined)
    } else if (company && companies?.length && !companies.find((c) => c.id === company.id)) {
      // Only clear company if it no longer exists in the companies list
      setCompany(undefined)
    }
  }, [companies, company, chat])

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

  // Change the localStorage key based on whether chat has started
  const [localStorageInput, setLocalStorageInput] = useLocalStorage(chatStarted ? `chat-input-${id}` : 'input', '')

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || ''
      setInput(finalValue)
    }
    // Add id to dependencies to re-run when chat changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    setLocalStorageInput(input)
  }, [input, setLocalStorageInput])

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

    // Check if on mobile and show warning dialog before sending
    // Only show warning if it hasn't been seen this session
    if (isMobile && !chatStarted && !mobileWarningSeen) {
      setPendingMessage(_input)
      mobileWarningOpener.open()
      return
    }

    // Continue with normal message sending
    sendMessageImpl(_input)
  }

  // Actual implementation of message sending
  const sendMessageImpl = async (_input: string) => {
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
      mutate('/api/companies')
      setActiveCompany(null)
    } catch (error) {
    } finally {
      setIsDeleting(false)

      setCompany(undefined)

      setActiveCompany(null)

      deleteOpener.close()
    }
  }

  const handleSelectCompany = (company: Company) => {
    setCompany(company)
  }

  const examplePrompts = [
    {
      label: 'Newsletter',
      prompt: 'Create a newsletter for my monthly technology updates',
      icon: NewspaperIcon,
    },
    {
      label: 'Welcome',
      prompt:
        'Create a welcome series for new customers that introduces our product features, shares success stories, and offers a special first-time discount',
      icon: EnvelopeIcon,
    },
    {
      label: 'E-commerce',
      prompt:
        'Create a promotional email for our summer sale featuring 3 product categories with images, prices, and "Shop Now" buttons for each item',
      icon: ShoppingCartIcon,
    },
    {
      label: 'Transactional',
      prompt:
        'Create a password reset email with a secure link, clear instructions, and a security notice about link expiration',
      icon: DocumentTextIcon,
    },
    {
      label: 'Cart',
      prompt:
        'Create a cart abandonment email with a 15% discount code, showing the abandoned items and emphasizing limited-time offer',
      icon: ShoppingCartIcon,
    },
  ]

  // A more reliable implementation of the text streaming function
  const streamTextToInput = (text: string) => {
    // Clear the input first
    setInput('')

    let currentIndex = 0
    const fullText = text // Store the complete target text

    // We'll stream a portion of the text in each interval
    const streamNextChunk = () => {
      const chunk = fullText.substring(0, currentIndex + 1)
      setInput(chunk)

      currentIndex++

      if (currentIndex < fullText.length) {
        setTimeout(streamNextChunk, 15)
      } else {
        // Streaming complete
        textareaRef.current?.focus()

        // Check if on mobile and show warning dialog for example prompts
        // Only show warning if it hasn't been seen this session
        if (isMobile && !chatStarted && !mobileWarningSeen) {
          setPendingMessage(fullText)
        }
      }
    }

    // Start the streaming process
    streamNextChunk()
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

  useEffect(() => {
    // Only run when status changes from 'streaming' to 'idle'
    if (status === 'ready' && latestAssistantMessage) {
      if (!isFirstAssistantMessageComplete) {
        // First assistant message just completed
        setIsFirstAssistantMessageComplete(true)

        // Automatically switch to preview when the first assistant message completes
        if (isMobile && chatStarted) {
          setShowEmailPreview(true)
        }
      } else {
        // Subsequent messages - only switch when they complete (status becomes idle)
        if (isMobile && chatStarted) {
          setShowEmailPreview(true)
        }
      }
    }
  }, [status, latestAssistantMessage, isMobile, chatStarted, isFirstAssistantMessageComplete])

  // Add state for rate limit error
  const [rateLimitError, setRateLimitError] = useState<string | null>(null)

  // Clear rate limit error when input changes
  useEffect(() => {
    setRateLimitError(null)
  }, [input])

  return (
    <div ref={containerRef} className="mx-auto flex h-full w-full flex-col overflow-hidden">
      {session?.data?.user && <Menu />}
      <BackgroundGradients inputDisabled={chatStarted} />
      <Header monthlyExportCount={monthlyExportCount ?? null} chatStarted={chatStarted} />
      <div className="flex flex-1 overflow-hidden">
        <>
          {isMobile && chatStarted && (
            <>
              {isFirstAssistantMessageComplete ? (
                <div className="fixed left-1/2 top-14 z-20 flex -translate-x-1/2 transform rounded-lg bg-white/90 p-1 shadow-lg backdrop-blur-sm">
                  <div className="relative flex">
                    <div
                      className="absolute h-full rounded-md bg-purple-600 transition-all duration-300"
                      style={{
                        width: '50%',
                        transform: showEmailPreview ? 'translateX(100%)' : 'translateX(0)',
                        top: 0,
                        left: 0,
                        zIndex: 0,
                      }}
                    />
                    <Button
                      plain
                      size="small"
                      onClick={() => setShowEmailPreview(false)}
                      className="relative z-10 min-w-[80px]"
                    >
                      <span
                        className={`flex items-center transition-colors duration-300 ${!showEmailPreview ? 'text-white' : 'text-gray-600'}`}
                      >
                        <ChatBubbleLeftRightIcon className="mr-1 h-4 w-4" />
                        Chat
                      </span>
                    </Button>
                    <Button
                      plain
                      size="small"
                      onClick={() => setShowEmailPreview(true)}
                      className="relative z-10 min-w-[80px]"
                    >
                      <span
                        className={`flex items-center transition-colors duration-300 ${showEmailPreview ? 'text-white' : 'text-gray-600'}`}
                      >
                        <DocumentTextIcon className="mr-1 h-4 w-4" />
                        Preview
                      </span>
                    </Button>
                  </div>
                </div>
              ) : // Show loading indicator or nothing while waiting for first message
              null}
            </>
          )}
          <div
            ref={animationScope}
            className="relative mx-auto flex h-full w-full items-center overflow-hidden"
            data-chat-visible={showChat}
          >
            <div
              className={classNames(`flex h-full w-full justify-center`, {
                '-mb-2': chatStarted,
                'mt-[3vh] px-4 sm:mt-[7vh] sm:px-0': !chatStarted,
              })}
            >
              <div
                className={classNames('flex h-full shrink-0 flex-col', {
                  'border-r border-gray-200': chatStarted && !isMobile,
                  'w-full sm:w-[370px] sm:min-w-[370px] sm:max-w-[370px] wide:w-[420px] wide:min-w-[420px] wide:max-w-[420px]':
                    chatStarted,
                  'w-full max-w-[600px]': !chatStarted,
                  hidden: chatStarted && isMobile && showEmailPreview,
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
                      'h-[calc(100vh-95px)]': chatStarted && !isMobile,
                      'h-[calc(100vh-140px)]': chatStarted && isMobile,
                      'h-[calc(var(--vh, 1vh) * 100 - 140px)]': chatStarted && isMobile,
                      'pl-[30px]': chatStarted && !isMobile,
                    })}
                    resize="smooth"
                    initial="instant"
                  >
                    <StickToBottom.Content
                      className={classNames(
                        'relative flex-grow overflow-auto px-4 pt-4',
                        isMobile && chatStarted ? '' : 'pb-4' // Remove fixed padding, we'll use style
                      )}
                      style={isMobile && chatStarted ? { paddingBottom: `${inputContainerHeight}px` } : {}}
                    >
                      <AutoScroller input={input} />
                      <div style={{ opacity: contentReady ? 1 : 0, transition: 'opacity 0.1s' }}>
                        <Messages
                          ref={messageRef}
                          className={classNames('z-1 mx-auto flex h-full w-full max-w-[552px] flex-col', {})}
                          messages={messagesWithoutSystem}
                          isStreaming={isLoading}
                        />
                      </div>
                    </StickToBottom.Content>
                    <ScrollToBottom textareaHeight={textareaHeight} />

                    <div
                      ref={inputContainerRef}
                      className={classNames(
                        'px-0 sm:px-4',
                        isMobile && chatStarted
                          ? 'fixed bottom-0 left-0 right-0 z-50 bg-white/95 pt-2 shadow-lg backdrop-blur'
                          : 'relative z-10'
                      )}
                      style={
                        isMobile && chatStarted
                          ? {
                              paddingBottom: 'env(safe-area-inset-bottom, 16px)',
                            }
                          : {}
                      }
                    >
                      {rateLimitError && <div className="mb-2 text-center text-sm text-red-500">{rateLimitError}</div>}
                      <ChatInput
                        chatStarted={chatStarted}
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
                    className="relative mx-auto mt-8 flex w-full max-w-xl flex-wrap justify-center gap-2 px-0 sm:px-0"
                  >
                    {examplePrompts.map((examplePrompt, index) => {
                      const Icon = examplePrompt.icon
                      return (
                        <button
                          key={index}
                          className="group relative mb-2 inline-flex h-8 items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold shadow transition-colors hover:bg-gray-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 disabled:pointer-events-none disabled:opacity-50"
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
                <div
                  className={classNames('w-full overflow-auto', {
                    hidden: isMobile && !showEmailPreview,
                  })}
                >
                  <Workspace isStreaming={isLoading} />
                </div>
              )}
            </div>

            <MobileWarningDialog
              isOpen={mobileWarningOpener.isOpen}
              onClose={mobileWarningOpener.close}
              onConfirm={() => {
                mobileWarningOpener.close()
                // Mark the warning as seen when confirmed
                setMobileWarningSeen(true)
                if (pendingMessage) {
                  sendMessageImpl(pendingMessage)
                  setPendingMessage(undefined)
                }
              }}
            />

            <CompanyDialog
              company={activeCompany}
              isOpen={companyOpener.isOpen}
              onClose={companyOpener.close}
              onSuccess={(updatedCompany) => {
                companyOpener.close()
                setActiveCompany(null)
                setCompany(updatedCompany)
                mutate('/api/companies')
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
          </div>
        </>
      </div>
    </div>
  )
}
