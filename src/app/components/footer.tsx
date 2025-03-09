'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import SocialIcons from './social-icons'

export function Footer() {
  const searchParams = useSearchParams()
  const chatStarted = searchParams.get('id')

  if (chatStarted) {
    return null
  }

  return (
    <footer className="flex items-center justify-end gap-4 px-4 py-4 text-sm text-gray-600">
      <SocialIcons />

      <span>•</span>
      <Link href="/help" className="hover:text-gray-900">
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
