import { OAuthProvider } from '@/lib/oauth/types'
import { useCallback, useEffect, useState } from 'react'

interface UseOAuthOptions {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

interface UseOAuthResult {
  initiateOAuth: (provider: OAuthProvider) => void
  isOAuthLoading: boolean
  isOAuthSuccess: boolean
  isOAuthError: boolean
  oauthError: string | null
  oauthData: any | null
  resetOAuth: () => void
}

/**
 * Hook to handle OAuth authentication using a popup window
 *
 * @example
 * const { initiateOAuth, isOAuthLoading, isOAuthSuccess, isOAuthError, oauthError } = useOAuth({
 *   onSuccess: (data) => console.log('OAuth success', data),
 *   onError: (error) => console.error('OAuth error', error)
 * })
 */
export function useOAuth(options: UseOAuthOptions = {}): UseOAuthResult {
  const [isOAuthLoading, setIsOAuthLoading] = useState(false)
  const [isOAuthSuccess, setIsOAuthSuccess] = useState(false)
  const [isOAuthError, setIsOAuthError] = useState(false)
  const [oauthError, setOauthError] = useState<string | null>(null)
  const [oauthData, setOauthData] = useState<any | null>(null)
  const [popupRef, setPopupRef] = useState<Window | null>(null)

  // Function to initiate OAuth flow
  const initiateOAuth = useCallback(
    (provider: OAuthProvider) => {
      // Reset states
      setIsOAuthLoading(true)
      setIsOAuthSuccess(false)
      setIsOAuthError(false)
      setOauthError(null)
      setOauthData(null)

      // Open a popup window for the OAuth flow
      const width = 600
      const height = 700
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2

      // Open our API route which will redirect to the provider
      const popup = window.open(
        `/api/oauth/${provider}`,
        'oauth-popup',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
      )

      // Check if popup was blocked
      if (!popup || popup.closed) {
        setIsOAuthLoading(false)
        setIsOAuthError(true)
        const errorMsg = 'Popup blocked. Please allow popups for this site.'
        setOauthError(errorMsg)
        if (options.onError) options.onError(errorMsg)
        return
      }

      // Store popup reference
      setPopupRef(popup)

      // Create a timer to check if the popup was closed manually
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed)
          // Only set error if we haven't already received a success message
          if (isOAuthLoading && !isOAuthSuccess && !isOAuthError) {
            setIsOAuthLoading(false)
            setIsOAuthError(true)
            const errorMsg = 'Authentication cancelled by user.'
            setOauthError(errorMsg)
            if (options.onError) options.onError(errorMsg)
          }
        }
      }, 1000)

      // Store interval ID to clear it later
      window.oauthCheckInterval = checkPopupClosed
    },
    [options, isOAuthLoading, isOAuthSuccess, isOAuthError]
  )

  // Reset the OAuth state
  const resetOAuth = useCallback(() => {
    setIsOAuthLoading(false)
    setIsOAuthSuccess(false)
    setIsOAuthError(false)
    setOauthError(null)
    setOauthData(null)
    setPopupRef(null)

    // Close popup if still open
    if (popupRef && !popupRef.closed) {
      popupRef.close()
    }

    // Clear any interval that might be running
    if (window.oauthCheckInterval) {
      clearInterval(window.oauthCheckInterval)
      window.oauthCheckInterval = undefined
    }
  }, [popupRef])

  // Listen for messages from the popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin for security
      if (event.origin !== window.location.origin) return

      console.log('Received message from popup:', event.data)

      // Check if the message is from our OAuth flow
      if (event.data && (event.data.success !== undefined || event.data.error !== undefined)) {
        // Always clear loading state
        setIsOAuthLoading(false)

        // Clear interval
        if (window.oauthCheckInterval) {
          clearInterval(window.oauthCheckInterval)
          window.oauthCheckInterval = undefined
        }

        if (event.data.error) {
          // Handle error
          setIsOAuthError(true)
          setOauthError(event.data.error)
          setIsOAuthSuccess(false)
          if (options.onError) options.onError(event.data.error)
        } else if (event.data.success) {
          // Handle success
          setIsOAuthSuccess(true)
          setIsOAuthError(false)
          setOauthError(null)
          setOauthData(event.data.data || event.data)
          if (options.onSuccess) options.onSuccess(event.data.data || event.data)
        }
      }
    }

    // Add event listener
    window.addEventListener('message', handleMessage)

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage)
      if (window.oauthCheckInterval) {
        clearInterval(window.oauthCheckInterval)
        window.oauthCheckInterval = undefined
      }
    }
  }, [options])

  return {
    initiateOAuth,
    isOAuthLoading,
    isOAuthSuccess,
    isOAuthError,
    oauthError,
    oauthData,
    resetOAuth,
  }
}

// Augment the Window interface to allow our interval tracking
declare global {
  interface Window {
    oauthCheckInterval?: NodeJS.Timeout
  }
}
