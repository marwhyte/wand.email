'use server'

import { auth } from '@/auth'
import { getUserByEmail } from '@/lib/database/queries/users'

export const fetchUser = async () => {
  const session = await auth()
  if (session?.user?.email) {
    return await getUserByEmail(session.user.email)
  }
  return null
}
