import { notFound } from 'next/navigation'

import { BackgroundGradients } from '@/app/components/background-gradients'
import { Chat } from '@/app/components/chat/chat'
import { Footer } from '@/app/components/footer'
import { Logo } from '@/app/components/Logo'
import { auth } from '@/auth'
import { getChatWithMessages } from '@/lib/database/queries/chats'
import { getCompanies, getCompany } from '@/lib/database/queries/companies'
import { getMonthlyExportCount } from '@/lib/database/queries/exports'
import { sortByCreatedAt } from '@/lib/utils/misc'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const { id } = params

  const chat = await getChatWithMessages(id)

  if (!chat) {
    notFound()
  }

  const session = await auth()

  if (!session?.user) {
    notFound()
  }

  const monthlyExportCount = await getMonthlyExportCount()
  const companies = await getCompanies()
  const company = chat.company_id ? await getCompany(chat.company_id) : null

  const isProduction = process.env.NODE_ENV === 'production'

  if (isProduction) {
    return (
      <div className="relative isolate flex min-h-screen flex-col">
        <BackgroundGradients />
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <Logo className="mb-4" text={false} />
          <h1 className="text-2xl font-bold">wand.email is in beta. Please contact us to get access.</h1>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Chat
        chat={chat}
        id={chat.id}
        initialMessages={sortByCreatedAt(chat.messages)}
        companies={companies}
        chatCompany={company}
        monthlyExportCount={monthlyExportCount}
      />
    </>
  )
}
