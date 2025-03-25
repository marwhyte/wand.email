import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Add your migration logic here
  await db.schema
    .createTable('Export')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('userId', 'uuid', (col) => col.references('User.id').onDelete('cascade').notNull())
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('content', 'jsonb', (col) => col.notNull())
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()

  await db.schema
    .createTable('File')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('fileName', 'text', (col) => col.notNull())
    .addColumn('imageKey', 'text', (col) => col.notNull().unique())
    .addColumn('userId', 'uuid', (col) => col.references('User.id').onDelete('cascade').notNull())
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('sizeBytes', 'integer', (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('Company')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('userId', 'uuid', (col) => col.references('User.id').onDelete('cascade').notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('primaryColor', 'text')
    .addColumn('logoFileId', 'uuid', (col) => col.references('File.id').onDelete('set null'))
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()

  await db.schema
    .createTable('Chat')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('userId', 'uuid', (col) => col.references('User.id').onDelete('cascade').notNull())
    .addColumn('title', 'text')
    .addColumn('email', 'jsonb')
    .addColumn('companyId', 'uuid', (col) => col.references('Company.id').onDelete('set null'))
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('deletedAt', 'timestamptz')
    .execute()

  await db.schema
    .createTable('Message')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('chatId', 'uuid', (col) => col.references('Chat.id').onDelete('cascade').notNull())
    .addColumn('role', 'text', (col) => col.notNull())
    .addColumn('email', 'jsonb')
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()

  await db.schema
    .createTable('Prompt')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('userId', 'uuid', (col) => col.references('User.id').onDelete('cascade').notNull())
    .addColumn('promptText', 'text', (col) => col.notNull())
    .addColumn('systemPrompt', 'text')
    .addColumn('responseText', 'text')
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('Export').execute()
  await db.schema.dropTable('Message').execute()
  await db.schema.dropTable('Chat').execute()
  await db.schema.dropTable('Prompt').execute()
  await db.schema.dropTable('Company').execute()
  await db.schema.dropTable('File').execute()
}
