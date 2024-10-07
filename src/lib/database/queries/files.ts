'use server'

import { revalidateTag, unstable_cache } from 'next/cache'
import { db } from '../db'

export const getFiles = unstable_cache(
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

export async function addFile(userId: string, fileName: string, imageKey: string, sizeBytes: number) {
  const file = await db
    .insertInto('files')
    .values({
      user_id: userId,
      file_name: fileName,
      image_key: imageKey,
      size_bytes: sizeBytes,
      created_at: new Date(),
    })
    .returningAll()
    .executeTakeFirst()

  revalidateTag('files')
  return file
}
