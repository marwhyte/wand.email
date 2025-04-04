'use client'

import { getBlockAttributes, getEmailAttributes } from '@/lib/utils/attributes/attributes'
import { Field, FieldGroup, Label } from '../fieldset'
import { Select } from '../select'
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

  // Initialize items array if it doesn't exist
  const items = listAttributes.items || []

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
        </Select>
      </Field>
    </FieldGroup>
  )
}

export default ListEditor
