'use client'

import { Dialog, DialogButton, DialogDescription, DialogTitle } from '@components/dialogs/dialog'
import { motion, type Variants } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { deleteChat } from '@/lib/database/queries/chats'
import { Chat } from '@/lib/database/types'
import { useAccountStore } from '@/lib/stores/accountStore'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { cubicEasingFn } from '@/lib/utils/easings'
import { fetcher, truncate } from '@/lib/utils/misc'
import {
  ArrowRightStartOnRectangleIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline'
import { Cog6ToothIcon, SparklesIcon, StarIcon } from '@heroicons/react/24/solid'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import AccountDialog from '../dialogs/account-dialog'
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
  const menuRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState<DialogContent>(null)
  const session = useSession()

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
    }
  }, [open, mutate])

  useEffect(() => {
    const enterThreshold = 40
    const exitThreshold = 40

    function onMouseMove(event: MouseEvent) {
      if (event.pageX < enterThreshold) {
        setOpen(true)
      }

      if (menuRef.current && event.clientX > menuRef.current.getBoundingClientRect().right + exitThreshold) {
        setOpen(false)
      }
    }

    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <div>
      <motion.div
        ref={menuRef}
        initial="closed"
        animate={open ? 'open' : 'closed'}
        variants={menuVariants}
        className="fixed top-0 z-50 flex h-full w-[350px] flex-col rounded-r-3xl border-r border-gray-100 bg-gray-50 text-sm shadow-xl"
      >
        <div className="mt-16 flex h-[var(--header-height)] items-center">{/* Placeholder */}</div>
        <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
          <div className="p-4">
            <Link
              onClick={() => {
                setEmail(undefined)
                setTitle(undefined)
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
              onClick={() => {
                setStepType('general')
                setShowAccountDialog(true)
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-gray-600 transition-colors hover:bg-gray-100"
            >
              <Cog6ToothIcon className="w-5" />
              Settings
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
                setStepType('subscription')
                setShowAccountDialog(true)
              }}
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-gray-600 transition-colors hover:bg-gray-100"
            >
              <CreditCardIcon className="w-5" />
              Manage subscription
            </button>

            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100"
            >
              <ArrowRightStartOnRectangleIcon className="w-5" />
              Sign out
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
      <div className="absolute bottom-0 left-0 flex flex-col items-center gap-2 pb-3 pl-3">
        <UserAvatar size={24} />
        <ViewColumnsIcon className="h-5 w-5" />
      </div>
      <AccountDialog isOpen={showAccountDialog} onClose={() => setShowAccountDialog(false)} />
    </div>
  )
}
