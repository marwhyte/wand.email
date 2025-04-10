'use client'

import { updateChat } from '@/lib/database/queries/chats'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'
import { ColorInput } from './color-input'
import { Text } from './text'
import { Tooltip } from './tooltip'

type BorderRadiusOption = 'square' | 'rounded' | 'default'

type ThemeColorPickerPopoverProps = {
  className?: string
  tooltip?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  children?: React.ReactNode
  popoverDirection?: 'up' | 'down'
  size?: 'default' | 'large'
} & React.HTMLAttributes<HTMLDivElement>

// Available themes for the color picker
const availableThemes = ['#8e6ff7', '#fed776', '#059669', '#3b82f6', '#fcf8f2']

export const ThemeColorPickerPopover: React.FC<ThemeColorPickerPopoverProps> = ({
  className = '',
  tooltip,
  tooltipPosition = 'top',
  children,
  popoverDirection = 'down',
  size = 'default',
  ...rest
}) => {
  const { themeColor, borderRadius, chatId, chatStarted, setThemeColor, setBorderRadius } = useChatStore()
  const { email, setEmail } = useEmailStore()

  // Temporary state (what's shown in the popover until saved)
  const [tempTheme, setTempTheme] = useState<string | null>(null)
  const [tempColor, setTempColor] = useState(themeColor)
  const [tempBorderRadius, setTempBorderRadius] = useState<BorderRadiusOption>(borderRadius as BorderRadiusOption)

  // Update temporary state when store values change
  useEffect(() => {
    setTempColor(themeColor)
    setTempBorderRadius(borderRadius as BorderRadiusOption)

    // Try to determine if this color matches a theme
    const foundTheme = availableThemes.find((theme) => theme.toLowerCase() === themeColor.toLowerCase())
    setTempTheme(foundTheme || null)
  }, [themeColor, borderRadius])

  // Reset temp values when popover opens
  const handlePopoverOpen = () => {
    setTempColor(themeColor)
    setTempBorderRadius(borderRadius as BorderRadiusOption)

    // Try to determine if this color matches a theme
    const foundTheme = availableThemes.find((theme) => theme.toLowerCase() === themeColor.toLowerCase())
    setTempTheme(foundTheme || null)
  }

  const handleThemeSelect = (theme: string | null) => {
    setTempTheme(theme)
    // If a theme is selected, update the temp color to its action color
    if (theme) {
      setTempColor(theme)
    }
  }

  const handleCustomColorChange = (color: string) => {
    setTempColor(color)
    // When a custom color is chosen, set temp theme to null
    setTempTheme(null)
  }

  const handleBorderRadiusChange = (radius: BorderRadiusOption) => {
    setTempBorderRadius(radius)
  }

  const handleSave = async (close: () => void) => {
    // Update the store
    setThemeColor(tempColor)
    setBorderRadius(tempBorderRadius)

    if (email) {
      // Clear all s3IconUrls from all icons in the email when theme changes
      if (email.themeColor !== tempColor) {
        // Deep clone the email and remove all s3IconUrls from icon blocks
        const updatedEmail = {
          ...email,
          themeColor: tempColor,
          borderRadius: tempBorderRadius,
          rows: email.rows.map((row) => ({
            ...row,
            columns: row.columns.map((column) => ({
              ...column,
              blocks: column.blocks.map((block) => {
                // If this is an icon block with s3IconUrl, remove the URL
                if (block.type === 'icon' && block.attributes.s3IconUrl) {
                  return {
                    ...block,
                    attributes: {
                      ...block.attributes,
                      s3IconUrl: undefined,
                    },
                  }
                }
                return block
              }),
            })),
          })),
        }

        setEmail(updatedEmail)
      } else {
        // No theme change, just update borderRadius
        setEmail({
          ...email,
          themeColor: tempColor,
          borderRadius: tempBorderRadius,
        })
      }
    }

    // If chat has started, update the chat in the database
    if (chatStarted && chatId) {
      try {
        await updateChat(chatId, {
          color: tempColor,
          borderRadius: tempBorderRadius,
        })
      } catch (error) {
        console.error('Failed to update chat theme settings:', error)
      }
    }

    close()
  }

  const sizeMultiplier = size === 'large' ? 1.5 : 1
  const iconSize = size === 'large' ? 'h-6 w-6' : 'h-4 w-4'

  return (
    <>
      <div className={`relative ${className}`} {...rest}>
        <Popover className="relative">
          {({ open, close }) => (
            <>
              {children ? (
                <PopoverButton
                  className="flex h-full w-full items-center justify-center focus:outline-none"
                  aria-label="Theme settings"
                  onClick={() => {
                    if (!open) {
                      handlePopoverOpen()
                    }
                  }}
                  data-tooltip-id="123"
                >
                  {children}
                </PopoverButton>
              ) : tooltip ? (
                <Tooltip id="theme-color-picker-popover" place={tooltipPosition} content={tooltip}>
                  <PopoverButton
                    className="flex items-center space-x-1.5 rounded-md bg-gray-100 px-2 py-1 hover:bg-gray-200 focus:outline-none"
                    aria-label="Theme settings"
                    onClick={() => {
                      if (!open) {
                        handlePopoverOpen()
                      }
                    }}
                    data-tooltip-id="123"
                  >
                    <div className="flex items-center space-x-1.5">
                      <div
                        className={iconSize + ' rounded-full'}
                        style={{
                          backgroundColor: themeColor,
                        }}
                      />
                      <div className={iconSize}>
                        <img
                          src="/border-radius.svg"
                          alt="Border Radius Icon"
                          className="h-full w-full"
                          style={{ filter: 'brightness(0) saturate(100%) invert(50%)' }}
                        />
                      </div>
                    </div>
                    {tempTheme === null && <span className="sr-only">Custom color</span>}
                  </PopoverButton>
                </Tooltip>
              ) : (
                <PopoverButton
                  className="flex items-center space-x-1.5 rounded-md bg-gray-100 px-2 py-1 hover:bg-gray-200 focus:outline-none"
                  aria-label="Theme settings"
                  onClick={() => {
                    if (!open) {
                      handlePopoverOpen()
                    }
                  }}
                  data-tooltip-id="1234"
                >
                  <div className="flex items-center space-x-1.5">
                    <div
                      className={iconSize + ' rounded-full'}
                      style={{
                        backgroundColor: themeColor,
                      }}
                    />
                    <div className={iconSize}>
                      <img
                        src="/border-radius.svg"
                        alt="Border Radius Icon"
                        className="h-full w-full"
                        style={{ filter: 'brightness(0) saturate(100%) invert(50%)' }}
                      />
                    </div>
                  </div>
                  {tempTheme === null && <span className="sr-only">Custom color</span>}
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
                  className={`absolute left-1/2 z-50 w-64 -translate-x-1/2 transform px-4 sm:px-0 ${
                    popoverDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
                  }`}
                >
                  <div className="overflow-hidden rounded-lg shadow-xl ring-1 ring-black ring-opacity-5">
                    <div className="relative bg-white p-3">
                      <div className="space-y-4">
                        {/* Primary Color */}
                        <div>
                          <Text className="!text-sm">Primary Color</Text>
                          <div className="grid grid-cols-5 gap-1.5 pt-2">
                            {/* Theme Color Swatches */}
                            {availableThemes.map((theme) => (
                              <button
                                key={theme}
                                type="button"
                                onClick={() => handleThemeSelect(theme)}
                                className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 p-2 ${
                                  tempTheme === theme ? 'border-2' : 'border border-gray-200'
                                }`}
                                style={tempTheme === theme ? { borderColor: theme } : {}}
                              >
                                <div className="h-6 w-6 rounded-md" style={{ backgroundColor: theme }}></div>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Text className="!pb-2 !text-sm">Custom Color</Text>
                          <ColorInput
                            value={tempColor}
                            onChange={handleCustomColorChange}
                            showTransparent={false}
                            showHexCode={true}
                            className={tempTheme === null ? 'custom-color-selected' : ''}
                          />
                        </div>

                        {/* Corner Radius */}
                        <div>
                          <Text className="!text-sm">Corner Radius</Text>
                          <div className="flex gap-2 pt-2">
                            {[
                              { value: 'square', element: <div className="h-4 w-4 border-2 border-gray-400"></div> },
                              {
                                value: 'default',
                                element: <div className="h-4 w-4 rounded-md border-2 border-gray-400"></div>,
                              },
                              {
                                value: 'rounded',
                                element: <div className="h-4 w-4 rounded-full border-2 border-gray-400"></div>,
                              },
                            ].map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => handleBorderRadiusChange(option.value as BorderRadiusOption)}
                                className={`flex h-10 flex-1 items-center justify-center rounded-lg bg-gray-50 p-2 ${
                                  tempBorderRadius === option.value
                                    ? 'border border-purple-500 ring-1 ring-purple-200'
                                    : 'border border-gray-200'
                                }`}
                              >
                                {option.element}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Save Button */}
                        <div>
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
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
      {tooltip && <Tooltip id="1235" place={tooltipPosition} content={tooltip} />}
    </>
  )
}
