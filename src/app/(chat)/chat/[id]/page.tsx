import { notFound } from 'next/navigation'

import { Chat } from '@/app/components/chat/chat'
import { auth } from '@/auth'
import { getChatWithMessages } from '@/lib/database/queries/chats'
import { getCompany } from '@/lib/database/queries/companies'
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

  const company = chat.companyId ? await getCompany(chat.companyId) : null

  // const isProduction = process.env.NODE_ENV === 'production'

  // if (isProduction) {
  //   return (
  //     <div className="relative isolate flex min-h-screen flex-col">
  //       <BackgroundGradients />
  //       <div className="flex h-full flex-1 flex-col items-center justify-center">
  //         <Logo className="mb-4" />
  //         <h1 className="text-2xl font-bold">wand.email is in beta. Please contact us to get access.</h1>
  //       </div>
  //       <Footer />
  //     </div>
  //   )
  // }

  return (
    <div className="relative isolate flex h-[100dvh] flex-col overflow-hidden">
      <Chat
        initialChatStarted
        chat={chat}
        id={chat.id}
        initialMessages={sortByCreatedAt(chat.messages)}
        chatCompany={company}
      />
    </div>
  )
}
