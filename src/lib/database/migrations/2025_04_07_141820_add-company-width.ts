import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('File').addColumn('width', 'integer').addColumn('height', 'integer').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('File').dropColumn('width').dropColumn('height').execute()
}
