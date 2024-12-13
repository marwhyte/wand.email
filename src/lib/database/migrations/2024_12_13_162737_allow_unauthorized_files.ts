import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('files')
    .alterColumn('user_id', (ac) => ac.dropNotNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('files')
    .alterColumn('user_id', (ac) => ac.setNotNull())
    .execute()
}
