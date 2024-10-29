import { auth } from '@/auth'
import { fetchUser } from '../actions'
import TemplateCard from '../components/email-workspace/template-card'
import TemplatesList from '../components/templates-list'

export default async function TemplatesPage() {
  const session = await auth()
  const user = session?.user?.email ? await fetchUser() : null

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <TemplatesList session={session} user={user} />
      </div>
      <div className="bg-zinc-100">
        <ul
          role="list"
          className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 md:grid-cols-3 lg:grid-cols-4 lg:px-8"
        >
          <TemplateCard
            href="/templates/going"
            image="/going/demo.png"
            title="Going"
            description="Marketing emails for flight deals"
          />
        </ul>
      </div>
    </div>
  )
}
