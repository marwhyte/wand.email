/* eslint-disable @next/next/no-img-element */
'use client'

import { Avatar } from '@/components/avatar'
import DarkModeToggle from '@/components/dark-mode-toggle'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown'
import { Logo } from '@/components/Logo'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import { getFirstTwoInitials } from '@/lib/utils/misc'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronUpIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid'
import { Cog6ToothIcon, HomeIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import { Session } from 'next-auth'
import { usePathname } from 'next/navigation'
import { doLogout } from '../actions'

const navigation = [{ name: 'Templates', href: '/home/templates', icon: HomeIcon, current: true }]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

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
      <DropdownItem href="/account/settings">
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

  const templates = [
    {
      id: 'going',
      name: 'Going',
      url: '/home/templates/going',
      current: pathname === '/home/templates/going',
    },
  ]

  return (
    <>
      <SidebarLayout
        navbar={
          <Navbar>
            <NavbarSpacer />
            <NavbarSection>
              <Dropdown>
                <DropdownButton as={NavbarItem}>
                  <Avatar
                    initials={
                      session?.user?.name && !session.user.image ? getFirstTwoInitials(session?.user?.name) : undefined
                    }
                    src={session?.user?.image}
                  />
                </DropdownButton>
                <AccountDropdownMenu session={session} anchor="bottom end" />
              </Dropdown>
            </NavbarSection>
          </Navbar>
        }
        sidebar={
          <Sidebar>
            <SidebarHeader>
              <Logo />
            </SidebarHeader>

            <SidebarBody>
              <SidebarSection>
                <SidebarItem href="/home/templates" current={pathname.startsWith('/home/templates')}>
                  <HomeIcon />
                  <SidebarLabel>Templates</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/home/settings" current={pathname.startsWith('/home/settings')}>
                  <Cog6ToothIcon />
                  <SidebarLabel>Settings</SidebarLabel>
                </SidebarItem>
              </SidebarSection>

              <SidebarSection className="max-lg:hidden">
                <SidebarHeading>Top templates</SidebarHeading>
                {templates.map((template) => (
                  <SidebarItem key={template.id} href={template.url}>
                    {template.name}
                  </SidebarItem>
                ))}
              </SidebarSection>

              <SidebarSpacer />

              <SidebarSection>
                <DarkModeToggle sideBarItem />
                <SidebarItem href="mailto:marcowhyte2@gmail">
                  <QuestionMarkCircleIcon />
                  <SidebarLabel>Support</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            </SidebarBody>

            <SidebarFooter className="max-lg:hidden">
              <Dropdown>
                <DropdownButton as={SidebarItem}>
                  <span className="flex min-w-0 items-center gap-3">
                    <Avatar
                      initials={
                        session?.user?.name && !session.user.image ? getFirstTwoInitials(session.user.name) : undefined
                      }
                      src={session?.user?.image}
                      className="size-10"
                      square
                      alt=""
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                        {session?.user?.name}
                      </span>
                      <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                        {session?.user?.email}
                      </span>
                    </span>
                  </span>
                  <ChevronUpIcon />
                </DropdownButton>
                <AccountDropdownMenu session={session} anchor="top start" />
              </Dropdown>
            </SidebarFooter>
          </Sidebar>
        }
      >
        {children}
      </SidebarLayout>
    </>
  )
}
