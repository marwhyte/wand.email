'use server'

import { auth } from '@/auth'
import { db } from '../db'
import { Plan } from '../types'

export async function getUsers() {
  const users = await db.selectFrom('User').selectAll().execute()
  return users
}

export async function getUserByEmail(email: string) {
  return await db
    .selectFrom('User')
    .select(['id', 'name', 'plan', 'email', 'stripeCustomerId', 'stripeSubscriptionExpiresAt'])
    .where('email', '=', email)
    .executeTakeFirst()
}

export async function getUserByStripeCustomerId(stripeCustomerId: string) {
  const user = await db
    .selectFrom('User')
    .selectAll()
    .where('stripeCustomerId', '=', stripeCustomerId)
    .executeTakeFirst()
  return user
}

export async function updateUserPlan(
  userId: string,
  plan: Plan,
  stripeCustomerId: string,
  stripeSubscriptionExpiresAt: Date | null
) {
  await db
    .updateTable('User')
    .set({ plan, stripeCustomerId, stripeSubscriptionExpiresAt, updatedAt: new Date() })
    .where('id', '=', userId)
    .execute()
}

export async function updateUser(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const name = formData.get('name')
  const email = formData.get('email')

  const updateFields: {
    name?: string
    email?: string
  } = {}
  if (name) updateFields.name = name as string
  if (email) updateFields.email = email as string

  await db
    .updateTable('User')
    .set({ ...updateFields, updatedAt: new Date() })
    .where('id', '=', session.user.id)
    .execute()
}

export async function userExists(email: string): Promise<boolean> {
  const user = await db.selectFrom('User').select('id').where('email', '=', email).executeTakeFirst()
  return !!user
}

export async function deleteUser(): Promise<boolean> {
  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }

  return await db.transaction().execute(async (trx) => {
    // Get the user ID first
    const user = await trx
      .selectFrom('User')
      .select('id')
      .where('id', '=', session.user?.id ?? '')
      .executeTakeFirst()

    if (!user) {
      return false // User not found
    }

    // Delete related records
    await trx.deleteFrom('File').where('userId', '=', user.id).execute()
    await trx.deleteFrom('Export').where('userId', '=', user.id).execute()
    await trx.deleteFrom('Chat').where('userId', '=', user.id).execute()

    // Delete the user
    const result = await trx.deleteFrom('User').where('id', '=', user.id).execute()

    return result[0].numDeletedRows > 0
  })
}

export async function updateUserSubscriptionExpiry(userId: string, stripeSubscriptionExpiresAt: Date | null) {
  await db
    .updateTable('User')
    .set({
      stripeSubscriptionExpiresAt,
      updatedAt: new Date(),
    })
    .where('id', '=', userId)
    .execute()
}

// AI Image Usage Related Functions
export async function recordAIImageUsage(chatId: string, prompt: string): Promise<void> {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  await db
    .insertInto('AIImageUsage')
    .values({
      userId: session.user.id,
      chatId,
      prompt,
    })
    .execute()
}

export async function getUserAIImageCountForCurrentMonth(userId: string): Promise<number> {
  // Get the first day of the current month
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const result = await db
    .selectFrom('AIImageUsage')
    .select(db.fn.count<number>('id').as('count'))
    .where('userId', '=', userId)
    .where('createdAt', '>=', firstDayOfMonth)
    .executeTakeFirst()

  return parseInt(result?.count?.toString() || '0', 10)
}

export async function hasHitMonthlyImageLimit(limit = 15): Promise<boolean> {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const plan = await getUserPlan(session.user.id)

  // If user is on a paid plan, they have no limit
  if (plan !== 'free') {
    return false
  }

  const count = await getUserAIImageCountForCurrentMonth(session.user.id)
  return count >= limit
}

// This helper function gets the user's current plan
async function getUserPlan(userId: string): Promise<string> {
  const user = await db.selectFrom('User').select('plan').where('id', '=', userId).executeTakeFirst()

  return user?.plan || 'free'
}

// For convenience, aliasing the new function to maintain compatibility
export const hasHitImageLimit = hasHitMonthlyImageLimit
