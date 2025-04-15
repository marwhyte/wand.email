import { saveOAuthToken } from '@/lib/database/queries/oauth-tokens'
import { exchangeCodeForToken } from '@/lib/oauth/oauth-client'
import { OAuthProvider } from '@/lib/oauth/types'
import { NextRequest, NextResponse } from 'next/server'

/**
 * API route to handle OAuth callback
 *
 * @example POST /api/oauth/callback/mailchimp
 * with body { code: string, state: string }
 */
export async function POST(request: NextRequest, context: { params: { provider: string } }) {
  try {
    // Get the provider parameter - params must be awaited
    const { provider } = await context.params
    const providerName = provider as OAuthProvider

    const body = await request.json()
    const { code, state } = body as { code: string; state?: string }

    // Ensure code was provided
    if (!code) {
      return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 })
    }

    // Verify state parameter if provided
    let userId: string
    if (state) {
      try {
        const decodedState = JSON.parse(Buffer.from(state, 'base64').toString())
        // Extract userId from state
        if (!decodedState.userId) {
          return NextResponse.json({ error: 'Invalid state parameter: missing userId' }, { status: 400 })
        }
        userId = decodedState.userId
      } catch (e) {
        return NextResponse.json({ error: 'Invalid state parameter: could not parse' }, { status: 400 })
      }
    } else {
      return NextResponse.json({ error: 'State parameter is required' }, { status: 400 })
    }

    // Exchange the code for a token
    const tokenResponse = await exchangeCodeForToken(providerName, code)

    if (tokenResponse.error || !tokenResponse.accessToken) {
      return NextResponse.json({ error: tokenResponse.error || 'Failed to obtain access token' }, { status: 500 })
    }

    // Save the token to the database using the userId from the state
    const savedToken = await saveOAuthToken(userId, providerName, {
      accessToken: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
      expiresAt: tokenResponse.expiresAt,
      serverPrefix: tokenResponse.serverPrefix,
      providerAccountId: tokenResponse.userData?.account_id || null,
      providerAccountName: tokenResponse.userData?.login?.email || null,
    })

    // Return success
    return NextResponse.json({
      success: true,
      provider: providerName,
      providerAccountName: savedToken.providerAccountName,
    })
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'OAuth callback failed' },
      { status: 500 }
    )
  }
}
