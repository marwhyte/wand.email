import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { Input } from './input'

export const ColorInput = forwardRef(function ColorInput(
  {
    className,
    onChange,
    showTransparent = true,
    showHexCode = false,
    ...props
  }: Omit<React.ComponentPropsWithoutRef<typeof Input>, 'onChange'> & {
    onChange?: (value: string) => void
    showTransparent?: boolean
    showHexCode?: boolean
  },
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

  const handleHexCodeClick = () => {
    if (internalRef.current) {
      internalRef.current.click()
    }
  }

  // Determine if we should show a colored border for custom colors
  const colorValue = (props.value as string) || ''
  const isCustomSelected = className?.includes('custom-color-selected')
  const borderStyle =
    isCustomSelected && colorValue && colorValue !== 'transparent'
      ? { borderColor: colorValue, borderWidth: '2px' }
      : {}

  return (
    <div className={`relative ${className || ''}`}>
      {showHexCode ? (
        <div
          className="flex h-10 items-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
          style={borderStyle}
        >
          <div className="h-10 w-10 overflow-hidden">
            <Input
              className="h-10 w-10 !border-0 !bg-gray-50"
              ref={internalRef}
              type="color"
              onChange={handleChange}
              {...props}
            />
          </div>
          <button
            className="h-10 max-w-[80px] truncate px-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
            onClick={handleHexCodeClick}
            title={(props.value as string) || ''}
          >
            {props.value || ''}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 overflow-hidden rounded-lg border border-gray-200 bg-gray-50" style={borderStyle}>
            <Input
              className="h-10 w-10 !border-0 !bg-gray-50"
              ref={internalRef}
              type="color"
              onChange={handleChange}
              {...props}
            />
          </div>
          {showTransparent && (
            <button
              type="button"
              onClick={handleSetTransparent}
              title="Set transparent"
              className="h-10 rounded-lg border border-gray-200 bg-gray-50 p-2"
            >
              <span className="sr-only">Set transparent</span>
              <div className="h-5 w-5 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc),linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc)] bg-[length:8px_8px] bg-[0_0,4px_4px]" />
            </button>
          )}
        </div>
      )}
    </div>
  )
})
