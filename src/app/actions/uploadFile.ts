'use server'

import { auth } from '@/auth'
import { addFile } from '@/lib/database/queries/files'
import { generatePresignedUrl } from './generatePresignedUrl'

export async function uploadFile(file: File) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    // Generate presigned URL
    const { url, key } = await generatePresignedUrl(file.name, file.type)

    // Upload file to S3
    const response = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    if (!response.ok) {
      return { success: false, error: 'Failed to upload file' }
    }

    // Add file to database
    await addFile(session.user.id, file.name, key, file.size)

    return { success: true, key }
  } catch (error) {
    console.error('Error uploading file:', error)
    return { success: false, error: 'Failed to upload file' }
  }
}
