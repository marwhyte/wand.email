import { useEmailSave } from '@/app/hooks/useEmailSave'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { useToolbarStore } from '@/lib/stores/toolbarStore'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Editor } from '@tiptap/react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { EmailBlock, TextBlockAttributes } from '../../types'
import { useToolbarStateStore } from '../editable-content'
import { emailElements } from './email-elements'
import { FormattingControls } from './FormattingControls'
import { SpecialLinksMenu } from './SpecialLinksMenu'
import { ToolbarProps } from './types'

export const FloatingToolbar = ({ style }: ToolbarProps) => {
  const { hide } = useToolbarStore()
  const { email, executeCommand, setCurrentBlock } = useEmailStore()
  const { exportType } = useChatStore()
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
  const [isCursorAtLinkBoundary, setIsCursorAtLinkBoundary] = useState(false)
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null)

  // Reset all UI state including toolbar state
  const resetToolbarState = useCallback(() => {
    // Reset local state
    setShowLinkInput(false)
    setIsEditingLink(false)
    setLinkUrl('')
    setShowSpecialLinksDialog(false)

    // Reset global toolbar state
    setToolbarState({
      bold: false,
      italic: false,
      underline: false,
      link: false,
      linkUrl: null,
    })
  }, [setToolbarState])

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

  // Function to check for cursor at link boundary from selection event
  const checkCursorPositionInContent = useCallback(
    (event?: MouseEvent) => {
      // Get the DOM node - either from event or from current selection
      let linkNode: Element | null = null

      if (event) {
        // If we have an event, check the target
        const domNode = event.target as HTMLElement
        linkNode = domNode.closest('a')
      } else {
        // Otherwise check the current selection
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const node = range.startContainer
          linkNode =
            node.parentElement?.closest('a') ||
            (node.nodeType === Node.ELEMENT_NODE ? (node as Element).closest('a') : null)
        }
      }

      if (linkNode) {
        // Check if cursor is at end of link
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          if (range.collapsed) {
            // Get the link node's text content
            const linkText = linkNode.textContent || ''
            // Get the offset within the link
            const offset = range.startOffset

            // If cursor is at the end of the link text
            if (offset === linkText.length) {
              setIsCursorAtLinkBoundary(true)
            } else {
              setIsCursorAtLinkBoundary(false)
            }
          } else {
            setIsCursorAtLinkBoundary(false)
          }
        }

        // Update toolbar state to show this is a link
        const href = linkNode.getAttribute('href')
        if (href) {
          setToolbarState({
            ...toolbarState,
            link: true,
            linkUrl: href,
          })
        }
      } else {
        // Not in a link - reset link state if it was active
        if (toolbarState.link) {
          setToolbarState({
            ...toolbarState,
            link: false,
            linkUrl: null,
          })
        }
        setIsCursorAtLinkBoundary(false)
      }
    },
    [toolbarState, setToolbarState]
  )

  // Add listener for selection changes in document
  useEffect(() => {
    const handleSelectionChange = () => {
      // Use the checkCursorPositionInContent function without a MouseEvent
      // It will use the current selection instead
      checkCursorPositionInContent()
    }

    document.addEventListener('selectionchange', handleSelectionChange)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [checkCursorPositionInContent])

  // Function to end a link at cursor position
  const handleEndLink = () => {
    // Use insertText command to insert text after the link
    // This will effectively "break" out of the link mark
    executeCommand({
      type: 'insertText',
      payload: { text: ' ' },
    })

    // Reset the toolbar state
    setToolbarState({
      ...toolbarState,
      link: false,
      linkUrl: null,
    })
  }

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

  // Only show toolbar when text is selected or a link is active
  const hasTextSelection = window.getSelection()?.toString().length !== 0
  const hasActiveLink = toolbarState.link
  const isFocusedInEditor = currentBlock !== null // If we have a current block, user is in the editor

  // Show the toolbar when user is in the editor (has a currentBlock)
  // or when there's a text selection or active link

  // Update editor reference from the contenteditable component
  useEffect(() => {
    if (!currentBlock) return

    // Reset all toolbar state when changing blocks
    resetToolbarState()

    // Find the editor instance associated with the current block
    const editorElement = document.querySelector(`[data-block-id="${currentBlock.id}"] .ProseMirror`)
    if (editorElement) {
      // @ts-ignore - accessing __vue__ property which contains the editor instance
      const editor = (editorElement as any)?.__editor || null
      setEditorInstance(editor)
    }
  }, [currentBlock?.id, resetToolbarState]) // Use currentBlock.id instead of the full object to avoid unnecessary rerenders

  // Update cursor position check when selection changes
  useEffect(() => {
    if (!editorInstance) return

    const handleSelectionUpdate = () => {
      // Check cursor position without creating a fake mouse event
      checkCursorPositionInContent()
    }

    editorInstance.on('selectionUpdate', handleSelectionUpdate)

    return () => {
      editorInstance.off('selectionUpdate', handleSelectionUpdate)
    }
  }, [editorInstance, checkCursorPositionInContent])

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

  // Get the button label based on exportType
  const getSpecialButtonLabel = () => {
    switch (exportType) {
      case 'mailchimp':
        return 'Mailchimp tags'
      case 'html':
        return 'Email tags'
      default:
        return 'Email tags'
    }
  }

  // Determine which tab to open by default based on exportType
  const getDefaultTab = (): 'merge-tags' | 'special-links' => {
    // For mailchimp, we could start with merge tags as default
    if (exportType === 'mailchimp') {
      return 'merge-tags'
    }
    // Default to merge tags for all other export types
    return 'merge-tags'
  }

  // Handle special link selection
  const handleSpecialLinkSelect = () => {
    setSpecialLinksTab(getDefaultTab())
    setShowSpecialLinksDialog(true)
  }

  const handleSpecialLinkValueSelect = (value: string, label?: string) => {
    // For our combined view, we need to check if the selected element is a tag or a link
    const selectedElement = emailElements.find((element) => element.value === value)

    if (selectedElement?.type === 'tag') {
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

  if (!isFocusedInEditor && !hasTextSelection && !hasActiveLink && !showLinkInput) {
    return null
  }

  if (!currentBlock) return null

  // Show toolbar only for text-based blocks and hide for all others
  const allowedTypes = ['text', 'heading', 'list']
  if (!allowedTypes.includes(currentBlock.type)) {
    return null
  }

  return (
    <>
      <motion.div
        ref={toolbarRef}
        className="floating-toolbar absolute z-50 !-translate-x-1/2"
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

                {isCursorAtLinkBoundary && toolbarState.link && (
                  <button
                    onClick={handleEndLink}
                    className="inline-flex items-center rounded-md px-2 py-1 text-blue-600 hover:bg-blue-50"
                    title="End Link"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <line x1="15" y1="3" x2="21" y2="3" />
                      <line x1="21" y1="3" x2="21" y2="9" />
                      <line x1="15" y1="9" x2="21" y2="3" />
                    </svg>
                  </button>
                )}

                <div className="h-4 w-px bg-gray-200" />

                <button
                  onClick={handleSpecialLinkSelect}
                  className="inline-flex items-center gap-x-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  {getSpecialButtonLabel()}
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
        currentExportType={exportType}
      />
    </>
  )
}
