import { Divider } from '@/app/components/divider'
import { Heading } from '@/app/components/heading'
import AccountForm from '@/app/forms/account-form'
import DeleteAccountForm from '@/app/forms/delete-account-form'
import { auth } from '@/auth'

const SettingsPage = async () => {
  const session = await auth()
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Heading>Settings</Heading>
      <Divider className="my-10 mt-6" />

      <AccountForm session={session} />

      <Divider className="my-10" soft />

      <DeleteAccountForm />
    </div>
  )
}

export default SettingsPage
