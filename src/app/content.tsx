'use client'

import { AvatarButton } from '@/app/components/avatar'
import DarkModeToggle from '@/app/components/dark-mode-toggle'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/app/components/dropdown'
import { Logo } from '@/app/components/Logo'
import { Navbar, NavbarItem, NavbarLabel, NavbarSection } from '@/app/components/navbar'
import { getFirstTwoInitials } from '@/lib/utils/misc'
import {
  ArrowRightStartOnRectangleIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid'
import { Session } from 'next-auth'
import { usePathname } from 'next/navigation'
import { doLogout } from './actions'
import { Button } from './components/button'

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

  // Check if the pathname matches /template/:id
  const isTemplatePage = /^\/templates\/[^/]+$/.test(pathname)

  const navItems = [
    { name: 'Why SwiftMailer', href: '/', current: pathname === '/' },
    { name: 'Templates', href: '/templates', current: pathname.startsWith('/templates') },
    // Only show Settings if there's a session
    ...(session ? [{ name: 'Settings', href: '/settings', current: pathname.startsWith('/settings') }] : []),
  ]

  return (
    <div className="flex h-screen flex-col">
      {!isTemplatePage && (
        <header className="border-b border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Navbar className="h-16">
              <div className="flex w-full items-center justify-between">
                <a href="/" className="-m-1.5 p-1.5">
                  <Logo />
                </a>
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
