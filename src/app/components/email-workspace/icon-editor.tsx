'use client'

import { getBlockAttributes } from '@/lib/utils/attributes/attributes'
import { useMemo } from 'react'
import { iconList } from '../../../../icon_list'
import { Field, FieldGroup, Label } from '../fieldset'
import { NumberInput } from '../input'
import ComboBox from '../list-box'
import { Select } from '../select'
import { Email, IconBlock, IconBlockAttributes, RowBlock } from './types'

interface IconEditorProps {
  block: IconBlock
  parentRow: RowBlock
  onChange: (block: Partial<IconBlockAttributes>) => void
  email: Email | null
}

interface IconOption {
  value: string
  label: string
}

const IconEditor = ({ block, parentRow, onChange, email }: IconEditorProps) => {
  const iconAttributes = getBlockAttributes(block, parentRow, email)

  // Process icon list
  const processedIconList = useMemo<IconOption[]>(() => {
    return iconList.map((icon: string) => ({
      value: icon.replace('.png', ''),
      label: icon.replace('.png', ''),
    }))
  }, [])

  // Create options for ComboBox - take only first 100 icons
  const iconOptions = useMemo(() => {
    const selectedIcon = processedIconList.find((icon: IconOption) => icon.value === (iconAttributes.icon || 'check'))

    const initialOptions = selectedIcon ? [{ id: selectedIcon.value, label: selectedIcon.label }] : []

    processedIconList.slice(0, 100).forEach((icon: IconOption) => {
      if (icon.value !== (iconAttributes.icon || 'check')) {
        initialOptions.push({
          id: icon.value,
          label: icon.label,
        })
      }
    })

    return initialOptions
  }, [processedIconList, iconAttributes.icon])

  // Find the currently selected option
  const selectedOption = useMemo(() => {
    return iconOptions.find((option) => option.id === (iconAttributes.icon || 'check')) || null
  }, [iconOptions, iconAttributes.icon])

  // Filter function for icon search
  const filterIcons = (query: string) => {
    if (!query) return iconOptions

    return processedIconList
      .filter((icon: IconOption) => icon.label.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 100)
      .map((icon: IconOption) => ({
        id: icon.value,
        label: icon.label,
      }))
  }

  return (
    <FieldGroup>
      <Field labelPosition="top">
        <Label>Icon</Label>
        <ComboBox
          options={iconOptions}
          selected={selectedOption}
          setSelected={(option) => onChange({ icon: option.id })}
          filterFunction={filterIcons}
        />
      </Field>

      <Field>
        <Label>Icon Size</Label>
        <NumberInput
          value={parseInt(iconAttributes.size || '64', 10)}
          onChange={(value) => onChange({ size: String(value) })}
          min={16}
          max={256}
        />
      </Field>

      <Field>
        <Label>Position</Label>
        <Select
          value={iconAttributes.position || 'left'}
          onChange={(e) => onChange({ position: e.target.value as 'top' | 'left' })}
        >
          <option value="left">Left</option>
          <option value="top">Top</option>
        </Select>
      </Field>
    </FieldGroup>
  )
}

export default IconEditor
