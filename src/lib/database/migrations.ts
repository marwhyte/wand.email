import { promises as fs } from 'fs'
import { FileMigrationProvider, Migrator } from 'kysely'
import path from 'path'
import { db } from './db'

async function executeMigration(down = false) {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, '../database/migrations'),
    }),
  })

  let result
  if (down) {
    result = await migrator.migrateDown()
  } else {
    result = await migrator.migrateToLatest()
  }

  const { error, results } = result

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was ${down ? 'reverted' : 'executed'} successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to ${down ? 'revert' : 'execute'} migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error(`failed to ${down ? 'revert' : 'execute'} migration`)
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

const args = process.argv.slice(2)
const down = args.includes('--down')

executeMigration(down)
