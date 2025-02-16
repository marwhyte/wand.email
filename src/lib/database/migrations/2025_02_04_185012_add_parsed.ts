import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Add your migration logic here
  await db.schema
    .alterTable('messages')
    .addColumn('parsed', 'boolean', (col) => col.notNull().defaultTo(false))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('messages').dropColumn('parsed').execute()
}
