import { BackgroundGradients } from './components/background-gradients'
import { Header } from './components/header'

export default function Loading() {
  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <BackgroundGradients inputDisabled={true} />
      <Header chatStarted={false} monthlyExportCount={null} />
    </div>
  )
}
