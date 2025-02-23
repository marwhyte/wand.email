import { auth } from '@/auth'
import { getCompanies } from '@/lib/database/queries/companies'
import { getMonthlyExportCount } from '@/lib/database/queries/exports'
import { BackgroundGradients } from './components/background-gradients'
import { Chat } from './components/chat/chat'
import { Footer } from './components/footer'

export default async function HomePage() {
  const session = await auth()
  const monthlyExportCount = session?.user?.id ? await getMonthlyExportCount() : null
  const companies = session?.user?.id ? await getCompanies() : null

  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <BackgroundGradients />
      <div className="flex h-full flex-1">
        <Chat companies={companies} monthlyExportCount={monthlyExportCount} />
      </div>
      <Footer />
    </div>
  )
}
