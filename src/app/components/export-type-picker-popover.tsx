'use client'

import { updateChat } from '@/lib/database/queries/chats'
import { ExportType } from '@/lib/database/types'
import { useAuthStore } from '@/lib/stores/authStore'
import { useChatStore } from '@/lib/stores/chatStore'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { CodeBracketIcon } from '@heroicons/react/20/solid'
import { clsx } from 'clsx'
import { useSession } from 'next-auth/react'
import React, { Fragment, useEffect, useState } from 'react'
import { Text } from './text'
import { Tooltip } from './tooltip'

type ExportTypePickerPopoverProps = {
  className?: string
  tooltip?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  children?: React.ReactNode
  popoverDirection?: 'up' | 'down'
  size?: 'default' | 'large'
} & React.HTMLAttributes<HTMLDivElement>

// Define icon components outside the main component
const HtmlIcon = ({ size, isPopover = false }: { size: 'default' | 'large'; isPopover?: boolean }) => {
  let iconSize = size === 'large' ? 'h-6 w-6' : 'h-4 w-4'
  if (isPopover) {
    iconSize = 'h-8 w-8'
  }
  return <CodeBracketIcon className={`${iconSize} text-blue-500`} />
}

// Mailchimp icon component
const MailchimpIcon = ({ size, isPopover = false }: { size: 'default' | 'large'; isPopover?: boolean }) => {
  let iconSize = size === 'large' ? 'h-6 w-6' : 'h-4 w-4'
  if (isPopover) {
    iconSize = 'h-8 w-8'
  }
  return (
    <div className={`flex items-center justify-center ${iconSize}`}>
      <img src="/mailchimp-icon.svg" alt="Mailchimp" className="h-full w-full object-contain" />
    </div>
  )
}

export const ExportTypePickerPopover: React.FC<ExportTypePickerPopoverProps> = ({
  className = '',
  tooltip,
  tooltipPosition = 'top',
  children,
  popoverDirection = 'down',
  size = 'default',
  ...rest
}) => {
  const { exportType, chatId, chatStarted, setExportType } = useChatStore()
  const { setShowSignUpDialog } = useAuthStore()
  const session = useSession()

  // Temporary state (what's shown in the popover until saved)
  const [tempExportType, setTempExportType] = useState<ExportType>(exportType)

  // Update temporary state when store values change
  useEffect(() => {
    setTempExportType(exportType)
  }, [exportType])

  // Reset temp values when popover opens
  const handlePopoverOpen = () => {
    // Check if user is signed in before opening popover
    if (!session.data?.user?.id) {
      setShowSignUpDialog(true)
      return false
    }

    setTempExportType(exportType)
    return true
  }

  const handleExportTypeSelect = (type: ExportType) => {
    setTempExportType(type)
  }

  const handleSave = async (close: () => void) => {
    // Update the store
    setExportType(tempExportType)

    // If chat has started, update the chat in the database
    if (chatStarted && chatId) {
      try {
        await updateChat(chatId, {
          exportType: tempExportType,
        })
      } catch (error) {
        console.error('Failed to update chat export type settings:', error)
      }
    }

    close()
  }

  const iconSize = size === 'large' ? 'h-6 w-6' : 'h-4 w-4'
  const textSize = size === 'large' ? 'text-sm' : 'text-xs'

  // Get label for current export type
  const getExportTypeLabel = (type: ExportType): string => {
    switch (type) {
      case 'html':
        return 'HTML'
      case 'mailchimp':
        return 'Mailchimp'
      default:
        return 'HTML'
    }
  }

  // Get icon for current export type
  const getExportTypeIcon = (type: ExportType, isPopover = false): React.ReactNode => {
    switch (type) {
      case 'html':
        return <HtmlIcon size={size} isPopover={isPopover} />
      case 'mailchimp':
        return <MailchimpIcon size={size} isPopover={isPopover} />
      default:
        return <HtmlIcon size={size} isPopover={isPopover} />
    }
  }

  const tooltipId = `export-type-picker-tooltip`

  return (
    <>
      <div className={`relative ${className}`} {...rest}>
        <Popover className="relative">
          {({ open, close }) => (
            <>
              {children ? (
                <PopoverButton
                  className="flex h-full w-full items-center justify-center focus:outline-none"
                  aria-label="Export type settings"
                  onClick={(e) => {
                    if (!open) {
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
                <Tooltip id={tooltipId} place={tooltipPosition} content={tooltip}>
                  <PopoverButton
                    className={clsx(
                      'flex items-center space-x-1.5 rounded-md px-2 py-1 hover:bg-gray-200 focus:outline-none',
                      exportType === 'mailchimp' ? 'bg-purple-100' : 'bg-gray-100'
                    )}
                    aria-label="Export type settings"
                    onClick={(e) => {
                      if (!open) {
                        if (!handlePopoverOpen()) {
                          e.preventDefault()
                        }
                      }
                    }}
                  >
                    <div className="flex items-center space-x-1.5">
                      <span className={clsx(textSize, 'font-medium text-indigo-700')}>
                        {getExportTypeLabel(exportType)}
                      </span>
                      <div className={iconSize}>{getExportTypeIcon(exportType, false)}</div>
                    </div>
                  </PopoverButton>
                </Tooltip>
              ) : (
                <PopoverButton
                  className={clsx(
                    'flex items-center space-x-1.5 rounded-md px-2 py-1 hover:bg-gray-200 focus:outline-none',
                    exportType === 'mailchimp' ? 'bg-purple-100' : 'bg-gray-100'
                  )}
                  aria-label="Export type settings"
                  onClick={(e) => {
                    if (!open) {
                      if (!handlePopoverOpen()) {
                        e.preventDefault()
                      }
                    }
                  }}
                >
                  <div className="flex items-center space-x-1.5">
                    <span className={clsx(textSize, 'font-medium text-indigo-700')}>
                      {getExportTypeLabel(exportType)}
                    </span>
                    <div className={iconSize}>{getExportTypeIcon(exportType, false)}</div>
                  </div>
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
                afterEnter={handlePopoverOpen}
              >
                <PopoverPanel
                  className={`absolute left-1/2 z-50 w-60 -translate-x-1/2 transform px-4 sm:px-0 ${
                    popoverDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
                  }`}
                >
                  <div className="overflow-hidden rounded-lg shadow-xl ring-1 ring-black ring-opacity-5">
                    <div className="relative bg-white p-3">
                      <div className="space-y-4">
                        {/* Export Type Options */}
                        <div>
                          <Text className="!text-sm">Export Format</Text>
                          <div className="mt-2 space-y-2">
                            {['html', 'mailchimp'].map((type) => (
                              <div
                                key={type}
                                onClick={() => handleExportTypeSelect(type as ExportType)}
                                className={`flex w-full items-center justify-between rounded-lg p-2 ${
                                  tempExportType === type ? 'bg-blue-50' : 'hover:bg-gray-50'
                                }`}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    handleExportTypeSelect(type as ExportType)
                                  }
                                }}
                              >
                                <div className="flex items-center space-x-2">
                                  <div className="flex h-12 w-12 items-center justify-center">
                                    {getExportTypeIcon(type as ExportType, true)}
                                  </div>
                                  <Text className="font-medium">{getExportTypeLabel(type as ExportType)}</Text>
                                </div>
                              </div>
                            ))}
                          </div>
                          <Text className="mt-2 text-xs italic text-gray-500">You can always change this later.</Text>
                        </div>

                        {/* Save Button */}
                        <button
                          type="button"
                          className="w-full rounded-lg bg-indigo-600 py-2 text-center text-sm text-white hover:bg-indigo-700"
                          onClick={() => handleSave(close)}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
      {tooltip && <Tooltip id={tooltipId} place={tooltipPosition} content={tooltip} />}
    </>
  )
}
