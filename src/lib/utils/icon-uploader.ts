'use server'

import { uploadFile } from '@/app/actions/uploadFile'
import { getImgFromKey } from '@/lib/utils/misc'
import { generateIconPng } from './icon-generator'

/**
 * Generate icon image and upload it to S3
 * @param icon Icon name
 * @param theme Theme name
 * @param size Icon size
 * @returns URL to the uploaded icon in S3
 */
export async function uploadIconToS3({
  icon,
  theme,
  size,
}: {
  icon: string
  theme: string
  size: string
}): Promise<string> {
  try {
    // Generate the icon directly using our utility
    const iconBuffer = await generateIconPng(icon, theme, parseInt(size, 10))
    const iconSize = parseInt(size, 10)

    // Create a File object from the buffer
    const iconFile = new File([iconBuffer], `${icon}-${theme}-${size}.png`, { type: 'image/png' })

    // Create a FormData object to upload the file
    const formData = new FormData()
    formData.append('file', iconFile)
    formData.append('width', iconSize.toString())
    formData.append('height', iconSize.toString())

    // Upload the file to S3
    const result = await uploadFile(formData, true) // Allow unauthorized upload

    if (!result.success || !result.file) {
      throw new Error(result.error || 'Failed to upload icon to S3')
    }

    // Return the URL to the uploaded icon
    return getImgFromKey(result.file.imageKey)
  } catch (error) {
    console.error('Error uploading icon to S3:', error)
    // Return the original icon URL as fallback
    return `/api/icon?icon=${icon}&theme=${theme}&size=${size}`
  }
}
