import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('prompts')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('prompt_text', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('user_id', 'uuid', (col) => col.references('users.id'))
    .addColumn('response_text', 'text')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('prompts').execute()
}
