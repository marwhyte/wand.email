import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'

type MergeTag = {
  name: string
  value: string
  category: string
}

type SpecialLink = {
  name: string
  value: string
  category: string
}

const mergeTags: MergeTag[] = [
  // Mailchimp
  { name: 'Email', value: '*|EMAIL|*', category: 'Mailchimp' },
  { name: 'First Name', value: '*|FNAME|*', category: 'Mailchimp' },
  { name: 'Last Name', value: '*|LNAME|*', category: 'Mailchimp' },
  { name: 'Subscribe', value: '*|LIST:SUBSCRIBE|*', category: 'Mailchimp' },
  { name: 'Archive', value: '*|ARCHIVE|*', category: 'Mailchimp' },

  // MailUp
  { name: 'Email', value: '[email]', category: 'MailUp' },
  { name: 'First Name', value: '[firstname]', category: 'MailUp' },
  { name: 'Last Name', value: '[lastname]', category: 'MailUp' },
  { name: 'Company', value: '[company]', category: 'MailUp' },

  // SendGrid
  { name: 'Email', value: '-email-', category: 'SendGrid' },
  { name: 'First Name', value: '-first_name-', category: 'SendGrid' },
  { name: 'Last Name', value: '-last_name-', category: 'SendGrid' },

  // Autopilot
  { name: 'Email', value: '--Email--', category: 'Autopilot' },
  { name: 'First Name', value: '--First Name--', category: 'Autopilot' },
  { name: 'Last Name', value: '--Last Name--', category: 'Autopilot' },
  { name: 'Company', value: '--Company--', category: 'Autopilot' },

  // Campaign Monitor
  { name: 'Email', value: '[email]', category: 'Campaign Monitor' },
  { name: 'First Name', value: '[firstname]', category: 'Campaign Monitor' },
  { name: 'Last Name', value: '[lastname]', category: 'Campaign Monitor' },

  // HubSpot
  { name: 'Company City', value: '{{ site_settings.company_city }}', category: 'HubSpot' },
  { name: 'Company Name', value: '{{ site_settings.company_name }}', category: 'HubSpot' },
  { name: 'Company State', value: '{{ site_settings.company_state }}', category: 'HubSpot' },
  { name: 'Company Street Address', value: '{{ site_settings.company_street_address_1 }}', category: 'HubSpot' },
]

const specialLinks: SpecialLink[] = [
  // Mailchimp
  { name: 'Unsubscribe', value: '*|UNSUB|*', category: 'Mailchimp' },

  // MailUp
  { name: 'Unsubscribe', value: 'http://[unsubscribe]/', category: 'MailUp' },
  { name: 'Subscribe', value: 'http://[subscribelink]/', category: 'MailUp' },
  { name: 'Preferences', value: 'http://[prefcenter]/', category: 'MailUp' },
  { name: 'Static Link', value: 'http://[staticnl]/', category: 'MailUp' },

  // SendGrid
  { name: 'Unsubscribe', value: '[Unsubscribe]', category: 'SendGrid' },
  { name: 'Web Version', value: '[weblink]', category: 'SendGrid' },

  // Autopilot
  { name: 'Unsubscribe', value: '--unsubscribe--', category: 'Autopilot' },

  // Campaign Monitor
  { name: 'Unsubscribe', value: '<unsubscribe>Unsubscribe</unsubscribe>', category: 'Campaign Monitor' },
  { name: 'Web Version', value: '<webversion>Open in a browser</webversion>', category: 'Campaign Monitor' },

  // HubSpot
  { name: 'Unsubscribe', value: '{{ unsubscribe_link }}', category: 'HubSpot' },
  { name: 'View as Web Page', value: '{{ view_as_page_url }}', category: 'HubSpot' },
]

type SpecialLinksMenuProps = {
  isOpen: boolean
  onClose: () => void
  onSelect: (value: string, label?: string) => void
  initialTab: 'merge-tags' | 'special-links'
}

export const SpecialLinksMenu = ({ isOpen, onClose, onSelect, initialTab }: SpecialLinksMenuProps) => {
  const [activeTab, setActiveTab] = useState<'merge-tags' | 'special-links'>(initialTab)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  const categories = [...new Set([...mergeTags, ...specialLinks].map((item) => item.category))]

  const filteredItems =
    searchQuery === ''
      ? activeTab === 'merge-tags'
        ? mergeTags
        : specialLinks
      : (activeTab === 'merge-tags' ? mergeTags : specialLinks).filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        )

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Insert Special Link or Merge Tag
                </Dialog.Title>
                <div className="mt-4">
                  <div className="flex space-x-4 border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab('merge-tags')}
                      className={`border-b-2 px-1 py-2 text-sm font-medium ${
                        activeTab === 'merge-tags'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      Merge Tags
                    </button>
                    <button
                      onClick={() => setActiveTab('special-links')}
                      className={`border-b-2 px-1 py-2 text-sm font-medium ${
                        activeTab === 'special-links'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      Special Links
                    </button>
                  </div>

                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="mt-4 max-h-[400px] overflow-y-auto">
                    {categories.map((category) => {
                      const categoryItems = filteredItems.filter((item) => item.category === category)
                      if (categoryItems.length === 0) return null

                      return (
                        <div key={category} className="mb-4">
                          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{category}</div>
                          <div className="mt-2 space-y-1">
                            {categoryItems.map((item) => (
                              <button
                                key={item.value}
                                onClick={() => {
                                  onSelect(item.value, item.name)
                                  onClose()
                                }}
                                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <span>{item.name}</span>
                                <span className="text-xs text-gray-500">{item.value}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-purple-100 px-4 py-2 text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
