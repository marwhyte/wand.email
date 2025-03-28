import { XMarkIcon } from '@heroicons/react/24/solid'
import { useEffect, useRef, useState } from 'react'
import { LinkInputProps } from './types'

export const LinkInput = ({ isVisible, isEditing, onClose, onSubmit }: LinkInputProps) => {
  const [linkUrl, setLinkUrl] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isVisible])

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

  if (!isVisible) return null

  return (
    <div className="z-50 rounded-md border border-gray-200 bg-white p-3 shadow-lg">
      <div className="mb-2 text-sm font-medium text-gray-700">{isEditing ? 'Edit Link' : 'Add Link'}</div>
      <div className="flex">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter URL"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="mr-2 flex-1 rounded-md border border-gray-300 p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          className="rounded-md bg-purple-600 px-3 py-2 text-white transition-colors hover:bg-purple-700"
        >
          {isEditing ? 'Update' : 'Add'}
        </button>
        <button onClick={onClose} className="ml-2 rounded-md p-2 text-gray-500 hover:bg-gray-100">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
