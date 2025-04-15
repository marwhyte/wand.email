'use client'

import { OAuthProvider } from '@/lib/oauth/types'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface OAuthCallbackClientProps {
  provider: OAuthProvider
}

export default function OAuthCallbackClient({ provider }: OAuthCallbackClientProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    async function handleCallback() {
      try {
        // Extract params from URL
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const state = searchParams.get('state')

        // Add debug info
        setDebugInfo(
          `Code: ${code ? 'Present' : 'Missing'}, Error: ${error || 'None'}, State: ${state ? 'Present' : 'Missing'}`
        )

        // Handle error from OAuth provider
        if (error) {
          setError(`Provider error: ${error}`)
          setStatus('error')
          sendMessageToParent({ error: `Provider error: ${error}` })
          return
        }

        // Ensure code was provided
        if (!code) {
          setError('No authorization code provided')
          setStatus('error')
          sendMessageToParent({ error: 'No authorization code provided' })
          return
        }

        // Ensure state was provided
        if (!state) {
          setError('No state parameter provided')
          setStatus('error')
          sendMessageToParent({ error: 'No state parameter provided' })
          return
        }

        // Verify state parameter
        let decodedState: any = null
        try {
          decodedState = JSON.parse(Buffer.from(state, 'base64').toString())
          // Validate state contains required fields
          if (!decodedState.userId || !decodedState.provider) {
            setError(
              `Invalid state parameter: missing required fields (userId: ${!!decodedState.userId}, provider: ${!!decodedState.provider})`
            )
            setStatus('error')
            sendMessageToParent({ error: 'Invalid state parameter: missing required fields' })
            return
          }
        } catch (e) {
          setError('Invalid state parameter: could not parse')
          setStatus('error')
          sendMessageToParent({ error: 'Invalid state parameter: could not parse' })
          return
        }

        // Update debug info
        setDebugInfo(
          (prev) =>
            `${prev}, State decoded: userId=${decodedState.userId.substring(0, 8)}..., provider=${decodedState.provider}`
        )

        // Exchange the code for a token using our server API
        const response = await fetch(`/api/oauth/callback/${provider}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            state,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          const errorMsg = data.error || `API error (${response.status}): Failed to authenticate`
          setDebugInfo((prev) => `${prev}, API error: ${response.status} - ${errorMsg}`)
          setError(errorMsg)
          setStatus('error')
          sendMessageToParent({ error: errorMsg })
          return
        }

        // Success! Notify the opener window and close this popup
        setStatus('success')

        // Ensure we send a proper success message
        sendMessageToParent({
          success: true,
          data: {
            provider,
            ...data,
          },
        })

        // Add a small delay before closing to ensure the message is sent
        setTimeout(() => {
          window.close()
        }, 2000)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error during authentication'
        console.error('OAuth callback error:', err)
        setError(errorMsg)
        setStatus('error')
        sendMessageToParent({ error: errorMsg })
      }
    }

    // Helper function to send messages to parent window
    function sendMessageToParent(message: any) {
      if (window.opener) {
        console.log('Sending message to parent:', message)
        window.opener.postMessage(message, window.location.origin)

        // Try sending twice to ensure delivery
        setTimeout(() => {
          window.opener.postMessage(message, window.location.origin)
        }, 500)
      } else {
        console.error('No parent window found to send message to')
      }
    }

    // Execute callback handler when component mounts
    handleCallback()
  }, [searchParams, provider])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold">{provider.charAt(0).toUpperCase() + provider.slice(1)} Integration</h1>

        {status === 'loading' && (
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
            <p>Processing authentication...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="mb-2 text-lg font-medium text-green-600">Authentication Successful!</p>
            <p>This window will close automatically in a moment.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <p className="mb-2 text-lg font-medium text-red-600">Authentication Failed</p>
            <p className="mb-4">{error || 'An unknown error occurred'}</p>

            {/* Show debug info in development */}
            {process.env.NODE_ENV !== 'production' && debugInfo && (
              <div className="mb-4 rounded bg-gray-100 p-3 text-left text-xs text-gray-700">
                <p className="font-bold">Debug info:</p>
                <p className="whitespace-pre-wrap break-all">{debugInfo}</p>
              </div>
            )}

            <button
              onClick={() => window.close()}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
