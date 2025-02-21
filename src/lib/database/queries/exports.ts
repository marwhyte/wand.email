'use server'

import { Email } from '@/app/components/email-workspace/types'
import { auth } from '@/auth'
import { revalidateTag, unstable_cache } from 'next/cache'
import { db } from '../db'
import { ExportType } from '../types'

// Internal helper that takes userId as parameter for caching
const getMonthlyExportCountInternal = unstable_cache(
  async (sessionUserId: string): Promise<number> => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const result = await db
      .selectFrom('exports')
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .where('created_at', '>=', startOfMonth)
      .where('user_id', '=', sessionUserId)
      .executeTakeFirst()

    return result?.count ?? 0
  },
  [],
  { tags: ['exports'], revalidate: 60 * 60 }
)

// Public function that handles auth internally
export async function getMonthlyExportCount() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }
  return getMonthlyExportCountInternal(session.user.id)
}

export async function addExport(content: Email, type: ExportType) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const newExport = await db
    .insertInto('exports')
    .values({
      content,
      type,
      user_id: session.user.id,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returningAll()
    .executeTakeFirst()

  revalidateTag('exports')
  return newExport
}
