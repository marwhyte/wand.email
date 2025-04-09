import { Chat } from '@/app/components/chat/chat'
import { Footer } from '@/app/components/footer'
import { auth } from '@/auth'
import { generateUUID } from '@/lib/utils/misc'

export default async function HomePage() {
  const id = generateUUID()

  const session = await auth()

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
    <div className="relative isolate flex h-[100dvh] flex-col">
      <div className="flex h-full flex-1 overflow-hidden">
        <Chat key={id} initialMessages={[]} id={id} initialChatStarted={false} />
      </div>
      <Footer />
    </div>
  )
}
