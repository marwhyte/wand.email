import { Email } from '@/app/components/email-workspace/types'
import { Company } from '@/lib/database/types'

export interface ExportTypeProps {
  email: Email | null
  company: Company | null
  onExportSuccess?: () => void
  onExportError?: (message: string) => void
}

export interface ExportTypeComponent {
  name: string
  icon: React.ReactNode
  title: string
  description: string
  component: React.ComponentType<ExportTypeProps>
}
