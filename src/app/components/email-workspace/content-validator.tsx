'use client'

import { useEmailStore } from '@/lib/stores/emailStore'
import { isValidHttpUrl } from '@/lib/utils/misc'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { EmailBlock, RowBlock } from './types'

interface ValidationIssue {
  blockId: string
  type: 'invalidLink' | 'missingImageSrc' | 'invalidSocialLink'
  message: string
  socialIndex?: number // Added for social link issues to track which specific social link has an issue
}

interface ContentValidatorProps {
  className?: string
  size?: 'default' | 'small'
}

const ContentValidator = ({ className = '', size = 'default' }: ContentValidatorProps) => {
  const { email, setCurrentBlock } = useEmailStore()
  const [issues, setIssues] = useState<ValidationIssue[]>([])

  const findBlockById = useCallback(
    (blockId: string): EmailBlock | RowBlock | null => {
      if (!email) return null

      // Search in top-level blocks
      for (const row of email.rows) {
        if (row.id === blockId) return row

        // Search in columns
        for (const column of row.columns) {
          for (const block of column.blocks) {
            if (block.id === blockId) return block
          }
        }
      }

      return null
    },
    [email]
  )

  const handleSelectBlock = useCallback(
    (blockId: string, close: () => void, issue?: ValidationIssue) => {
      const block = findBlockById(blockId)
      if (block) {
        setCurrentBlock(block)
        close()

        // Add a small delay to ensure the DOM has updated
        setTimeout(() => {
          // Find the element with the block's ID
          const element = document.querySelector(`[data-block-id="${blockId}"]`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })

            // Find the appropriate input to focus based on block type and issue type
            setTimeout(() => {
              // Add a pulsing outline to help user identify where to look
              const addPulsingOutline = (element: HTMLElement) => {
                // Remove any existing outline classes first
                document.querySelectorAll('.outline-pulse').forEach((el) => {
                  el.classList.remove('outline-pulse')
                })

                element.classList.add('outline-pulse')

                // Remove the pulse after a few seconds
                setTimeout(() => {
                  element.classList.remove('outline-pulse')
                }, 4000)
              }

              if (block.type === 'button' || block.type === 'link') {
                // Focus the href input in EmailBlockEditor
                const hrefEditor = document.querySelector(
                  '.href-editor-container input[type="url"], .href-editor-container input[type="tel"], .href-editor-container input[type="email"]'
                )
                if (hrefEditor instanceof HTMLInputElement) {
                  hrefEditor.focus()
                  addPulsingOutline(hrefEditor)
                }
              } else if (
                block.type === 'socials' &&
                issue?.type === 'invalidSocialLink' &&
                issue.socialIndex !== undefined
              ) {
                // Target the specific social link input by index
                const socialInputs = document.querySelectorAll('.socials-editor-container input[type="url"]')
                if (socialInputs && socialInputs[issue.socialIndex]) {
                  const input = socialInputs[issue.socialIndex] as HTMLInputElement
                  input.focus()
                  addPulsingOutline(input)
                }
              } else if (block.type === 'text') {
                // For text blocks, we need to trigger the floating toolbar
                const textContent = element.querySelector('.ProseMirror')
                if (textContent) {
                  // Simulate a click to focus the editor
                  textContent.dispatchEvent(new MouseEvent('click', { bubbles: true }))

                  // Find any link in the content and select it
                  const links = textContent.querySelectorAll('a')
                  if (links.length > 0) {
                    // Try to find an invalid link - look for each URL in the error message
                    let targetLink = links[0] // Default to first link if we can't match

                    if (issue?.message) {
                      // Extract URL from error message
                      const urlMatch = issue.message.match(/invalid link: (.*?)($|,|\s)/i)
                      if (urlMatch && urlMatch[1]) {
                        const badUrl = urlMatch[1]
                        // Find link with this URL
                        for (const link of links) {
                          if (link.getAttribute('href') === badUrl) {
                            targetLink = link
                            break
                          }
                        }
                      }
                    }

                    // Select the link
                    const range = document.createRange()
                    range.selectNodeContents(targetLink)
                    const selection = window.getSelection()
                    if (selection) {
                      selection.removeAllRanges()
                      selection.addRange(range)

                      // The editable-content component will detect this selection
                      // and position the toolbar appropriately above the selected link

                      // Wait for floating toolbar to appear, then focus its input when it appears
                      setTimeout(() => {
                        const linkButton = document.querySelector('.floating-toolbar button[title="Link"]')
                        if (linkButton instanceof HTMLButtonElement) {
                          linkButton.click()

                          // Wait for link input to appear
                          setTimeout(() => {
                            const linkInput = document.querySelector('.floating-toolbar input[type="text"]')
                            if (linkInput instanceof HTMLInputElement) {
                              linkInput.focus()
                              addPulsingOutline(linkInput)
                            }
                          }, 100)
                        }
                      }, 150) // Slightly increased delay to ensure toolbar appears
                    }
                  }
                }
              } else if (block.type === 'image' && issue?.type === 'missingImageSrc') {
                // Focus the image src input
                const imgSrcInput = document.querySelector('.image-src-input')
                if (imgSrcInput instanceof HTMLInputElement) {
                  imgSrcInput.focus()
                  addPulsingOutline(imgSrcInput)
                }
              }
            }, 300) // Increased delay to ensure editors are mounted
          }
        }, 100)
      }
    },
    [findBlockById, setCurrentBlock]
  )

  // Validate email content for issues
  useEffect(() => {
    if (!email) {
      setIssues([])
      return
    }

    const newIssues: ValidationIssue[] = []

    // Process all rows and their contents
    email.rows.forEach((row) => {
      row.columns.forEach((column) => {
        column.blocks.forEach((block) => {
          // Check for invalid links in button blocks
          if (block.type === 'button' && block.attributes.href) {
            if (!isValidLinkUrl(block.attributes.href)) {
              newIssues.push({
                blockId: block.id,
                type: 'invalidLink',
                message: `Button has invalid link: ${block.attributes.href}`,
              })
            }
          }

          // Check for invalid links in link blocks
          if (block.type === 'link' && block.attributes.href) {
            if (!isValidLinkUrl(block.attributes.href)) {
              newIssues.push({
                blockId: block.id,
                type: 'invalidLink',
                message: `Link has invalid URL: ${block.attributes.href}`,
              })
            }
          }

          // Check for text blocks with links in the content
          if (block.type === 'text' && block.attributes.content) {
            // Find href attributes in HTML content
            const hrefRegex = /href=["'](.*?)["']/g
            let match
            while ((match = hrefRegex.exec(block.attributes.content)) !== null) {
              const href = match[1]
              if (!isValidLinkUrl(href)) {
                newIssues.push({
                  blockId: block.id,
                  type: 'invalidLink',
                  message: `Text contains invalid link: ${href}`,
                })
              }
            }
          }

          // Check for missing image sources
          if (block.type === 'image') {
            if (!block.attributes.src || block.attributes.src.trim() === '') {
              newIssues.push({
                blockId: block.id,
                type: 'missingImageSrc',
                message: 'Image is missing source URL',
              })
            }
          }

          // Check for social links in social blocks
          if (block.type === 'socials' && block.attributes.links) {
            block.attributes.links.forEach((socialLink, index) => {
              if (!socialLink.url || !isValidLinkUrl(socialLink.url)) {
                newIssues.push({
                  blockId: block.id,
                  type: 'invalidSocialLink',
                  message: `Invalid URL for ${socialLink.icon || 'social'} icon: ${socialLink.url || 'missing URL'}`,
                  socialIndex: index,
                })
              }
            })
          }
        })
      })
    })

    setIssues(newIssues)
  }, [email])

  // Helper function to check if a URL is valid for links
  const isValidLinkUrl = (href: string): boolean => {
    if (!href || href.trim() === '') return false

    if (href.startsWith('mailto:')) {
      // Check email links (basic validation)
      const emailPart = href.replace('mailto:', '').split('?')[0]
      return emailPart.includes('@')
    } else if (href.startsWith('tel:')) {
      // Phone links should have some content
      return href.replace('tel:', '').trim() !== ''
    } else if (href === '#' || href === '/') {
      // Placeholder links are technically valid, but not ideal
      return false
    } else {
      // Web links should be valid URLs
      return isValidHttpUrl(href)
    }
  }

  if (issues.length === 0) return null

  // Increase icon sizes
  const iconSize = size === 'small' ? 'h-6 w-6' : 'h-7 w-7'
  const badgeSize = size === 'small' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  const badgeTextSize = size === 'small' ? 'text-[8px]' : 'text-[10px]'

  return (
    <div className={`relative ${className}`}>
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <PopoverButton
              className="flex items-center justify-center text-red-500 hover:text-red-600 focus:outline-none"
              title={`${issues.length} content issue${issues.length > 1 ? 's' : ''} found`}
              aria-label="Show content issues"
            >
              <ExclamationCircleIcon className={iconSize} />
              {issues.length > 1 && (
                <span
                  className={`absolute -right-1 -top-1 flex ${badgeSize} items-center justify-center rounded-full bg-white ${badgeTextSize} font-bold text-red-500 ring-1 ring-red-500`}
                >
                  {issues.length}
                </span>
              )}
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
              <PopoverPanel className="absolute right-0 z-50 mt-1 w-80 transform px-4 sm:px-0">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative bg-white p-4">
                    <div className="mb-2 text-lg font-bold">Content Issues</div>
                    <div className="max-h-80 overflow-y-auto">
                      {issues.map((issue, index) => (
                        <div
                          key={index}
                          className="mb-2 cursor-pointer rounded border border-gray-200 p-2 hover:bg-gray-50"
                          onClick={() => handleSelectBlock(issue.blockId, close, issue)}
                        >
                          <div className="flex items-center">
                            <ExclamationCircleIcon className="mr-2 h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium">
                              {issue.type === 'invalidLink'
                                ? 'Invalid Link'
                                : issue.type === 'missingImageSrc'
                                  ? 'Missing Image Source'
                                  : 'Invalid Social Link'}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-gray-600">{issue.message}</p>
                          <p className="mt-1 text-xs text-purple-600">Click to select this block</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}

export default ContentValidator
