'use client'

import { doGoogleLogin } from '@/app/actions/authentication'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function SignInPopUpPage() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (!(status === 'loading')) {
      if (!session) {
        try {
          doGoogleLogin()
        } catch (error) {
          if (window.opener) {
            window.opener.postMessage({ error: error }, window.location.origin)
            window.close()
          }
        }
      }
      if (session) {
        if (window.opener) {
          window.opener.postMessage('signInComplete', window.location.origin)
          window.close()
        }
      }
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
