import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Create new AIImageUsage table
  await db.schema
    .createTable('AIImageUsage')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('userId', 'uuid', (col) => col.references('User.id').onDelete('cascade').notNull())
    .addColumn('chatId', 'uuid', (col) => col.references('Chat.id').onDelete('cascade').notNull())
    .addColumn('prompt', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()

  // Add indexes for efficient querying
  await db.schema.createIndex('AIImageUsage_userId_index').on('AIImageUsage').column('userId').execute()

  await db.schema.createIndex('AIImageUsage_createdAt_index').on('AIImageUsage').column('createdAt').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop indexes first
  await db.schema.dropIndex('AIImageUsage_userId_index').ifExists().execute()
  await db.schema.dropIndex('AIImageUsage_createdAt_index').ifExists().execute()

  // Drop the table
  await db.schema.dropTable('AIImageUsage').ifExists().execute()
}
