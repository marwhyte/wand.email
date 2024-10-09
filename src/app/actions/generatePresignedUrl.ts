'use server'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function generatePresignedUrl(fileName: string, fileType: string) {
  const fileExtension = fileName.split('.').pop()
  const uniqueKey = `${Date.now()}-${uuidv4()}.${fileExtension}`

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: uniqueKey,
    ContentType: fileType,
  })

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    return { url: signedUrl, key: uniqueKey }
  } catch (error) {
    console.error('Error generating pre-signed URL:', error)
    throw new Error('Failed to generate pre-signed URL')
  }
}
