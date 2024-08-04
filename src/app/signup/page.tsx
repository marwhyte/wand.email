import { Link } from '@/components/link'
import RegistrationForm from '@/components/RegistrationForm'
import UnauthenticatedHeader from '@/components/UnauthenticatedHeader'

const SignupPage = () => {
  return (
    <div>
      <UnauthenticatedHeader isSignup />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <RegistrationForm />

          <p className="mt-10 text-center text-sm text-gray-500">
            Already a member? <Link href="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
