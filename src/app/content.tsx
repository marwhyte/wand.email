'use client'

import { getFirstTwoInitials } from '@/lib/utils/misc'
import { AvatarButton } from '@components/avatar'
import { Button } from '@components/button'
import DarkModeToggle from '@components/dark-mode-toggle'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@components/dropdown'
import { Logo } from '@components/Logo'
import { Navbar, NavbarItem, NavbarLabel, NavbarSection } from '@components/navbar'
import {
  ArrowRightStartOnRectangleIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid'
import { Session } from 'next-auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { doLogout } from './actions'

type Props = {
  children: React.ReactNode
  session: Session | null
}

type AccountDropdownMenuProps = {
  anchor: 'top start' | 'bottom end'
  session: Session | null
}

function AccountDropdownMenu({ anchor, session }: AccountDropdownMenuProps) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="/settings">
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/">
        <ShieldCheckIcon />
        <DropdownLabel>Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="mailto:marcowhyte2@gmail">
        <LightBulbIcon />
        <DropdownLabel>Share feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem onClick={() => doLogout()}>
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

export default function Content({ children, session }: Props) {
  let pathname = usePathname()

  // Check if the pathname matches /templates/:id or /projects/:id
  const isTemplatePage = /^\/templates\/[^/]+$/.test(pathname) || /^\/projects\/[^/]+$/.test(pathname)

  const navItems = [
    { name: 'Why SentSwiftly', href: '/', current: pathname === '/' },
    { name: 'Templates', href: '/templates', current: pathname.startsWith('/templates') },
    ...(session ? [{ name: 'My projects', href: '/projects', current: pathname.startsWith('/projects') }] : []),
    ...(session ? [{ name: 'Settings', href: '/settings', current: pathname.startsWith('/settings') }] : []),
  ]

  return (
    <div className="flex h-screen flex-col">
      {!isTemplatePage && (
        <header className="border-b border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Navbar className="h-16">
              <div className="flex w-full items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5">
                  <Logo />
                </Link>
                <NavbarSection>
                  {navItems.map((item) => (
                    <NavbarItem key={item.name} href={item.href} current={item.current}>
                      <NavbarLabel>{item.name}</NavbarLabel>
                    </NavbarItem>
                  ))}
                </NavbarSection>
                <div className="flex items-center">
                  <DarkModeToggle />
                  {session ? (
                    <Dropdown>
                      <DropdownButton as="div" className="ml-4 flex items-center">
                        <AvatarButton
                          className="h-8 w-8"
                          initials={
                            session.user?.name && !session.user.image
                              ? getFirstTwoInitials(session.user.name)
                              : undefined
                          }
                          src={session.user?.image}
                        />
                      </DropdownButton>
                      <AccountDropdownMenu session={session} anchor="bottom end" />
                    </Dropdown>
                  ) : (
                    <div className="ml-4 flex items-center space-x-4">
                      {pathname !== '/login' && <Button href="/login">Log in</Button>}
                      {pathname !== '/signup' && (
                        <Button color="blue" href="/signup">
                          Get Started
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Navbar>
          </div>
        </header>
      )}
      <main className={`flex-grow overflow-y-auto ${isTemplatePage ? 'h-screen' : ''}`}>
        <div className="h-full">{children}</div>
      </main>
    </div>
  )
}
