import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React, { forwardRef } from 'react'

export function InputGroup({ children }: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      data-slot="control"
      className={clsx(
        'relative isolate block',
        '[&_input]:has-[[data-slot=icon]:first-child]:pl-10 [&_input]:has-[[data-slot=icon]:last-child]:pr-10 sm:[&_input]:has-[[data-slot=icon]:first-child]:pl-8 sm:[&_input]:has-[[data-slot=icon]:last-child]:pr-8',
        '[&>[data-slot=icon]]:pointer-events-none [&>[data-slot=icon]]:absolute [&>[data-slot=icon]]:top-3 [&>[data-slot=icon]]:z-0 [&>[data-slot=icon]]:size-5 sm:[&>[data-slot=icon]]:top-2.5 sm:[&>[data-slot=icon]]:size-4',
        '[&>[data-slot=icon]:first-child]:left-3 sm:[&>[data-slot=icon]:first-child]:left-2.5 [&>[data-slot=icon]:last-child]:right-3 sm:[&>[data-slot=icon]:last-child]:right-2.5',
        '[&>[data-slot=icon]]:text-zinc-500 dark:[&>[data-slot=icon]]:text-zinc-400'
      )}
    >
      {children}
    </span>
  )
}

const dateTypes = ['date', 'datetime-local', 'month', 'time', 'week']
type DateType = (typeof dateTypes)[number]

export const Input = forwardRef(function Input(
  {
    className,
    error,
    ...props
  }: {
    className?: string
    error?: string
    type?: 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | 'color' | DateType
  } & Omit<Headless.InputProps, 'className'>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <div>
      <span
        data-slot="control"
        className={clsx([
          className,
          // Basic layout
          'relative block w-full',
          // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
          'before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow',
          // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
          'dark:before:hidden',
          // Focus ring
          'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent sm:after:focus-within:ring-2 sm:after:focus-within:ring-blue-500',
          // Disabled state
          'has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-zinc-950/5 before:has-[[data-disabled]]:shadow-none',
          // Invalid state
          'before:has-[[data-invalid]]:shadow-red-500/10',
          error && 'before:has-[[data-invalid]]:shadow-red-500/10',
        ])}
      >
        <Headless.Input
          ref={ref}
          {...props}
          aria-invalid={error ? 'true' : undefined}
          className={clsx([
            // Date classes
            props.type &&
              dateTypes.includes(props.type) && [
                '[&::-webkit-datetime-edit-fields-wrapper]:p-0',
                '[&::-webkit-date-and-time-value]:min-h-[1.5em]',
                '[&::-webkit-datetime-edit]:inline-flex',
                '[&::-webkit-datetime-edit]:p-0',
                '[&::-webkit-datetime-edit-year-field]:p-0',
                '[&::-webkit-datetime-edit-month-field]:p-0',
                '[&::-webkit-datetime-edit-day-field]:p-0',
                '[&::-webkit-datetime-edit-hour-field]:p-0',
                '[&::-webkit-datetime-edit-minute-field]:p-0',
                '[&::-webkit-datetime-edit-second-field]:p-0',
                '[&::-webkit-datetime-edit-millisecond-field]:p-0',
                '[&::-webkit-datetime-edit-meridiem-field]:p-0',
              ],
            // Color input classes
            props.type === 'color' && [
              'h-10 w-10 cursor-pointer overflow-hidden bg-gray-50 p-0',
              '[&::-webkit-color-swatch-wrapper]:!m-0 [&::-webkit-color-swatch-wrapper]:h-full [&::-webkit-color-swatch-wrapper]:w-full [&::-webkit-color-swatch-wrapper]:bg-gray-50 [&::-webkit-color-swatch-wrapper]:!p-2',
              '[&::-webkit-color-swatch]:!m-0 [&::-webkit-color-swatch]:h-full [&::-webkit-color-swatch]:w-full [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:!border-0',
              '[&::-moz-color-swatch]:!m-0 [&::-moz-color-swatch]:h-full [&::-moz-color-swatch]:w-full [&::-moz-color-swatch]:rounded-lg [&::-moz-color-swatch]:!border-0',
            ],
            // Basic layout
            'relative block w-full appearance-none rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]',
            // Override padding for color inputs
            props.type === 'color' && '!border-0 !p-0 sm:!p-0',
            // Typography
            'text-base/6 text-zinc-950 placeholder:text-zinc-500 dark:text-white sm:text-sm/6',
            // Border
            props.type !== 'color' &&
              'border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20',
            // Background color
            'bg-transparent dark:bg-white/5',
            // Hide default focus styles
            'focus:outline-none',
            // Invalid state
            'data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-500 data-[invalid]:data-[hover]:dark:border-red-500',
            error &&
              'data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-500 data-[invalid]:data-[hover]:dark:border-red-500',
            // Disabled state
            'data-[disabled]:border-zinc-950/20 dark:data-[hover]:data-[disabled]:border-white/15 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%]',
            // System icons
            'dark:[color-scheme:dark]',
          ])}
        />
      </span>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>}
    </div>
  )
})

export const NumberInput = forwardRef(function NumberInput(
  {
    className,
    error,
    min = 1,
    max = 50,
    value,
    onChange,
    id,
    label,
    helperText,
    ...props
  }: {
    className?: string
    error?: string
    min?: number
    max?: number
    value?: number
    onChange?: (value: number) => void
    id?: string
    label?: string
    helperText?: string
  } & Omit<Headless.InputProps, 'className' | 'type' | 'onChange' | 'value'>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const inputId = `number-input-${React.useId()}`
  const [inputValue, setInputValue] = React.useState(value?.toString() || '')

  React.useEffect(() => {
    if (value !== undefined) {
      setInputValue(value.toString())
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    const numValue = parseInt(newValue, 10)
    if (!isNaN(numValue) && onChange) {
      // Enforce min and max constraints when typing
      const constrainedValue = Math.min(Math.max(numValue, min), max)
      if (constrainedValue !== numValue) {
        // Update the input value if it was constrained
        setInputValue(constrainedValue.toString())
      }
      onChange(constrainedValue)
    }
  }

  const increment = () => {
    const currentValue = parseInt(inputValue, 10) || 0
    const newValue = Math.min(currentValue + 1, max)
    setInputValue(newValue.toString())
    if (onChange) onChange(newValue)
  }

  const decrement = () => {
    const currentValue = parseInt(inputValue, 10) || 0
    const newValue = Math.max(currentValue - 1, min)
    setInputValue(newValue.toString())
    if (onChange) onChange(newValue)
  }

  return (
    <div className={className}>
      {label && (
        <Headless.Label htmlFor={inputId} className="mb-1 block text-xs font-medium text-zinc-900 dark:text-white">
          {label}
        </Headless.Label>
      )}
      <div className="relative flex max-w-[6rem] items-center">
        <button
          type="button"
          onClick={decrement}
          className="h-8 rounded-s-md border border-zinc-300 bg-zinc-100 p-1.5 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-100 dark:border-zinc-600 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:focus:ring-zinc-700"
        >
          <svg
            className="h-2.5 w-2.5 text-zinc-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 2"
          >
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
          </svg>
        </button>
        <Headless.Input
          ref={ref}
          type="text"
          id={inputId}
          value={inputValue}
          onChange={handleChange}
          aria-invalid={error ? 'true' : undefined}
          data-input-counter
          data-input-counter-min={min}
          data-input-counter-max={max}
          aria-describedby={helperText ? `${inputId}-helper-text` : undefined}
          className="block h-8 w-full border-x-0 border-zinc-300 bg-zinc-50 py-1.5 text-center text-xs text-zinc-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...props}
        />
        <button
          type="button"
          onClick={increment}
          className="h-8 rounded-e-md border border-zinc-300 bg-zinc-100 p-1.5 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-100 dark:border-zinc-600 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:focus:ring-zinc-700"
        >
          <svg
            className="h-2.5 w-2.5 text-zinc-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
        </button>
      </div>
      {helperText && (
        <p id={`${inputId}-helper-text`} className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {helperText}
        </p>
      )}
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-500">{error}</p>}
    </div>
  )
})
