import * as Headless from '@headlessui/react'
import NextLink, { type LinkProps } from 'next/link'
import React, { forwardRef } from 'react'

export const Link = forwardRef(function Link(
  props: LinkProps & React.ComponentPropsWithoutRef<'a'>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <Headless.DataInteractive>
      <NextLink
        className="font-semibold text-zinc-950 hover:text-zinc-700 dark:text-white dark:hover:text-zinc-300"
        {...props}
        ref={ref}
      />
    </Headless.DataInteractive>
  )
})
