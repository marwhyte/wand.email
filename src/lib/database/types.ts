import { Generated } from 'kysely'

export interface Database {
  users: UserTable
  projects: ProjectTable
  exports: ExportTable
  files: FileTable
}

export type ExportType = 'react' | 'html'

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
  type: ExportType
  created_at: Date
}

export interface FileTable {
  id: Generated<string>
  file_name: string
  image_key: string
  user_id: string
  created_at: Date
  size_bytes: number
}
