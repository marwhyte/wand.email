'use server'

import { auth } from '@/auth'
import { removeFile } from '@/lib/database/queries/files'
import { deleteS3Object } from './deleteS3Object'

export async function deleteFile(fileKey: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    await deleteS3Object(fileKey)
    await removeFile(fileKey)

    return { success: true }
  } catch (error) {
    console.error('Delete file error:', error)
    return { success: false, error: 'Failed to delete file' }
  }
}
