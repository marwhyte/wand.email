import { Subheading } from '@/app/components/heading'
import { auth } from '@/auth'
import Image from 'next/image'
import Link from 'next/link'

export default async function TemplatesPage() {
  const session = await auth()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Link href="/home/templates/going">
          <li className="col-span-1 flex flex-col divide-y rounded-lg border border-green-200 text-center outline-green-200 hover:outline">
            <div className="flex flex-1 flex-col py-8">
              <Image alt="Going logo" src="/going/going-logo.png" width={100} height={100} className="mx-auto mb-4" />
              <img alt="Going demo" src="/going/demo.png" className="full-w" />

              <Subheading className="mt-6">Marketing emails for flight deals</Subheading>
              <dl className="mt-1 flex flex-grow flex-col justify-between">
                <dt className="sr-only">Flight marketing emails</dt>
                <dd className="mt-3">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    Premium
                  </span>
                </dd>
              </dl>
            </div>
          </li>
        </Link>
      </ul>
    </div>
  )
}
