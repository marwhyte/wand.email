'use client'

import { usePersistedState } from '@/app/hooks/usePersistedState'
import { useEmailStore } from '@/lib/stores/emailStore'
import { useEffect } from 'react'

import { Tab, TabGroup, TabList } from '@/app/components/tab'
import { Text } from '@/app/components/text'
import { capitalizeFirstLetter } from '@/lib/utils/misc'
import { Cog6ToothIcon, Square3Stack3DIcon, TableCellsIcon } from '@heroicons/react/24/outline'
import BlockEditor from './block-editor'
import EmailComponents from './email-components'
import EmailRows from './email-rows'
import EmailSettings from './email-settings'
import { Email } from './types'

enum Tabs {
  CONTENT = 'content',
  ROWS = 'rows',
  SETTINGS = 'settings',
}

const tabIcons = {
  [Tabs.CONTENT]: Square3Stack3DIcon,
  [Tabs.ROWS]: TableCellsIcon,
  [Tabs.SETTINGS]: Cog6ToothIcon,
}

export default function EmailEditor({ email }: { email: Email }) {
  const { currentBlock, setCurrentBlock } = useEmailStore()

  // Use our custom hook with the email ID as namespace
  const [tab, setTab] = usePersistedState<Tabs>('editorTab', Tabs.CONTENT, `email_${email.id}`, 'session')

  useEffect(() => {
    if (currentBlock?.type === 'row') {
      setTab(Tabs.ROWS)
    } else if (currentBlock) {
      setTab(Tabs.CONTENT)
    }
  }, [currentBlock, setTab])

  const handleTabChange = (index: number) => {
    const newTab = Object.values(Tabs)[index]
    if (newTab !== Tabs.ROWS && currentBlock?.type === 'row') {
      setCurrentBlock?.(null)
    } else if (newTab === Tabs.ROWS && currentBlock && currentBlock?.type !== 'row') {
      setCurrentBlock?.(null)
    } else if (newTab === Tabs.SETTINGS && currentBlock) {
      setCurrentBlock?.(null)
    }
    setTab(newTab)
  }

  const getTabDescription = () => {
    if (currentBlock) {
      return null
    }
    if (tab === Tabs.CONTENT) {
      return 'Drag a piece of content into the email'
    } else if (tab === Tabs.ROWS) {
      return 'Drag a row into the email'
    } else if (tab === Tabs.SETTINGS) {
      return 'Email settings'
    }

    return null
  }

  const description = getTabDescription()

  return (
    <div className="email-editor flex h-full w-full min-w-[290px] max-w-[310px] flex-col overflow-y-scroll border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <TabGroup value={tab} className="mx-auto mt-4" onChange={handleTabChange}>
        <TabList>
          {Object.values(Tabs).map((tabValue) => {
            const Icon = tabIcons[tabValue]
            return (
              <Tab selected={tab === tabValue} key={tabValue} className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                {capitalizeFirstLetter(tabValue)}
              </Tab>
            )
          })}
        </TabList>
      </TabGroup>
      {description && (
        <div className="mx-auto mt-4">
          <Text>{description}</Text>
        </div>
      )}
      {currentBlock && email && <BlockEditor email={email} />}
      {tab === Tabs.CONTENT && !currentBlock && <EmailComponents />}
      {tab === Tabs.ROWS && !currentBlock && <EmailRows />}
      {tab === Tabs.SETTINGS && email && <EmailSettings email={email} />}
    </div>
  )
}
