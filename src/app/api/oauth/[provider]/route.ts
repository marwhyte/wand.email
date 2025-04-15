import { auth } from '@/auth'
import { getAuthorizationUrl } from '@/lib/oauth/providers'
import { OAuthProvider } from '@/lib/oauth/types'
import { NextRequest, NextResponse } from 'next/server'

/**
 * API route to initiate OAuth flow for a provider
 *
 * @example GET /api/oauth/mailchimp
 */
export async function GET(request: NextRequest, { params }: { params: { provider: string } }) {
  try {
    // Get the provider parameter - params must be awaited
    const { provider } = params
    const providerName = provider as OAuthProvider

    // Verify user is authenticated
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // State can be used to verify the callback and include additional data
    const state = Buffer.from(
      JSON.stringify({
        userId: session.user.id,
        provider: providerName,
        timestamp: Date.now(),
      })
    ).toString('base64')

    // Get authorization URL with state
    let authUrl = getAuthorizationUrl(providerName)
    authUrl += `&state=${encodeURIComponent(state)}`

    // Redirect to the authorization URL
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('OAuth initiation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initiate OAuth flow' },
      { status: 500 }
    )
  }
}
