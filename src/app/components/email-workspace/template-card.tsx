'use client'

import { getTemplate } from '@/lib/data/templates'
import Link from 'next/link'
import { Subheading } from '../heading'
import { EmailContent } from './email-renderer-final'

type TemplateCardProps = {
  href: string
  name: string
  title: string
  description: string
}

const TemplateCard = ({ href, name, title, description }: TemplateCardProps) => {
  const email = getTemplate(name)
  if (!email) {
    return null
  }

  return (
    <Link
      onClick={() => {
        sessionStorage.removeItem('template_email')
      }}
      href={href}
      className="block overflow-hidden rounded-lg shadow-lg hover:outline hover:outline-blue-500"
    >
      <li className="col-span-1 flex !h-full w-[224px] flex-col divide-y border bg-white text-center">
        <div className="flex flex-1 flex-col pb-8">
          <div className="relative h-72 w-full overflow-hidden bg-white">
            <div className="absolute inset-0">
              <div
                className="flex w-full items-start justify-center"
                style={{
                  transform: 'scale(0.32)',
                  transformOrigin: 'top center',
                }}
              >
                <EmailContent email={{ ...email, width: '700px' }} />
              </div>
            </div>
          </div>
          <div className="px-4">
            <Subheading className="mt-6">{description}</Subheading>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">{title}</dt>
              <dd className="mt-3">
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  Premium
                </span>
              </dd>
            </dl>
          </div>
        </div>
      </li>
    </Link>
  )
}

export default TemplateCard
