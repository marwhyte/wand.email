import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .addColumn('plan', sql`varchar(255) NOT NULL DEFAULT 'free'`)
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  db.schema.alterTable('users').dropColumn('plan').execute()
}
