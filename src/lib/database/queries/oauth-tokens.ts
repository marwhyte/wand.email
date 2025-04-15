import { db } from '@/lib/database/db'
import { OAuthToken } from '@/lib/database/types'

/**
 * Save an OAuth token for a user
 */
export async function saveOAuthToken(
  userId: string,
  provider: string,
  data: {
    accessToken: string
    refreshToken?: string | null
    expiresAt?: Date | null
    serverPrefix?: string | null
    providerAccountId?: string | null
    providerAccountName?: string | null
  }
): Promise<OAuthToken> {
  // Check if a token already exists for this user and provider
  const existingToken = await getOAuthToken(userId, provider)

  if (existingToken) {
    // Update existing token
    return await db
      .updateTable('OAuthToken')
      .set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken ?? null,
        expiresAt: data.expiresAt ?? null,
        serverPrefix: data.serverPrefix ?? null,
        providerAccountId: data.providerAccountId ?? null,
        providerAccountName: data.providerAccountName ?? null,
        updatedAt: new Date(),
      })
      .where('id', '=', existingToken.id)
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  // Create new token
  return await db
    .insertInto('OAuthToken')
    .values({
      userId,
      provider,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? null,
      expiresAt: data.expiresAt ?? null,
      serverPrefix: data.serverPrefix ?? null,
      providerAccountId: data.providerAccountId ?? null,
      providerAccountName: data.providerAccountName ?? null,
    })
    .returningAll()
    .executeTakeFirstOrThrow()
}

/**
 * Get an OAuth token for a user and provider
 */
export async function getOAuthToken(userId: string, provider: string): Promise<OAuthToken | null> {
  return (
    (await db
      .selectFrom('OAuthToken')
      .selectAll()
      .where('userId', '=', userId)
      .where('provider', '=', provider)
      .executeTakeFirst()) || null
  )
}

/**
 * Delete an OAuth token for a user and provider
 */
export async function deleteOAuthToken(userId: string, provider: string): Promise<void> {
  await db.deleteFrom('OAuthToken').where('userId', '=', userId).where('provider', '=', provider).execute()
}

/**
 * Get all OAuth tokens for a user
 */
export async function getOAuthTokensByUser(userId: string): Promise<OAuthToken[]> {
  return await db.selectFrom('OAuthToken').selectAll().where('userId', '=', userId).execute()
}
