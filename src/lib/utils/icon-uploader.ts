'use server'

import { uploadFile } from '@/app/actions/uploadFile'
import { Email, IconBlock } from '@/app/components/email-workspace/types'
import { getImgFromKey } from '@/lib/utils/misc'

/**
 * Fetch icon image from the icon API and upload it to S3
 * @param icon Icon name
 * @param theme Theme name
 * @param size Icon size
 * @returns URL to the uploaded icon in S3
 */
export async function uploadIconToS3(icon: string, theme: string, size: string): Promise<string> {
  try {
    // Generate a cache key for unique identification
    const cacheKey = new Date().getTime()

    // Get the base URL from environment variable or default to localhost
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Fetch the icon from the icon API
    const iconUrl = `${baseUrl}/api/icon?icon=${icon}&theme=${theme}&t=${cacheKey}&size=${size}`
    const iconResponse = await fetch(iconUrl)

    if (!iconResponse.ok) {
      throw new Error(`Failed to fetch icon: ${iconResponse.statusText}`)
    }

    // Get the icon as a blob
    const iconBlob = await iconResponse.blob()

    // Create a File object from the blob
    const iconFile = new File([iconBlob], `${icon}-${theme}-${size}.png`, { type: 'image/png' })

    // Create a FormData object to upload the file
    const formData = new FormData()
    formData.append('file', iconFile)

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

// Cache to store already uploaded icon URLs
const iconUrlCache = new Map<string, string>()

/**
 * Preprocess all icons in an email before rendering by uploading them to S3
 * and updating the email structure with S3 URLs
 *
 * @param email The email object to process
 * @returns A new email object with updated icon blocks containing S3 URLs
 */
export async function preprocessEmailIcons(email: Email): Promise<Email> {
  if (!email) return email

  const theme = email.theme || 'default'
  const processedEmail = { ...email }

  // Process all rows and find icon blocks
  for (const row of processedEmail.rows) {
    for (const column of row.columns) {
      for (let i = 0; i < column.blocks.length; i++) {
        const block = column.blocks[i]

        // Only process icon blocks
        if (block.type !== 'icon') continue

        const iconBlock = block as IconBlock

        // Skip if already has an S3 URL
        if (iconBlock.attributes.s3IconUrl) continue

        const { icon, size = '64' } = iconBlock.attributes

        // Generate a cache key for this specific icon
        const iconCacheKey = `${icon}-${theme}-${size}`

        // Check if we already have this icon in our cache
        if (iconUrlCache.has(iconCacheKey)) {
          iconBlock.attributes.s3IconUrl = iconUrlCache.get(iconCacheKey)!
          continue
        }

        try {
          // Upload the icon to S3
          const uploadedUrl = await uploadIconToS3(icon, theme, size)

          // Cache the URL
          iconUrlCache.set(iconCacheKey, uploadedUrl)

          // Update the block with the S3 URL
          iconBlock.attributes.s3IconUrl = uploadedUrl
        } catch (error) {
          console.error(`Error processing icon ${icon}:`, error)
          // Continue with the next icon if this one fails
        }
      }
    }
  }

  return processedEmail
}
