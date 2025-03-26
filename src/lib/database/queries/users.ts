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
