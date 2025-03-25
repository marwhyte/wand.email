/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Kysely, SqliteAdapter } from 'kysely'
// import { DB } from 'kysely-codegen'
import { notifySlack } from '@/app/actions/notifySlack'
import { Adapter } from 'next-auth/adapters'
import { Database } from './types'

const isoDateRE =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
function isDate(value: any) {
  return value && isoDateRE.test(value) && !isNaN(Date.parse(value))
}

const format = {
  from<T>(object?: Record<string, any>): T {
    const newObject: Record<string, unknown> = {}
    for (const key in object) {
      const value = object[key]
      if (isDate(value)) newObject[key] = new Date(value)
      else newObject[key] = value
    }
    return newObject as T
  },
  to<T>(object: Record<string, any>): T {
    const newObject: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(object))
      newObject[key] = value instanceof Date ? value.toISOString() : value
    return newObject as T
  },
}

export default function KyselyAdapter(db: Kysely<Database>): Adapter {
  const { adapter } = db.getExecutor()
  const { supportsReturning } = adapter
  const isSqlite = adapter instanceof SqliteAdapter
  /** If the database is SQLite, turn dates into an ISO string  */
  const to = isSqlite ? format.to : <T>(x: T) => x as T
  /** If the database is SQLite, turn ISO strings into dates */
  const from = isSqlite ? format.from : <T>(x: T) => x as T
  return {
    async createUser(data) {
      const user = { ...data, id: crypto.randomUUID() }

      notifySlack(`New user signed up!\nName: ${user.name}\nEmail: ${user.email}`, 'upgrade')

      await db
        .insertInto('User')
        .values(
          to({
            ...user,
            createdAt: new Date(),
            updatedAt: new Date(),
            plan: 'free',
          })
        )
        .executeTakeFirstOrThrow()
      return user
    },
    async getUser(id) {
      const result = await db.selectFrom('User').selectAll().where('id', '=', id).executeTakeFirst()
      if (!result) return null
      return from(result)
    },
    async getUserByEmail(email) {
      const result = await db.selectFrom('User').selectAll().where('email', '=', email).executeTakeFirst()
      if (!result) return null
      return from(result)
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const result = await db
        .selectFrom('User')
        .innerJoin('Account', 'User.id', 'Account.userId')
        .selectAll('User')
        .where('Account.providerAccountId', '=', providerAccountId)
        .where('Account.provider', '=', provider)
        .executeTakeFirst()
      if (!result) return null
      return from(result)
    },
    async updateUser({ id, ...user }) {
      const userData = to(user)
      const query = db.updateTable('User').set(userData).where('id', '=', id)
      const result = supportsReturning
        ? query.returningAll().executeTakeFirstOrThrow()
        : query
            .executeTakeFirstOrThrow()
            .then(() => db.selectFrom('User').selectAll().where('id', '=', id).executeTakeFirstOrThrow())
      return from(await result)
    },
    async deleteUser(userId) {
      await db.deleteFrom('User').where('User.id', '=', userId).executeTakeFirst()
    },
    async linkAccount(account) {
      await db
        .insertInto('Account')
        .values(
          to({
            ...account,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        )
        .executeTakeFirstOrThrow()
      return account
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await db
        .deleteFrom('Account')
        .where('Account.providerAccountId', '=', providerAccountId)
        .where('Account.provider', '=', provider)
        .executeTakeFirstOrThrow()
    },
    async createSession(session) {
      await db
        .insertInto('Session')
        .values(
          to({
            ...session,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        )
        .execute()
      return session
    },
    async getSessionAndUser(sessionToken) {
      const result = await db
        .selectFrom('Session')
        .innerJoin('User', 'User.id', 'Session.userId')
        .selectAll('User')
        .select(['Session.expires', 'Session.userId'])
        .where('Session.sessionToken', '=', sessionToken)
        .executeTakeFirst()
      if (!result) return null
      const { userId, expires, ...user } = result
      const session = { sessionToken, userId, expires }
      return { user: from(user), session: from(session) }
    },
    async updateSession(session) {
      const sessionData = to(session)
      const query = db.updateTable('Session').set(sessionData).where('Session.sessionToken', '=', session.sessionToken)
      const result = supportsReturning
        ? await query.returningAll().executeTakeFirstOrThrow()
        : await query.executeTakeFirstOrThrow().then(async () => {
            return await db
              .selectFrom('Session')
              .selectAll()
              .where('Session.sessionToken', '=', sessionData.sessionToken)
              .executeTakeFirstOrThrow()
          })
      return from(result)
    },
    async deleteSession(sessionToken) {
      await db.deleteFrom('Session').where('Session.sessionToken', '=', sessionToken).executeTakeFirstOrThrow()
    },
    async createVerificationToken(data) {
      console.log('Creating verification token:', data)
      await db.insertInto('VerificationToken').values(to(data)).execute()
      return data
    },
    async useVerificationToken({ identifier, token }) {
      const query = db
        .deleteFrom('VerificationToken')
        .where('VerificationToken.token', '=', token)
        .where('VerificationToken.identifier', '=', identifier)

      const result = supportsReturning
        ? await query.returningAll().executeTakeFirst()
        : await db
            .selectFrom('VerificationToken')
            .selectAll()
            .where('token', '=', token)
            .executeTakeFirst()
            .then(async (res) => {
              await query.executeTakeFirst()
              return res
            })
      if (!result) return null
      return from(result)
    },
  }
}
