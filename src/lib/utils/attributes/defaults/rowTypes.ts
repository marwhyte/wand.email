import type { RowBlock } from '@/app/components/email-workspace/types'
import { Email } from '@/app/components/email-workspace/types'
import { getEmailAttributes } from '../attributes'

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
      borderWidth: '1px',
      borderColor: '#dadce0',
      borderStyle: 'solid',
      borderRadius: '8px',
      paddingTop: '40px',
      paddingBottom: '40px',
      paddingLeft: '20px',
      paddingRight: '20px',
    },
  },
  floating: {
    header: {},
    footer: {
      backgroundColor: '#f4f4f4',
    },
    gallery: {},
    default: {
      paddingBottom: '20px',
      paddingLeft: '40px',
      paddingRight: '40px',
    },
  },
  default: {
    default: {},
  },

  // Add more variants as needed
}

// Add email type-specific row styles
export const emailTypeRowDefaults: Record<string, VariantRowStyles> = {
  ecommerce: {
    header: {},
    footer: {},
    gallery: {
      paddingTop: '12px',
      paddingBottom: '12px',
    },
    default: {
      paddingTop: '12px',
      paddingBottom: '12px',
    },
  },
  newsletter: {
    header: {},
    footer: {},
    default: {
      paddingBottom: '40px',
    },
  },
  marketing: {
    header: {},
    footer: {},
    default: {},
  },
  transactional: {
    header: {
      paddingTop: '20px',
      paddingBottom: '20px',
    },
    footer: {
      paddingTop: '32px',
      paddingBottom: '32px',
    },
    default: {},
  },
}

// Add combination-specific row styles
export const combinedTypeVariantDefaults: Record<string, Record<string, VariantRowStyles>> = {
  outline: {
    newsletter: {
      header: {},
      footer: {
        paddingTop: '8px',
      },
      default: {
        paddingLeft: '18px',
        paddingRight: '18px',
        paddingTop: '18px',
        paddingBottom: '8px',
      },
    },
    // Add other email types for outline variant if needed
    marketing: {},
    transactional: {},
  },
  // Add other variants if needed
  floating: {
    newsletter: {},
  },
}

export function getTypeDefaults(row: RowBlock, email: Email | null): Partial<RowBlock['attributes']> {
  const emailAttributes = getEmailAttributes(email)
  const rowAttributes = row.attributes

  // Get base styles for the row type
  const baseStyles = (() => {
    switch (rowAttributes.type) {
      case 'header': {
        return {
          paddingTop: '24px',
          paddingBottom: '12px',
        }
      }
      case 'footer': {
        return {
          paddingTop: '20px',
          paddingBottom: '48px',
          backgroundColor: '#f4f4f4',
        }
      }
      case 'gallery': {
        const defaults: Partial<RowBlock['attributes']> = {}

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

  // Get variant-specific styles
  const variantStyles = emailAttributes?.styleVariant
    ? variantRowDefaults[emailAttributes.styleVariant]?.[rowAttributes.type || 'default'] || {}
    : {}

  // Get email type-specific styles
  const emailTypeStyles = emailAttributes?.type
    ? emailTypeRowDefaults[emailAttributes.type]?.[rowAttributes.type || 'default'] || {}
    : {}

  // Get combined variant and email type specific styles
  const combinedStyles =
    emailAttributes?.styleVariant && emailAttributes?.type
      ? combinedTypeVariantDefaults[emailAttributes.styleVariant]?.[emailAttributes.type]?.[
          rowAttributes.type || 'default'
        ] || {}
      : {}

  // Merge styles with priority: base < email type < variant < combined
  return {
    ...baseStyles,
    ...emailTypeStyles,
    ...variantStyles,
    ...combinedStyles,
  }
}
