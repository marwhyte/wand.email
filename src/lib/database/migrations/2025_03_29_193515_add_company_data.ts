import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('Company').addColumn('description', 'text').execute()
  await db.schema.alterTable('Company').addColumn('address', 'text').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('Company').dropColumn('description').execute()
}
