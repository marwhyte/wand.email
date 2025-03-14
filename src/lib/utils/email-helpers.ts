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
  rows: RowBlock[],
  color: string,
  linkColor: string,
  fontFamily = 'Arial',
  bgColor = '#ffffff',
  rowBgColor = '#ffffff',
  width = '600'
): Email => ({
  id: uuidv4(),
  rows,
  color,
  linkColor,
  fontFamily,
  bgColor,
  rowBgColor,
  width,
  preview: '',
})
