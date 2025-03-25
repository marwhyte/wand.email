'use client'

import { Button } from '@components/button'
import { Field, Label } from '@components/fieldset'
import { Input } from '@components/input'
import Loading from '@components/loading'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'

type Props = {
  register?: boolean
}

const CredentialsForm = ({ register }: Props) => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setError(null)
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')

    if (!email) {
      setError('Please enter your email address.')
      setLoading(false)
      return
    }

    try {
      console.log('Submitting email:', email)
      const result = await signIn('resend', {
        email,
        redirect: false,
      })
      console.log('SignIn result:', result)

      if (result?.ok) {
        console.log('Response was ok')
        setSubmitted(true)
      } else {
        console.log('Response error:', result?.error)
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
        <p className="mt-2">We&apos;ve sent you a magic link to sign in. Please check your email inbox.</p>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleFormSubmit}>
      <Field labelPosition="top" className="mb-4">
        <Label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Email
        </Label>
        <Input id="email" placeholder="Email" name="email" type="email" autoComplete="email" required />
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
            Send Sign in Link
          </Button>
        )}
      </div>
    </form>
  )
}

export default CredentialsForm
