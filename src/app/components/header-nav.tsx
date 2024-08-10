'use client'

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { LayoutGroup, motion } from 'framer-motion'
import React, { Fragment, forwardRef, useId } from 'react'
import { TouchTarget } from './button'
import { Link } from './link'

export function HeaderNav({ className, ...props }: React.ComponentPropsWithoutRef<'nav'>) {
  return <nav {...props} className={clsx(className, 'flex items-center')} />
}

export function HeaderNavSection({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  let id = useId()

  return (
    <LayoutGroup id={id}>
      <div {...props} data-slot="section" className={clsx(className, 'flex items-center gap-2')} />
    </LayoutGroup>
  )
}

export const HeaderNavItem = forwardRef(function HeaderNavItem(
  {
    current,
    className,
    children,
    ...props
  }: { current?: boolean; className?: string; children: React.ReactNode } & (
    | Omit<Headless.ButtonProps, 'className'>
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'type' | 'className'>
  ),
  ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
) {
  let classes = clsx(
    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900',
    'dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
  )

  return (
    <span className={clsx(className, 'relative')}>
      {current && (
        <motion.span
          layoutId="current-indicator"
          className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-zinc-900 dark:bg-zinc-100"
        />
      )}
      {'href' in props ? (
        <Headless.CloseButton as={Fragment} ref={ref}>
          <Link className={classes} {...props} data-current={current ? 'true' : undefined}>
            <TouchTarget>{children}</TouchTarget>
          </Link>
        </Headless.CloseButton>
      ) : (
        <Headless.Button
          {...props}
          className={clsx('cursor-pointer', classes)}
          data-current={current ? 'true' : undefined}
          ref={ref}
        >
          <TouchTarget>{children}</TouchTarget>
        </Headless.Button>
      )}
    </span>
  )
})

export function HeaderNavLabel({ className, ...props }: React.ComponentPropsWithoutRef<'span'>) {
  return <span {...props} className={clsx(className, 'truncate')} />
}
