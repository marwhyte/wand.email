'use server'

import { auth } from '@/auth'
import { revalidateTag, unstable_cache } from 'next/cache'
import { db } from '../db'
import { ExportType } from '../types'

export const getMonthlyExportCount = unstable_cache(
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
