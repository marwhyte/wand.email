'use client'

import { getBlockAttributes, getEmailAttributes } from '@/lib/utils/attributes/attributes'
import { useCallback, useMemo, useState } from 'react'
import { iconList } from '../../../../icon_list'
import { Field, FieldGroup, Label } from '../fieldset'
import ComboBox from '../list-box'
import { Select } from '../select'
import { Switch, SwitchField } from '../switch'
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
  const [isAdvancedIcons, setIsAdvancedIcons] = useState<boolean>(() => {
    const uniqueIcons = new Set(listAttributes.icons)
    return uniqueIcons.size > 1 // Set to true if not all icons are the same
  })

  // Initialize items array if it doesn't exist
  const items = listAttributes.items || []

  // Add this to optimize the icon list processing
  const processedIconList = useMemo(() => {
    return iconList.map((icon) => ({
      value: icon.replace('.png', ''),
      label: icon.replace('.png', ''),
    }))
  }, [iconList])

  const handleAdvancedIconsToggle = (newValue: boolean) => {
    if (!newValue) {
      onChange({ icons: Array(items.length).fill(listAttributes.icons?.[0] || 'check') })
    }
    setIsAdvancedIcons(newValue)
  }

  return (
    <FieldGroup>
      <Field>
        <Label>List Type</Label>
        <Select
          value={listAttributes.type}
          onChange={(e) => onChange({ type: e.target.value as ListBlockAttributes['type'] })}
        >
          <option value="ul">Bullet</option>
          <option value="ol">Number</option>
          <option value="icon">Icon</option>
        </Select>
      </Field>
      {listAttributes.type === 'icon' && (
        <Field labelPosition="top">
          <div className="mb-4 flex items-center justify-between">
            <Label>Icon</Label>
            <SwitchField>
              <Switch checked={isAdvancedIcons} onChange={handleAdvancedIconsToggle} />
              <Label>Advanced</Label>
            </SwitchField>
          </div>

          {isAdvancedIcons ? (
            // Advanced view - individual icons for each item
            <div className="mt-2 space-y-2">
              {(items || []).map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-6 text-xs text-gray-500">{index + 1}.</span>
                  <IconSelector
                    value={listAttributes.icons?.[index] || listAttributes.icons?.[0] || ''}
                    onChange={(value) => {
                      const newIcons = [...(listAttributes.icons || [])]
                      newIcons[index] = value
                      onChange({ icons: newIcons })
                    }}
                    icons={processedIconList}
                  />
                </div>
              ))}
            </div>
          ) : (
            // Simple view - one icon for all items
            <IconSelector
              value={listAttributes.icons?.[0] || ''}
              onChange={(value) => onChange({ icons: Array(items?.length || 0).fill(value) })}
              icons={processedIconList}
            />
          )}
        </Field>
      )}
    </FieldGroup>
  )
}

// Optimize the IconSelector component for large datasets
const IconSelector = ({
  value,
  onChange,
  icons,
}: {
  value: string
  onChange: (value: string) => void
  icons: { value: string; label: string }[]
}) => {
  // Convert the icons array to the format expected by ComboBox
  const comboBoxOptions = useMemo(() => {
    // Find the currently selected icon to ensure it's always included
    const selectedIcon = icons.find((icon) => icon.value === value)

    // First create a small initial set with the selected option (if it exists)
    const initialOptions = selectedIcon ? [{ id: selectedIcon.value, label: selectedIcon.label }] : []

    // Then add the first 100 icons (excluding the selected one to avoid duplicates)
    icons.slice(0, 100).forEach((icon) => {
      if (icon.value !== value) {
        initialOptions.push({
          id: icon.value,
          label: icon.label,
        })
      }
    })

    return initialOptions
  }, [icons, value])

  // Find the currently selected option
  const selectedOption = comboBoxOptions.find((option) => option.id === value) || null

  // Provide a custom filter function that will be passed to ComboBox
  const filterFunction = useCallback(
    (query: string) => {
      if (!query) return comboBoxOptions

      // When user searches, dynamically filter from the full dataset
      return icons
        .filter((icon) => icon.label.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 100) // Only show top 100 matches
        .map((icon) => ({
          id: icon.value,
          label: icon.label,
        }))
    },
    [icons, comboBoxOptions]
  )

  return (
    <ComboBox
      options={comboBoxOptions}
      selected={selectedOption}
      setSelected={(option) => onChange(option.id)}
      filterFunction={filterFunction}
    />
  )
}

export default ListEditor
