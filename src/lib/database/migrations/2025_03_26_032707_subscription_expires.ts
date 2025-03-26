import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('User').addColumn('stripeSubscriptionExpiresAt', 'timestamp').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('User').dropColumn('stripeSubscriptionExpiresAt').execute()
}
