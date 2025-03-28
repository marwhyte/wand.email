import { Kysely } from 'kysely'
import { generateEmailScript } from '../../utils/email-script-generator'

export async function up(db: Kysely<any>): Promise<void> {
  // Get all messages with their emails
  const messages = await db.selectFrom('Message').select(['id', 'email']).execute()

  // Get all chats with their emails
  const chats = await db.selectFrom('Chat').select(['id', 'email']).execute()

  // First, create a temporary column to store the string version
  await db.schema.alterTable('Message').addColumn('email_string', 'text').execute()

  await db.schema.alterTable('Chat').addColumn('email_string', 'text').execute()

  // Update each message individually
  for (const message of messages) {
    if (message.email) {
      const emailString = generateEmailScript(message.email)
      await db.updateTable('Message').set({ email_string: emailString }).where('id', '=', message.id).execute()
    }
  }

  // Update each chat individually
  for (const chat of chats) {
    if (chat.email) {
      const emailString = generateEmailScript(chat.email)
      await db.updateTable('Chat').set({ email_string: emailString }).where('id', '=', chat.id).execute()
    }
  }

  // Drop the original email column
  await db.schema.alterTable('Message').dropColumn('email').execute()

  await db.schema.alterTable('Chat').dropColumn('email').execute()

  // Rename the string column to email
  await db.schema.alterTable('Message').renameColumn('email_string', 'email').execute()

  await db.schema.alterTable('Chat').renameColumn('email_string', 'email').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // This is a one-way migration since we're converting JSON to strings
  // The original JSON structure cannot be reliably reconstructed from the string

  // If needed, you could create a new jsonb column and attempt to parse the strings
  // but that would require custom logic to reverse the generateEmailScript function
  console.warn('This migration cannot be fully reversed as it converts JSON to strings.')

  // Keep the column as text but indicate it's not reversible
  // You may need to manually handle this if rolling back
}
