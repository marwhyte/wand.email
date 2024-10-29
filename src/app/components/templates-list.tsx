'use client'

import { User } from '@/lib/database/types'
import { Tab, TabGroup, TabList } from '@components/tab'
import { Session } from 'next-auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useQueryParam } from '../hooks/useQueryParam'
import { Divider } from './divider'
import { Heading } from './heading'

enum TemplateTypes {
  personalized = 'personalized',
  recommended = 'recommended',
  ECommerce = 'ecommerce',
  Transactional = 'transactional',
  WelcomeSeries = 'welcome-series',
  Newsletter = 'newsletter',
}

type Props = {
  session: Session | null
  user: User | null | undefined
}

const TemplatesList = ({ session, user }: Props) => {
  const router = useRouter()

  const isOnboarded = user?.is_onboarded || (!user && localStorage.getItem('is_onboarded') === 'true')

  const getNameForTemplateType = (type: TemplateTypes) => {
    switch (type) {
      case TemplateTypes.recommended:
        return 'Recommended'
      case TemplateTypes.ECommerce:
        return 'E-Commerce'
      case TemplateTypes.Transactional:
        return 'Transactional'
      case TemplateTypes.WelcomeSeries:
        return 'Welcome Series'
      case TemplateTypes.Newsletter:
        return 'Newsletter'
      case TemplateTypes.personalized:
        return 'Personalized'
    }
  }

  const [templateType, setTemplateType] = useQueryParam<TemplateTypes>(
    'templateType',
    isOnboarded ? TemplateTypes.personalized : TemplateTypes.recommended,
    (value) => Object.values(TemplateTypes).includes(value as TemplateTypes)
  )

  useEffect(() => {
    const value = localStorage.getItem('postSignUpRedirectTo')

    if (session?.user && value) {
      localStorage.removeItem('postSignUpRedirectTo')
      router.push(value)
    }
  }, [session, router])

  const handleTabChange = (index: number) => {
    console.log(index)
    console.log(Object.values(TemplateTypes)[index])
    const newTab = Object.values(TemplateTypes)[index]

    setTemplateType(newTab)
  }

  return (
    <div>
      {!isOnboarded && (
        <div>
          <div className="px-6 py-6 sm:px-6 sm:py-12 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Set up your branding.
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-pretty text-lg/8 text-gray-600">
                By uploading your logo, colors and style, you can browse ready made emails for your organization.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="/onboarding"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </a>
                <Link href="/onboarding" className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
                  No signup required <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="relative mb-16 mt-6">
            <Divider className="absolute inset-3 flex items-center" aria-hidden="true" />

            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-white px-6 dark:bg-zinc-900">Or browse templates</span>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <Heading
          level={1}
          className={
            templateType === TemplateTypes.personalized
              ? 'animate-animate-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-[size:200%] !bg-clip-text !text-transparent'
              : undefined
          }
        >
          {getNameForTemplateType(templateType)} Email Templates
        </Heading>
      </div>
      <div className="mt-10 flex justify-center">
        <TabGroup value={templateType} onChange={handleTabChange}>
          <TabList>
            {Object.values(TemplateTypes)
              .filter((type) => {
                if (type === TemplateTypes.personalized) {
                  return isOnboarded
                }
                return true
              })
              .map((type) => (
                <Tab
                  key={type}
                  selected={templateType === type}
                  className={
                    type === TemplateTypes.personalized && templateType === type
                      ? 'animate-animate-gradient bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] !text-white'
                      : undefined
                  }
                >
                  {getNameForTemplateType(type)}
                </Tab>
              ))}
          </TabList>
        </TabGroup>
      </div>
    </div>
  )
}

export default TemplatesList
