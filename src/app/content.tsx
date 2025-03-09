'use client'

import { doLogout } from '@/app/actions/authentication'
import { DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu } from '@components/dropdown'
import {
  ArrowRightStartOnRectangleIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid'

import { Session } from 'next-auth'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from './components/button'
import UpgradeDialog from './components/dialogs/upgrade-dialog'
import { Logo } from './components/Logo'
import { usePlan } from './components/payment/plan-provider'
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
  const isOnboardingPage = pathname === '/onboarding'
  const isTemplatePage = /^\/templates\/[^/]+$/.test(pathname) || /^\/projects\/[^/]+$/.test(pathname)
  const hideHeader = isTemplatePage || isOnboardingPage
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
    <div className="flex min-h-screen flex-col">
      {!hideHeader && (
        <header>
          <div className="absolute flex w-full items-center justify-between bg-transparent px-4 py-4">
            <Logo text={false} />
            {!session?.user && (
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
        </header>
      )}

      <main className={`flex-grow overflow-y-scroll ${hideHeader ? 'h-screen' : ''}`}>
        <div>{children}</div>
      </main>
      <UpgradeDialog open={isUpgradeDialogOpen} onClose={closeUpgradeDialog} />
    </div>
  )
}
