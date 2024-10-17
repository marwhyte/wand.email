'use server'

import { auth } from '@/auth'
import { db } from '../db'
import { Plan } from '../types'

export async function getUsers() {
  const users = await db.selectFrom('users').selectAll().execute()
  return users
}

export async function getUserByEmail(email: string) {
  const user = await db.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst()
  return user
}

export async function getUserByStripeCustomerId(stripeCustomerId: string) {
  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('stripe_customer_id', '=', stripeCustomerId)
    .executeTakeFirst()
  return user
}

export async function addUser(user: {
  name: string
  email: string
  googleId?: string
  password?: string
}): Promise<{ id: string; name: string; email: string; google_id?: string | null; created_at: Date } | undefined> {
  if (!user.googleId && !user.password) {
    throw new Error('Either googleId or password is required')
  }

  const result = await db
    .insertInto('users')
    .values({
      name: user.name,
      email: user.email,
      password: user.password,
      google_id: user.googleId,
      created_at: new Date(),
      updated_at: new Date(),
      plan: 'free',
    })
    .returningAll()
    .executeTakeFirst()

  return result
}

export async function updateUserPlan(userId: string, plan: Plan, stripeCustomerId: string) {
  await db
    .updateTable('users')
    .set({ plan, stripe_customer_id: stripeCustomerId, updated_at: new Date() })
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

  const updateFields: { name?: string; email?: string } = {}
  if (name) updateFields.name = name as string
  if (email) updateFields.email = email as string

  await db
    .updateTable('users')
    .set({ ...updateFields, updated_at: new Date() })
    .where('id', '=', session.user.id)
    .execute()
}

export async function userExists(email: string): Promise<boolean> {
  const user = await db.selectFrom('users').select('id').where('email', '=', email).executeTakeFirst()

  return !!user
}

export async function deleteUser(): Promise<boolean> {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  return await db.transaction().execute(async (trx) => {
    // Get the user ID first
    const user = await trx
      .selectFrom('users')
      .select('id')
      .where('id', '=', session.user?.id ?? '')
      .executeTakeFirst()

    if (!user) {
      return false // User not found
    }

    // Delete related records
    await trx.deleteFrom('files').where('user_id', '=', user.id).execute()
    await trx.deleteFrom('exports').where('user_id', '=', user.id).execute()
    await trx.deleteFrom('projects').where('user_id', '=', user.id).execute()

    // Delete the user
    const result = await trx.deleteFrom('users').where('id', '=', user.id).execute()

    return result[0].numDeletedRows > 0
  })
}
