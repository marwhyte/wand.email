import { EmailBlock, TextBlockAttributes } from '@/app/components/email-workspace/types'
import { useEmailSave } from '@/app/hooks/useEmailSave'
import { useEmailStore } from '@/lib/stores/emailStore'
import { useToolbarStore } from '@/lib/stores/toolbarStore'
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
  onChange?: (newContent: string) => void
  onEnterKey?: () => void
  onBackspaceKey?: () => void
  forceListItem?: boolean
  listType?: 'bullet' | 'ordered'
}

export default function EditableContent({
  content,
  isSelected,
  onSelect,
  className,
  style,
  onChange,
  onEnterKey,
  onBackspaceKey,
  forceListItem = false,
  listType = 'bullet',
}: Props) {
  const { email, editorCommand, clearCommand, currentBlock, setCurrentBlock, executeCommand } = useEmailStore()
  const { show, hide } = useToolbarStore()
  const saveEmail = useEmailSave()
  const { setState: setToolbarState } = useToolbarStateStore()
  const editorRef = useRef<Editor | null>(null)

  const onChangeInternal = useCallback(
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

          saveEmail(updatedEmail)
        }
      }
    },
    [currentBlock, executeCommand]
  )

  // Determine if we're editing a button or link
  const isButton = currentBlock?.type === 'button'
  const isLink = currentBlock?.type === 'link'

  // Create a debounced onChange function with useMemo
  const debouncedOnChange = useMemo(() => {
    return debounce((html: string) => {
      // Strip outer paragraph tags if present
      const strippedHtml = html.replace(/^<p>(.*)<\/p>$/, '$1')
      if (!onChange) {
        onChangeInternal({ content: strippedHtml })
      }

      // Call the external onChange handler if provided
      if (onChange) {
        onChange(strippedHtml)
      }
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
        bulletList: forceListItem ? {} : false,
        orderedList: forceListItem ? {} : false,
        listItem: forceListItem ? {} : false,
      }),
      Underline,
      TextStyle,
      Color,
      ...(forceListItem ? [] : [PreventEmptyLines]),
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        HTMLAttributes: {},
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
        if (event.key === 'Enter' && !event.shiftKey && forceListItem && onEnterKey) {
          const { state } = view
          const { selection } = state
          const { $head } = selection

          if ($head.parentOffset === $head.parent.content.size) {
            event.preventDefault()
            onEnterKey()
            return true
          }
        }

        if (event.key === 'Backspace' && forceListItem && onBackspaceKey) {
          const { state } = view
          const { selection } = state
          const { $head } = selection

          if ($head.parentOffset === 0 && $head.parent.textContent.trim() === '') {
            event.preventDefault()
            onBackspaceKey()
            return true
          }
        }

        if (event.key === 'Enter' && !forceListItem) {
          const { state } = view
          const { selection } = state
          const { $head } = selection

          const isEmptyNode = $head.parent.textContent.trim() === ''

          if (isButton || isLink || currentBlock?.type === 'heading') {
            event.preventDefault()
            return true
          }

          if (isEmptyNode) {
            event.preventDefault()
            return true
          }
        }
        return false
      },
    },
    content: forceListItem ? content : content,
    onUpdate: ({ editor }) => {
      let html = editor.getHTML()

      if (forceListItem) {
        html = html
          .replace(/<li>(.*?)<\/li>/s, '$1')
          .replace(/<ul>(.*?)<\/ul>/s, '$1')
          .replace(/<ol>(.*?)<\/ol>/s, '$1')
          .replace(/<p>(.*?)<\/p>/s, '$1')
      }

      debouncedOnChange(html)
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
            const chain = editor.chain().focus()
            if (editorCommand.payload.text) {
              // If we have text, insert it as a link
              chain
                .insertContent({
                  type: 'text',
                  marks: [{ type: 'link', attrs: { href: editorCommand.payload.href } }],
                  text: editorCommand.payload.text,
                })
                .run()
            } else if (editor.isActive('link')) {
              chain.unsetLink().setLink({ href: editorCommand.payload.href }).run()
            } else {
              chain.setLink({ href: editorCommand.payload.href }).run()
            }
            setToolbarState({
              ...editor.getAttributes('textStyle'),
              bold: editor.isActive('bold'),
              italic: editor.isActive('italic'),
              underline: editor.isActive('underline'),
              link: editor.isActive('link'),
            })
          }
          break
        case 'insertText':
          if (editorCommand.payload?.text) {
            chain.insertContent(editorCommand.payload.text).run()
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
      const spacing = 60
      const toolbarWidth = 400 // Reduced from 600px to 400px to match actual width

      // Account for container scroll position
      const containerScrollTop = emailContainer.scrollTop
      const containerScrollLeft = emailContainer.scrollLeft

      // Calculate initial left position (centered on element)
      let left = elementRect.left - containerRect.left + elementRect.width / 2 + containerScrollLeft

      // Ensure toolbar doesn't go off the right edge
      const maxLeft = containerRect.width - toolbarWidth / 2 - 8 // Reduced padding to 8px
      left = Math.min(left, maxLeft)

      // Ensure toolbar doesn't go off the left edge
      const minLeft = toolbarWidth / 2 + 8 // Reduced padding to 8px
      left = Math.max(left, minLeft)

      const top = elementRect.top - containerRect.top - toolbarHeight - spacing + containerScrollTop

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

  // Initial setup for list content if needed
  useEffect(() => {
    if (editor && forceListItem) {
      if (listType === 'bullet') {
        editor.commands.toggleBulletList()
      } else if (listType === 'ordered') {
        editor.commands.toggleOrderedList()
      }

      // Focus the editor after initialization to ensure the cursor is positioned
      setTimeout(() => {
        editor.commands.focus()
      }, 10)
    }
  }, [editor, forceListItem, listType])

  if (!editor) {
    return null
  }

  return (
    <div
      onClick={handleClick}
      className={`${className}`}
      style={{
        ...style,
      }}
    >
      <EditorContent
        editor={editor}
        className={`cursor-text focus:outline-none ${isButton || isLink ? 'inline-block' : ''}`}
      />
    </div>
  )
}
