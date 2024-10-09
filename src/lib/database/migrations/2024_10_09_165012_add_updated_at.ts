import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Add updated_at columns
  await db.schema.alterTable('projects').addColumn('updated_at', 'timestamp').execute()

  await db.schema.alterTable('files').addColumn('updated_at', 'timestamp').execute()

  await db.schema.alterTable('exports').addColumn('updated_at', 'timestamp').execute()

  await db.schema.alterTable('users').addColumn('updated_at', 'timestamp').execute()

  // Update the new columns with created_at values
  await db
    .updateTable('projects')
    .set({ updated_at: sql`created_at` })
    .execute()
  await db
    .updateTable('files')
    .set({ updated_at: sql`created_at` })
    .execute()
  await db
    .updateTable('exports')
    .set({ updated_at: sql`created_at` })
    .execute()
  await db
    .updateTable('users')
    .set({ updated_at: sql`created_at` })
    .execute()

  // Set NOT NULL constraint
  await db.schema
    .alterTable('projects')
    .alterColumn('updated_at', (col) => col.setNotNull())
    .execute()

  await db.schema
    .alterTable('files')
    .alterColumn('updated_at', (col) => col.setNotNull())
    .execute()

  await db.schema
    .alterTable('exports')
    .alterColumn('updated_at', (col) => col.setNotNull())
    .execute()

  await db.schema
    .alterTable('users')
    .alterColumn('updated_at', (col) => col.setNotNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('projects').dropColumn('updated_at').execute()
  await db.schema.alterTable('files').dropColumn('updated_at').execute()
  await db.schema.alterTable('exports').dropColumn('updated_at').execute()
  await db.schema.alterTable('users').dropColumn('updated_at').execute()
}
