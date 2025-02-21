import type { ButtonBlockAttributes, ColumnBlock, ColumnBlockAttributes, EmailBlock, HeadingBlockAttributes, ImageBlockAttributes, RowBlock, TextBlockAttributes } from '@/app/components/email-workspace/types'

type BlockStyleModifier = {
  text?: Partial<TextBlockAttributes>
  heading?: Partial<HeadingBlockAttributes>
  image?: Partial<ImageBlockAttributes>
  button?: Partial<ButtonBlockAttributes>
  column?: Partial<ColumnBlockAttributes>
}

export const rowTypeBlockDefaults: Record<string, BlockStyleModifier> = {
  gallery: {
    image: {
      borderRadius: '8px',
    },
    heading: {
      fontSize: '24px',
      paddingBottom: '16px',
    },
    text: {
      fontSize: '14px',
    },
  },
  header: {
    image: {
      borderRadius: '0',
    },
    heading: {
      fontSize: '32px',
    },
  },
  // Add other row types as needed
}

export function getRowTypeBlockDefaults(block: EmailBlock | ColumnBlock, parentRow?: RowBlock) {
  if (!parentRow?.attributes.type) return {}

  const baseDefaults = rowTypeBlockDefaults[parentRow.attributes.type]?.[block.type as keyof BlockStyleModifier] || {}

  // Handle special cases based on row structure
  if (parentRow.attributes.type === 'gallery') {
    // For gallery rows with 2 columns where one has an image and one doesn't
    if (parentRow.columns.length === 2) {
      const photoColumns = parentRow.columns.filter((col) => col.blocks.some((block) => block.type === 'image'))
      if (photoColumns.length === 1) {
        // For the text column
        if (block.type === 'column') {
          return {
            ...baseDefaults,
            verticalAlign: 'middle',
          }
        }
      }
    }
  }

  // Handle header row with 2 columns
  if (parentRow.attributes.type === 'header' && parentRow.columns.length === 2) {
    if (block.type === 'column') {
      const columnIndex = parentRow.columns.findIndex((col) => col.id === block.id)
      return {
        ...baseDefaults,
        verticalAlign: 'middle',
        textAlign: columnIndex === 1 ? 'right' : 'left',
      }
    }
  }

  return baseDefaults
}
