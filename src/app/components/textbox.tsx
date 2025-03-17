'use client'

import { useEmailStore } from '@/lib/stores/emailStore'
import { BoldIcon, ItalicIcon, LinkIcon, LinkSlashIcon, UnderlineIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef, useState } from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
  hideToolbar?: boolean
  preventNewlines?: boolean
  autofocus?: boolean
}

export default function Textbox({
  value,
  onChange,
  hideToolbar = false,
  preventNewlines = false,
  autofocus = false,
}: Props) {
  const [linkUrl, setLinkUrl] = useState('')
  const { email } = useEmailStore()
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [isEditingLink, setIsEditingLink] = useState(false)
  const linkInputRef = useRef<HTMLDivElement>(null)

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (linkInputRef.current && !linkInputRef.current.contains(event.target as Node)) {
        setShowLinkInput(false)
      }
    }

    // Add event listener when the link input is shown
    if (showLinkInput) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLinkInput])

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
      handleKeyDown: preventNewlines
        ? (view, event) => {
            // Prevent Enter key from creating new lines
            if (event.key === 'Enter') {
              return true // Return true to indicate the event was handled
            }
            return false // Let other key events pass through
          }
        : undefined,
    },
    immediatelyRender: false,
    autofocus: autofocus,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
          rel: 'noopener noreferrer',
          style: `color: ${email?.linkColor ?? '#2563eb'};`,
        },
        validate: (url) => {
          try {
            // Validate URL format
            new URL(url.startsWith('http') ? url : `https://${url}`)

            // Disallowed domains check
            const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
            const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname

            return !disallowedDomains.includes(domain)
          } catch {
            return false
          }
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      // Get HTML and remove outer <p> tags if they exist
      const html = editor.getHTML()
      const cleanedHtml = html.replace(/^<p>(.*)<\/p>$/, '$1')
      onChange(cleanedHtml)
    },
    onCreate: ({ editor }) => {
      if (autofocus) {
        editor.commands.focus('end') // Move cursor to the end
      }
    },
  })

  const setLink = () => {
    if (!editor) return

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      setShowLinkInput(false)
      setIsEditingLink(false)
      return
    }

    try {
      // Add https:// if not present
      const url = linkUrl.startsWith('http://') || linkUrl.startsWith('https://') ? linkUrl : `https://${linkUrl}`

      // Validate URL
      new URL(url)

      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
      setLinkUrl('')
      setShowLinkInput(false)
      setIsEditingLink(false)
    } catch (e) {
      alert('Please enter a valid URL')
    }
  }

  const editLink = () => {
    if (!editor) return

    // Get the current link attributes
    const attributes = editor.getAttributes('link')
    if (attributes.href) {
      // Set the input value to the current link URL (removing protocol if needed)
      const url = attributes.href.toString()
      setLinkUrl(url.replace(/^https?:\/\//, ''))
      setIsEditingLink(true)
      setShowLinkInput(true)
    }
  }

  const handleLinkButtonClick = () => {
    if (editor?.isActive('link')) {
      // If a link is selected, edit it
      editLink()
    } else {
      // Otherwise toggle the link input
      setIsEditingLink(false)
      setShowLinkInput(!showLinkInput)
    }
  }

  if (!editor) {
    return null
  }

  const buttonClass = (isActive: boolean) =>
    `mr-2 p-2 rounded-md transition-colors ${
      isActive ? 'bg-purple-100 text-purple-700 border-purple-300' : 'text-gray-700 hover:bg-gray-100'
    }`

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm">
      {!hideToolbar && (
        <div className="flex border-b border-gray-200 p-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={buttonClass(editor.isActive('bold'))}
            title="Bold"
          >
            <BoldIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={buttonClass(editor.isActive('italic'))}
            title="Italic"
          >
            <ItalicIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={buttonClass(editor.isActive('underline'))}
            title="Underline"
          >
            <UnderlineIcon className="h-5 w-5" />
          </button>
          <div className="mr-2 flex items-center">
            <input
              type="color"
              onInput={(e) =>
                editor
                  .chain()
                  .focus()
                  .setColor((e.target as HTMLInputElement).value)
                  .run()
              }
              title="Text Color"
              className="h-8 w-8 cursor-pointer rounded-md bg-white p-1"
            />
          </div>
          <button
            onClick={handleLinkButtonClick}
            className={buttonClass(editor.isActive('link'))}
            title={editor.isActive('link') ? 'Edit Link' : 'Add Link'}
          >
            <LinkIcon className="h-5 w-5" />
          </button>
          {editor.isActive('link') && (
            <button
              onClick={() => editor.chain().focus().unsetLink().run()}
              title="Remove Link"
              className="rounded-md p-2 text-red-600 hover:bg-red-50"
            >
              <LinkSlashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      <div className="relative">
        {showLinkInput && (
          <div
            ref={linkInputRef}
            className="absolute left-2 right-2 top-2 z-10 rounded-md border border-gray-200 bg-white p-3 shadow-lg"
          >
            <div className="mb-2 text-sm font-medium text-gray-700">{isEditingLink ? 'Edit Link' : 'Add Link'}</div>
            <div className="flex">
              <input
                type="text"
                placeholder="Enter URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setLink()}
                className="mr-2 flex-1 rounded-md border border-gray-300 p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={setLink}
                className="rounded-md bg-purple-600 px-3 py-2 text-white transition-colors hover:bg-purple-700"
              >
                Add
              </button>
              <button
                onClick={() => setShowLinkInput(false)}
                className="ml-2 rounded-md p-2 text-gray-500 hover:bg-gray-100"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <EditorContent
          autoFocus
          editor={editor}
          className="max-w-none p-2 focus-visible:outline-none [&_a:hover]:text-blue-800 [&_a]:text-blue-600"
        />
      </div>
    </div>
  )
}
