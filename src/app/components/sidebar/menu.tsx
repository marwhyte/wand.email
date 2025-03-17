'use client'

import { Dialog, DialogButton, DialogDescription, DialogTitle } from '@components/dialogs/dialog'
import { motion, type Variants } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { deleteChat } from '@/lib/database/queries/chats'
import { Chat } from '@/lib/database/types'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { cubicEasingFn } from '@/lib/utils/easings'
import { fetcher, truncate } from '@/lib/utils/misc'
import { SparklesIcon, StarIcon } from '@heroicons/react/24/solid'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import Loading from '../loading'
import { usePlan } from '../payment/plan-provider'
import { Text } from '../text'
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
  const menuRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState<DialogContent>(null)
  const session = useSession()
  const { plan, setUpgradeDialogOpen } = usePlan()
  const isPremium = plan !== 'free'
  const router = useRouter()

  const handleUpgradeClick = () => {
    setUpgradeDialogOpen(true)
    setOpen(false)
    router.push('/')
  }

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
    <motion.div
      ref={menuRef}
      initial="closed"
      animate={open ? 'open' : 'closed'}
      variants={menuVariants}
      className="fixed top-0 z-50 flex h-full w-[350px] flex-col rounded-r-3xl border-r border-gray-100 bg-gray-50 text-sm shadow-xl"
    >
      <div className="mt-20 flex h-[var(--header-height)] items-center">{/* Placeholder */}</div>
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
        <div className="my-2 pl-6 pr-5 font-medium">Your Chats</div>
        <div className="flex-1 overflow-scroll pb-5 pl-4 pr-5">
          {loading && (
            <div className="mt-5 flex justify-center">
              <Loading />
            </div>
          )}
          {list.length === 0 && !loading && <div className="pl-2 text-gray-500">No previous conversations</div>}
          {binDates(list).map(({ category, items }) => (
            <div key={category} className="mt-4 space-y-1 first:mt-0">
              <div className="z-1 sticky top-0 pb-1 pl-2 pt-2 text-gray-500">{category}</div>
              {items
                // .filter((item) => item.title)
                .map((item) => (
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

        <div className="border-t border-gray-200 p-4">
          {!isPremium && (
            <div className="mb-2 space-y-0.5 text-center">
              <button
                onClick={handleUpgradeClick}
                type="button"
                className="mb-2 me-2 rounded-lg bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-red-400"
              >
                Upgrade to Premium
              </button>
            </div>
          )}
          <div className="mb-2 space-y-0.5 text-center">
            <Text className="font-bold text-gray-500">Signed in as</Text>
            <Text className="text-gray-600">{truncate(session.data?.user?.email || '', 30)}</Text>
            {isPremium && (
              <Text className="text-xs font-medium text-blue-600">
                <StarIcon className="mr-0.5 inline-block h-3 w-3" />
                Premium Plan
              </Text>
            )}
          </div>
          <button
            onClick={() => signOut()}
            className="w-full rounded-md bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200"
          >
            Sign out
          </button>
        </div>
      </div>
    </motion.div>
  )
}
