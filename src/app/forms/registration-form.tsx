import { Link } from '@/app/components/link'
import { Text } from '@/app/components/text'
import { TextButton } from '@components/button'
import { Divider } from '@components/divider'
import CredentialsForm from './credentials-form'
import GoogleLoginForm from './google-login-form'

type Props = {
  onSwitchType?: () => void
  redirectToInitialProject?: boolean
}

export default function RegistrationForm({ onSwitchType, redirectToInitialProject = false }: Props) {
  return (
    <>
      <div>
        <CredentialsForm register redirectToInitialProject={redirectToInitialProject} />
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
    </>
  )
}
