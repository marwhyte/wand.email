import { useEmailSave } from '@/app/hooks/useEmailSave'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { useToolbarStore } from '@/lib/stores/toolbarStore'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { EmailBlock, TextBlockAttributes } from '../../types'
import { useToolbarStateStore } from '../editable-content'
import { FormattingControls } from './FormattingControls'
import { SpecialLinksMenu } from './SpecialLinksMenu'
import { ToolbarProps } from './types'

export const FloatingToolbar = ({ style }: ToolbarProps) => {
  const { hide } = useToolbarStore()
  const { email, executeCommand, setCurrentBlock } = useEmailStore()
  const { company } = useChatStore()
  const handleSave = useEmailSave()
  const { currentBlock } = useEmailStore()
  const parentRow = email?.rows.find((row) =>
    row.columns.some((column) => column.blocks.some((b) => b.id === currentBlock?.id))
  )

  const { state: toolbarState, setState: setToolbarState } = useToolbarStateStore()
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [isEditingLink, setIsEditingLink] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const linkInputRef = useRef<HTMLInputElement>(null)
  const [showSpecialLinksDialog, setShowSpecialLinksDialog] = useState(false)
  const [specialLinksTab, setSpecialLinksTab] = useState<'merge-tags' | 'special-links'>('merge-tags')
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [toolbarStyle, setToolbarStyle] = useState<React.CSSProperties>({})

  // Calculate and set the correct toolbar position
  useLayoutEffect(() => {
    if (!toolbarRef.current) return

    const container = document.querySelector('[data-email-container]')
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const toolbarRect = toolbarRef.current.getBoundingClientRect()
    const toolbarWidth = toolbarRect.width

    // Calculate initial position centered on target
    let left = (style?.left as number) || 0

    // Account for container edges
    const maxLeft = containerRect.width - 10 // 10px from right edge
    const minLeft = 10 // 10px from left edge

    // Calculate the ideal centered position (offset by half the toolbar width)
    const idealLeft = left - toolbarWidth / 2

    // Adjust if going beyond right edge
    if (idealLeft + toolbarWidth > maxLeft) {
      left = maxLeft - toolbarWidth + toolbarWidth / 2
    }

    // Adjust if going beyond left edge
    if (idealLeft < minLeft) {
      left = minLeft + toolbarWidth / 2
    }

    // Set the position
    setToolbarStyle({
      top: style?.top || 0,
      left,
    })
  }, [style?.top, style?.left, toolbarRef.current, showLinkInput])

  // Define all callbacks before any conditional returns
  const onChange = useCallback(
    (attributes: Partial<TextBlockAttributes>) => {
      if (currentBlock) {
        const updatedBlock = {
          ...currentBlock,
          attributes: { ...currentBlock.attributes, ...attributes },
        } as EmailBlock

        // Check if there's an actual change
        if (JSON.stringify(updatedBlock) !== JSON.stringify(currentBlock)) {
          setCurrentBlock(updatedBlock)

          if (!email) return
          const updatedEmail = {
            ...email,
            rows: email.rows.map((row) => ({
              ...row,
              columns: row.columns.map((column) => ({
                ...column,
                blocks: column.blocks.map((block) => (block.id === updatedBlock.id ? updatedBlock : block)),
              })),
            })),
          }

          handleSave(updatedEmail)
        }
      }
    },
    [currentBlock, setCurrentBlock, email, handleSave]
  )

  // Add escape key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showLinkInput) {
          setShowLinkInput(false)
        }
        // We no longer close the toolbar with Escape, only the link input
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showLinkInput])

  // Auto-focus the link input when it becomes visible
  useEffect(() => {
    if (showLinkInput && linkInputRef.current) {
      setTimeout(() => {
        linkInputRef.current?.focus()
      }, 10)
    }
  }, [showLinkInput])

  // If no current block is selected, don't show the toolbar
  if (!currentBlock) return null

  // Show toolbar only for text-based blocks and hide for all others
  const allowedTypes = ['text', 'heading', 'list']
  if (!allowedTypes.includes(currentBlock.type)) {
    return null
  }

  // Only show toolbar when text is selected or a link is active
  const hasTextSelection = window.getSelection()?.toString().length !== 0
  const hasActiveLink = toolbarState.link
  if (!hasTextSelection && !hasActiveLink && !showLinkInput) {
    return null
  }

  // Handle formatting button clicks
  const handleFormatClick = (type: 'bold' | 'italic' | 'underline') => {
    setToolbarState({
      ...toolbarState,
      [type]: !toolbarState[type],
    })
    executeCommand({ type })
  }

  // Handle link submission
  const handleLinkSubmit = () => {
    if (!linkUrl) {
      setShowLinkInput(false)
      return
    }

    try {
      // Add https:// if not present
      const url = linkUrl.startsWith('http://') || linkUrl.startsWith('https://') ? linkUrl : `https://${linkUrl}`

      // Validate URL
      new URL(url)

      setToolbarState({
        ...toolbarState,
        link: true,
        linkUrl: url,
      })
      executeCommand({ type: 'link', payload: { href: url } })
      setShowLinkInput(false)
      setIsEditingLink(false)
      setLinkUrl('')
    } catch (e) {
      alert('Please enter a valid URL')
    }
  }

  // Handle special link selection
  const handleSpecialLinkSelect = (tab: 'merge-tags' | 'special-links') => {
    setSpecialLinksTab(tab)
    setShowSpecialLinksDialog(true)
  }

  const handleSpecialLinkValueSelect = (value: string, label?: string) => {
    if (specialLinksTab === 'merge-tags') {
      // For merge tags, just insert the text
      executeCommand({ type: 'insertText', payload: { text: value } })
    } else {
      // For special links, create a link with the label
      if (!currentBlock) {
        // If no block is selected, create a new link with the label
        executeCommand({ type: 'link', payload: { href: value, text: label } })
      } else if (currentBlock.type === 'link') {
        // If current block is a link, update its href
        onChange({ href: value } as any)
      } else {
        // If current block is text or other type, wrap it in a link with the label
        executeCommand({ type: 'link', payload: { href: value, text: label } })
      }
    }
    setShowSpecialLinksDialog(false)
  }

  // Handle link button click
  const handleLinkButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // If a link is already active, prepopulate with the link URL
    if (toolbarState.link && toolbarState.linkUrl) {
      setIsEditingLink(true)
      setLinkUrl(toolbarState.linkUrl)
    } else {
      setIsEditingLink(false)
      setLinkUrl('')
    }

    setShowLinkInput(!showLinkInput)
  }

  // Cancel link creation
  const handleCancelLink = () => {
    setShowLinkInput(false)
    setLinkUrl('')
  }

  return (
    <>
      <motion.div
        ref={toolbarRef}
        className="absolute z-50 !-translate-x-1/2"
        style={{
          position: 'absolute',
          whiteSpace: 'nowrap',
          ...toolbarStyle,
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex divide-transparent rounded-lg border bg-white shadow-lg">
          <AnimatePresence mode="wait">
            {!showLinkInput ? (
              // Default toolbar content
              <motion.div
                key="formatting-toolbar"
                className="flex items-center gap-2 p-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <FormattingControls
                  bold={toolbarState.bold}
                  italic={toolbarState.italic}
                  underline={toolbarState.underline}
                  link={toolbarState.link}
                  showLinkButton={true}
                  onFormatClick={handleFormatClick}
                  onLinkClick={handleLinkButtonClick}
                />

                <div className="h-4 w-px bg-gray-200" />

                <button
                  onClick={() => handleSpecialLinkSelect('merge-tags')}
                  className="inline-flex items-center gap-x-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Merge Tags
                </button>

                <button
                  onClick={() => handleSpecialLinkSelect('special-links')}
                  className="inline-flex items-center gap-x-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Special Links
                </button>
              </motion.div>
            ) : (
              // Link input content
              <motion.div
                key="link-input"
                className="flex w-full items-center p-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <input
                  ref={linkInputRef}
                  type="text"
                  placeholder="Enter URL"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLinkSubmit()}
                  className="flex-1 rounded-md border-0 px-3 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-purple-500"
                  autoFocus
                />
                <button
                  onClick={handleLinkSubmit}
                  className="ml-2 inline-flex items-center rounded px-2 py-1 text-green-600 hover:bg-green-50"
                  title={isEditingLink ? 'Update Link' : 'Add Link'}
                >
                  <CheckIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancelLink}
                  className="inline-flex items-center rounded px-2 py-1 text-red-500 hover:bg-red-50"
                  title="Cancel"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <SpecialLinksMenu
        isOpen={showSpecialLinksDialog}
        onClose={() => setShowSpecialLinksDialog(false)}
        onSelect={handleSpecialLinkValueSelect}
        initialTab={specialLinksTab}
      />
    </>
  )
}
