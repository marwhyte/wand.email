'use client'

import { User } from '@/lib/database/types'
import { Tab, TabGroup, TabList } from '@components/tab'
import { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useQueryParam } from '../hooks/useQueryParam'
import { Heading } from './heading'

import { getTemplateConfig, templates, templateTypes } from '@/lib/data/templates'
import Link from 'next/link'
import { useState } from 'react'
import { generateEmailFromDescription } from '../actions/generateTemplateFromOnboarding'
import { Divider } from './divider'
import TemplateCard from './email-workspace/template-card'
import { goingTemplate } from './email-workspace/templates/going-template'
import { Input } from './input'

export const TemplateGeneratorForm = ({
  primaryColor,
  secondaryColor,
  themes,
  logo,
  businessType,
}: {
  primaryColor: string | null
  secondaryColor: string | null
  themes: string[]
  logo: string | null
  businessType: string | null
}) => {
  const [description, setDescription] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [generatedTemplate, setGeneratedTemplate] = useState<Template | null>(null)

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
          const colorScheme = [primaryColor, secondaryColor].filter(Boolean).join(', ')
          const response = await generateEmailFromDescription(
            description,
            colorScheme,
            themes,
            logo || '',
            businessType || ''
          )
          setGeneratedTemplate({
            id: 'generated',
            name: 'Generated Template',
            description: description,
            types: ['personalized'],
            template: response,
          })
        } catch (error) {
          console.error('Error generating template:', error)
          alert('Failed to generate template')
        } finally {
          setLoading(false)
        }
      }}
      className="mx-auto mt-6 max-w-2xl"
    >
      <div className="flex flex-col items-center gap-4">
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a short description of the email you want"
          required
        />

        <button
          disabled={loading}
          type="submit"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {loading ? 'Generating...' : 'Generate Template'}
        </button>

        {generatedTemplate && (
          <div className="mt-4">
            <h3 className="mb-4 text-lg font-semibold">Generated Template:</h3>
            <TemplateCard template={generatedTemplate} />
          </div>
        )}
      </div>
    </form>
  )
}

type Props = {
  session: Session | null
  user: User | null | undefined
}

const TemplatesList = ({ session, user }: Props) => {
  const router = useRouter()
  const [personalizedEmail, setPersonalizedEmail] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentTemplates, setCurrentTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [config, setConfig] = useState<any>(null)

  const isOnboarded = user?.is_onboarded || (!user && localStorage.getItem('is_onboarded') === 'true')
  const themes = user?.themes || (localStorage.getItem('themes') ? JSON.parse(localStorage.getItem('themes')!) : [])
  const primaryColor = user?.primary_color || localStorage.getItem('primaryColor')
  const secondaryColor = user?.secondary_color || localStorage.getItem('secondaryColor')
  const businessType = user?.business_type || localStorage.getItem('businessType')

  const getNameForTemplateType = (type: TemplateTypes) => {
    switch (type) {
      case 'recommended':
        return 'Recommended'
      case 'ecommerce':
        return 'E-Commerce'
      case 'transactional':
        return 'Transactional'
      case 'welcome-series':
        return 'Welcome Series'
      case 'newsletter':
        return 'Newsletter'
      case 'personalized':
        return 'Personalized'
    }
  }

  const [templateType, setTemplateType] = useQueryParam<TemplateTypes>(
    'templateType',
    isOnboarded ? 'personalized' : 'recommended',
    (value) => templateTypes.includes(value as TemplateTypes)
  )

  useEffect(() => {
    const initializeTemplates = async () => {
      if (templateType === 'personalized') {
        try {
          const templateConfig = await getTemplateConfig({ user })
          setConfig(templateConfig)
          setCurrentTemplates([
            {
              ...templates[0], // Using going template as base
              template: goingTemplate(),
            },
          ])
        } catch (error) {
          console.error('Error initializing templates:', error)
          setCurrentTemplates([])
        }
      } else {
        setCurrentTemplates(templates)
      }
      setIsLoading(false)
    }

    initializeTemplates()
  }, [templateType, user])

  useEffect(() => {
    const loadTemplates = async () => {
      if (templateType !== 'personalized') {
        setCurrentTemplates(templates.filter((template) => template.types.includes(templateType)))
        return
      }

      // Only reset to default personalized template if there are no current templates
      if (currentTemplates.length === 0) {
        try {
          const config = await getTemplateConfig({ user })
          setCurrentTemplates([
            {
              ...templates[0],
              template: goingTemplate(),
            },
          ])
        } catch (error) {
          console.error('Error loading templates:', error)
        }
      }
    }

    loadTemplates()
  }, [templateType, currentTemplates.length, user])

  useEffect(() => {
    const value = localStorage.getItem('postSignUpRedirectTo')

    if (session?.user && value) {
      localStorage.removeItem('postSignUpRedirectTo')
      router.push(value)
    }
  }, [session, router])

  const handleTabChange = (index: number) => {
    const availableTypes = templateTypes.filter((type) => {
      if (type === 'personalized') {
        return isOnboarded
      }
      if (type === 'recommended') {
        return !isOnboarded
      }
      return true
    })

    const newTab = availableTypes[index]
    setTemplateType(newTab as TemplateTypes)
  }

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
              templateType === 'personalized'
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
              {templateTypes
                .filter((type) => {
                  if (type === 'personalized') {
                    return isOnboarded
                  }
                  if (type === 'recommended') {
                    return !isOnboarded
                  }
                  return true
                })
                .map((type) => (
                  <Tab
                    key={type}
                    selected={templateType === type}
                    className={
                      type === 'personalized' && templateType === type
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
      <div className="min-h-96 bg-zinc-100">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {isOnboarded && config && !process.env.NEXT_PUBLIC_CREATE_MODE && (
            <TemplateGeneratorForm
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              themes={themes}
              logo={config.logoUrl}
              businessType={businessType}
            />
          )}
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <ul role="list" className="flex flex-wrap justify-center gap-6 md:justify-start">
              {currentTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default TemplatesList
