import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('Chat')
    .addColumn('exportType', 'text', (col) => col.defaultTo('html'))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('Chat').dropColumn('exportType').execute()
}
