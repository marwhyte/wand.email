import { notFound } from 'next/navigation'

import { Chat } from '@/app/components/chat/chat'
import { auth } from '@/auth'
import { getChatWithMessages } from '@/lib/database/queries/chats'
import { getCompanies, getCompany } from '@/lib/database/queries/companies'
import { getMonthlyExportCount } from '@/lib/database/queries/exports'

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

  return (
    <>
      <Chat
        chat={chat}
        id={chat.id}
        initialMessages={chat.messages}
        companies={companies}
        chatCompany={company}
        monthlyExportCount={monthlyExportCount}
      />
    </>
  )
}
