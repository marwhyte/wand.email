import { Generated } from 'kysely'

export interface Database {
  users: UserTable
  projects: ProjectTable
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
  title: string
  user_id: string
  content: string
  created_at: Date
}
