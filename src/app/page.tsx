import { BackgroundGradients } from './components/background-gradients'
import { Chat } from './components/chat/chat'
import { Footer } from './components/footer'

export default function HomePage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <BackgroundGradients />
      <div className="flex h-full flex-1">
        <Chat />
      </div>
      <Footer />
    </div>
  )
}
