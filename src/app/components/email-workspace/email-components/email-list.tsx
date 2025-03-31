import { useEmailSave } from '@/app/hooks/useEmailSave'
import { useEmailStore } from '@/lib/stores/emailStore'
import { getBlockAttributes, getEmailAttributes } from '@/lib/utils/attributes/attributes'
import { getListProps } from '@/lib/utils/attributes/props'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Email, ListBlock, ListBlockAttributes, RowBlock } from '../types'
import EditableContent from './editable-content'

type Props = {
  block: ListBlock
  parentRow: RowBlock
  email: Email | null
}

const EmailList = ({ block, parentRow, email }: Props) => {
  const { setCurrentBlock } = useEmailStore()
  const listAttributes = getBlockAttributes(block, parentRow, email) as ListBlockAttributes
  const emailAttributes = getEmailAttributes(email)
  const saveEmail = useEmailSave()
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null)
  const editorRefs = useRef<Array<HTMLLIElement | null>>([])

  // Reset refs array when items change
  useEffect(() => {
    editorRefs.current = editorRefs.current.slice(0, listAttributes.items?.length || 1)
  }, [listAttributes.items?.length])

  const { style, ...restListProps } = getListProps(block, parentRow, email)
  const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyles } = style || {}

  const handleItemSelect = useCallback((index: number) => {
    setSelectedItemIndex(index)
  }, [])

  // Set ref for list item at given index
  const setRef = useCallback((el: HTMLLIElement | null, index: number) => {
    editorRefs.current[index] = el
  }, [])

  const handleItemChange = useCallback(
    (index: number, newContent: string) => {
      if (!email) return

      // Create a deep copy of the list items to avoid mutating state directly
      const updatedItems = [...(listAttributes.items || [''])]
      updatedItems[index] = newContent

      // Ensure there is always at least one item
      if (updatedItems.length === 0 || (updatedItems.length === 1 && updatedItems[0] === '')) {
        updatedItems[0] = '&nbsp;' // Placeholder to ensure at least one item
      }

      // Create an updated block with the new list items
      const updatedBlock = {
        ...block,
        attributes: {
          ...block.attributes,
          items: updatedItems,
        },
      }

      // Update the current block
      setCurrentBlock(updatedBlock)

      // Update the email with the new block
      const updatedEmail = {
        ...email,
        rows: email.rows.map((row) => ({
          ...row,
          columns: row.columns.map((column) => ({
            ...column,
            blocks: column.blocks.map((b) => (b.id === block.id ? updatedBlock : b)),
          })),
        })),
      }

      // Save the updated email
      saveEmail(updatedEmail)
    },
    [email, block, listAttributes.items, setCurrentBlock, saveEmail]
  )

  const handleAddListItem = useCallback(
    (index: number) => {
      if (!email) return

      // Create a deep copy of the list items to avoid mutating state directly
      const updatedItems = [...(listAttributes.items || [''])]
      updatedItems.splice(index + 1, 0, '') // Insert empty item after current one

      // Create an updated block with the new list items
      const updatedBlock = {
        ...block,
        attributes: {
          ...block.attributes,
          items: updatedItems,
        },
      }

      // Update the current block
      setCurrentBlock(updatedBlock)

      // Update the email with the new block
      const updatedEmail = {
        ...email,
        rows: email.rows.map((row) => ({
          ...row,
          columns: row.columns.map((column) => ({
            ...column,
            blocks: column.blocks.map((b) => (b.id === block.id ? updatedBlock : b)),
          })),
        })),
      }

      // Save the updated email
      saveEmail(updatedEmail)

      // Select the newly added item
      const newIndex = index + 1
      setSelectedItemIndex(newIndex)

      // Focus the new item after a short delay to allow DOM update
      setTimeout(() => {
        const newItemEditor = editorRefs.current[newIndex]
        if (newItemEditor) {
          const editableContent = newItemEditor.querySelector('[contenteditable="true"]')
          if (editableContent) {
            ;(editableContent as HTMLElement).focus()
          }
        }
      }, 50)
    },
    [email, block, listAttributes.items, setCurrentBlock, saveEmail]
  )

  const handleRemoveListItem = useCallback(
    (index: number) => {
      if (!email || (listAttributes.items?.length || 0) <= 1) return

      // Get the prev index before removing the item
      const prevIndex = Math.max(0, index - 1)

      // Create a deep copy of the list items to avoid mutating state directly
      const updatedItems = [...(listAttributes.items || [''])]
      updatedItems.splice(index, 1) // Remove item at index

      // Create an updated block with the new list items
      const updatedBlock = {
        ...block,
        attributes: {
          ...block.attributes,
          items: updatedItems,
        },
      }

      // Update the current block
      setCurrentBlock(updatedBlock)

      // Update the email with the new block
      const updatedEmail = {
        ...email,
        rows: email.rows.map((row) => ({
          ...row,
          columns: row.columns.map((column) => ({
            ...column,
            blocks: column.blocks.map((b) => (b.id === block.id ? updatedBlock : b)),
          })),
        })),
      }

      // Save the updated email
      saveEmail(updatedEmail)

      // Select the previous item
      setSelectedItemIndex(prevIndex)

      // Focus the previous item after a short delay to allow DOM update
      setTimeout(() => {
        const prevItemEditor = editorRefs.current[prevIndex]
        if (prevItemEditor) {
          const editableContent = prevItemEditor.querySelector('[contenteditable="true"]')
          if (editableContent) {
            ;(editableContent as HTMLElement).focus()

            // Move cursor to end of text
            const selection = window.getSelection()
            const range = document.createRange()
            if (selection && editableContent.firstChild) {
              range.selectNodeContents(editableContent)
              range.collapse(false) // Collapse to end
              selection.removeAllRanges()
              selection.addRange(range)
            }
          }
        }
      }, 50)
    },
    [email, block, listAttributes.items, setCurrentBlock, saveEmail]
  )

  // Ensure we always have at least one item
  const items = listAttributes.items && listAttributes.items.length > 0 ? listAttributes.items : ['']

  return (
    <div {...restListProps}>
      {listAttributes.type === 'ul' ? (
        <ul
          style={{
            marginTop: 0,
            marginBottom: 0,
            listStyleType: 'disc',
            ...restStyles,
          }}
        >
          {items.map((item, index) => (
            <li
              key={index}
              style={{
                marginTop: '5px',
                marginBottom: '5px',
                marginLeft: '0px',
                marginRight: '0px',
                position: 'relative',
              }}
              className={selectedItemIndex === index ? 'relative' : ''}
              ref={(el) => setRef(el, index)}
            >
              <EditableContent
                content={item}
                isSelected={selectedItemIndex === index}
                onSelect={() => handleItemSelect(index)}
                className="w-full"
                style={{}}
                onChange={(newContent) => handleItemChange(index, newContent)}
                onEnterKey={() => handleAddListItem(index)}
                onBackspaceKey={() => items.length > 1 && !item.trim() && handleRemoveListItem(index)}
                forceListItem={true}
                listType="bullet"
              />
            </li>
          ))}
        </ul>
      ) : (
        <ol
          style={{
            marginTop: 0,
            marginBottom: 0,
            listStyleType: 'decimal',
            ...restStyles,
          }}
          start={1}
        >
          {items.map((item, index) => (
            <li
              key={index}
              style={{
                marginTop: '5px',
                marginBottom: '5px',
                marginLeft: '0px',
                marginRight: '0px',
                position: 'relative',
              }}
              className={selectedItemIndex === index ? 'relative' : ''}
              ref={(el) => setRef(el, index)}
            >
              <EditableContent
                content={item}
                isSelected={selectedItemIndex === index}
                onSelect={() => handleItemSelect(index)}
                className="w-full"
                style={{}}
                onChange={(newContent) => handleItemChange(index, newContent)}
                onEnterKey={() => handleAddListItem(index)}
                onBackspaceKey={() => items.length > 1 && !item.trim() && handleRemoveListItem(index)}
                forceListItem={true}
                listType="ordered"
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default EmailList
