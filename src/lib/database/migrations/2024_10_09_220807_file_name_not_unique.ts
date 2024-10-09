import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Remove unique constraint from file_name
  await db.schema.alterTable('files').dropConstraint('files_file_name_key').execute()

  // Add unique constraint to image_key
  await db.schema.alterTable('files').addUniqueConstraint('files_image_key_unique', ['image_key']).execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Rollback: Remove unique constraint from image_key and add it back to file_name
  await db.schema.alterTable('files').dropConstraint('files_image_key_unique').execute()

  await db.schema.alterTable('files').addUniqueConstraint('files_file_name_key', ['file_name']).execute()
}
