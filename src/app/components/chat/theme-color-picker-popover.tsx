import { useChatStore } from '@/lib/stores/chatStore'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Text } from '../text'
import { Tooltip } from '../tooltip'

interface ThemeColorPickerPopoverProps {
  tooltip?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
}

export function ThemeColorPickerPopover({ tooltip, tooltipPosition = 'top' }: ThemeColorPickerPopoverProps) {
  const { themeColor, setThemeColor } = useChatStore()

  const colors = [
    { name: 'Yellow', value: '#FED776' },
    { name: 'Blue', value: '#7DD3FC' },
    { name: 'Green', value: '#86EFAC' },
    { name: 'Purple', value: '#D8B4FE' },
    { name: 'Pink', value: '#F9A8D4' },
    { name: 'Orange', value: '#FDBA74' },
  ]

  // Generate tooltip ID if tooltip is provided
  const tooltipId = tooltip ? `theme-color-picker-tooltip-${Math.random().toString(36).substring(2, 9)}` : undefined

  return (
    <>
      <div className="relative">
        <Popover className="relative">
          {({ open }) => (
            <>
              <PopoverButton
                className="flex items-center space-x-1.5 rounded-md bg-gray-100 px-2 py-1 hover:bg-gray-200 focus:outline-none"
                aria-label="Theme color settings"
                data-tooltip-id={tooltipId}
              >
                <div
                  className="h-4 w-4 rounded-full"
                  style={{
                    backgroundColor: themeColor,
                  }}
                />
              </PopoverButton>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <PopoverPanel className="absolute right-0 z-50 mt-1 w-64 transform px-4 sm:px-0">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative bg-white p-3">
                      <div className="space-y-4">
                        <div>
                          <Text className="!text-sm">Select Theme Color</Text>
                          <div className="mt-2 grid grid-cols-3 gap-2">
                            {colors.map((c) => (
                              <button
                                key={c.value}
                                type="button"
                                onClick={() => setThemeColor(c.value)}
                                className={`flex h-8 w-full items-center justify-center rounded-md ${
                                  themeColor === c.value ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                                }`}
                                style={{
                                  backgroundColor: c.value,
                                }}
                                aria-label={c.name}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
      {tooltip && tooltipId && <Tooltip id={tooltipId} place={tooltipPosition} content={tooltip} />}
    </>
  )
}
