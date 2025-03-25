'use client'

import { TextButton } from '@components/button'
import { Link } from '@react-email/components'
import { useState } from 'react'
import { Divider } from '../components/divider'
import { Text } from '../components/text'
import CredentialsForm from './credentials-form'
import GoogleLoginForm from './google-login-form'

type Props = {
  onSwitchType?: () => void
}

const LoginForm = ({ onSwitchType }: Props) => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  if (emailSent) {
    return (
      <div className="text-center">
        <p className="mb-4">Check your email</p>
        <p>A sign in link has been sent to your email address.</p>
      </div>
    )
  }

  return (
    <div>
      <CredentialsForm />
      <div>
        <div className="relative mt-10">
          <Divider className="absolute inset-3 flex items-center" aria-hidden="true" />

          <div className="relative flex justify-center text-sm font-medium leading-6">
            <span className="bg-white px-6 dark:bg-zinc-900">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <GoogleLoginForm />
        </div>
      </div>
      <div className="mt-6">
        <Text className="text-center">
          Already a member?{' '}
          {onSwitchType ? <TextButton onClick={onSwitchType}>Login</TextButton> : <Link href="/login">Login</Link>}
        </Text>
      </div>
    </div>
  )
}

export default LoginForm
