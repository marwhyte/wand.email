import type { RowBlock, RowBlockType } from '@/app/components/email-workspace/types'
import { Email } from '@/app/components/email-workspace/types'
import { ThemeColors, getThemeColors } from '@/lib/utils/colors'
import { getEmailAttributes } from '../attributes'

type RowStyleModifier = Partial<RowBlock['attributes']>
type VariantRowStyles = Record<string, RowStyleModifier>

// Base styles for each row type
export const baseRowStyles: Record<
  RowBlockType,
  (row: RowBlock, themeColors: ThemeColors) => Partial<RowBlock['attributes']>
> = {
  'feature-list': (row, themeColors) => ({}),
  cards: (row, themeColors) => ({
    backgroundColor: '#f9fafb',
    columnSpacing: 16,
  }),
  article: (row, themeColors) => ({}),
  cta: (row, themeColors) => ({
    borderRadius: '0px',
    backgroundColor: themeColors.gradientDark.start,
    backgroundImage: `linear-gradient(to bottom right, ${themeColors.gradientDark.start}, ${themeColors.gradientDark.end})`,
  }),
  invoice: (row, themeColors) => ({}),
  hero: (row, themeColors) => ({
    backgroundColor: themeColors.gradientLight.start,
    backgroundImage: `linear-gradient(to bottom right, ${themeColors.gradientLight.start}, ${themeColors.gradientLight.end})`,
  }),
  header: (row, themeColors) => ({
    paddingTop: '24px',
    paddingBottom: '24px',
    backgroundColor: themeColors.base,
    borderRadius: '16px 16px 0 0',
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
    backgroundColor: '#f3f4f6',
    borderRadius: '0 0 16px 16px',
    verticalAlign: 'middle',
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
  (row: RowBlock, email: Email | null, themeColors: ThemeColors) => Partial<RowBlock['attributes']>
> = {
  default: (row, email, themeColors) => {
    const rowType = row.attributes.type || 'default'
    const emailAttributes = getEmailAttributes(email)

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

// Helper function to find the position of a row in the email
function findRowPosition(
  row: RowBlock,
  email: Email | null
): { index: number; prevRow?: RowBlock; nextRow?: RowBlock } {
  if (!email || !email.rows) return { index: -1 }

  const index = email.rows.findIndex((r) => r.id === row.id)
  return {
    index,
    prevRow: index > 0 ? email.rows[index - 1] : undefined,
    nextRow: index < email.rows.length - 1 ? email.rows[index + 1] : undefined,
  }
}

// Check if a row is a title row based on surrounding rows
function isTitleRow(row: RowBlock, email: Email | null): boolean {
  if (!email) return false

  const { prevRow, nextRow } = findRowPosition(row, email)

  // Not a title row if there's no next row (it's the last row)
  if (!nextRow) return false

  // Title row if:
  // 1. The next row has the same type
  // 2. This row only has heading/text blocks
  if (row.attributes.type === nextRow.attributes.type) {
    // Check if current row only contains heading and text blocks
    const onlyHasHeadingAndText = row.columns.every((column) =>
      column.blocks.every((block) => block.type === 'heading' || block.type === 'text')
    )

    return onlyHasHeadingAndText
  }

  return false
}

export function getTypeDefaults(row: RowBlock, email: Email | null): Partial<RowBlock['attributes']> {
  const emailAttributes = getEmailAttributes(email)
  const rowAttributes = row.attributes
  const themeValue = emailAttributes?.themeColor || 'default'
  const variant = emailAttributes?.styleVariant || 'default'
  const rowType = rowAttributes.type || 'default'

  // Get theme colors using the dynamic function
  const themeColors = getThemeColors(themeValue)

  // Check if row only contains a spacer
  const hasSingleSpacer =
    row.columns.length === 1 && row.columns[0].blocks.length === 1 && row.columns[0].blocks[0].type === 'spacer'

  // Get base styles
  const baseStyles = baseRowStyles[rowType]?.(row, themeColors) || baseRowStyles.default(row, themeColors)

  // Get variant styles
  const variantStyles = variantRowDefaults[variant]?.[rowType] || variantRowDefaults[variant]?.['default'] || {}

  // Apply variant-specific overrides
  const variantOverrides = variantStyleOverrides[variant]?.(row, email, themeColors) || {}

  // Check for adjacent rows with the same type
  const { prevRow, nextRow } = findRowPosition(row, email)
  const adjacentRowOverrides: Partial<RowBlock['attributes']> = {}

  // Special handling for footer rows with dividers
  if (rowType === 'footer') {
    // Check if this is the first footer (it has columns or no divider as first element)
    const isFirstFooter = !prevRow || prevRow.attributes.type !== 'footer'

    // Check if this is the second footer (it has a divider as first element)
    const hasLeadingDivider =
      row.columns.length === 1 && row.columns[0].blocks.length > 0 && row.columns[0].blocks[0].type === 'divider'

    const isSecondFooter = prevRow && prevRow.attributes.type === 'footer' && hasLeadingDivider

    if (isFirstFooter) {
      // First footer has normal top padding but no bottom padding if followed by another footer
      adjacentRowOverrides.paddingTop = '24px'
      if (nextRow && nextRow.attributes.type === 'footer') {
        adjacentRowOverrides.paddingBottom = '0px'
      } else {
        adjacentRowOverrides.paddingBottom = '24px'
      }
    } else if (isSecondFooter) {
      // Second footer has no top padding but normal bottom padding
      adjacentRowOverrides.paddingTop = '0px'
      adjacentRowOverrides.paddingBottom = '24px'
    }
  }
  // Default adjacent row handling for non-footer rows
  else {
    // If the previous row has the same type, remove bottom padding from previous row
    if (prevRow && prevRow.attributes.type === rowType && rowType !== 'default') {
      adjacentRowOverrides.paddingTop = '0px'
    }

    // If the next row has the same type, remove bottom padding from this row
    if (nextRow && nextRow.attributes.type === rowType && rowType !== 'default') {
      adjacentRowOverrides.paddingBottom = '12px'
    }
  }

  if (hasSingleSpacer) {
    adjacentRowOverrides.paddingTop = '0px'
    adjacentRowOverrides.paddingBottom = '0px'
  }

  // Check if this is a title row and add 20px bottom padding
  const titleRowOverrides: Partial<RowBlock['attributes']> = {}
  if (isTitleRow(row, email)) {
    titleRowOverrides.paddingBottom = '20px'
  }

  // Merge all styles with priority: base < variant < overrides < theme < adjacent row < title row overrides
  return {
    ...baseStyles,
    ...variantStyles,
    ...variantOverrides,
    ...adjacentRowOverrides,
    ...titleRowOverrides, // Title row overrides have highest priority
  }
}
