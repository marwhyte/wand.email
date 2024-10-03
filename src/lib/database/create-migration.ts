import fs from 'fs'
import path from 'path'

const migrationTemplate = `import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Add your migration logic here
}

export async function down(db: Kysely<any>): Promise<void> {
  // Add your rollback logic here
}
`

function createMigration(name: string) {
  const date = new Date()
  const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '_')
  const timestamp = date.toISOString().slice(11, 19).replace(/:/g, '')
  const fileName = `${formattedDate}_${timestamp}_${name}.ts`
  const filePath = path.join(__dirname, 'migrations', fileName)

  fs.writeFileSync(filePath, migrationTemplate)
  console.log(`Created migration file: ${fileName}`)
}

const migrationName = process.argv[2]
if (!migrationName) {
  console.error('Please provide a migration name')
  process.exit(1)
}

createMigration(migrationName)
