import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useEffect, useRef, useState } from 'react'
import { LinkInputProps } from './types'

export const LinkInput = ({ isVisible, isEditing, initialUrl = '', onClose, onSubmit }: LinkInputProps) => {
  const [linkUrl, setLinkUrl] = useState(initialUrl)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Save the current selection when the component mounts or updates
  const savedSelectionRef = useRef<Range | null>(null)

  // Capture the initial selection
  useEffect(() => {
    if (isVisible) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        savedSelectionRef.current = selection.getRangeAt(0).cloneRange()
      }
    }
  }, [isVisible])

  // Update linkUrl when initialUrl changes
  useEffect(() => {
    if (initialUrl) {
      setLinkUrl(initialUrl)
    }
  }, [initialUrl])

  // Prevent mousedown events from stealing focus
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // If clicking inside the link input container, prevent default
      // to maintain selection in the editor
      e.preventDefault()

      // Save the current selection
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        savedSelectionRef.current = selection.getRangeAt(0).cloneRange()
      }

      // Focus the input but don't change selection
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus()

        // Schedule selection restoration
        setTimeout(restoreSelection, 0)
      }
    }

    // Only add listener to the link input container
    const container = containerRef.current
    if (container && isVisible) {
      container.addEventListener('mousedown', handleMouseDown)
    }

    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown)
      }
    }
  }, [isVisible])

  // Auto-focus the input field when it becomes visible
  useEffect(() => {
    if (isVisible && inputRef.current) {
      // Focus the input but don't lose the editor selection
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus()

          // Immediate restoration of selection
          restoreSelection()
        }
      })
    }
  }, [isVisible])

  // Helper to restore text selection
  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      try {
        const selection = window.getSelection()
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(savedSelectionRef.current)
        }
      } catch (e) {
        // Ignore invalid selection errors
      }
    }
  }

  const handleSubmit = () => {
    if (!linkUrl) {
      onClose()
      return
    }

    try {
      // Add https:// if not present
      const url = linkUrl.startsWith('http://') || linkUrl.startsWith('https://') ? linkUrl : `https://${linkUrl}`

      // Validate URL
      new URL(url)

      onSubmit(url)
      setLinkUrl('')
    } catch (e) {
      alert('Please enter a valid URL')
    }
  }

  // Handle close button click
  const handleClose = () => {
    onClose()
  }

  // Special event handling for key presses
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      handleClose()
    } else {
      // For all other keys, make sure text selection is maintained
      requestAnimationFrame(restoreSelection)
    }
  }

  if (!isVisible) return null

  return (
    <div className="z-50 rounded-md border border-gray-200 bg-white shadow-lg" ref={containerRef}>
      <div className="flex items-center">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter URL"
          value={linkUrl}
          onChange={(e) => {
            setLinkUrl(e.target.value)
            // Maintain selection in background
            requestAnimationFrame(restoreSelection)
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-l-md border-r-0 px-3 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-purple-500"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          className="inline-flex items-center border-gray-200 px-2 py-1 text-green-600 hover:bg-green-50"
          title={isEditing ? 'Update Link' : 'Add Link'}
        >
          <CheckIcon className="h-4 w-4" />
        </button>
        <button
          onClick={handleClose}
          className="inline-flex items-center rounded-r-md px-2 py-1 text-red-500 hover:bg-red-50"
          title="Cancel"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
