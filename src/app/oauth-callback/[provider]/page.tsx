import { OAuthProvider } from '@/lib/oauth/types'
import OAuthCallbackClient from './client'

// This is the Server Component (default in App Router)
export default async function OAuthCallbackPage({ params }: { params: { provider: string } }) {
  // In a server component, we can await the params
  const { provider } = await params

  return <OAuthCallbackClient provider={provider as OAuthProvider} />
}
