import { tiers } from '@/lib/data/plans'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import { CheckIcon } from '@heroicons/react/24/solid'
import { Heading } from '../components/heading'
import { Link } from '../components/link'
import { Logo } from '../components/Logo'

const OnboardingPage = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="hidden bg-purple-600 px-12 py-24 lg:col-span-1 lg:block">
        <div className="flex items-center">
          <Logo text textColor="light" />
          <Link className="ml-6 flex items-center font-bold text-white" href="/templates">
            <ChevronLeftIcon className="h-6 w-6 font-bold" />
            Go back
          </Link>
        </div>

        <div className="mt-8 rounded-lg bg-purple-500 p-8">
          <Heading className="mb-6 font-bold !text-white" level={2}>
            Your free plan
          </Heading>
          {tiers[0].highlights.map((highlight) => (
            <div key={highlight} className="mt-2 flex items-center gap-4">
              <CheckIcon className="h-6 w-6 text-green-500" />
              <span className="text-white">{highlight}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-1 rounded-lg bg-gray-100 p-4 lg:col-span-2">
        <h2 className="mb-2 text-xl font-bold">Section 2</h2>
        {/* Add content for section 2 */}
      </div>
    </div>
  )
}

export default OnboardingPage
