'use client'

import { preprocessEmail } from '@/app/actions/preprocessEmail'
import { Email } from '@/app/components/email-workspace/types'
import { useCallback, useState } from 'react'

/**
 * Hook for preprocessing emails with S3 icons
 *
 * @returns An object containing:
 * - preprocessAndGetEmail: Function to process an email and return the processed version
 * - processedEmail: The cached processed email
 * - isProcessing: Whether processing is currently in progress
 * - error: Any error that occurred during processing
 */
export function useEmailPreprocessor() {
  const [processedEmail, setProcessedEmail] = useState<Email | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Preprocess an email to upload all icons to S3
   *
   * @param email The email to process
   * @param forceRefresh Whether to force a refresh even if already processed
   * @returns The processed email with S3 icon URLs
   */
  const preprocessAndGetEmail = useCallback(
    async (email: Email | null, forceRefresh = false): Promise<Email | null> => {
      if (!email) return null

      // If we already have a processed version and don't need to refresh, return it
      if (processedEmail && !forceRefresh) {
        // Use a simple equality check of a few key properties to determine if it's the same email
        const isSameEmail =
          processedEmail.theme === email.theme && JSON.stringify(processedEmail.rows) === JSON.stringify(email.rows)

        if (isSameEmail) {
          return processedEmail
        }
      }

      setIsProcessing(true)
      setError(null)

      try {
        // Preprocess the email to upload all icons to S3
        const emailWithIcons = await preprocessEmail(email)

        // Save the processed email
        setProcessedEmail(emailWithIcons)
        return emailWithIcons
      } catch (err) {
        console.error('Error preprocessing email:', err)
        setError(err instanceof Error ? err : new Error(String(err)))
        // Fall back to the original email if processing fails
        return email
      } finally {
        setIsProcessing(false)
      }
    },
    [processedEmail]
  )

  return {
    preprocessAndGetEmail,
    processedEmail,
    isProcessing,
    error,
  }
}
