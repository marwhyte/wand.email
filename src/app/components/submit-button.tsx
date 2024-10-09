'use client'

import { ComponentProps, ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from './button'
import Loading from './loading'

type Props = ComponentProps<typeof Button> & {
  children: ReactNode
}

export default function SubmitButton({ children, ...props }: Props) {
  const { pending } = useFormStatus()
  return (
    <Button {...props} type="submit" aria-disabled={pending}>
      {children}
      {pending && <Loading width={16} height={16} />}
    </Button>
  )
}
