import { auth } from '@/auth'
import { getOAuthToken } from '@/lib/database/queries/oauth-tokens'
import { NextRequest, NextResponse } from 'next/server'

/**
 * API route to check if a user is authenticated with a provider
 *
 * @example GET /api/oauth/mailchimp/check-auth
 */
export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ authenticated: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has a valid OAuth token for Mailchimp
    const token = await getOAuthToken(session.user.id, 'mailchimp')

    return NextResponse.json({
      authenticated: !!token,
      providerName: token ? token.providerAccountName : null,
    })
  } catch (error) {
    console.error('OAuth check auth error:', error)
    return NextResponse.json(
      {
        authenticated: false,
        error: error instanceof Error ? error.message : 'Failed to check authentication status',
      },
      { status: 500 }
    )
  }
}
