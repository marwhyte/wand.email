import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Add the new column
  await db.schema.alterTable('chats').addColumn('previous_email', 'jsonb').execute()

  // Update existing records to copy email to previous_email
  await db
    .updateTable('chats')
    .set({
      previous_email: sql`email`,
    })
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('chats').dropColumn('previous_email').execute()
}
