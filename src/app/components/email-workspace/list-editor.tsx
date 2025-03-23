import { getBlockAttributes, getEmailAttributes } from '@/lib/utils/attributes/attributes'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import parse from 'html-react-parser'
import { useEffect, useState } from 'react'
import { Button } from '../button'
import { Field, FieldGroup, Label } from '../fieldset'
import { Select } from '../select'
import Textbox from '../textbox'
import { Email, ListBlock, ListBlockAttributes, RowBlock } from './types'

interface ListEditorProps {
  block: ListBlock
  parentRow: RowBlock
  onChange: (block: Partial<ListBlockAttributes>) => void
  email: Email | null
}

const ListEditor = ({ block, parentRow, onChange, email }: ListEditorProps) => {
  const emailAttributes = getEmailAttributes(email)
  const listAttributes = getBlockAttributes(block, parentRow, email)
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null)

  // Initialize items array if it doesn't exist
  const items = listAttributes.items || []

  const handleAddItem = () => {
    const newItems = [...items, 'New item']
    onChange({ items: newItems })
    // Select the newly added item
    setSelectedItemIndex(newItems.length - 1)
  }

  const handleDeleteItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    onChange({ items: newItems })

    // Reset selected item if it was deleted
    if (selectedItemIndex === index) {
      setSelectedItemIndex(null)
    } else if (selectedItemIndex !== null && selectedItemIndex > index) {
      // Adjust selection if a previous item was deleted
      setSelectedItemIndex(selectedItemIndex - 1)
    }
  }

  const handleItemChange = (index: number, text: string) => {
    const newItems = [...items]
    newItems[index] = text
    onChange({ items: newItems })
  }

  const handleSelectItem = (index: number) => {
    setSelectedItemIndex(index === selectedItemIndex ? null : index)
  }

  const parseOptions = {
    replace: (domNode: any) => {
      if (domNode.name === 'a' && (!domNode.attribs.style || !domNode.attribs.style.includes('color'))) {
        domNode.attribs.style = `color: ${emailAttributes.linkColor ?? '#0066CC'};`
        return domNode
      }
    },
  }

  useEffect(() => {
    setSelectedItemIndex(null)
  }, [block.id])

  return (
    <FieldGroup>
      <Field labelPosition="top">
        <Label>List Items</Label>
        <div className="mt-2 space-y-2">
          {items.map((item, index) => (
            <div
              onClick={() => handleSelectItem(index)}
              key={index}
              className={`flex min-h-[40px] cursor-pointer items-center gap-2 rounded p-2 ${
                selectedItemIndex === index ? 'border border-purple-200 bg-purple-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex-grow overflow-hidden text-ellipsis">
                {typeof item === 'string' && item.includes('<') ? parse(item, parseOptions) : item}
              </div>
              <Button
                size="small"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation() // Prevent triggering handleSelectItem
                  handleDeleteItem(index)
                }}
              >
                <TrashIcon className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Button size="small" onClick={handleAddItem} className="flex items-center gap-1">
            <PlusIcon className="h-5 w-5" /> Add Item
          </Button>
        </div>
      </Field>

      {selectedItemIndex !== null && (
        <Field labelPosition="top">
          <Label>Edit Item</Label>
          <Textbox
            key={`item-${selectedItemIndex}`}
            value={items[selectedItemIndex] || ''}
            onChange={(value) => handleItemChange(selectedItemIndex, value)}
            preventNewlines={true}
            autofocus={true}
          />
        </Field>
      )}

      <Field>
        <Label>List Type</Label>
        <Select
          value={listAttributes.type}
          onChange={(e) => onChange({ type: e.target.value as ListBlockAttributes['type'] })}
        >
          <option value="ul">Bullet</option>
          <option value="ol">Number</option>
        </Select>
      </Field>
    </FieldGroup>
  )
}

export default ListEditor
