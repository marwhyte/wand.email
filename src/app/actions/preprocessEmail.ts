'use client'

import { getEmailAttributes, getIconAttributes } from '@/lib/utils/attributes'
import { uploadIconToS3 } from '@/lib/utils/icon-uploader'
import { Email } from '../components/email-workspace/types'

/**
 * Client-side function to preprocess an email by calling the API
 * This will upload all icons to S3 and update the email with S3 URLs
 *
 * @param email The email to preprocess
 * @returns The processed email with all icons uploaded to S3
 */

type IconToUpdate = {
  icon: string
  size: string
  theme: string
}

export async function preprocessEmail(email: Email): Promise<Email> {
  const emailAttributes = getEmailAttributes(email)
  const theme = emailAttributes.themeColor

  const updatedEmail = { ...email }

  for (const row of updatedEmail.rows) {
    for (const column of row.columns) {
      for (let i = 0; i < column.blocks.length; i++) {
        const block = column.blocks[i]

        if (block.type !== 'icon') continue

        if (block.attributes.s3IconUrl) continue

        const iconAttributes = getIconAttributes(block, row, email)

        const iconToUpdate: IconToUpdate = {
          icon: iconAttributes.icon,
          size: iconAttributes.size || '64',
          theme,
        }

        const s3IconUrl = await uploadIconToS3(iconToUpdate)

        block.attributes.s3IconUrl = s3IconUrl
      }
    }
  }

  return updatedEmail
}
