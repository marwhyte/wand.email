'use client'

import Link from 'next/link'
import { Subheading } from '../heading'

type TemplateCardProps = {
  href: string
  image: string
  title: string
  description: string
}

const TemplateCard = ({ href, image, title, description }: TemplateCardProps) => {
  return (
    <Link
      onClick={() => {
        sessionStorage.removeItem('template_email')
      }}
      href={href}
    >
      <li className="col-span-1 flex flex-col divide-y rounded-lg border border-green-200 bg-white text-center outline-green-200 hover:outline">
        <div className="flex flex-1 flex-col pb-8">
          <img alt="Going demo" src={image} className="full-w" />

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
      </li>
    </Link>
  )
}

export default TemplateCard
