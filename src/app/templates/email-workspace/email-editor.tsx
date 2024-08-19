'use client'

import { useBlock } from './block-provider'

import { Tab, TabGroup, TabList } from '@/app/components/tab'
import { Text } from '@/app/components/text'
import { capitalizeFirstLetter } from '@/lib/utils/misc'
import { Cog6ToothIcon, Square3Stack3DIcon, TableCellsIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import BlockEditor from './block-editor'
import EmailComponents from './email-components'

type Props = {
  email: Email
  onSave: (template: Email) => void
}

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

export default function EmailEditor({ email, onSave }: Props) {
  const { currentBlock, setCurrentBlock } = useBlock()

  const [tab, setTab] = useState<Tabs>(Tabs.CONTENT)

  const handleTabChange = (index: number) => {
    setTab(Object.values(Tabs)[index])
  }

  const getTabDescription = () => {
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
    <div className="flex h-full w-full min-w-[380px] max-w-[400px] flex-col overflow-y-scroll border-l-[0.5px] border-r-[0.5px] border-zinc-200 bg-white lg:min-w-[410px] lg:max-w-[430px] dark:border-zinc-700 dark:bg-zinc-900">
      <TabGroup className="mx-auto mt-4" onChange={handleTabChange}>
        <TabList>
          {Object.values(Tabs).map((tab) => {
            const Icon = tabIcons[tab]
            return (
              <Tab key={tab} className="flex items-center gap-2">
                <Icon className="mr-1 h-5 w-5" />
                {capitalizeFirstLetter(tab)}
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
      {tab === Tabs.CONTENT && (
        <div>{currentBlock ? <BlockEditor email={email} onSave={onSave} /> : <EmailComponents email={email} />}</div>
      )}
    </div>
  )
}
