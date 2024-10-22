'use client'

import { useQueryParam } from '@/app/hooks/useQueryParam'
import { useEmail } from './email-provider'

import { Tab, TabGroup, TabList } from '@/app/components/tab'
import { Text } from '@/app/components/text'
import { capitalizeFirstLetter } from '@/lib/utils/misc'
import { Cog6ToothIcon, Square3Stack3DIcon, TableCellsIcon } from '@heroicons/react/24/outline'
import { useEffect } from 'react'
import 'react-quill/dist/quill.snow.css'
import BlockEditor from './block-editor'
import EmailComponents from './email-components'
import EmailRows from './email-rows'
import EmailSettings from './email-settings'

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

export default function EmailEditor() {
  const { currentBlock, setCurrentBlock } = useEmail()

  const [tab, setTab] = useQueryParam<Tabs>('tab', Tabs.CONTENT, (value) => Object.values(Tabs).includes(value as Tabs))

  useEffect(() => {
    if (currentBlock?.type === 'row') {
      setTab(Tabs.ROWS)
    } else if (currentBlock) {
      setTab(Tabs.CONTENT)
    }
  }, [currentBlock])

  const handleTabChange = (index: number) => {
    const newTab = Object.values(Tabs)[index]
    if (newTab !== Tabs.ROWS && currentBlock?.type === 'row') {
      setCurrentBlock?.(null)
    } else if (newTab === Tabs.ROWS && currentBlock && currentBlock?.type !== 'row') {
      setCurrentBlock?.(null)
    }
    setTab(newTab)
  }

  const getTabDescription = () => {
    if (currentBlock) {
      return null
    }
    if (tab === Tabs.CONTENT) {
      return 'Drag a piece of content into the email to add it'
    } else if (tab === Tabs.ROWS) {
      return 'Drag a row into the email to add it'
    } else if (tab === Tabs.SETTINGS) {
      return 'Email settings'
    }

    return null
  }

  const description = getTabDescription()

  return (
    <div className="flex h-full w-full min-w-[380px] max-w-[400px] flex-col overflow-y-scroll border-l-[0.5px] border-r-[0.5px] border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 lg:min-w-[410px] lg:max-w-[430px]">
      <TabGroup value={tab} className="mx-auto mt-4" onChange={handleTabChange}>
        <TabList>
          {Object.values(Tabs).map((tabValue) => {
            const Icon = tabIcons[tabValue]
            return (
              <Tab selected={tab === tabValue} key={tabValue} className="flex items-center gap-2">
                <Icon className="mr-1 h-5 w-5" />
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
      {currentBlock && <BlockEditor />}
      {tab === Tabs.CONTENT && !currentBlock && <EmailComponents />}
      {tab === Tabs.ROWS && !currentBlock && <EmailRows />}
      {tab === Tabs.SETTINGS && <EmailSettings />}
    </div>
  )
}
