import { BackgroundGradients } from '@/app/components/background-gradients'
import { Header } from '@/app/components/header'

export default function Loading() {
  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <BackgroundGradients />
      <Header chatStarted={false} monthlyExportCount={null} />
    </div>
  )
}
