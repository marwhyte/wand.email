'use server'

import { auth } from '@/auth'
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

export async function getFile(fileId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }
  const file = await db
    .selectFrom('files')
    .selectAll()
    .where('id', '=', fileId)
    .where('user_id', '=', session.user.id)
    .executeTakeFirst()
  return file
}

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

export async function removeFile(userId: string, fileKey: string) {
  await db.deleteFrom('files').where('user_id', '=', userId).where('image_key', '=', fileKey).execute()

  revalidateTag('files')
}
