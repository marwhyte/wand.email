export type OAuthProvider = 'mailchimp' | 'hubspot'

export interface OAuthProviderConfig {
  id: OAuthProvider
  name: string
  authorizationUrl: string
  tokenUrl: string
  metadataUrl?: string
  clientId: string
  clientSecret: string
  redirectUri: string
  scope?: string
}

export type MailchimpMetadata = {
  dc: string
  login_url: string
  api_endpoint: string
  login: {
    email: string
    login_id: number
  }
  account_id: string
  user_id: string
  role: string
}

export type OAuthResponse = {
  provider: OAuthProvider
  accessToken: string
  refreshToken?: string
  expiresAt?: Date
  userData?: any
  serverPrefix?: string
  error?: string
}

export interface MailchimpFolder {
  id: string
  name: string
  type: string
  count: number
}

export interface MailchimpFoldersResponse {
  folders: MailchimpFolder[]
  total_items: number
}
