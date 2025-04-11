import { useEmailSave } from '@/app/hooks/useEmailSave'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { useToolbarStore } from '@/lib/stores/toolbarStore'
import { getBlockProps } from '@/lib/utils/attributes'
import { useCallback, useEffect, useRef, useState } from 'react'
import { EmailBlock, TextBlockAttributes } from '../../types'
import { useToolbarStateStore } from '../editable-content'
import { AlignmentControls } from './AlignmentControls'
import { FormattingControls } from './FormattingControls'
import { LineHeightControls } from './LineHeightControls'
import { LinkInput } from './LinkInput'
import { SpecialLinksMenu } from './SpecialLinksMenu'
import { TextControls } from './TextControls'
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

  const processedProps =
    parentRow && currentBlock && currentBlock.type !== 'row'
      ? getBlockProps(currentBlock, parentRow, company, email)
      : {}

  const { state: toolbarState, setState: setToolbarState } = useToolbarStateStore()

  const [showLinkInput, setShowLinkInput] = useState(false)
  const [isEditingLink, setIsEditingLink] = useState(false)
  const linkContainerRef = useRef<HTMLDivElement>(null)
  const [showSpecialLinksDialog, setShowSpecialLinksDialog] = useState(false)
  const [specialLinksTab, setSpecialLinksTab] = useState<'merge-tags' | 'special-links'>('merge-tags')

  // Handle click outside for link input
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (linkContainerRef.current && !linkContainerRef.current.contains(event.target as Node)) {
        setShowLinkInput(false)
      }
    }

    if (showLinkInput) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLinkInput])

  // Handle formatting button clicks
  const handleFormatClick = (type: 'bold' | 'italic' | 'underline') => {
    setToolbarState({
      ...toolbarState,
      [type]: !toolbarState[type],
    })
    executeCommand({ type })
  }

  // Handle link submission
  const handleLinkSubmit = (url: string) => {
    setToolbarState({
      ...toolbarState,
      link: true,
      linkUrl: url,
    })
    executeCommand({ type: 'link', payload: { href: url } })
    setShowLinkInput(false)
    setIsEditingLink(false)
  }

  const showLinkButton = currentBlock?.type !== 'link' && currentBlock?.type !== 'button'
  const showLineHeightControls =
    currentBlock?.type !== 'link' && currentBlock?.type !== 'button' && currentBlock?.type !== 'list'
  const showAlignmentControls = currentBlock?.type === 'text' || currentBlock?.type === 'heading'
  const isButtonOrLink = currentBlock?.type === 'button' || currentBlock?.type === 'link'
  const showSpecialLinks =
    currentBlock?.type === 'text' ||
    currentBlock?.type === 'heading' ||
    currentBlock?.type === 'link' ||
    currentBlock?.type === 'list' ||
    currentBlock?.type === 'table'

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
    } else {
      setIsEditingLink(false)
    }

    setShowLinkInput(!showLinkInput)
  }

  // Add escape key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hide()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [hide])

  return (
    <>
      <div className="floating-toolbar" style={style}>
        <div ref={linkContainerRef}>
          {showLinkInput && (
            <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform" style={{ zIndex: 1000 }}>
              <LinkInput
                isVisible={showLinkInput}
                isEditing={isEditingLink}
                initialUrl={toolbarState.linkUrl || ''}
                onClose={() => setShowLinkInput(false)}
                onSubmit={handleLinkSubmit}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col divide-y divide-transparent rounded-lg border bg-white shadow-lg">
          {showSpecialLinks && (
            <div className="flex items-center gap-2 p-1">
              <button
                onClick={handleLinkButtonClick}
                className={`inline-flex items-center gap-x-1 rounded-md px-2 py-1 text-xs font-medium shadow-sm ring-1 ring-inset ${
                  toolbarState.link
                    ? 'bg-indigo-100 text-indigo-700 ring-indigo-300'
                    : 'bg-white text-gray-900 ring-gray-300 hover:bg-gray-50'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                  />
                </svg>
                {toolbarState.link && toolbarState.linkUrl ? 'Edit Link' : 'Add Link'}
              </button>

              <div className="h-4 w-px bg-gray-200" />

              <button
                onClick={() => handleSpecialLinkSelect('merge-tags')}
                className="inline-flex items-center gap-x-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Merge Tags
              </button>

              <div className="h-4 w-px bg-gray-200" />

              <button
                onClick={() => handleSpecialLinkSelect('special-links')}
                className="inline-flex items-center gap-x-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Special Links
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 p-1">
            <div className="flex items-center gap-2">
              <FormattingControls
                bold={toolbarState.bold}
                italic={toolbarState.italic}
                underline={toolbarState.underline}
                link={toolbarState.link}
                showLinkButton={false}
                onFormatClick={handleFormatClick}
                onLinkClick={handleLinkButtonClick}
              />
            </div>

            <div className="h-4 w-px bg-gray-200" />

            <div className="flex items-center gap-2">
              <TextControls
                fontSize={processedProps.style?.fontSize ? parseInt(String(processedProps.style.fontSize)) : 16}
                fontWeight={String(processedProps.style?.fontWeight) || 'normal'}
                color={processedProps.style?.color || '#000000'}
                onChange={onChange}
              />

              {showAlignmentControls && (
                <AlignmentControls
                  textAlign={(processedProps.style?.textAlign as 'left' | 'center' | 'right') || 'left'}
                  onChange={(value) => onChange({ textAlign: value })}
                />
              )}
            </div>

            {showLineHeightControls && (
              <>
                <div className="h-4 w-px bg-gray-200" />
                <LineHeightControls
                  lineHeight={String(processedProps.style?.lineHeight) || '120%'}
                  onChange={(value) => onChange({ lineHeight: value })}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <SpecialLinksMenu
        isOpen={showSpecialLinksDialog}
        onClose={() => setShowSpecialLinksDialog(false)}
        onSelect={handleSpecialLinkValueSelect}
        initialTab={specialLinksTab}
      />
    </>
  )
}
