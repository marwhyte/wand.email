import type { RowBlock } from '@/app/components/email-workspace/types'
import { Email } from '@/app/components/email-workspace/types'
import { getEmailAttributes } from '../generators'

type RowStyleModifier = Partial<RowBlock['attributes']>
type VariantRowStyles = Record<string, RowStyleModifier>

// Add variant-specific row styles
export const variantRowDefaults: Record<string, VariantRowStyles> = {
  outline: {
    header: {
      backgroundColor: '#ffffff',
    },
    footer: {
      backgroundColor: '#ffffff',
    },
    gallery: {},
    default: {
      paddingTop: '40px',
      paddingBottom: '40px',
      paddingLeft: '20px',
      paddingRight: '20px',
    },
  },

  // Add more variants as needed
}

export function getTypeDefaults(row: RowBlock, email: Email | null): Partial<RowBlock['attributes']> {
  const emailAttributes = getEmailAttributes(email)

  // Get base styles for the row type
  const baseStyles = (() => {
    switch (row.attributes.type) {
      case 'header': {
        return {
          paddingTop: '24px',
          paddingBottom: '12px',
        }
      }
      case 'footer': {
        return {
          paddingTop: '40px',
          paddingBottom: '48px',
          backgroundColor: '#f4f4f4',
        }
      }
      case 'gallery': {
        const defaults: Partial<RowBlock['attributes']> = {
          paddingTop: '12px',
          paddingBottom: '12px',
        }

        if (row.columns.length === 2) {
          defaults.stackOnMobile = true

          // Check if exactly one column has a photo
          const photoColumns = row.columns.filter((col) => col.blocks.some((block) => block.type === 'image'))
          if (photoColumns.length === 1 && row.columns.length >= 2) {
            defaults.columnSpacing = 24
          }
        }

        defaults.columnSpacing = defaults.columnSpacing ?? 16
        return defaults
      }
      case undefined:
      default:
        return {} // Empty base styles for default/undefined types
    }
  })()

  // Get variant-specific styles, treating undefined type as 'default'
  const variantStyles = emailAttributes?.styleVariant
    ? variantRowDefaults[emailAttributes.styleVariant]?.[row.attributes.type || 'default'] || {}
    : {}

  // Merge styles with variant styles taking priority
  return {
    ...baseStyles,
    ...variantStyles,
  }
}
