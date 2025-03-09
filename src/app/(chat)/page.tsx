import { BackgroundGradients } from '@/app/components/background-gradients'
import { Chat } from '@/app/components/chat/chat'
import { Footer } from '@/app/components/footer'
import { auth } from '@/auth'
import { getCompanies } from '@/lib/database/queries/companies'
import { getMonthlyExportCount } from '@/lib/database/queries/exports'
import { generateUUID } from '@/lib/utils/misc'

export default async function HomePage() {
  const id = generateUUID()

  const session = await auth()
  const monthlyExportCount = session?.user?.id ? await getMonthlyExportCount() : null
  const companies = session?.user?.id ? await getCompanies() : null

  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <BackgroundGradients />
      <div className="flex h-full flex-1">
        <Chat key={id} initialMessages={[]} id={id} companies={companies} monthlyExportCount={monthlyExportCount} />
      </div>
      <Footer />
    </div>
  )
}
