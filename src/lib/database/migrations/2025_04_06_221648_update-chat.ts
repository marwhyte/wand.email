import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('Chat')
    .addColumn('color', 'text', (col) => col.defaultTo('#FED776'))
    .addColumn('borderRadius', 'text', (col) => col.defaultTo('rounded'))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('Chat').dropColumn('color').dropColumn('borderRadius').execute()
}
