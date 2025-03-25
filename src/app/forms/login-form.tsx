'use client'

import { Divider } from '../components/divider'
import CredentialsForm from './credentials-form'
import GoogleLoginForm from './google-login-form'

const LoginForm = () => {
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
    </div>
  )
}

export default LoginForm
