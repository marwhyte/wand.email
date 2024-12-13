import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('user_events')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('user_id', 'uuid', (col) => col.references('users.id').onDelete('cascade').notNull())
    .addColumn('event_type', 'varchar', (col) => col.notNull())
    .addColumn('resource_type', 'varchar', (col) => col.notNull())
    .addColumn('resource_id', 'varchar', (col) => col)
    .addColumn('metadata', 'jsonb', (col) => col.defaultTo('{}').notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute()

  // Add index for faster queries on user_id and event_type
  await db.schema.createIndex('user_events_user_id_idx').on('user_events').column('user_id').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('user_events').execute()
}
