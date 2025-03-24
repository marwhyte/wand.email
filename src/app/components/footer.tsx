'use client'
import { useEmailStore } from '@/lib/stores/emailStore'
import Link from 'next/link'
import SocialIcons from './social-icons'

export function Footer() {
  const { email } = useEmailStore()

  if (email) return

  return (
    <footer className="flex items-center justify-end gap-4 px-4 py-4 text-sm text-gray-600">
      <SocialIcons />

      <span className="hidden md:inline">•</span>
      <Link href="mailto:support@wand.email" className="hidden hover:text-gray-900 md:inline">
        Help Center
      </Link>
      <span>•</span>
      <Link href="/tos.html" className="hover:text-gray-900">
        Terms
      </Link>
      <span>•</span>
      <Link href="/privacy.html" className="hover:text-gray-900">
        Privacy
      </Link>
    </footer>
  )
}
