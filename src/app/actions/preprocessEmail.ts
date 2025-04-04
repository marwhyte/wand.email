'use client'

import { Email } from '../components/email-workspace/types'

/**
 * Client-side function to preprocess an email by calling the API
 * This will upload all icons to S3 and update the email with S3 URLs
 *
 * @param email The email to preprocess
 * @returns The processed email with all icons uploaded to S3
 */
export async function preprocessEmail(email: Email): Promise<Email> {
  try {
    const response = await fetch('/api/preprocess-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to preprocess email')
    }

    const data = await response.json()
    return data.email
  } catch (error) {
    console.error('Error preprocessing email:', error)
    // Return the original email if preprocessing fails
    return email
  }
}
