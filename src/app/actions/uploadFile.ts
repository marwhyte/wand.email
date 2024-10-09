'use server'

import { auth } from '@/auth'
import { addFile } from '@/lib/database/queries/files'
import { generatePresignedUrl } from './generatePresignedUrl'

const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB

export async function uploadFile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  const file = formData.get('file') as File
  if (!file) {
    return { success: false, error: 'No file provided' }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: 'File size exceeds 15MB limit' }
  }

  try {
    const { url, key } = await generatePresignedUrl(file.name, file.type)

    // Upload file to S3
    const response = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    console.log(response)

    if (!response.ok) {
      return { success: false, error: 'Failed to upload file' }
    }

    // Add file to database
    await addFile(session.user.id, file.name, key, file.size)

    return { success: true, message: 'File uploaded successfully' }
  } catch (error) {
    console.error('Error uploading file:', error)
    return { success: false, error: 'Failed to upload file' }
  }
}
