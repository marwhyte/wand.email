import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import type React from 'react'

export function Fieldset({ className, ...props }: { className?: string } & Omit<Headless.FieldsetProps, 'className'>) {
  return (
    <Headless.Fieldset
      {...props}
      className={clsx(className, '[&>*+[data-slot=control]]:mt-6 [&>[data-slot=text]]:mt-1')}
    />
  )
}

export function Legend({ className, ...props }: { className?: string } & Omit<Headless.LegendProps, 'className'>) {
  return (
    <Headless.Legend
      data-slot="legend"
      {...props}
      className={clsx(
        className,
        'text-base/6 font-semibold text-zinc-950 data-[disabled]:opacity-50 dark:text-white sm:text-sm/6'
      )}
    />
  )
}

export function FieldGroup({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="control"
      {...props}
      className={clsx(
        className,
        'divide-y divide-zinc-200 dark:divide-zinc-800',
        '[&>*]:py-4 [&>:first-child]:pt-0 [&>:last-child]:pb-0'
      )}
    />
  )
}

export function Field({
  className,
  labelPosition = 'side',
  ...props
}: {
  className?: string
  labelPosition?: 'side' | 'top'
} & Omit<Headless.FieldProps, 'className'>) {
  return (
    <Headless.Field
      {...props}
      data-label-position={labelPosition}
      className={clsx(
        className,
        'grid grid-cols-1 gap-x-4',
        labelPosition === 'side' && 'sm:grid-cols-[3fr_2fr]',
        '[&>[data-slot=label]]:font-medium',
        labelPosition === 'side' && '[&>[data-slot=label]]:sm:self-center',
        labelPosition === 'top' && '[&>[data-slot=label]]:mb-1',
        labelPosition === 'side' &&
          '[&:has([data-slot=label])>[data-slot=control]]:sm:w-full [&:has([data-slot=label])>[data-slot=control]]:sm:justify-self-end',
        labelPosition === 'side' &&
          '[&:has([data-slot=label])>[data-slot=control]]:sm:col-start-2 [&:not(:has([data-slot=label]))>[data-slot=control]]:col-span-full [&>[data-slot=control]]:col-span-1',
        labelPosition === 'side' &&
          '[&:has([data-slot=label])>[data-slot=description]]:sm:col-start-2 [&:not(:has([data-slot=label]))>[data-slot=description]]:col-span-full [&>[data-slot=description]]:col-span-1',
        labelPosition === 'side' &&
          '[&:has([data-slot=label])>[data-slot=error]]:sm:col-start-2 [&:not(:has([data-slot=label]))>[data-slot=error]]:col-span-full [&>[data-slot=error]]:col-span-1',
        labelPosition === 'top' &&
          '[&>[data-slot=control]]:col-span-full [&>[data-slot=description]]:col-span-full [&>[data-slot=error]]:col-span-full'
      )}
    />
  )
}

export function Label({ className, ...props }: { className?: string } & Omit<Headless.LabelProps, 'className'>) {
  return (
    <Headless.Label
      data-slot="label"
      {...props}
      className={clsx(
        className,
        'select-none text-base/6 text-zinc-950 data-[disabled]:opacity-50 dark:text-white sm:text-sm/6',
        '[.field-group[data-label-position=top]_&]:mb-2'
      )}
    />
  )
}

export function Description({
  className,
  ...props
}: { className?: string } & Omit<Headless.DescriptionProps, 'className'>) {
  return (
    <Headless.Description
      data-slot="description"
      {...props}
      className={clsx(
        className,
        'text-base/6 text-zinc-500 data-[disabled]:opacity-50 dark:text-zinc-400 sm:text-sm/6'
      )}
    />
  )
}

export function ErrorMessage({
  className,
  ...props
}: { className?: string } & Omit<Headless.DescriptionProps, 'className'>) {
  return (
    <Headless.Description
      data-slot="error"
      {...props}
      className={clsx(className, 'text-base/6 text-red-600 data-[disabled]:opacity-50 dark:text-red-500 sm:text-sm/6')}
    />
  )
}
