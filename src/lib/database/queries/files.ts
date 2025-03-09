'use server'

import { auth } from '@/auth'
import { db } from '../db'

export async function getFiles() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const files = await db.selectFrom('files').selectAll().where('user_id', '=', session.user.id).execute()
  return files
}

export async function getFile(fileId: string) {
  const session = await auth()

  const file = await db
    .selectFrom('files')
    .selectAll()
    .where('id', '=', fileId)
    .where((eb) =>
      eb.or([
        eb('user_id', 'is', null),
        // Only check user_id match if user is authenticated
        session?.user?.id ? eb('user_id', '=', session.user.id) : eb.val(false),
      ])
    )
    .executeTakeFirst()
  return file
}

export async function addFile(userId: string | null, fileName: string, imageKey: string, sizeBytes: number) {
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

  return file
}

export async function removeFile(fileKey: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }
  await db.deleteFrom('files').where('user_id', '=', session.user.id).where('image_key', '=', fileKey).execute()
}
