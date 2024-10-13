'use client'

import { updateUser } from '@/lib/database/queries/users'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AlertBox from '../components/alert-box'
import { Button } from '../components/button'
import { Subheading } from '../components/heading'
import { Input } from '../components/input'
import SubmitButton from '../components/submit-button'
import { Text } from '../components/text'

type Props = {
  session: Session | null
}

const AccountForm = ({ session }: Props) => {
  const { data: sessionData, update } = useSession()
  const [name, setName] = useState(session?.user?.name ?? '')
  const [message, setMessage] = useState({ type: '', content: '' })

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? '')
    }
  }, [session?.user])

  const handleSubmit = async (formData: FormData) => {
    try {
      await updateUser(formData)
      setMessage({ type: 'success', content: 'Account updated successfully!' })
      await update({
        name,
      })
    } catch (error) {
      setMessage({ type: 'error', content: 'Failed to update account. Please try again.' })
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (message.type === 'success') setMessage({ type: '', content: '' })
    }, 3000)
  }, [message])

  return (
    <form action={handleSubmit}>
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Name</Subheading>
          <Text>Change your account name here</Text>
        </div>
        <div>
          <Input value={name} onChange={(e) => setName(e.target.value)} aria-label="Organization Name" name="name" />
        </div>
      </section>
      <div className="flex justify-end gap-4">
        <Button type="reset" plain>
          Reset
        </Button>
        <SubmitButton
          isSuccess={message.type === 'success'}
          disabled={!name || name === session?.user?.name || sessionData?.user?.name === name}
        >
          Save changes
        </SubmitButton>
      </div>
      {message.type === 'error' && <AlertBox status="error">{message.content}</AlertBox>}
    </form>
  )
}

export default AccountForm
