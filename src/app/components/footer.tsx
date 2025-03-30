'use client'

import { useChatStore } from '@/lib/stores/chatStore'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export function Footer() {
  const { chatStarted } = useChatStore()
  const [showInfo, setShowInfo] = useState(false)

  if (chatStarted) return null

  return (
    <footer className="absolute bottom-0 flex w-full items-center justify-end gap-4 px-4 py-4 text-sm text-gray-600">
      <Link href="mailto:support@wand.email" className="hidden hover:text-gray-900 md:inline">
        Support
      </Link>
      <span className="hidden md:inline">•</span>
      <Link href="/tos.html" className="hover:text-gray-900">
        Terms
      </Link>
      <span>•</span>
      <Link href="/privacy.html" className="hover:text-gray-900">
        Privacy
      </Link>

      <div className="relative ml-4" onMouseEnter={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)}>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'easeInOut',
          }}
          className="cursor-pointer"
        >
          <Link href="https://marcowhyte.com" target="_blank" rel="noopener noreferrer">
            <Image
              src="/marco.png"
              alt="Marco Whyte"
              width={50}
              height={50}
              className="rounded-full border-2 border-gray-200 transition-all hover:border-gray-400"
            />
          </Link>
        </motion.div>

        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-full right-0 mb-2 w-64 rounded-lg bg-white p-3 shadow-lg"
          >
            <p className="mb-2 text-sm text-gray-800">
              Hey! I&apos;m Marco, an indie hacker who loves to build AI apps while traveling the world.
            </p>
            <p className="text-sm text-gray-700">
              After battling with email styling across different clients, I built this tool to solve my own frustrations
              and help others create beautiful, consistent, on brand emails without the headache.
            </p>
            <div className="mt-2 text-xs text-blue-600">
              <Link href="https://marcowhyte.com/blog" target="_blank" rel="noopener noreferrer">
                Learn more about me →
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </footer>
  )
}
