import { OAuthProvider, OAuthProviderConfig } from './types'

// Base URL for OAuth redirects, should be configured in env vars
const OAUTH_BASE_URL = process.env.NEXT_PUBLIC_OAUTH_BASE_URL || 'http://127.0.0.1:3000'

// Provider configurations
const providers: Record<OAuthProvider, OAuthProviderConfig> = {
  mailchimp: {
    id: 'mailchimp',
    name: 'Mailchimp',
    authorizationUrl: 'https://login.mailchimp.com/oauth2/authorize',
    tokenUrl: 'https://login.mailchimp.com/oauth2/token',
    metadataUrl: 'https://login.mailchimp.com/oauth2/metadata',
    clientId: process.env.MAILCHIMP_CLIENT_ID || '',
    clientSecret: process.env.MAILCHIMP_CLIENT_SECRET || '',
    redirectUri: `${OAUTH_BASE_URL}/oauth-callback/mailchimp`,
  },
  hubspot: {
    id: 'hubspot',
    name: 'HubSpot',
    authorizationUrl: 'https://app.hubspot.com/oauth/authorize',
    tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
    clientId: process.env.HUBSPOT_CLIENT_ID || '',
    clientSecret: process.env.HUBSPOT_CLIENT_SECRET || '',
    redirectUri: `${OAUTH_BASE_URL}/oauth-callback/hubspot`,
    scope: 'content',
  },
}

/**
 * Get OAuth provider configuration
 */
export function getProviderConfig(provider: OAuthProvider): OAuthProviderConfig {
  const config = providers[provider]

  if (!config) {
    throw new Error(`Provider ${provider} not configured`)
  }

  if (!config.clientId || !config.clientSecret) {
    throw new Error(`Provider ${provider} missing client credentials`)
  }

  return config
}

/**
 * Build the authorization URL for an OAuth provider
 */
export function getAuthorizationUrl(provider: OAuthProvider): string {
  const config = getProviderConfig(provider)
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
  })

  if (config.scope) {
    params.append('scope', config.scope)
  }

  return `${config.authorizationUrl}?${params.toString()}`
}
