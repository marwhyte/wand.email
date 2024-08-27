import { EmailProvider } from '@/app/components/email-workspace/email-provider'
import { auth } from '@/auth'
import { getTemplate } from '@/lib/data/templates'
import Workspace from '@components/email-workspace/email-workspace'

export default async function TemplatePage({ params }: { params: { id: string } }) {
  const session = await auth()

  const defaultEmail = getTemplate(params.id)

  if (!defaultEmail) {
    return <div>Template not found</div>
  }

  return (
    <EmailProvider defaultEmail={defaultEmail}>
      <Workspace session={session} />
    </EmailProvider>
  )
}
