'use server'

import { Email } from '@/app/components/email-workspace/types'
import { auth } from '@/auth'
import { db } from '../db'
import { ExportType } from '../types'

export async function getMonthlyExportCount() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const result = await db
    .selectFrom('Export')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .where('createdAt', '>=', startOfMonth)
    .where('userId', '=', session.user.id)
    .executeTakeFirst()

  return result?.count ?? 0
}

export async function addExport(content: Email, type: ExportType) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const newExport = await db
    .insertInto('Export')
    .values({
      content,
      type,
      userId: session.user.id,
    })
    .returningAll()
    .executeTakeFirst()

  return newExport
}
