'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Divider } from '../components/divider'
import TemplateCard from '../components/email-workspace/template-card'
import { Heading } from '../components/heading'
import { Tab, TabGroup, TabList } from '../components/tab'
import { useQueryParam } from '../hooks/useQueryParam'

enum TemplateTypes {
  recommended = 'recommended',
  ECommerce = 'ecommerce',
  Transactional = 'transactional',
  WelcomeSeries = 'welcome-series',
  Newsletter = 'newsletter',
}

export default function TemplatesPage() {
  const session = useSession()
  const router = useRouter()

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
    }
  }

  const [templateType, setTemplateType] = useQueryParam<TemplateTypes>(
    'templateType',
    TemplateTypes.recommended,
    (value) => Object.values(TemplateTypes).includes(value as TemplateTypes)
  )

  useEffect(() => {
    const value = localStorage.getItem('postSignUpRedirectTo')

    if (session.data?.user && value) {
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
            </div>
          </div>
        </div>

        <div className="relative mb-16 mt-6">
          <Divider className="absolute inset-3 flex items-center" aria-hidden="true" />

          <div className="relative flex justify-center text-sm font-medium leading-6">
            <span className="bg-white px-6 dark:bg-zinc-900">Or browse templates</span>
          </div>
        </div>

        <div className="text-center">
          <Heading level={1}>{getNameForTemplateType(templateType)} Email Templates</Heading>
        </div>
        <div className="mt-10 flex justify-center">
          <TabGroup value={templateType} onChange={handleTabChange}>
            <TabList>
              {Object.values(TemplateTypes).map((type) => (
                <Tab key={type} selected={templateType === type}>
                  {getNameForTemplateType(type)}
                </Tab>
              ))}
            </TabList>
          </TabGroup>
        </div>
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
