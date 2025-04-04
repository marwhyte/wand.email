import type { RowBlock, RowBlockType, ThemeColors } from '@/app/components/email-workspace/types'
import { Email, EmailTheme, themeColorMap } from '@/app/components/email-workspace/types'
import { getEmailAttributes } from '../attributes'

type RowStyleModifier = Partial<RowBlock['attributes']>
type VariantRowStyles = Record<string, RowStyleModifier>

// Base styles for each row type
export const baseRowStyles: Record<
  RowBlockType,
  (row: RowBlock, themeColors: ThemeColors) => Partial<RowBlock['attributes']>
> = {
  'key-features': (row, themeColors) => ({}),
  cards: (row, themeColors) => ({}),
  article: (row, themeColors) => ({}),
  list: (row, themeColors) => ({}),
  cta: (row, themeColors) => ({}),
  invoice: (row, themeColors) => ({}),
  hero: (row, themeColors) => ({
    backgroundColor: themeColors.gradientLight.start,
    backgroundImage: `linear-gradient(to bottom right, ${themeColors.gradientLight.start}, ${themeColors.gradientLight.end})`,
    paddingTop: '32px',
    paddingBottom: '32px',
    paddingLeft: '24px',
    paddingRight: '24px',
  }),
  header: (row, themeColors) => ({
    paddingTop: '24px',
    paddingBottom: '12px',
    backgroundColor: themeColors.base,
  }),

  cart: (row, themeColors) => {
    const hasSingleDivider =
      row.columns.length === 1 && row.columns[0].blocks.length === 1 && row.columns[0].blocks[0].type === 'divider'

    return {
      verticalAlign: 'middle',
      paddingTop: hasSingleDivider ? '0px' : '2px',
      paddingBottom: hasSingleDivider ? '0px' : '2px',
      backgroundColor: themeColors.light,
    }
  },

  discount: (row, themeColors) => ({
    backgroundColor: themeColors.light,
    paddingTop: '30px',
    paddingBottom: '30px',
    borderRadius: '8px',
  }),

  footer: (row, themeColors) => ({
    paddingTop: '20px',
    paddingBottom: '48px',
    backgroundColor: themeColors.light,
  }),

  gallery: (row, themeColors) => {
    const defaults: Partial<RowBlock['attributes']> = {
      backgroundColor: themeColors.base,
      columnSpacing: 16,
    }

    if (row.columns.length === 2) {
      defaults.stackOnMobile = true

      // Check if exactly one column has a photo
      const photoColumns = row.columns.filter((col) => col.blocks.some((block) => block.type === 'image'))
      if (photoColumns.length === 1 && row.columns.length >= 2) {
        defaults.columnSpacing = 24
      }
    }

    return defaults
  },

  default: (row, themeColors) => ({
    backgroundColor: themeColors.base,
  }),
}

// Variant-specific row styles
export const variantRowDefaults: Record<string, VariantRowStyles> = {
  outline: {
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
  default: {},
  clear: {
    default: {},
  },
}

// Special variant style overrides
export const variantStyleOverrides: Record<
  string,
  (row: RowBlock, email: Email | null, themeColors: any) => Partial<RowBlock['attributes']>
> = {
  default: (row, email, themeColors) => {
    const rowType = row.attributes.type || 'default'
    const emailAttributes = getEmailAttributes(email)

    // Special handling for default footer to use email background color
    if (rowType === 'footer' && emailAttributes?.backgroundColor) {
      return {
        backgroundColor: emailAttributes.backgroundColor || themeColors.light,
      }
    }

    // Special handling for discount and cart rows
    if (rowType === 'discount' || rowType === 'cart') {
      return {
        borderRadius: '0px',
        borderColor: themeColors.base,
        borderWidth: '20px',
        borderStyle: 'solid',
        borderSide: rowType === 'cart' ? 'leftRight' : 'all',
      }
    }

    return {}
  },

  outline: (row, email, themeColors) => {
    const rowType = row.attributes.type || 'default'

    // Remove border for header and footer in outline variant
    if (rowType === 'header' || rowType === 'footer') {
      return {
        borderWidth: '0px',
      }
    }

    return {}
  },
}

export function getTypeDefaults(row: RowBlock, email: Email | null): Partial<RowBlock['attributes']> {
  const emailAttributes = getEmailAttributes(email)
  const rowAttributes = row.attributes
  const theme = (emailAttributes?.theme as EmailTheme) || 'default'
  const themeColors = themeColorMap[theme]
  const variant = emailAttributes?.styleVariant || 'default'
  const rowType = rowAttributes.type || 'default'

  // Check if row only contains a spacer
  const hasSingleSpacer =
    row.columns.length === 1 && row.columns[0].blocks.length === 1 && row.columns[0].blocks[0].type === 'spacer'

  // Get base styles
  const baseStyles = baseRowStyles[rowType]?.(row, themeColors) || baseRowStyles.default(row, themeColors)

  // Get variant styles
  const variantStyles = variantRowDefaults[variant]?.[rowType] || variantRowDefaults[variant]?.['default'] || {}

  // Apply variant-specific overrides
  const variantOverrides = variantStyleOverrides[variant]?.(row, email, themeColors) || {}

  // Apply theme-specific overrides for header and footer
  const themeOverrides =
    rowType === 'header' || rowType === 'footer'
      ? { backgroundColor: rowType === 'header' ? themeColors.base : themeColors.light }
      : {}

  // Merge all styles with priority: base < variant < overrides < theme
  return {
    ...baseStyles,
    ...variantStyles,
    ...variantOverrides,
    ...themeOverrides,
  }
}
