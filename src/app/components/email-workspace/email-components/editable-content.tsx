import { EmailBlock, TextBlockAttributes } from '@/app/components/email-workspace/types'
import { useEmailSave } from '@/app/hooks/useEmailSave'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { useToolbarStore } from '@/lib/stores/toolbarStore'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { Editor, EditorContent, Extension, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import debounce from 'lodash.debounce'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { create } from 'zustand'

type ToolbarState = {
  bold: boolean
  italic: boolean
  underline: boolean
  link: boolean
  linkUrl: string | null
}

// New toolbar state store
export const useToolbarStateStore = create<{
  state: ToolbarState
  setState: (state: Partial<ToolbarState>) => void
}>((set) => ({
  state: {
    bold: false,
    italic: false,
    underline: false,
    link: false,
    linkUrl: null,
  },
  setState: (state) => set(({ state: prevState }) => ({ state: { ...prevState, ...state } })),
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
  block: EmailBlock
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
  block,
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
  const { email, editorCommand, clearCommand, setCurrentBlock, executeCommand } = useEmailStore()
  const { show, hide } = useToolbarStore()
  const { exportType, company } = useChatStore()
  const saveEmail = useEmailSave()
  const { setState: setToolbarState } = useToolbarStateStore()
  const editorRef = useRef<Editor | null>(null)
  const [selectedLinkUrl, setSelectedLinkUrl] = useState<string | null>(null)

  // Add refs to track last known values
  const lastExportTypeRef = useRef<string | null>(null)
  const lastCompanyAddressRef = useRef<string | null>(null)

  // Process content based on export type
  const processedContent = useMemo(() => {
    if (!content) return content

    // Only replace the merge tag for HTML or React export types
    if ((exportType === 'html' || exportType === 'react') && company?.address) {
      return content.replace(/\*\|LIST:ADDRESSLINE\|\*/g, company.address)
    }

    return content
  }, [content, exportType, company?.address])

  const onChangeInternal = useCallback(
    (attributes: Partial<TextBlockAttributes>) => {
      const updatedBlock: EmailBlock = {
        ...block,
        attributes: { ...block.attributes, ...attributes },
      } as EmailBlock

      // Check if there's an actual change

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
    },
    [block, executeCommand]
  )

  // Determine if we're editing a button or link
  const isButton = block.type === 'button'
  const isLink = block.type === 'link'

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
    immediatelyRender: false,
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
      handleClick: (view, pos, event) => {
        // Check if a link was clicked
        checkForLinkClick(event)
        return false // Let the default behavior continue
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

          if (isButton || isLink || block.type === 'heading') {
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
    content: processedContent,
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
        const linkAttrs = editor.getAttributes('link')
        setToolbarState({
          bold: editor.isActive('bold'),
          italic: editor.isActive('italic'),
          underline: editor.isActive('underline'),
          link: editor.isActive('link'),
          linkUrl: linkAttrs.href || null,
        })

        // Update the selected link URL state
        setSelectedLinkUrl(linkAttrs.href || null)
      }
    },
  })

  // Function to check if a link is clicked
  const checkForLinkClick = useCallback(
    (event: MouseEvent) => {
      if (!editor || !isSelected) return

      // Get the DOM node
      const domNode = event.target as HTMLElement
      const linkNode = domNode.closest('a')

      if (linkNode) {
        // Get the link URL and update the toolbar state
        const href = linkNode.getAttribute('href')

        // Select the link node in the editor
        const { view } = editor
        const { state } = view
        const { doc, selection } = state

        // Update toolbar state with link information
        setToolbarState({
          link: true,
          linkUrl: href,
        })

        // Set the selected link URL for immediate access
        setSelectedLinkUrl(href)

        // Prevent the default behavior
        event.preventDefault()
      }
    },
    [editor, isSelected, setToolbarState]
  )

  // Update editor reference
  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  // Initialize editor with the correct content based on export type on first load
  useEffect(() => {
    if (editor && processedContent) {
      // Only set on first load or if export type changed
      if (lastExportTypeRef.current === null || lastExportTypeRef.current !== exportType) {
        editor.commands.setContent(processedContent)
        lastExportTypeRef.current = exportType
        lastCompanyAddressRef.current = company?.address || null
      }
    }
  }, [editor, processedContent, exportType, company?.address])

  // Update editor content when export type or company changes
  useEffect(() => {
    if (!editor || !content) return

    // Only update if export type or company address actually changed
    if (exportType === lastExportTypeRef.current && company?.address === lastCompanyAddressRef.current) {
      return
    }

    // Update refs with new values
    lastExportTypeRef.current = exportType
    lastCompanyAddressRef.current = company?.address || null

    // Skip update if editor is currently focused to avoid disrupting active editing
    if (editor.isFocused && document.activeElement === editor.view.dom) {
      return
    }

    // Process content based on current export type and company
    let updatedContent = content

    // Only replace the merge tag for HTML or React export types
    if ((exportType === 'html' || exportType === 'react') && company?.address) {
      updatedContent = content.replace(/\*\|LIST:ADDRESSLINE\|\*/g, company.address)
    } else {
      // For other export types, ensure the merge tag is present (in case it was previously replaced)
      if (!content.includes('*|LIST:ADDRESSLINE|*') && company?.address && content.includes(company.address)) {
        updatedContent = content.replace(new RegExp(company.address, 'g'), '*|LIST:ADDRESSLINE|*')
      }
    }

    // Only update if content actually changed
    if (updatedContent !== editor.getHTML()) {
      // Store current selection state
      const { from, to } = editor.state.selection

      // Update content
      editor.commands.setContent(updatedContent)

      // Try to restore selection if possible (approximate position)
      if (from !== to) {
        // If there was a selection, try to restore something similar
        setTimeout(() => {
          editor.commands.setTextSelection({ from, to })
        }, 0)
      }

      // NOTE: We don't call onChange here because we don't want to save the
      // visual representation of the merge tag (with the company address).
      // We always save the merge tag in the data model.
    }
  }, [editor, content, exportType, company?.address])

  // Listen for commands from the store
  useEffect(() => {
    if (!editor || !isSelected || !editorCommand) return

    // Execute command on this editor only if this component is selected
    if (isSelected) {
      // Store the current selection state
      const selection = window.getSelection()
      const savedRange = selection?.getRangeAt(0)?.cloneRange()

      const chain = editor.chain().focus()

      switch (editorCommand.type) {
        case 'bold':
          chain.toggleBold().run()
          // Immediately update toolbar state to reflect the change
          setToolbarState({
            bold: editor.isActive('bold'),
            italic: editor.isActive('italic'),
            underline: editor.isActive('underline'),
            link: editor.isActive('link'),
            linkUrl: editor.getAttributes('link').href || null,
          })
          break
        case 'italic':
          chain.toggleItalic().run()
          setToolbarState({
            bold: editor.isActive('bold'),
            italic: editor.isActive('italic'),
            underline: editor.isActive('underline'),
            link: editor.isActive('link'),
            linkUrl: editor.getAttributes('link').href || null,
          })
          break
        case 'underline':
          chain.toggleUnderline().run()
          setToolbarState({
            bold: editor.isActive('bold'),
            italic: editor.isActive('italic'),
            underline: editor.isActive('underline'),
            link: editor.isActive('link'),
            linkUrl: editor.getAttributes('link').href || null,
          })
          break
        case 'link':
          if (editorCommand.payload?.href) {
            // Save editor selection state if not inserting new text
            const hasTextSelection = !editor.state.selection.empty

            if (editor.isActive('link')) {
              chain.unsetLink().setLink({ href: editorCommand.payload.href }).run()
            } else if (editorCommand.payload.text) {
              // If we have text, insert it as a link
              chain
                .insertContent({
                  type: 'text',
                  marks: [{ type: 'link', attrs: { href: editorCommand.payload.href } }],
                  text: editorCommand.payload.text,
                })
                .run()
            } else if (hasTextSelection) {
              // Apply link to selected text
              chain.setLink({ href: editorCommand.payload.href }).run()
            } else {
              // No text selected, just set the link
              chain.setLink({ href: editorCommand.payload.href }).run()
            }

            setToolbarState({
              bold: editor.isActive('bold'),
              italic: editor.isActive('italic'),
              underline: editor.isActive('underline'),
              link: editor.isActive('link'),
              linkUrl: editorCommand.payload.href,
            })

            // Update the selected link URL
            setSelectedLinkUrl(editorCommand.payload.href)

            // Restore selection if needed
            setTimeout(() => {
              if (savedRange && (!editorCommand.payload.text || editor.isActive('link'))) {
                try {
                  const selection = window.getSelection()
                  if (selection) {
                    selection.removeAllRanges()
                    selection.addRange(savedRange)
                  }
                } catch (e) {
                  // Ignore errors from invalid ranges
                }
              }
            }, 10)
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
      const linkAttrs = editor.getAttributes('link')
      setToolbarState({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        link: editor.isActive('link'),
        linkUrl: linkAttrs.href || null,
      })

      // Update the selected link URL
      setSelectedLinkUrl(linkAttrs.href || null)
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
      const spacing = 10

      // Account for container scroll position
      const containerScrollTop = emailContainer.scrollTop

      // Get current selection to better position the toolbar
      const selection = window.getSelection()
      let targetRect = elementRect

      // If there's a text selection, get its rect for more precise positioning
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0)
        const selectionRect = range.getBoundingClientRect()
        // Only use selection rect if it's not empty
        if (selectionRect.width > 0 || selectionRect.height > 0) {
          targetRect = selectionRect
        }
      } else if (editor?.isActive('link')) {
        // For links, try to position over the link
        const linkElement = editor.view.dom.querySelector('a')
        if (linkElement) {
          const linkRect = linkElement.getBoundingClientRect()
          targetRect = linkRect
        }
      }

      // Calculate positions for the toolbar
      const top = targetRect.top - containerRect.top - toolbarHeight - spacing + containerScrollTop
      const left = targetRect.left - containerRect.left + targetRect.width / 2

      show(top, left)
    }
  }, [isSelected, editor, show])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Capture current scroll position
      const emailContainer = e.currentTarget.closest('[data-email-container]')
      const scrollPosition = emailContainer?.scrollTop

      // Check if a link was clicked
      const target = e.target as HTMLElement
      const linkNode = target.closest('a')

      if (linkNode) {
        // Prevent default navigation
        e.preventDefault()

        // Get the href attribute
        const href = linkNode.getAttribute('href')

        // Update the toolbar state with the link info
        setToolbarState({
          link: true,
          linkUrl: href,
        })

        // Set the selected link URL
        setSelectedLinkUrl(href)
      }

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
    [onSelect, editor, setToolbarState]
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
