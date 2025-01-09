import { Generated } from 'kysely'

export interface Database {
  users: UserTable
  projects: ProjectTable
  exports: ExportTable
  files: FileTable
  chats: ChatTable
  messages: MessageTable
}

export type ExportType = 'react' | 'html'

export type Plan = 'free' | 'starter' | 'pro'
export type BillingCycle = 'monthly' | 'yearly'

export enum BusinessType {
  ConsumerGoods = 'consumer_goods',
  IndustrialGoods = 'industrial_goods',
  FoodAndBeverage = 'food_and_beverage',
  SupplementsAndPharmaceuticals = 'supplements_and_pharmaceuticals',
  Restaurant = 'restaurant',
  GeneralMerchandiseRetailer = 'general_merchandise_retailer',
  WellnessAndFitnessServices = 'wellness_and_fitness_services',
  HospitalityAndTravel = 'hospitality_and_travel',
  EventsAndEntertainment = 'events_and_entertainment',
  OtherPersonalServices = 'other_personal_services',
  AgencyMarketingAndConsulting = 'agency_marketing_and_consulting',
  FinancialAndInsurance = 'financial_and_insurance',
  Healthcare = 'healthcare',
  ProfessionalAndBusinessServices = 'professional_and_business_services',
  MediaAndContent = 'media_and_content',
  RealEstateAndConstruction = 'real_estate_and_construction',
  SoftwareOrSaaS = 'software_or_saas',
  Education = 'education',
  NonProfit = 'non_profit',
  GovernmentAndPublicAdministration = 'government_and_public_administration',
  TelecommunicationsAndUtilities = 'telecommunications_and_utilities',
  TransportationAndWarehousing = 'transportation_and_warehousing',
  AgricultureForestryFishingAndHunting = 'agriculture_forestry_fishing_and_hunting',
}

export interface UserTable {
  google_id?: string
  id: Generated<string>
  name: string
  email: string
  created_at: Date
  updated_at: Date
  password?: string
  plan: Plan
  stripe_customer_id?: string
  business_type?: BusinessType
  primary_color?: string
  secondary_color?: string
  logo_file_id?: string
  is_onboarded: boolean
  themes?: string[]
}

// New type with 'id' as string
export type User = Omit<UserTable, 'id'> & { id: string }

export interface ProjectTable {
  id: Generated<string>
  deleted_at: Date | null
  title: string
  user_id: string
  content: Email
  created_at: Date
  updated_at: Date
}

export type Project = Omit<ProjectTable, 'id'> & { id: string }

export interface ExportTable {
  id: Generated<string>
  user_id: string
  content: Email
  type: ExportType
  created_at: Date
  updated_at: Date
}

export type Export = Omit<ExportTable, 'id'> & { id: string }

export interface FileTable {
  id: Generated<string>
  file_name: string
  image_key: string
  user_id: string | null
  created_at: Date
  size_bytes: number
  updated_at: Date
}

export type File = Omit<FileTable, 'id'> & { id: string }

export interface ChatTable {
  id: Generated<string>
  user_id: string
  title: string
  email: Email | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export type Chat = Omit<ChatTable, 'id'> & { id: string }

export interface MessageTable {
  id: Generated<string>
  chat_id: string
  role: 'user' | 'assistant' | 'system' | 'data'
  content: string
  created_at: Date
  sequence: number
}

export type Message = Omit<MessageTable, 'id'> & { id: string }
