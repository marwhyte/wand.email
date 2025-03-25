import { Email } from '@/app/components/email-workspace/types'
import { Generated, GeneratedAlways } from 'kysely'

export interface Database {
  Account: AccountTable
  Chat: ChatTable
  Company: CompanyTable
  Export: ExportTable
  File: FileTable
  Message: MessageTable
  Session: SessionTable
  User: UserTable
  VerificationToken: VerificationTokenTable
}

export type ExportType = 'react' | 'html'

export type Plan = 'free' | 'starter' | 'pro'
export type BillingCycle = 'monthly' | 'yearly'

export interface AccountTable {
  id: GeneratedAlways<string>
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token: string | null
  access_token: string | null
  expires_at: number | null
  token_type: string | null
  scope: string | null
  id_token: string | null
  session_state: string | null
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}

export type Account = Omit<AccountTable, 'id' | 'createdAt' | 'updatedAt'> & {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface ChatTable {
  id: Generated<string>
  userId: string
  title: string
  email: Email | null
  createdAt: GeneratedAlways<Date>
  updatedAt: Generated<Date>
  deletedAt: Date | null
  companyId: string | null
}

export type Chat = Omit<ChatTable, 'id' | 'createdAt' | 'updatedAt'> & {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface CompanyTable {
  id: GeneratedAlways<string>
  userId: string
  name: string
  primaryColor: string | null
  logoFileId: string | null
  createdAt: GeneratedAlways<Date>
  updatedAt: Generated<Date>
}

export type Company = Omit<CompanyTable, 'id' | 'createdAt' | 'updatedAt'> & {
  id: string
  createdAt: Date
  updatedAt: Date
  logoImageKey: string | null
}

export interface ExportTable {
  id: GeneratedAlways<string>
  userId: string
  content: Email
  type: ExportType
  createdAt: GeneratedAlways<Date>
  updatedAt: Generated<Date>
}

export type Export = Omit<ExportTable, 'id' | 'createdAt' | 'updatedAt'> & {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface FileTable {
  id: GeneratedAlways<string>
  fileName: string
  imageKey: string
  userId: string | null
  createdAt: GeneratedAlways<Date>
  updatedAt: Generated<Date>
  sizeBytes: number
}

export type File = Omit<FileTable, 'id' | 'createdAt' | 'updatedAt'> & {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface MessageTable {
  id: GeneratedAlways<string>
  chatId: string
  role: 'user' | 'assistant' | 'system' | 'data'
  content: string
  createdAt: GeneratedAlways<Date>
  updatedAt: Generated<Date>
  email: Email | null
}

export type Message = Omit<MessageTable, 'id' | 'createdAt' | 'updatedAt'> & {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface SessionTable {
  id: GeneratedAlways<string>
  userId: string
  sessionToken: string
  expires: Date
  createdAt: GeneratedAlways<Date>
  updatedAt: Generated<Date>
}

export type Session = Omit<SessionTable, 'id' | 'createdAt' | 'updatedAt'> & {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface UserTable {
  id: GeneratedAlways<string>
  name: string | null
  email: string
  emailVerified: Date | null
  image: string | null
  plan: Plan
  stripeCustomerId: string | null
  createdAt: GeneratedAlways<Date>
  updatedAt: Generated<Date>
}

export type User = Omit<UserTable, 'id' | 'createdAt' | 'updatedAt'> & {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface VerificationTokenTable {
  identifier: string
  token: string
  expires: Date
}
