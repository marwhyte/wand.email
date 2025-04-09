'use server'

import { auth } from '@/auth'
import { addFile } from '@/lib/database/queries/files'
import { generatePresignedUrl } from './generatePresignedUrl'

const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB

export async function uploadFile(formData: FormData, allowUnauthorized = false) {
  console.log('uploadFile', formData)
  const session = await auth()
  if (!session?.user?.id && !allowUnauthorized) {
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
    // Check if this is an icon file (sent from icon-uploader)
    const customFilename = formData.get('filename') as string | null
    const isIcon = customFilename?.includes('-') && customFilename.endsWith('.png')

    // Generate the presigned URL, preserving filename for icons
    const { url, key } = await generatePresignedUrl(
      customFilename || file.name,
      file.type,
      isIcon // Preserve filename if it's an icon
    )

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

    // Get width and height from formData
    const width = parseInt(formData.get('width') as string)
    const height = parseInt(formData.get('height') as string)

    // Add file to database and get the file ID
    const addedFile = await addFile(session?.user?.id ?? null, file.name, key, file.size, width, height)

    return {
      success: true,
      message: 'File uploaded successfully',
      file: addedFile,
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return { success: false, error: 'Failed to upload file' }
  }
}
