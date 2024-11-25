'use client'

import { User } from '@/lib/database/types'
import { Tab, TabGroup, TabList } from '@components/tab'
import { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { convertImageToEmail } from '../actions/generateTemplateFromImage'
import { useQueryParam } from '../hooks/useQueryParam'
import { Heading } from './heading'

import { Input } from '@/app/components/input'
import { templates, templateTypes } from '@/lib/data/templates'
import Link from 'next/link'
import { useState } from 'react'
import { Divider } from './divider'
import TemplateCard from './email-workspace/template-card'
import { Field, Label } from './fieldset'

const isCreateMode = process.env.NEXT_PUBLIC_CREATE_MODE === 'true'

export const TemplateGeneratorForm = () => {
  const [result, setResult] = useState<string>('')
  const [templateName, setTemplateName] = useState<string>('')
  const [imageNames, setImageNames] = useState<string[]>([])
  const [description, setDescription] = useState<string>('')
  const [htmlEmail, setHtmlEmail] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <form
      onSubmit={async (e) => {
        setLoading(true)
        e.preventDefault()
        const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement
        if (!fileInput.files?.length) return

        const file = fileInput.files[0]
        if (!file.type.startsWith('image/')) {
          alert('Please upload an image file')
          return
        }

        try {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('htmlEmail', htmlEmail)

          const response = await convertImageToEmail(formData, templateName, imageNames, description)
          setResult(response)
        } catch (error) {
          console.error('Error processing image:', error)
          alert('Failed to process image')
        } finally {
          setLoading(false)
        }
      }}
      className="mt-6"
    >
      <div className="flex flex-col items-center gap-4">
        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="Template Name"
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
          required
        />
        <input
          type="text"
          value={imageNames.join(', ')}
          onChange={(e) => setImageNames(e.target.value.split(',').map((name) => name.trim()))}
          placeholder="Image Names (comma-separated)"
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Template Description"
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
        />
        <textarea
          value={htmlEmail}
          onChange={(e) => setHtmlEmail(e.target.value)}
          placeholder="HTML Email"
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
        />
        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
        />
        <button
          disabled={loading}
          type="submit"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {loading ? 'Generating...' : 'Generate Template'}
        </button>

        {result && (
          <div className="mt-4 w-full max-w-2xl">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Template:</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result)
                  // Optional: Add some visual feedback
                  alert('Copied to clipboard!')
                }}
                type="button"
                className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200"
              >
                Copy
              </button>
            </div>
            <pre className="whitespace-pre-wrap rounded-md bg-gray-100 p-4 text-sm">{result}</pre>
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

  const isOnboarded = user?.is_onboarded || (!user && localStorage.getItem('is_onboarded') === 'true')

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

  const currentTemplates = templates.filter((template) => template.types.includes(templateType))

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
          {templateType === 'personalized' && (
            <div className="mx-auto max-w-2xl">
              <Field>
                <Label>In a few words, describe the email you are looking for.</Label>
                <Input
                  type="text"
                  value={personalizedEmail}
                  onChange={(e) => setPersonalizedEmail(e.target.value)}
                  placeholder="Onboarding emails for new customers after a clothing purchase..."
                  required
                />
              </Field>
            </div>
          )}
          <ul role="list" className="flex flex-wrap justify-center gap-6 md:justify-start">
            {currentTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </ul>
        </div>
      </div>
      {isCreateMode && <TemplateGeneratorForm />}
    </div>
  )
}

export default TemplatesList
