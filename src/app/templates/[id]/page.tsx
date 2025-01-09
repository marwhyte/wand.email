import DesktopOnly from '@/app/components/desktop-only'
import { auth } from '@/auth'
import { getTemplate } from '@/lib/data/templates'
import { getMonthlyExportCount } from '@/lib/database/queries/exports'

export default async function TemplatePage({ params }: { params: { id: string } }) {
  const session = await auth()
  const monthlyExportCount = session?.user?.id ? await getMonthlyExportCount() : 0

  const defaultEmail = getTemplate(params.id)

  if (!defaultEmail) {
    return <div>Template not found</div>
  }

  return (
    <>
      <DesktopOnly />
      <div className="hidden lg:block">
        {/* <Workspace monthlyExportCount={monthlyExportCount} session={session} /> */}
      </div>
    </>
  )
}
