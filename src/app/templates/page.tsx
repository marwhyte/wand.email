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
        <ul role="list" className="mx-auto flex max-w-7xl flex-wrap gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <TemplateCard
            href="/templates/going"
            name="going"
            title="Going"
            description="Marketing emails for flight deals"
          />
          <TemplateCard
            href="/templates/ebay"
            name="ebay"
            title="Ebay"
            description="Marketing emails for flight deals"
          />
          <TemplateCard
            href="/templates/nike-verification"
            name="nike-verification"
            title="Nike Verification"
            description="Verification code email"
          />
        </ul>
      </div>
    </div>
  )
}
