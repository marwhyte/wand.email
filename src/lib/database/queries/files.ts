'use server'

import { auth } from '@/auth' // Assuming you're using NextAuth or a similar authentication solution
import { revalidateTag, unstable_cache } from 'next/cache'
import { db } from '../db'

const getCachedFiles = unstable_cache(
  async (userId: string) => {
    const files = await db.selectFrom('files').selectAll().where('user_id', '=', userId).execute()
    return files
  },
  ['files'],
  {
    tags: ['files'],
    revalidate: 60 * 60 * 24,
  }
)

export async function getFiles() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }
  return getCachedFiles(session.user.id)
}

export async function addFile(userId: string, fileName: string, imageKey: string, sizeBytes: number) {
  const file = await db
    .insertInto('files')
    .values({
      user_id: userId,
      file_name: fileName,
      image_key: imageKey,
      size_bytes: sizeBytes,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returningAll()
    .executeTakeFirst()

  revalidateTag('files')
  return file
}
