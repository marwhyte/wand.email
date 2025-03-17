import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Add your migration logic here
  await db.schema.alterTable('messages').addColumn('email', 'jsonb').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Add your rollback logic here
  await db.schema.alterTable('messages').dropColumn('email').execute()
}
