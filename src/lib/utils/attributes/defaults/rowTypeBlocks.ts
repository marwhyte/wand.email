import type {
  ButtonBlockAttributes,
  ColumnBlock,
  ColumnBlockAttributes,
  EmailBlock,
  HeadingBlockAttributes,
  ImageBlockAttributes,
  RowBlock,
  TextBlockAttributes,
} from '@/app/components/email-workspace/types'

type BlockStyleModifier = {
  text?: Partial<TextBlockAttributes>
  heading?: Partial<HeadingBlockAttributes>
  image?: Partial<ImageBlockAttributes>
  button?: Partial<ButtonBlockAttributes>
  column?: Partial<ColumnBlockAttributes>
}

export const rowTypeBlockDefaults: Record<string, BlockStyleModifier> = {
  gallery: {
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
  footer: {
    image: {
      borderRadius: '0',
    },
    text: {
      color: '#414141',
      fontSize: '12px',
      paddingTop: '4px',
      paddingBottom: '4px',
    },
  },
  // Add other row types as needed
}

export function getRowTypeBlockDefaults(block: EmailBlock | ColumnBlock, parentRow?: RowBlock) {
  if (!parentRow?.attributes.type) return {}

  const baseDefaults = rowTypeBlockDefaults[parentRow.attributes.type]?.[block.type as keyof BlockStyleModifier] || {}

  // Special case handling for different block types
  switch (block.type) {
    case 'image':
      if (parentRow.attributes.type === 'header' || parentRow.attributes.type === 'footer') {
        const attributes = (block as EmailBlock).attributes as ImageBlockAttributes
        let width = attributes.width
        let additionalStyles = {}

        if (parentRow.attributes.type === 'footer' && parentRow.columns.length === 1) {
          additionalStyles = { marginLeft: 'auto', marginRight: 'auto' }
        }

        if (!width) {
          const img = new Image()
          img.src = attributes.src || ''

          if (img.naturalWidth && img.naturalHeight) {
            const aspectRatio = img.naturalWidth / img.naturalHeight
            width = aspectRatio >= 0.8 && aspectRatio <= 1.2 ? '50px' : '100px'
          } else {
            width = '100px'
          }

          return {
            ...baseDefaults,
            ...additionalStyles,
            width,
          }
        }

        return {
          ...baseDefaults,
          ...additionalStyles,
        }
      }
      break

    case 'column':
      // Footer column handling
      if (parentRow.attributes.type === 'footer' && parentRow.columns.length === 1) {
        return {
          ...baseDefaults,
          textAlign: 'center',
        }
      }
      // Gallery column handling
      if (parentRow.attributes.type === 'gallery' && parentRow.columns.length === 2) {
        const photoColumns = parentRow.columns.filter((col) => col.blocks.some((b) => b.type === 'image'))
        if (photoColumns.length === 1) {
          return {
            ...baseDefaults,
            verticalAlign: 'middle',
          }
        }
      }

      // Header column handling
      if (parentRow.attributes.type === 'header' && parentRow.columns.length === 2) {
        const columnIndex = parentRow.columns.findIndex((col) => col.id === block.id)
        return {
          ...baseDefaults,
          verticalAlign: 'middle',
          textAlign: columnIndex === 1 ? 'right' : 'left',
        }
      }
      break

    case 'heading':
      if (parentRow.attributes.type === 'footer' && parentRow.columns.length === 1) {
        return {
          ...baseDefaults,
          textAlign: 'center',
        }
      }
      break

    case 'text':
    case 'button':
      break
  }

  return baseDefaults
}
