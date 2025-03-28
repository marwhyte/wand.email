'use client'

import { Dialog, DialogButton, DialogDescription, DialogTitle } from '@components/dialogs/dialog'
import { motion, type Variants } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { useIsMobile, useOpener } from '@/app/hooks'
import { deleteChat } from '@/lib/database/queries/chats'
import { Chat } from '@/lib/database/types'
import { useAccountStore } from '@/lib/stores/accountStore'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { cubicEasingFn } from '@/lib/utils/easings'
import { fetcher, truncate } from '@/lib/utils/misc'
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  ChatBubbleBottomCenterTextIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  ViewColumnsIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Cog6ToothIcon, SparklesIcon, StarIcon } from '@heroicons/react/24/solid'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import AccountDialog from '../dialogs/account-dialog'
import FeedbackDialog from '../dialogs/feedback-dialog'
import Loading from '../loading'
import { usePlan } from '../payment/plan-provider'
import { Text } from '../text'
import { UserAvatar } from '../user-avatar'
import { binDates } from './date-binning'
import { HistoryItem } from './history-item'

const menuVariants = {
  closed: {
    opacity: 0,
    visibility: 'hidden',
    left: '-150px',
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
  open: {
    opacity: 1,
    visibility: 'initial',
    left: 0,
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
} satisfies Variants

type DialogContent = { type: 'delete'; item: Chat } | null

export function Menu() {
  const { setEmail } = useEmailStore()
  const { setTitle } = useChatStore()
  const { setShowAccountDialog, setStepType, showAccountDialog } = useAccountStore()
  const feedbackOpener = useOpener()
  const menuRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState<DialogContent>(null)
  const manualToggledRef = useRef(false)
  const session = useSession()

  // Use the isMobile hook
  const isMobile = useIsMobile()

  const { plan, setUpgradeDialogOpen } = usePlan()
  const isPremium = plan && plan !== 'free'
  const router = useRouter()

  const closeDialog = () => {
    setDialogContent(null)
  }

  const {
    data: list = [],
    isLoading: loading,
    mutate,
  } = useSWR<Array<Chat>>('/api/history', fetcher, {
    fallbackData: [],
  })

  const handleDelete = async (chatId: string) => {
    try {
      const success = await deleteChat(chatId)
      if (success) {
        mutate(
          list.filter((chat) => chat.id !== chatId),
          false
        )
      }
      closeDialog()
    } catch (error) {
      closeDialog()
    }
  }

  useEffect(() => {
    if (open) {
      mutate()

      // Prevent body scrolling when menu is open on mobile
      if (isMobile) {
        document.body.style.overflow = 'hidden'
      }
    } else {
      // Restore body scrolling when menu is closed
      if (isMobile) {
        document.body.style.overflow = ''
      }
    }

    // Clean up when component unmounts
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, mutate, isMobile])

  useEffect(() => {
    // Only add hover detection on desktop
    if (isMobile) return

    const enterThreshold = 40
    const exitThreshold = 40

    function onMouseMove(event: MouseEvent) {
      // Auto-open menu with mouse movement only if it wasn't manually controlled recently
      if (event.pageX < enterThreshold && !manualToggledRef.current) {
        setOpen(true)
      }

      if (menuRef.current && event.clientX > menuRef.current.getBoundingClientRect().right + exitThreshold) {
        setOpen(false)
        // Reset manual toggle state when mouse moves far enough away
        manualToggledRef.current = false
      }
    }

    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [isMobile])

  // Add a new effect to handle clicking outside to close the menu on mobile
  useEffect(() => {
    if (!isMobile || !open) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Don't close if the click was on the toggle button (that's handled separately)
      const toggleButton = document.querySelector('[aria-label="Close menu"], [aria-label="Open menu"]')
      if (toggleButton && toggleButton.contains(event.target as Node)) {
        return
      }

      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isMobile, open])

  // Add a ref to track when the last toggle occurred to prevent immediate reopening
  const lastToggleTimeRef = useRef(0)

  // Function to toggle the menu open/closed
  const toggleMenu = (event?: React.MouseEvent) => {
    // Stop propagation to prevent the click from being captured by other handlers
    event?.stopPropagation()

    // Prevent rapid toggling by checking time since last toggle
    const now = Date.now()
    if (now - lastToggleTimeRef.current < 300) {
      return // Ignore clicks that happen too soon after the last one
    }

    lastToggleTimeRef.current = now
    manualToggledRef.current = true
    setOpen(!open)
  }

  return (
    <div>
      {/* Mobile menu toggle button - only show on mobile */}
      {isMobile && (
        <button
          onClick={toggleMenu}
          className="fixed left-4 top-4 z-[51] rounded-md bg-white p-2 shadow-md"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <XMarkIcon className="h-6 w-6 text-gray-600" /> : <Bars3Icon className="h-6 w-6 text-gray-600" />}
        </button>
      )}

      <motion.div
        ref={menuRef}
        initial="closed"
        animate={open ? 'open' : 'closed'}
        variants={menuVariants}
        className="fixed top-0 z-50 flex h-full w-[350px] flex-col rounded-r-3xl border-r border-gray-100 bg-gray-50 text-sm shadow-xl"
        onTouchMove={(e) => isMobile && open && e.stopPropagation()}
      >
        <div className="mt-16 flex h-[var(--header-height)] items-center">{/* Placeholder */}</div>
        <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
          <div className="p-4">
            <Link
              onClick={() => {
                setEmail(null)
                setTitle(undefined)
                // Close menu on mobile after navigation
                if (isMobile) {
                  setOpen(false)
                }
              }}
              href="/"
              className="flex items-center gap-2 rounded-md bg-blue-50 p-2 font-bold text-blue-500 transition-colors hover:bg-blue-100"
            >
              <span className="inline-block h-5 w-5 scale-110 transform text-current">
                <SparklesIcon className="h-5 w-5" />
              </span>
              Start new chat
            </Link>
          </div>
          <div className="my-2 pl-7 pr-5 font-medium">Your Chats</div>
          <div className="flex-1 overflow-scroll pb-5 pl-5 pr-5">
            {loading && (
              <div className="mt-5 flex justify-center">
                <Loading />
              </div>
            )}
            {list.length === 0 && !loading && <div className="pl-2 text-gray-500">No previous conversations</div>}
            {binDates(list).map(({ category, items }) => (
              <div key={category} className="mt-4 space-y-1 first:mt-0">
                <div className="sticky top-0 z-10 bg-gray-50 pb-1 pl-2 pt-2 text-gray-500">{category}</div>
                {items.map((item) => (
                  <HistoryItem key={item.id} item={item} onDelete={() => setDialogContent({ type: 'delete', item })} />
                ))}
              </div>
            ))}
            <Dialog open={dialogContent !== null} onClose={closeDialog}>
              {dialogContent?.type === 'delete' && (
                <>
                  <DialogTitle>Delete Chat?</DialogTitle>
                  <DialogDescription>
                    <div>
                      <p>
                        You are about to delete <strong>{dialogContent.item.title}</strong>.
                      </p>
                      <p className="mt-1">Are you sure you want to delete this chat?</p>
                    </div>
                  </DialogDescription>
                  <div className="flex justify-end gap-2 bg-gray-200 px-5 pb-4">
                    <DialogButton type="secondary" onClick={closeDialog}>
                      Cancel
                    </DialogButton>
                    <DialogButton
                      type="danger"
                      onClick={() => {
                        if (dialogContent?.item) {
                          handleDelete(dialogContent.item.id)
                        }
                      }}
                    >
                      Delete
                    </DialogButton>
                  </div>
                </>
              )}
            </Dialog>
          </div>

          <div className="flex flex-col gap-2 border-t border-gray-200 bg-white p-3">
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-gray-600 transition-colors hover:bg-gray-100"
            >
              <ArrowRightStartOnRectangleIcon className="w-5" />
              Sign out
            </button>
            <button
              onClick={() => {
                setStepType('general')
                setShowAccountDialog(true)
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-gray-600 transition-colors hover:bg-gray-100"
            >
              <Cog6ToothIcon className="w-5" />
              Settings
            </button>
            <button
              onClick={() => {
                setStepType('subscription')
                setShowAccountDialog(true)
              }}
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-gray-600 transition-colors hover:bg-gray-100"
            >
              <CreditCardIcon className="w-5" />
              Manage subscription
            </button>
            <Link
              href="mailto:support@wand.email"
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-gray-600 transition-colors hover:bg-gray-100"
            >
              <QuestionMarkCircleIcon className="w-5" />
              Contact support
            </Link>
            <button
              onClick={() => {
                feedbackOpener.open()
              }}
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-gray-600 transition-colors hover:bg-gray-100"
            >
              <ChatBubbleBottomCenterTextIcon className="w-5" />
              Provide feedback
            </button>
          </div>

          <div className="border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4 p-4">
              <UserAvatar size={32} />
              <div>
                <Text className="text-gray-600">{truncate(session.data?.user?.email || '', 30)}</Text>
                {isPremium ? (
                  <Text className="text-xs font-medium text-blue-600">
                    <StarIcon className="mr-0.5 inline-block h-3 w-3 !text-yellow-500" />
                    Premium Plan
                  </Text>
                ) : (
                  <Text className="text-xs font-medium text-gray-600">Free Plan</Text>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Only show this on desktop (hide on mobile) */}
      {!isMobile && (
        <div className="fixed bottom-3 left-3 z-40 flex flex-col items-center gap-2">
          <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
          <UserAvatar size={24} />

          <ViewColumnsIcon className="h-5 w-5" />
        </div>
      )}

      <AccountDialog isOpen={showAccountDialog} onClose={() => setShowAccountDialog(false)} />
      <FeedbackDialog isOpen={feedbackOpener.isOpen} onClose={feedbackOpener.close} />
    </div>
  )
}
