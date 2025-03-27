'use client'

import { Button } from '@components/button'
import { Field } from '@components/fieldset'
import Loading from '@components/loading'
import { ExclamationTriangleIcon, PencilSquareIcon } from '@heroicons/react/20/solid'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'
import { GlowInput } from '../components/glow-input'
import { Text } from '../components/text'

const CredentialsForm = () => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setError(null)
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')

    setEmail(email as string)

    if (!email) {
      setError('Please enter your email address.')
      setLoading(false)
      return
    }

    if (!isValidEmail(email as string)) {
      setError('Please enter a valid email address.')
      setLoading(false)
      return
    }

    try {
      const result = await signIn('resend', {
        email,
        redirect: false,
      })

      if (result?.ok) {
        setSubmitted(true)
      } else {
        setError('Failed to send login link. Please try again.')
      }
    } catch (e) {
      console.error('Detailed error:', e)
      setError('An error occurred. Please try again.')
    }

    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-semibold">Check your email</h2>
        <Text className="mt-2 flex items-center justify-center gap-2">
          We&apos;ve emailed a magic link to {email}
          <button onClick={() => setSubmitted(false)} className="text-sm text-blue-600 hover:text-blue-800">
            <PencilSquareIcon className="h-4 w-4" />
          </button>
        </Text>
        <Text className="mt-2">Click the link in your email to log in or sign up.</Text>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleFormSubmit}>
      <Text className="text-center !text-base font-medium !text-black">
        Welcome to <b>wand.email</b>! Enter your email to continue.
      </Text>

      <Field labelPosition="top" className="mb-2">
        <GlowInput
          defaultValue={email}
          id="email"
          placeholder="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </Field>

      {error && (
        <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        {loading ? (
          <Loading />
        ) : (
          <Button className="w-full" type="submit">
            Send link
          </Button>
        )}
      </div>
    </form>
  )
}

export default CredentialsForm
