'use server'

import { auth } from '@/auth'
import { db } from '../db'

export async function getFiles() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const files = await db.selectFrom('File').selectAll().where('userId', '=', session.user.id).execute()
  return files
}

export async function getFile(fileId: string) {
  const session = await auth()

  const file = await db
    .selectFrom('File')
    .selectAll()
    .where('id', '=', fileId)
    .where((eb) =>
      eb.or([
        eb('userId', 'is', null),
        // Only check user_id match if user is authenticated
        session?.user?.id ? eb('userId', '=', session.user.id) : eb.val(false),
      ])
    )
    .executeTakeFirst()
  return file
}

export async function addFile(
  userId: string | null,
  fileName: string,
  imageKey: string,
  sizeBytes: number,
  width: number,
  height: number
) {
  const file = await db
    .insertInto('File')
    .values({
      userId,
      fileName,
      imageKey,
      sizeBytes,
      width,
      height,
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
  await db.deleteFrom('File').where('userId', '=', session.user.id).where('imageKey', '=', fileKey).execute()
}
