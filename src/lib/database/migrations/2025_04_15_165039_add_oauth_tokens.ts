import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Create OAuth tokens table
  await db.schema
    .createTable('OAuthToken')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('userId', 'uuid', (col) => col.references('User.id').onDelete('cascade').notNull())
    .addColumn('provider', 'varchar', (col) => col.notNull()) // 'mailchimp', 'hubspot', etc.
    .addColumn('accessToken', 'varchar', (col) => col.notNull())
    .addColumn('refreshToken', 'varchar') // Optional, not all providers use refresh tokens
    .addColumn('expiresAt', 'timestamp') // Optional, not all tokens expire
    .addColumn('serverPrefix', 'varchar') // For Mailchimp this is 'dc'
    .addColumn('providerAccountId', 'varchar') // Identifier within the provider
    .addColumn('providerAccountName', 'varchar') // User-friendly name from provider
    .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updatedAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute()

  // Create index for faster lookups
  await db.schema
    .createIndex('oauth_tokens_user_provider_idx')
    .on('OAuthToken')
    .columns(['userId', 'provider'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop the OAuth tokens table
  await db.schema.dropTable('OAuthToken').execute()
}
