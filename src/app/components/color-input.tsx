import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { Input } from './input'

export const ColorInput = forwardRef(function ColorInput(
  {
    className,
    onChange,
    ...props
  }: Omit<React.ComponentPropsWithoutRef<typeof Input>, 'onChange'> & { onChange?: (value: string) => void },
  externalRef: React.ForwardedRef<HTMLInputElement>
) {
  const internalRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(externalRef, () => internalRef.current as HTMLInputElement)

  const handleSetTransparent = () => {
    if (internalRef.current) {
      internalRef.current.value = 'transparent'
      onChange?.('transparent')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <div className="relative mt-2 flex items-center gap-2">
      <Input ref={internalRef} type="color" onChange={handleChange} {...props} />
      <button type="button" onClick={handleSetTransparent} title="Set transparent">
        <span className="sr-only">Set transparent</span>
        <div className="h-5 w-5 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc),linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc)] bg-[length:8px_8px] bg-[0_0,4px_4px]" />
      </button>
    </div>
  )
})
