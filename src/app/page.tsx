import UnauthenticatedHeader from '@/components/UnauthenticatedHeader'
import LoginForm from '@/forms/login-form'

export default function Home() {
  return (
    <div>
      <UnauthenticatedHeader isLogin />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
