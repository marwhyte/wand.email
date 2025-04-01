import type { RowBlock } from '@/app/components/email-workspace/types'
import { Email, EmailTheme, themeColorMap } from '@/app/components/email-workspace/types'
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
  default: {
    default: {
      paddingLeft: '24px',
      paddingRight: '24px',
    },
  },
  clear: {
    default: {},
  },
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
  clear: {
    newsletter: {},
  },
}

export function getTypeDefaults(row: RowBlock, email: Email | null): Partial<RowBlock['attributes']> {
  const emailAttributes = getEmailAttributes(email)
  const rowAttributes = row.attributes
  const theme = (emailAttributes?.theme as EmailTheme) || 'default'
  const themeColors = themeColorMap[theme]

  // Get base styles for the row type
  const baseStyles: Partial<RowBlock['attributes']> = (() => {
    // Check if row only contains a spacer
    const hasSingleSpacer =
      row.columns.length === 1 && row.columns[0].blocks.length === 1 && row.columns[0].blocks[0].type === 'spacer'

    // If row only has a spacer, remove top and bottom padding
    if (hasSingleSpacer) {
      return {
        paddingTop: '0px',
        paddingBottom: '0px',
      }
    }

    switch (rowAttributes.type) {
      case 'header': {
        return {
          paddingTop: '24px',
          paddingBottom: '12px',
          backgroundColor: themeColors.base,
        }
      }
      case 'cart': {
        return {
          verticalAlign: 'middle',
          paddingTop: '2px',
          paddingBottom: '2px',
          backgroundColor: themeColors.light,
          ...(row.columns.length === 1 &&
            row.columns[0].blocks.length === 1 &&
            row.columns[0].blocks[0].type === 'divider' && {
              paddingTop: '0px',
              paddingBottom: '0px',
            }),
        }
      }
      case 'discount': {
        return {
          backgroundColor: themeColors.light,
          paddingTop: '30px',
          paddingBottom: '30px',
          borderRadius: '8px',
        }
      }
      case 'footer': {
        return {
          paddingTop: '20px',
          paddingBottom: '48px',
          backgroundColor: themeColors.light,
        }
      }
      case 'gallery': {
        const defaults: Partial<RowBlock['attributes']> = {
          backgroundColor: themeColors.base,
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
        return { backgroundColor: themeColors.base } // Default styles with theme base color
    }
  })()

  // Get variant styles
  const variantStyles: Partial<RowBlock['attributes']> = (() => {
    if (!emailAttributes?.styleVariant) return {}

    const variant = emailAttributes.styleVariant
    const rowType = rowAttributes.type || 'default'

    // Special handling for default footer to use email background color
    if (variant === 'default' && rowType === 'footer' && emailAttributes.backgroundColor) {
      return {
        ...variantRowDefaults[variant]?.[rowType],
        backgroundColor: emailAttributes.backgroundColor || themeColors.light,
      }
    }

    // Special handling for discount row type when variant is 'default'
    if ((rowType === 'discount' || rowType === 'cart') && variant === 'default') {
      // Add borderWidth only for default variant
      return {
        ...(variantRowDefaults[variant]?.[rowType] || variantRowDefaults[variant]?.['default'] || {}),
        borderRadius: '0px',
        borderColor: themeColors.base,
        borderWidth: '20px',
        borderStyle: 'solid',
        borderSide: rowType === 'cart' ? 'leftRight' : 'all',
      }
    }

    if (rowType === 'discount') {
      return {
        ...(variantRowDefaults[variant]?.[rowType] || variantRowDefaults[variant]?.['default'] || {}),
        backgroundColor: themeColors.light,
      }
    }

    // If there's a specific style for this row type in the variant, use it
    // Otherwise fall back to the 'default' style for this variant
    const styles = variantRowDefaults[variant]?.[rowType] || variantRowDefaults[variant]?.['default'] || {}

    // Apply theme-specific overrides to variant styles for header and footer
    if (rowType === 'header' || rowType === 'footer') {
      return {
        ...styles,
        backgroundColor: rowType === 'header' ? themeColors.base : themeColors.light,
      }
    }

    return styles
  })()

  // Get email type-specific styles
  const emailTypeStyles = (() => {
    if (!emailAttributes?.type) return {}

    const emailType = emailAttributes.type
    const rowType = rowAttributes.type || 'default'

    // If there's a specific style for this row type in the email type, use it
    // Otherwise fall back to the 'default' style for this email type
    return emailTypeRowDefaults[emailType]?.[rowType] || emailTypeRowDefaults[emailType]?.['default'] || {}
  })()

  // Get combined variant and email type specific styles
  const combinedStyles = (() => {
    if (!emailAttributes?.styleVariant || !emailAttributes?.type) return {}

    const variant = emailAttributes.styleVariant
    const emailType = emailAttributes.type
    const rowType = rowAttributes.type || 'default'

    // Look for specific style for this combination
    // First try the specific row type, then fall back to 'default' if not found
    return (
      combinedTypeVariantDefaults[variant]?.[emailType]?.[rowType] ||
      combinedTypeVariantDefaults[variant]?.[emailType]?.['default'] ||
      {}
    )
  })()

  // Merge styles with priority: base < email type < variant < combined
  return {
    ...baseStyles,
    ...emailTypeStyles,
    ...variantStyles,
    ...combinedStyles,
  }
}
