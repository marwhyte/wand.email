import CredentialsForm from '@/app/forms/credentials-form'
import { TextButton } from '@components/button'
import { Divider } from '@components/divider'
import { Link } from '@components/link'
import { Text } from '@components/text'
import GoogleLoginForm from './google-login-form'

type LoginFormProps = {
  onSwitchType?: () => void
  redirectToInitialProject?: boolean
}

export default function LoginForm({ onSwitchType, redirectToInitialProject = false }: LoginFormProps) {
  return (
    <>
      <div>
        <CredentialsForm redirectToInitialProject={redirectToInitialProject} />
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
            Not a member?{' '}
            {onSwitchType ? (
              <TextButton onClick={onSwitchType}>Sign up</TextButton>
            ) : (
              <Link href="/signup">Sign up</Link>
            )}
          </Text>
        </div>
      </div>
    </>
  )
}
