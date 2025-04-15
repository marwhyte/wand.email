import { getProviderConfig } from './providers'
import { MailchimpMetadata, OAuthProvider, OAuthResponse } from './types'

/**
 * Exchange an authorization code for an access token
 */
export async function exchangeCodeForToken(provider: OAuthProvider, code: string): Promise<OAuthResponse> {
  try {
    const config = getProviderConfig(provider)

    // Exchange code for token
    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
        code,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(`Token exchange failed: ${errorData.error || tokenResponse.statusText}`)
    }

    const tokenData = await tokenResponse.json()

    // For providers with metadata endpoint (like Mailchimp), get the metadata
    let serverPrefix
    let userData

    if (provider === 'mailchimp' && config.metadataUrl) {
      const metadataResponse = await fetch(config.metadataUrl, {
        headers: {
          Authorization: `OAuth ${tokenData.access_token}`,
        },
      })

      if (metadataResponse.ok) {
        const metadata = (await metadataResponse.json()) as MailchimpMetadata
        serverPrefix = metadata.dc
        userData = metadata
      }
    }

    // Calculate expiration date if expires_in is provided
    let expiresAt
    if (tokenData.expires_in) {
      expiresAt = new Date(Date.now() + tokenData.expires_in * 1000)
    }

    return {
      provider,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt,
      userData,
      serverPrefix,
    }
  } catch (error) {
    console.error('OAuth token exchange error:', error)
    return {
      provider,
      accessToken: '',
      error: error instanceof Error ? error.message : 'Unknown error during token exchange',
    }
  }
}

/**
 * Refresh an existing token (for providers that support refresh tokens)
 */
export async function refreshToken(provider: OAuthProvider, refreshToken: string): Promise<OAuthResponse> {
  try {
    const config = getProviderConfig(provider)

    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: refreshToken,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(`Token refresh failed: ${errorData.error || tokenResponse.statusText}`)
    }

    const tokenData = await tokenResponse.json()

    // Calculate expiration date if expires_in is provided
    let expiresAt
    if (tokenData.expires_in) {
      expiresAt = new Date(Date.now() + tokenData.expires_in * 1000)
    }

    return {
      provider,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || refreshToken,
      expiresAt,
    }
  } catch (error) {
    console.error('OAuth token refresh error:', error)
    return {
      provider,
      accessToken: '',
      error: error instanceof Error ? error.message : 'Unknown error during token refresh',
    }
  }
}
