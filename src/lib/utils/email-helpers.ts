import { ColumnBlock, Email, EmailBlock, EmailBlockType, RowBlock } from '@/app/components/email-workspace/types'
import { v4 as uuidv4 } from 'uuid'

// Creates a block with a given type, content, and attributes. Accepts column.
export const createBlock = (type: EmailBlockType, content: string, attrs = {}, column: ColumnBlock): EmailBlock => {
  const block = {
    id: uuidv4(),
    type,
    content,
    attributes: attrs,
  } as EmailBlock

  if (type === 'socials') {
    console.log(block, 'block')
  }

  column.blocks.push(block)
  return block
}

// Creates a column with a given number of grid columns and attributes. Accepts block array.
export const createColumn = (blocks: any[], width = '100%', attrs = {}) => ({
  id: uuidv4(),
  type: 'column' as const,
  width,
  attributes: attrs,
  blocks,
})

type RowWithColumnConfig = {
  rowAttrs?: Record<string, any>
  columnAttrs?: Record<string, any>
  width?: string
}

export const createRow = (attrs = {}): RowBlock => ({
  id: uuidv4(),
  type: 'row' as const,
  attributes: attrs,
  columns: [],
})

export const createEmail = (
  email: Email,
  color?: string,
  linkColor?: string,
  fontFamily?: string,
  backgroundColor?: string,
  rowBackgroundColor?: string,
  width?: string
): Email => ({
  color,
  linkColor,
  fontFamily,
  backgroundColor,
  rowBackgroundColor,
  width,
  preview: '',
  ...email,
  id: uuidv4(),
})
