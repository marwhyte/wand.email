import { EmailProvider } from '@/app/components/email-workspace/email-provider'
import { auth } from '@/auth'
import { getMonthlyExportCount } from '@/lib/database/queries/exports'
import { getProject } from '@/lib/database/queries/projects'
import Workspace from '@components/email-workspace/email-workspace'

export default async function ProjectsPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const project = session?.user?.id ? await getProject(params.id, session.user.id) : undefined
  const monthlyExportCount = session?.user?.id ? await getMonthlyExportCount(session.user.id) : 0

  if (!project?.content) {
    return <div>Project not found</div>
  }

  const email = project.content

  return (
    <EmailProvider defaultEmail={email}>
      <Workspace project={project} session={session} monthlyExportCount={monthlyExportCount} />
    </EmailProvider>
  )
}
