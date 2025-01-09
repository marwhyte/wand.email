import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  // Create chats table
  await db.schema
    .createTable('chats')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('users.id'))
    .addColumn('title', 'text')
    .addColumn('email', 'jsonb')
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('deleted_at', 'timestamp')
    .execute()

  // Create messages table
  await db.schema
    .createTable('messages')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('chat_id', 'uuid', (col) => col.notNull().references('chats.id').onDelete('cascade'))
    .addColumn('role', 'text', (col) => col.notNull())
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('sequence', 'integer', (col) => col.notNull())
    .execute()

  // Add index for faster message retrieval
  await db.schema.createIndex('messages_chat_id_sequence_idx').on('messages').columns(['chat_id', 'sequence']).execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('messages').execute()
  await db.schema.dropTable('chats').execute()
}
