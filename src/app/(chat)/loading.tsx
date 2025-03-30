import { Header } from '@/app/components/header'
import { BackgroundGradients } from '../components/background-gradients'

export default function Loading() {
  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <BackgroundGradients />
      <Header chatStarted={false} monthlyExportCount={null} />\{' '}
    </div>
  )
}
