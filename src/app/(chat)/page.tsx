import { BackgroundGradients } from '@/app/components/background-gradients'
import { Chat } from '@/app/components/chat/chat'
import { Footer } from '@/app/components/footer'
import { auth } from '@/auth'
import { getCompanies } from '@/lib/database/queries/companies'
import { getMonthlyExportCount } from '@/lib/database/queries/exports'
import { generateUUID } from '@/lib/utils/misc'
import { Logo } from '../components/Logo'

export default async function HomePage() {
  const id = generateUUID()

  const session = await auth()
  const monthlyExportCount = session?.user?.id ? await getMonthlyExportCount() : null
  const companies = session?.user?.id ? await getCompanies() : null

  const isProduction = process.env.NODE_ENV === 'production'

  if (isProduction) {
    return (
      <div className="relative isolate flex min-h-screen flex-col">
        <BackgroundGradients />
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <Logo className="mb-4" text={false} />
          <h1 className="text-2xl font-bold">SentSwiftly is in beta. Please contact us to get access.</h1>
        </div>
        <Footer />
      </div>
    )
  }

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
