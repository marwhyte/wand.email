import { Generated } from 'kysely'

export interface Database {
  users: UserTable
  projects: ProjectTable
  exports: ExportTable
}

export interface UserTable {
  google_id?: string
  id: Generated<string>
  name: string
  email: string
  created_at: Date
  password?: string
}

export interface ProjectTable {
  id: Generated<string>
  deleted_at: Date | null
  title: string
  user_id: string
  content: Email
  created_at: Date
}

export interface ExportTable {
  id: Generated<string>
  user_id: string
  content: Email
  created_at: Date
}
