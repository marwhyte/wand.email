'use server'

import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function deleteS3Object(fileKey: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
  })

  try {
    await s3Client.send(command)
  } catch (error) {
    console.error('Error deleting S3 object:', error)
    throw new Error('Failed to delete S3 object')
  }
}
