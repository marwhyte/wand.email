'use server'

import { db } from '../db'

export async function getUsers() {
  const users = await db.selectFrom('users').selectAll().execute()
  return users
}

export async function getUserByEmail(email: string) {
  const user = await db.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst()
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
    })
    .returningAll()
    .executeTakeFirst()

  return result
}
