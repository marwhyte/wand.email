import { auth } from '@/auth'
import Workspace from '../email-workspace/email-workspace'

export default async function GoingPage({ params }: { params: { id: string } }) {
  const session = await auth()

  return (
    <div>
      <Workspace session={session} id={params.id} />
    </div>
  )
}
