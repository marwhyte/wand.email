import DesktopOnly from '@/app/components/desktop-only'
import { auth } from '@/auth'
import { getMonthlyExportCount } from '@/lib/database/queries/exports'
import { getProject } from '@/lib/database/queries/projects'

export default async function ProjectsPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const project = session?.user?.id ? await getProject(params.id) : undefined
  const monthlyExportCount = session?.user?.id ? await getMonthlyExportCount() : 0

  if (!project?.content) {
    return <div>Project not found</div>
  }

  const email = project.content

  return (
    <>
      <DesktopOnly />
      <div className="hidden lg:block">
        {/* <Workspace project={project} session={session} monthlyExportCount={monthlyExportCount} /> */}
      </div>
    </>
  )
}
