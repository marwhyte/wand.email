'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import TemplateCard from '../components/email-workspace/template-card'

export default function TemplatesPage() {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    const value = localStorage.getItem('postSignUpRedirectTo')

    if (session.data?.user && value) {
      localStorage.removeItem('postSignUpRedirectTo')
      router.push(value)
    }
  }, [session, router])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <TemplateCard
          href="/templates/going"
          image="/going/going-logo.png"
          title="Going"
          description="Marketing emails for flight deals"
        />
      </ul>
    </div>
  )
}
