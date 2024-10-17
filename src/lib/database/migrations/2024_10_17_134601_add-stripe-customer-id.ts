import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('users').addColumn('stripe_customer_id', 'varchar(255)').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('users').dropColumn('stripe_customer_id').execute()
}
