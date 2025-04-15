'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// Helper to get the base URL that matches what's registered in HubSpot
const getBaseUrl = () => {
  // First priority: Use the environment variable if it's set
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_OAUTH_BASE_URL) {
    return process.env.NEXT_PUBLIC_OAUTH_BASE_URL
  }

  // Second priority: For local development, use 127.0.0.1:3000
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return 'http://127.0.0.1:3000'
  }

  // Third priority: Use the actual origin
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // Fallback
  return 'http://127.0.0.1:3000'
}

export default function HubSpotOAuthCallback() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [message, setMessage] = useState('Processing...')
  const [showDebug, setShowDebug] = useState(false)
  const [messageSent, setMessageSent] = useState(false)

  useEffect(() => {
    // Extract query parameters
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description') || searchParams.get('error')
    const state = searchParams.get('state')

    // Function to communicate with parent window and close this one
    const sendMessageAndClose = () => {
      if (!window.opener) {
        setMessage('No parent window found. You can close this window.')
        return
      }

      try {
        // Prevent sending multiple messages
        if (messageSent) return

        const targetOrigin = getBaseUrl()
        console.log('[OAuth Callback] Sending message to:', targetOrigin)

        if (error) {
          // Send error message to parent window
          window.opener.postMessage(
            {
              type: 'OAUTH_ERROR',
              provider: 'hubspot',
              error: errorDescription || error,
            },
            targetOrigin
          )
          setMessage('Authentication failed. This window will close automatically.')
        } else if (code) {
          // Send success message with code to parent window
          console.log('[OAuth Callback] Sending success message with code')
          window.opener.postMessage(
            {
              type: 'OAUTH_SUCCESS',
              provider: 'hubspot',
              code,
            },
            targetOrigin
          )
          setMessage('Authentication successful! This window will close automatically.')
        } else {
          // No code or error - something went wrong
          window.opener.postMessage(
            {
              type: 'OAUTH_ERROR',
              provider: 'hubspot',
              error: 'No code or error returned from provider',
            },
            targetOrigin
          )
          setMessage('Authentication failed: No response from provider.')
        }

        setMessageSent(true)

        // Close this window after a longer delay to ensure message is processed
        setTimeout(() => {
          console.log('[OAuth Callback] Closing window after sending message')
          window.close()
        }, 2500)
      } catch (err) {
        console.error('[OAuth] Error communicating with parent window:', err)
        setMessage('Error communicating with the main window. You can close this window.')
      }
    }

    // Send the message as soon as the page loads
    sendMessageAndClose()
  }, [searchParams, router, messageSent])

  // Toggle debug panel
  const toggleDebug = () => setShowDebug((prev) => !prev)

  // Manually retry closing
  const handleManualClose = () => {
    window.close()
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 text-xl font-semibold">{message}</div>

      {messageSent && (
        <button
          className="mt-2 rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
          onClick={handleManualClose}
        >
          Close Window
        </button>
      )}

      {process.env.NODE_ENV === 'development' && (
        <button className="mt-4 text-orange-500 hover:underline" onClick={toggleDebug}>
          {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
        </button>
      )}

      {showDebug && (
        <div className="mt-6 max-w-lg rounded border border-gray-200 bg-gray-50 p-4 text-left text-sm">
          <h3 className="mb-2 font-medium">Debug Information</h3>
          <p>
            <strong>Base URL:</strong> {getBaseUrl()}
          </p>
          <p>
            <strong>Has opener:</strong> {window.opener ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Code:</strong>{' '}
            {searchParams.get('code') ? `${searchParams.get('code')?.substring(0, 10)}...` : 'None'}
          </p>
          <p>
            <strong>State:</strong> {searchParams.get('state') || 'None'}
          </p>
          <p>
            <strong>Error:</strong> {searchParams.get('error') || 'None'}
          </p>
          <p>
            <strong>Description:</strong> {searchParams.get('error_description') || 'None'}
          </p>
          <p>
            <strong>Message Sent:</strong> {messageSent ? 'Yes' : 'No'}
          </p>
        </div>
      )}
    </div>
  )
}
