import * as Headless from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import React from 'react'
import { Text } from './text'

export function Disclosure({
  className,
  children,
  title,
  ...props
}: {
  className?: string
  children: React.ReactNode
  title: string
} & Omit<Headless.DisclosureProps<'div'>, 'className'>) {
  return (
    <Headless.Disclosure {...props}>
      {({ open }) => (
        <>
          <Headless.DisclosureButton
            className={clsx(
              'flex w-full justify-between rounded-lg bg-zinc-100 px-4 py-2 text-left text-sm font-medium text-zinc-900 hover:bg-zinc-200 focus:outline-none focus-visible:ring focus-visible:ring-zinc-500 focus-visible:ring-opacity-75',
              'dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700'
            )}
          >
            <span>{title}</span>
            <ChevronUpIcon className={clsx('h-5 w-5 text-zinc-500', open ? 'rotate-180 transform' : '')} />
          </Headless.DisclosureButton>
          <Headless.DisclosurePanel
            className={clsx(className, '!mt-1 px-4 pb-2 pt-2 text-sm text-zinc-500', 'dark:text-zinc-400')}
          >
            {children}
          </Headless.DisclosurePanel>
        </>
      )}
    </Headless.Disclosure>
  )
}

export function DisclosureTitle({
  className,
  ...props
}: { className?: string } & Omit<Headless.DisclosurePanelProps<typeof Text>, 'className'>) {
  return (
    <Text
      className={clsx(className, 'text-balance text-lg/6 font-semibold text-zinc-950 sm:text-base/6 dark:text-white')}
    >
      {props.title}
    </Text>
  )
}

export function DisclosureBody({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={clsx(className)} />
}

export default Disclosure
