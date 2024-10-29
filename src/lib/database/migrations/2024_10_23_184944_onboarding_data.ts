import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('users').addColumn('business_type', 'varchar(255)').execute()
  await db.schema.alterTable('users').addColumn('primary_color', 'varchar(255)').execute()
  await db.schema.alterTable('users').addColumn('secondary_color', 'varchar(255)').execute()
  await db.schema
    .alterTable('users')
    .addColumn('logo_file_id', 'uuid', (col) => col.references('files.id').onDelete('set null'))
    .execute()

  await db.schema.alterTable('users').addColumn('themes', 'json').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('users').dropColumn('themes').execute()
  await db.schema.alterTable('users').dropColumn('logo_file_id').execute()
  await db.schema.alterTable('users').dropColumn('secondary_color').execute()
  await db.schema.alterTable('users').dropColumn('primary_color').execute()
  await db.schema.alterTable('users').dropColumn('business_type').execute()
}
