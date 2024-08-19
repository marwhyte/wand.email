// tab.tsx
import {
  Tab as HeadlessTab,
  TabGroup as HeadlessTabGroup,
  TabList as HeadlessTabList,
  TabPanel as HeadlessTabPanel,
  TabPanels as HeadlessTabPanels,
} from '@headlessui/react'
import clsx from 'clsx'
import { ComponentProps } from 'react'

type TabGroupProps = ComponentProps<typeof HeadlessTabGroup>

export function TabGroup({ children, ...props }: TabGroupProps) {
  return <HeadlessTabGroup {...props}>{children}</HeadlessTabGroup>
}

type TabListProps = ComponentProps<typeof HeadlessTabList>

export function TabList({ children, ...props }: TabListProps) {
  return (
    <HeadlessTabList className="inline-flex space-x-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800" {...props}>
      {children}
    </HeadlessTabList>
  )
}

type TabProps = ComponentProps<typeof HeadlessTab>

export function Tab({ children, disabled, ...props }: TabProps) {
  return (
    <HeadlessTab
      {...props}
      disabled={disabled}
      className={({ selected }: { selected: boolean }) =>
        clsx(
          'flex items-center justify-center rounded-lg px-2 py-1.5 text-sm font-medium leading-5',
          'ring-white ring-opacity-60 ring-offset-2 ring-offset-zinc-100 focus:outline-none focus:ring-2 dark:ring-offset-zinc-900',
          selected
            ? 'bg-white text-zinc-900 dark:bg-zinc-700 dark:text-white'
            : 'text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white',
          disabled && 'cursor-not-allowed opacity-50'
        )
      }
    >
      {children}
    </HeadlessTab>
  )
}

type TabPanelsProps = ComponentProps<typeof HeadlessTabPanels>

export function TabPanels({ children, ...props }: TabPanelsProps) {
  return <HeadlessTabPanels {...props}>{children}</HeadlessTabPanels>
}

type TabPanelProps = ComponentProps<typeof HeadlessTabPanel>

export function TabPanel({ ...props }: TabPanelProps) {
  return <HeadlessTabPanel {...props} />
}
