import { EmailProvider } from '@/app/components/email-workspace/email-provider'
import { auth } from '@/auth'
import { getProject } from '@/lib/database/queries/projects'
import Workspace from '@components/email-workspace/email-workspace'

export default async function ProjectsPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const project = await getProject(params.id)

  if (!project?.content) {
    return <div>Project not found</div>
  }

  const email = JSON.parse(project.content)

  return (
    <EmailProvider defaultEmail={email}>
      <Workspace session={session} />
    </EmailProvider>
  )
}
