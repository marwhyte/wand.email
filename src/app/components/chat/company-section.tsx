import { useOpener } from '@/app/hooks'
import { updateChat } from '@/lib/database/queries/chats'
import { deleteCompany } from '@/lib/database/queries/companies'
import { Chat, Company } from '@/lib/database/types'
import { useAuthStore } from '@/lib/stores/authStore'
import { useChatStore } from '@/lib/stores/chatStore'
import { fetcher, getImgFromKey } from '@/lib/utils/misc'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { PencilSquareIcon, PlusCircleIcon, TagIcon, TrashIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import { useSession } from 'next-auth/react'
import { Fragment, useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { Button } from '../button'
import CompanyDialog from '../dialogs/company-dialog'
import { DeleteCompanyDialog } from '../dialogs/delete-company-dialog'
import { Text } from '../text'
import { Tooltip } from '../tooltip'

interface CompanySectionProps {
  chat: Chat | null | undefined
  tooltip?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  children?: React.ReactNode
  popoverDirection?: 'up' | 'down'
  size?: 'default' | 'large'
}

export function CompanySection({
  chat,
  tooltip,
  tooltipPosition = 'top',
  children,
  popoverDirection = 'down',
  size = 'default',
}: CompanySectionProps) {
  const session = useSession()
  const { mutate } = useSWRConfig()
  const { company, setCompany } = useChatStore()
  const [tempCompany, setTempCompany] = useState<Company | null>(null)
  const [activeCompany, setActiveCompany] = useState<Company | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { setShowSignUpDialog } = useAuthStore()

  // Dialog openers
  const companyOpener = useOpener()
  const deleteOpener = useOpener()

  const { data: companies } = useSWR<Company[]>(session?.data?.user?.id ? '/api/companies' : null, fetcher, {
    fallbackData: [],
  })

  useEffect(() => {
    if (chat) return // Early return if chat exists

    // Only update company if necessary to avoid infinite loops
    if (companies?.length && !company) {
      setCompany(companies[0])
    } else if (!companies?.length && company) {
      // Only clear company if companies is empty and we have a company set
      setCompany(undefined)
    } else if (company && companies?.length && !companies.find((c) => c.id === company.id)) {
      // Only clear company if it no longer exists in the companies list
      setCompany(undefined)
    }
  }, [companies, company, chat])

  // Update temporary state when store values change
  useEffect(() => {
    setTempCompany(company)
  }, [company])

  // Reset temp values when popover opens
  const handlePopoverOpen = () => {
    // Check if user is signed in before opening popover
    if (!session?.data?.user?.id) {
      setShowSignUpDialog(true)
      return false
    }

    setTempCompany(company)
    return true
  }

  const handleCompanySelect = (selectedCompany: Company | null, close: () => void) => {
    // Check if user is signed in
    if (!session?.data?.user?.id) {
      setShowSignUpDialog(true)
      return
    }

    setCompany(selectedCompany || undefined)
    setTempCompany(selectedCompany)

    if (chat) {
      updateChat(chat.id, {
        companyId: selectedCompany?.id,
      })
    }
    close()
  }

  const handleDeleteCompany = async (companyId: string) => {
    setActiveCompany(companies?.find((c) => c.id === companyId) || null)
    deleteOpener.open()
  }

  const confirmDeleteCompany = async () => {
    if (!activeCompany) return

    try {
      setIsDeleting(true)
      await deleteCompany(activeCompany.id)
      mutate('/api/companies')
      setActiveCompany(null)
    } catch (error) {
      console.error('Failed to delete company:', error)
    } finally {
      setIsDeleting(false)
      setCompany(undefined)
      setActiveCompany(null)
      deleteOpener.close()
    }
  }

  const handleCompanySuccess = (updatedCompany: Company) => {
    companyOpener.close()
    setActiveCompany(null)
    setCompany(updatedCompany)
    if (chat) {
      updateChat(chat.id, {
        companyId: updatedCompany.id,
      })
    }
    mutate('/api/companies')
  }

  const tooltipId = `company-section`
  const iconSize = size === 'large' ? 'h-6 w-6' : 'h-4 w-4'
  const textSize = size === 'large' ? 'text-sm' : 'text-xs'

  return (
    <>
      <div className="relative">
        <Popover className="relative">
          {({ open, close }) => (
            <>
              {children ? (
                <PopoverButton
                  className="flex h-full w-full items-center justify-center focus:outline-none"
                  aria-label="Company settings"
                  onClick={(e) => {
                    if (!open) {
                      if (!companies?.length) {
                        if (!session?.data?.user?.id) {
                          setShowSignUpDialog(true)
                          e.preventDefault()
                          return
                        }
                        setActiveCompany(null)
                        companyOpener.open()
                        return
                      }
                      if (!handlePopoverOpen()) {
                        e.preventDefault()
                      }
                    }
                  }}
                  data-tooltip-id={tooltipId}
                  data-tooltip-hidden={open}
                >
                  {children}
                </PopoverButton>
              ) : tooltip ? (
                <Tooltip id="company-section" place={tooltipPosition} content={tooltip}>
                  <PopoverButton
                    className={clsx(
                      'flex items-center space-x-1.5 rounded-md px-2 py-1 hover:bg-gray-200 focus:outline-none',
                      company ? 'bg-purple-100' : 'bg-gray-100'
                    )}
                    aria-label="Company settings"
                    onClick={(e) => {
                      if (!open) {
                        if (!companies?.length) {
                          if (!session?.data?.user?.id) {
                            setShowSignUpDialog(true)
                            e.preventDefault()
                            return
                          }
                          setActiveCompany(null)
                          companyOpener.open()
                          return
                        }
                        if (!handlePopoverOpen()) {
                          e.preventDefault()
                        }
                      }
                    }}
                  >
                    <div className="flex items-center space-x-1.5">
                      <span className={clsx(textSize, 'font-medium text-indigo-700')}>
                        {company ? company.name : 'Branding'}
                      </span>
                      <TagIcon className={iconSize + ' !text-gray-500'} />
                    </div>
                    {!company && <span className="sr-only">No company selected</span>}
                  </PopoverButton>
                </Tooltip>
              ) : (
                <PopoverButton
                  className={clsx(
                    'flex items-center space-x-1.5 rounded-md px-2 py-1 hover:bg-gray-200 focus:outline-none',
                    company ? 'bg-purple-100' : 'bg-gray-100'
                  )}
                  aria-label="Company settings"
                  onClick={(e) => {
                    if (!open) {
                      if (!companies?.length) {
                        if (!session?.data?.user?.id) {
                          setShowSignUpDialog(true)
                          e.preventDefault()
                          return
                        }
                        setActiveCompany(null)
                        companyOpener.open()
                        return
                      }
                      if (!handlePopoverOpen()) {
                        e.preventDefault()
                      }
                    }
                  }}
                >
                  <div className="flex items-center space-x-1.5">
                    <span className={clsx(textSize, 'font-medium text-indigo-700')}>
                      {company ? company.name : 'Branding'}
                    </span>
                    <TagIcon className={iconSize + ' !text-gray-500'} />
                  </div>
                  {!company && <span className="sr-only">No company selected</span>}
                </PopoverButton>
              )}

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <PopoverPanel
                  className={`absolute left-1/2 z-50 w-64 -translate-x-1/2 transform px-4 sm:px-0 ${
                    popoverDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
                  }`}
                >
                  <div className="overflow-hidden rounded-lg shadow-xl ring-1 ring-black ring-opacity-5">
                    <div className="relative bg-white p-3">
                      <div className="space-y-4">
                        {/* Company List */}
                        <div>
                          <Text className="!text-sm">Select Branding</Text>
                          <div className="mt-2 space-y-2">
                            {companies?.map((c) => (
                              <div
                                key={c.id}
                                onClick={() => handleCompanySelect(c, close)}
                                className={`flex w-full items-center justify-between rounded-lg p-2 ${
                                  tempCompany?.id === c.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                                }`}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    handleCompanySelect(c, close)
                                  }
                                }}
                              >
                                <div className="flex items-center space-x-2">
                                  <img
                                    src={
                                      c.logoImageKey ? getImgFromKey(c.logoImageKey) : getImgFromKey('dummy-logo.png')
                                    }
                                    alt={`${c.name} logo`}
                                    className={clsx(
                                      'h-14 object-contain',
                                      c.logoWidth != null && c.logoHeight != null
                                        ? c.logoWidth > c.logoHeight
                                          ? 'w-20' // Wider image
                                          : c.logoWidth === c.logoHeight
                                            ? 'w-14' // Square image
                                            : 'w-14' // Taller image
                                        : 'w-14' // Default to wider for dummy logo
                                    )}
                                  />
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    plain
                                    tooltip="Edit company"
                                    onClick={(e: React.MouseEvent) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      setActiveCompany(c)
                                      companyOpener.open()
                                    }}
                                    tooltipId="edit-company"
                                  >
                                    <PencilSquareIcon className={iconSize + ' !text-gray-500'} />
                                  </Button>
                                  <Button
                                    plain
                                    tooltip="Delete company"
                                    onClick={(e: React.MouseEvent) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      handleDeleteCompany(c.id)
                                    }}
                                    tooltipId="delete-company"
                                  >
                                    <TrashIcon className={iconSize + ' !text-red-500'} />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Add Company Button */}
                        <Button
                          outline
                          className="w-full"
                          onClick={() => {
                            setActiveCompany(null)
                            companyOpener.open()
                            close()
                          }}
                        >
                          <PlusCircleIcon className={iconSize} />
                          <span>Add Company</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
      {tooltip && <Tooltip id="company-section" place={tooltipPosition} content={tooltip} />}

      {/* Company Dialog */}
      <CompanyDialog
        company={activeCompany}
        isOpen={companyOpener.isOpen}
        onClose={() => {
          companyOpener.close()
          setActiveCompany(null)
          // Reopen the popover
          const popoverButton = document.querySelector('[aria-label="Company settings"]')
          if (popoverButton) {
            ;(popoverButton as HTMLElement).click()
          }
        }}
        onSuccess={handleCompanySuccess}
      />

      {/* Delete Company Dialog */}
      <DeleteCompanyDialog
        open={deleteOpener.isOpen}
        onClose={() => {
          deleteOpener.close()
          setActiveCompany(null)
          // Reopen the popover
          const popoverButton = document.querySelector('[aria-label="Company settings"]')
          if (popoverButton) {
            ;(popoverButton as HTMLElement).click()
          }
        }}
        company={activeCompany}
        isDeleting={isDeleting}
        onConfirmDelete={confirmDeleteCompany}
      />
    </>
  )
}
