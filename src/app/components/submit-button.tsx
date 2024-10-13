'use client'

import { ComponentProps, ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from './button'
import Loading from './loading'
import Success from './success'

type Props = ComponentProps<typeof Button> & {
  children: ReactNode
  isSuccess?: boolean
}

export default function SubmitButton({ children, isSuccess, ...props }: Props) {
  const { pending } = useFormStatus()

  return (
    <>
      <Button
        {...props}
        type="submit"
        aria-disabled={pending}
        disabled={pending || props.disabled || isSuccess}
        className={`relative ${props.className || ''}`}
      >
        <span className={pending || isSuccess ? 'invisible' : 'visible'}>{children}</span>
        {pending && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loading width={16} height={16} />
          </span>
        )}
        {isSuccess && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Success height={16} width={16} />
          </span>
        )}
      </Button>
    </>
  )
}
