import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('chats').addColumn('company_id', 'uuid').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('chats').dropColumn('company_id').execute()
}
