import {
  ButtonBlockAttributes,
  EmailBlock,
  HeadingBlockAttributes,
  LinkBlockAttributes,
  TextBlockAttributes,
} from '@/app/components/email-workspace/types'
import { useEmailSave } from '@/app/hooks/useEmailSave'
import { useEmailStore } from '@/lib/stores/emailStore'
import { useToolbarStore } from '@/lib/stores/toolbarStore'
import { getEmailAttributes } from '@/lib/utils/attributes'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { Editor, EditorContent, Extension, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import debounce from 'lodash.debounce'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { create } from 'zustand'

type ToolbarState = {
  bold: boolean
  italic: boolean
  underline: boolean
  link: boolean
}

// New toolbar state store
export const useToolbarStateStore = create<{
  state: ToolbarState
  setState: (state: ToolbarState) => void
}>((set) => ({
  state: {
    bold: false,
    italic: false,
    underline: false,
    link: false,
  },
  setState: (state) => set({ state }),
}))

// Create a custom extension to prevent empty lines
const PreventEmptyLines = Extension.create({
  name: 'preventEmptyLines',
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }: { editor: Editor }) => {
        const { state } = editor
        const { selection } = state
        const { empty, $head } = selection

        // Only prevent Enter if we're in an empty paragraph
        if (empty && $head.parent.type.name === 'paragraph' && $head.parent.textContent.trim() === '') {
          return true // Prevent the default Enter behavior for empty paragraphs
        }

        return false // Allow Enter for non-empty paragraphs
      },
    }
  },
})

type Props = {
  content: string
  isSelected: boolean
  onSelect: () => void
  className?: string
  style?: React.CSSProperties
}

export default function EditableContent({ content, isSelected, onSelect, className, style }: Props) {
  const { email, editorCommand, clearCommand, currentBlock, setCurrentBlock, executeCommand } = useEmailStore()
  const { show, hide } = useToolbarStore()
  const saveEmail = useEmailSave()
  const { setState: setToolbarState } = useToolbarStateStore()
  const emailAttributes = getEmailAttributes(email)
  const editorRef = useRef<Editor | null>(null)

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

          console.log('updatedEmail', updatedEmail)

          saveEmail(updatedEmail)
        }
      }
    },
    [currentBlock, executeCommand]
  )

  // Determine if we're editing a button or link
  const isButton = currentBlock?.type === 'button'
  const isLink = currentBlock?.type === 'link'

  // Get alignment from current block's attributes, ensuring type safety
  const textAlign =
    currentBlock?.type === 'button'
      ? (currentBlock.attributes as ButtonBlockAttributes).align || 'left'
      : currentBlock?.type === 'link'
        ? (currentBlock.attributes as LinkBlockAttributes).align || 'left'
        : currentBlock?.type === 'text'
          ? (currentBlock.attributes as TextBlockAttributes).textAlign || 'left'
          : currentBlock?.type === 'heading'
            ? (currentBlock.attributes as HeadingBlockAttributes).textAlign || 'left'
            : 'left'

  // Create a debounced onChange function with useMemo
  const debouncedOnChange = useMemo(() => {
    return debounce((html: string) => {
      console.log('debounced', html)
      // Strip outer paragraph tags if present
      const strippedHtml = html.replace(/^<p>(.*)<\/p>$/, '$1')
      onChange({ content: strippedHtml })
    }, 300)
  }, [onChange])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedOnChange.cancel()
    }
  }, [debouncedOnChange])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Underline,
      TextStyle,
      Color,
      PreventEmptyLines,
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        HTMLAttributes: {
          class: isButton
            ? 'block text-center no-underline'
            : isLink
              ? 'text-blue-600 underline hover:text-blue-800'
              : 'text-blue-600 underline hover:text-blue-800',
          rel: 'noopener noreferrer',
          style: isButton
            ? `color: ${currentBlock?.attributes?.color || '#ffffff'}; display: inline-block; text-align: center; text-decoration: none;`
            : `color: ${emailAttributes.linkColor ?? '#2563eb'};`,
        },
        validate: (url) => {
          try {
            new URL(url.startsWith('http') ? url : `https://${url}`)
            return true
          } catch {
            return false
          }
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: `focus:outline-none ${isButton || isLink ? 'inline-block' : ''}`,
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter') {
          const { state } = view
          const { selection } = state
          const { $head } = selection

          // Get the current node content
          const isEmptyNode = $head.parent.textContent.trim() === ''

          // Still prevent Enter for buttons, links, and headings as before
          if (isButton || isLink || currentBlock?.type === 'heading') {
            event.preventDefault()
            return true
          }

          // Prevent Enter on empty paragraphs (to avoid consecutive empty lines)
          if (isEmptyNode) {
            event.preventDefault()
            return true
          }
        }
        return false
      },
    },
    content,
    onUpdate: ({ editor }) => {
      debouncedOnChange(editor.getHTML())
    },
    onSelectionUpdate: ({ editor }) => {
      // Update toolbar state when selection changes
      if (isSelected) {
        setToolbarState({
          bold: editor.isActive('bold'),
          italic: editor.isActive('italic'),
          underline: editor.isActive('underline'),
          link: editor.isActive('link'),
        })
      }
    },
  })

  // Update editor reference
  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  // Listen for commands from the store
  useEffect(() => {
    if (!editor || !isSelected || !editorCommand) return

    // Execute command on this editor only if this component is selected
    if (isSelected) {
      const chain = editor.chain().focus()

      switch (editorCommand.type) {
        case 'bold':
          chain.toggleBold().run()
          // Immediately update toolbar state to reflect the change
          setToolbarState({
            ...editor.getAttributes('textStyle'),
            bold: editor.isActive('bold'),
            italic: editor.isActive('italic'),
            underline: editor.isActive('underline'),
            link: editor.isActive('link'),
          })
          break
        case 'italic':
          chain.toggleItalic().run()
          setToolbarState({
            ...editor.getAttributes('textStyle'),
            bold: editor.isActive('bold'),
            italic: editor.isActive('italic'),
            underline: editor.isActive('underline'),
            link: editor.isActive('link'),
          })
          break
        case 'underline':
          chain.toggleUnderline().run()
          setToolbarState({
            ...editor.getAttributes('textStyle'),
            bold: editor.isActive('bold'),
            italic: editor.isActive('italic'),
            underline: editor.isActive('underline'),
            link: editor.isActive('link'),
          })
          break
        case 'link':
          if (editorCommand.payload?.href) {
            chain.setLink({ href: editorCommand.payload.href }).run()
            setToolbarState({
              ...editor.getAttributes('textStyle'),
              bold: editor.isActive('bold'),
              italic: editor.isActive('italic'),
              underline: editor.isActive('underline'),
              link: editor.isActive('link'),
            })
          }
          break
        case 'focus':
          chain.focus().run()
          break
      }

      // Clear the command after execution
      clearCommand()
    }
  }, [editor, editorCommand, isSelected, clearCommand, setToolbarState])

  // Update toolbar state when selection or focus changes
  useEffect(() => {
    if (editor && isSelected) {
      setToolbarState({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        link: editor.isActive('link'),
      })
    }
  }, [editor, isSelected, setToolbarState])

  useEffect(() => {
    if (isSelected) {
      // When selected, update the toolbar position based on the current element
      const element = editor?.view.dom.closest('[contenteditable]')
      if (!element) return

      const emailContainer = element.closest('[data-email-container]')
      if (!emailContainer) return

      const containerRect = emailContainer.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()

      const toolbarHeight = 40
      const spacing = 27

      // Account for container scroll position
      const containerScrollTop = emailContainer.scrollTop
      const containerScrollLeft = emailContainer.scrollLeft

      const top = elementRect.top - containerRect.top - toolbarHeight - spacing + containerScrollTop
      const left = elementRect.left - containerRect.left + elementRect.width / 2 + containerScrollLeft

      show(top, left)
    }
  }, [isSelected, editor, show])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Capture current scroll position
      const emailContainer = e.currentTarget.closest('[data-email-container]')
      const scrollPosition = emailContainer?.scrollTop

      onSelect()

      // Focus editor but prevent scrolling by restoring position afterwards
      editor?.commands.focus()

      // Restore scroll position after focus
      if (emailContainer && scrollPosition !== undefined) {
        setTimeout(() => {
          emailContainer.scrollTop = scrollPosition
        }, 0)
      }
    },
    [onSelect, editor]
  )

  if (!editor) {
    return null
  }

  return (
    <div
      onClick={handleClick}
      className={`${className} ${isButton || isLink ? '' : ''}`}
      style={{
        ...style,
        ...(isButton || isLink ? { textAlign: textAlign } : {}),
      }}
    >
      <EditorContent
        editor={editor}
        className={`cursor-text focus:outline-none ${isButton || isLink ? 'inline-block' : ''}`}
        style={isButton || isLink ? { textAlign: textAlign } : {}}
      />
    </div>
  )
}
