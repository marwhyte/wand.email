import clsx from 'clsx'
import React, { forwardRef } from 'react'

export const Range = forwardRef(function Range(
  {
    className,
    error,
    min,
    max,
    value,
    isPercent = false,
    ...props
  }: {
    className?: string
    error?: string
    isPercent?: boolean
    min: number
    max: number
    value: number
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'type' | 'min' | 'max' | 'value'>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const formatValue = (val: number) => {
    return isPercent ? `${val}%` : val
  }

  return (
    <div>
      <span
        data-slot="control"
        className={clsx([
          className,
          'relative block w-full',
          'before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow',
          'dark:before:hidden',
          'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent sm:after:focus-within:ring-2 sm:after:focus-within:ring-blue-500',
          'has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-zinc-950/5 before:has-[[data-disabled]]:shadow-none',
          error && 'before:has-[[data-invalid]]:shadow-red-500/10',
        ])}
      >
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          value={value}
          {...props}
          aria-invalid={error ? 'true' : undefined}
          className={clsx([
            'relative block w-full appearance-none rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]',
            'text-base/6 text-zinc-950 dark:text-white sm:text-sm/6',
            'border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20',
            'bg-transparent dark:bg-white/5',
            'focus:outline-none',
            error &&
              'data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-500 data-[invalid]:data-[hover]:dark:border-red-500',
            'data-[disabled]:border-zinc-950/20 dark:data-[hover]:data-[disabled]:border-white/15 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%]',
            '[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500',
            '[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500',
            '[&::-ms-thumb]:h-5 [&::-ms-thumb]:w-5 [&::-ms-thumb]:cursor-pointer [&::-ms-thumb]:appearance-none [&::-ms-thumb]:rounded-full [&::-ms-thumb]:bg-blue-500',
          ])}
        />
      </span>
      <div className="mt-2 flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
        <span>{formatValue(min)}</span>
        <span>Current: {formatValue(value)}</span>
        <span>{formatValue(max)}</span>
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>}
    </div>
  )
})

export default Range
