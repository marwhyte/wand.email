import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Create companies table
  await db.schema
    .createTable('companies')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('primary_color', 'text')
    .addColumn('logo_file_id', 'uuid', (col) => col.references('files.id').onDelete('set null'))
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('users.id'))
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()

  // Remove columns from users table
  await db.schema
    .alterTable('users')
    .dropColumn('business_type')
    .dropColumn('primary_color')
    .dropColumn('secondary_color')
    .dropColumn('logo_file_id')
    .dropColumn('themes')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Add columns back to users table
  await db.schema
    .alterTable('users')
    .addColumn('business_type', 'text')
    .addColumn('primary_color', 'text')
    .addColumn('secondary_color', 'text')
    .addColumn('logo_file_id', 'text')
    .addColumn('themes', 'jsonb')
    .execute()

  // Drop companies table
  await db.schema.dropTable('companies').execute()
}
