import { auth } from '@/auth'
import { fetchUser } from '../actions'
import TemplatesList from '../components/templates-list'

export default async function TemplatesPage() {
  const session = await auth()
  const user = session?.user?.email ? await fetchUser() : null

  return (
    <div>
      <TemplatesList session={session} user={user} />
    </div>
  )
}
