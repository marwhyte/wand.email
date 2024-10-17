'use client'

import { doLogout } from '@/app/actions/authentication'
import { getFirstTwoInitials } from '@/lib/utils/misc'
import { AvatarButton } from '@components/avatar'
import { Button } from '@components/button'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@components/dropdown'
import { Logo } from '@components/Logo'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  BoltIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'

import { Session } from 'next-auth'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { usePlan } from './components/payment/plan-provider'
import UpgradeDialog from './components/payment/upgrade-dialog'
import { Text } from './components/text'

type Props = {
  children: React.ReactNode
  session: Session | null
}

type AccountDropdownMenuProps = {
  anchor: 'top start' | 'bottom end'
  email: string
}

function AccountDropdownMenu({ anchor, email }: AccountDropdownMenuProps) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="/settings">
        <UserCircleIcon />
        <DropdownLabel>
          My account
          <Text className="!text-xs group-data-[focus]:!text-white">{email}</Text>
        </DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/tos.html">
        <ShieldCheckIcon />
        <DropdownLabel>Terms of service</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="/privacy.html">
        <ShieldCheckIcon />
        <DropdownLabel>Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="mailto:support@sentswiftly.com">
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
  const searchParams = useSearchParams()
  const router = useRouter()
  const { plan } = usePlan()
  const isTemplatePage = /^\/templates\/[^/]+$/.test(pathname) || /^\/projects\/[^/]+$/.test(pathname)

  const navItems = [
    { name: 'Why SentSwiftly', href: '/', current: pathname === '/' },
    { name: 'Templates', href: '/templates', current: pathname.startsWith('/templates') },
    ...(session?.user ? [{ name: 'My projects', href: '/projects', current: pathname.startsWith('/projects') }] : []),
    ...(!session?.user || plan === 'free'
      ? [{ name: 'Pricing', href: '/pricing', current: pathname.startsWith('/pricing') }]
      : []),
    ...(session?.user ? [{ name: 'Settings', href: '/settings', current: pathname.startsWith('/settings') }] : []),
  ]

  const isUpgradeDialogOpen = searchParams.get('upgrade') === 'true'

  const openUpgradeDialog = () => {
    router.push(`${pathname}?upgrade=true&plan=starter`, { scroll: false })
  }

  const closeUpgradeDialog = () => {
    router.push(pathname, { scroll: false })
  }

  return (
    <div className="flex h-screen flex-col">
      {!isTemplatePage && (
        <header>
          <div>
            <Disclosure as="nav" className="relative bg-white shadow">
              <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 justify-between">
                  <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    {/* Mobile menu button */}
                    <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                      <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                    </DisclosureButton>
                  </div>
                  <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="flex flex-shrink-0 items-center">
                      <Link href="/">
                        <Logo text={false} />
                      </Link>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                      {navItems.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${item.current ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <div className="hidden md:block">
                      {plan === 'free' && (
                        <button onClick={openUpgradeDialog}>
                          <span className="inline-flex items-baseline rounded-full border border-yellow-500 bg-yellow-50 px-2.5 py-0.5 text-sm font-medium leading-7 md:mt-2 lg:mt-0">
                            <BoltIcon className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-yellow-400" />
                            Upgrade
                          </span>
                        </button>
                      )}
                    </div>
                    {session?.user ? (
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
                        <AccountDropdownMenu anchor="bottom end" email={session.user?.email ?? ''} />
                      </Dropdown>
                    ) : (
                      <div className="ml-4 flex items-center space-x-4">
                        {pathname !== '/login' && <Button href="/login">Log in</Button>}
                        {pathname !== '/signup' && (
                          <Button color="purple" href="/signup">
                            Get Started
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 pb-4 pt-2">
                  {navItems.map((item) => (
                    <DisclosureButton
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${item.current ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'}`}
                    >
                      {item.name}
                    </DisclosureButton>
                  ))}
                </div>
              </DisclosurePanel>
            </Disclosure>
          </div>
        </header>
      )}

      <main className={`flex-grow overflow-y-auto ${isTemplatePage ? 'h-screen' : ''}`}>
        <div className="h-full">{children}</div>
      </main>
      <UpgradeDialog open={isUpgradeDialogOpen} onClose={closeUpgradeDialog} />
    </div>
  )
}
