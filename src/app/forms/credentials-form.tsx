'use client'

import { doCredentialsLogin } from '@/app/actions'
import { Button } from '@/app/components/button'
import { Field, Label } from '@/app/components/fieldset'
import { Input } from '@/app/components/input'
import { Link } from '@/app/components/link'
import Loading from '@/app/components/loading'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type Props = {
  register?: boolean
}

const CredentialsForm = ({ register }: Props) => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setError(null)
    const formData = new FormData(event.currentTarget)

    if (!formData.get('email') || !formData.get('password') || (!formData.get('name') && register)) {
      setError('Please fill in all fields.')
      return
    }

    if (register) {
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.status === 201) {
          await doCredentialsLogin(formData)

          router.push('/home')
        } else {
          setError(await response.text())
        }
      } catch (e) {
        console.error('here', e)
        setError("Couldn't sign up. Please try again.")
      }
    } else {
      try {
        await doCredentialsLogin(formData)

        router.push('/home')
      } catch (e) {
        console.error('here', e)
        setError('Invalid credentials. Please try again.')
      }
    }

    setLoading(false)
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
      {register && (
        <div>
          <Field>
            <Label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              Name
            </Label>
            <Input id="name" placeholder="Name" name="name" type="text" autoComplete="name" required />
          </Field>
        </div>
      )}

      <div>
        <div>
          <Field>
            <Label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email
            </Label>
            <Input id="email" placeholder="Email" name="email" type="email" autoComplete="email" required />
          </Field>
        </div>
      </div>

      <div>
        <Field>
          <Label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
            Password
          </Label>
          <Input
            id="password"
            placeholder="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </Field>

        <div className="mt-6 text-sm leading-6">
          <Link href="/reset-password">Forgot password?</Link>
        </div>
      </div>

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
            {register ? 'Register' : 'Sign in'}
          </Button>
        )}
      </div>
    </form>
  )
}

export default CredentialsForm
