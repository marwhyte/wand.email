import { tiers } from '@/lib/data/plans'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import { CheckIcon } from '@heroicons/react/24/solid'
import { fetchUser } from '../actions'
import { Heading } from '../components/heading'
import { Link } from '../components/link'
import { Logo } from '../components/Logo'
import { LogoProvider } from '../components/onboarding/logo-provider'

const OnboardingPage = async () => {
  const user = await fetchUser()

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-[550px] bg-purple-600 px-12 py-24 lg:block">
        <div className="flex items-center">
          <Logo text textColor="light" />
          <Link className="ml-6 flex items-center font-bold text-white" href="/templates">
            <ChevronLeftIcon className="h-6 w-6 font-bold" />
            Go back
          </Link>
        </div>

        <div className="mt-8 rounded-lg bg-purple-500 p-8">
          <Heading className="mb-6 font-bold !text-white" level={2}>
            Access to
          </Heading>
          <div className="space-y-4">
            {tiers[0].highlights.map((highlight) => (
              <div key={highlight} className="flex items-center gap-4">
                <CheckIcon className="h-6 w-6 text-green-500" />
                <span className="text-white">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex min-h-screen flex-1 items-center justify-center rounded-lg">
        <div className="w-[480px]">
          <LogoProvider user={user ?? null} />
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage
