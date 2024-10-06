'use client'

import Link from 'next/link'
import { Logo } from './Logo'
import { Button } from './button'

type Props = {
  isLogin?: boolean
  isSignup?: boolean
}

export default function UnauthenticatedHeader({ isLogin, isSignup }: Props) {
  return (
    <header className="bg-white shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.20),_0px_1px_0px_0px_rgba(255,_255,_255,_0.06)_inset] forced-colors:outline">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">SentSwiftly</span>
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-6">
          {!isLogin && <Button href="/">Log in</Button>}
          {!isSignup && <Button href="/signup">Sign up</Button>}
        </div>
      </nav>
    </header>
  )
}
