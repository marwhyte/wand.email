'use client'

import { doGoogleLogin } from '@/app/actions/authentication'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function SignInPopUpPage() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (!(status === 'loading') && !session) {
      doGoogleLogin()
    }
    if (session) {
      window.opener?.postMessage('signInComplete', window.location.origin)
      window.close()
    }
  }, [session, status])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        left: 0,
        top: 0,
        background: 'white',
      }}
    />
  )
}
