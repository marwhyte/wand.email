import { ExportType } from '@/lib/database/types'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { LinkIcon } from '@heroicons/react/24/outline'
import { Fragment, useEffect, useState } from 'react'
import { EmailElement, emailElements, exportTypeToCategory } from './email-elements'

type SpecialLinksMenuProps = {
  isOpen: boolean
  onClose: () => void
  onSelect: (value: string, label?: string) => void
  initialTab: 'merge-tags' | 'special-links'
  currentExportType: ExportType
}

export const SpecialLinksMenu = ({
  isOpen,
  onClose,
  onSelect,
  initialTab,
  currentExportType,
}: SpecialLinksMenuProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAllProviders, setShowAllProviders] = useState(false)

  // Reset showAllProviders when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowAllProviders(false)
    }
  }, [isOpen])

  // Get the current provider name based on export type
  const currentProvider = exportTypeToCategory[currentExportType] || null

  // If showing all providers, show all categories, otherwise filter to just the current provider
  const categories = showAllProviders
    ? [...new Set(emailElements.map((item: EmailElement) => item.category))]
    : currentProvider === 'Mailchimp'
      ? ['Mailchimp']
      : [...new Set(emailElements.map((item: EmailElement) => item.category))]

  // Filter items based on search and current provider
  const filteredElements =
    searchQuery === ''
      ? emailElements.filter(
          (item: EmailElement) =>
            showAllProviders || !currentProvider || currentProvider === 'HTML' || item.category === currentProvider
        )
      : emailElements.filter(
          (item: EmailElement) =>
            (showAllProviders || !currentProvider || currentProvider === 'HTML' || item.category === currentProvider) &&
            (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.category.toLowerCase().includes(searchQuery.toLowerCase()))
        )

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {currentProvider && currentProvider !== 'HTML'
                    ? `Insert ${currentProvider} Elements`
                    : `Insert Email Elements`}
                </DialogTitle>
                <div className="mt-4">
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  {/* Show toggle for all providers */}
                  {currentProvider && currentProvider !== 'HTML' && !showAllProviders && (
                    <button
                      onClick={() => setShowAllProviders(true)}
                      className="mt-2 text-xs font-medium text-purple-600 hover:text-purple-800"
                    >
                      Looking for another mailing service?
                    </button>
                  )}

                  <div className="mt-4 max-h-[400px] overflow-y-auto">
                    {categories.map((category: string) => {
                      const categoryItems = filteredElements.filter((item: EmailElement) => item.category === category)
                      if (categoryItems.length === 0) return null

                      return (
                        <div key={category} className="mb-4">
                          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{category}</div>
                          <div className="mt-2 space-y-1">
                            {categoryItems.map((item: EmailElement) => (
                              <button
                                key={item.value}
                                onClick={() => {
                                  onSelect(item.value, item.name)
                                  onClose()
                                }}
                                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 ${
                                  item.type === 'link' ? 'border-l-2 border-blue-500' : 'border-l-2 border-green-500'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {item.type === 'link' && <LinkIcon className="h-4 w-4 text-blue-500" />}
                                  <span>{item.name}</span>
                                  {item.type === 'link' && (
                                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                                      Link
                                    </span>
                                  )}
                                  {item.type === 'tag' && (
                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                                      Tag
                                    </span>
                                  )}
                                </div>
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
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
