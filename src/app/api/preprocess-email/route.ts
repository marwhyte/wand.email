import { Email } from '@/app/components/email-workspace/types'
import { preprocessEmailIcons } from '@/lib/utils/icon-uploader'
import { NextRequest, NextResponse } from 'next/server'

/**
 * API route to preprocess an email by uploading all icon images to S3
 * and updating the email object with the S3 URLs
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the email object
    const body = await request.json()
    const email = body.email as Email

    if (!email) {
      return NextResponse.json({ error: 'No email provided in request' }, { status: 400 })
    }

    // Process all icons in the email
    const processedEmail = await preprocessEmailIcons(email)

    // Return the processed email
    return NextResponse.json({
      email: processedEmail,
      success: true,
    })
  } catch (error) {
    console.error('Error preprocessing email:', error)
    return NextResponse.json(
      { error: 'Failed to preprocess email', details: (error as Error).message },
      { status: 500 }
    )
  }
}
