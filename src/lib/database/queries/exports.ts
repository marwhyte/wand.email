'use server'

import { unstable_cache } from 'next/cache'
import { db } from '../db'

export const getMontlyExportCount = unstable_cache(
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
