'use client'

import { Button } from '@components/button'
import { Field, Label } from '@components/fieldset'
import { Input } from '@components/input'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

const ForgotPasswordForm = () => {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSuccess(true)
      } else {
        const error = await response.text()
        setError(error)
      }
    } catch (e) {
      setError('An error occurred. Please try again.')
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center">
        <p className="mb-4">If an account exists for that email, we have sent password reset instructions to it.</p>
        <p>Please check your email to continue.</p>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <Field labelPosition="top" className="mb-4">
        <Label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Email
        </Label>
        <Input id="email" placeholder="Enter your email" name="email" type="email" autoComplete="email" required />
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

      <Button className="w-full" type="submit" loading={loading}>
        Send Reset Instructions
      </Button>
    </form>
  )
}

export default ForgotPasswordForm
