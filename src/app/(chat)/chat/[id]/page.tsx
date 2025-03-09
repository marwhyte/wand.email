import { notFound } from 'next/navigation'

import { Chat } from '@/app/components/chat/chat'
import { DataStreamHandler } from '@/app/components/data-stream-handler'
import { auth } from '@/auth'
import { getChatWithMessages } from '@/lib/database/queries/chats'
import { getCompanies } from '@/lib/database/queries/companies'
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

  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={chat.messages}
        companies={companies}
        monthlyExportCount={monthlyExportCount}
      />
      <DataStreamHandler id={id} />
    </>
  )
}
