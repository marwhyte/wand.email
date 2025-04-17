import type {
  ButtonBlockAttributes,
  ColumnBlockAttributes,
  DividerBlockAttributes,
  Email,
  EmailBlock,
  HeadingBlockAttributes,
  IconBlockAttributes,
  ImageBlockAttributes,
  LinkBlockAttributes,
  ListBlockAttributes,
  RowBlock,
  RowBlockType,
  SocialsBlockAttributes,
  SpacerBlockAttributes,
  SurveyBlockAttributes,
  TableBlockAttributes,
  TextBlockAttributes,
} from '@/app/components/email-workspace/types'
import { Company } from '@/lib/database/types'
import React from 'react'
import { getImgSrc } from '../../misc'
import { getEmailAttributes } from '../attributes'

type BlockAttributeMap = {
  text: TextBlockAttributes
  heading: HeadingBlockAttributes
  image: ImageBlockAttributes
  link: LinkBlockAttributes
  divider: DividerBlockAttributes
  socials: SocialsBlockAttributes
  button: ButtonBlockAttributes
  survey: SurveyBlockAttributes
  table: TableBlockAttributes
  list: ListBlockAttributes
  spacer: SpacerBlockAttributes
  icon: IconBlockAttributes
  column: ColumnBlockAttributes
}

type BlockStyleModifier = {
  table?: Partial<TableBlockAttributes>
  text?: Partial<TextBlockAttributes>
  heading?: Partial<HeadingBlockAttributes>
  image?: Partial<ImageBlockAttributes>
  link?: Partial<LinkBlockAttributes>
  divider?: Partial<DividerBlockAttributes>
  socials?: Partial<SocialsBlockAttributes>
  button?: Partial<ButtonBlockAttributes>
  spacer?: Partial<SpacerBlockAttributes>
  survey?: Partial<SurveyBlockAttributes>
  list?: Partial<ListBlockAttributes>
  icon?: Partial<IconBlockAttributes>
  column?: Partial<ColumnBlockAttributes>
}

type VariantBlockStyles = Record<string, BlockStyleModifier>

export const rowTypeBlockDefaults: Record<RowBlockType, BlockStyleModifier> = {
  default: {},
  hero: {
    heading: {
      paddingTop: '0px',
      paddingBottom: '16px',
    },
    text: {
      paddingTop: '0px',
      paddingBottom: '32px',
      color: '#374151',
    },
    image: {
      paddingTop: '0px',
      paddingBottom: '32px',
    },
    button: {
      paddingTop: '0px',
      paddingBottom: '0px',
    },
  },
  'feature-list': {
    icon: {
      align: 'center',
    },
  },
  cards: {
    heading: {
      textAlign: 'left',
      fontSize: '16px',
      paddingTop: '16px',
      paddingRight: '16px',
      paddingBottom: '4px',
      paddingLeft: '16px',
    },
    text: {
      textAlign: 'left',
      fontSize: '14px',
      paddingTop: '4px',
      paddingRight: '16px',
      paddingBottom: '16px',
      paddingLeft: '16px',
    },
    button: {
      align: 'center',
      fontSize: '12px',
      paddingLeft: '16px',
      paddingRight: '16px',
      paddingTop: '8px',
      paddingBottom: '16px',
      contentPaddingTop: '6px',
      contentPaddingBottom: '6px',
      contentPaddingLeft: '12px',
      contentPaddingRight: '12px',
    },
    image: {
      borderRadius: '0px',
    },
    column: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
    },
  },
  article: {
    image: {
      paddingBottom: '16px',
    },
    heading: {
      fontSize: '20px',
      textAlign: 'left',
      paddingTop: '16px',
      paddingRight: '0px',
      paddingBottom: '8px',
      paddingLeft: '0px',
    },
    text: {
      fontSize: '16px',
      textAlign: 'left',
      paddingTop: '0px',
      paddingRight: '0px',
      paddingBottom: '16px',
      paddingLeft: '0px',
    },
    button: {
      align: 'left',
      paddingTop: '0px',
      paddingRight: '0px',
      paddingLeft: '0px',
      paddingBottom: '0px',
      fontSize: '16px',
    },
    link: {
      fontSize: '16px',
      align: 'left',
      paddingTop: '0px',
      paddingRight: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
    },
  },
  cta: {
    heading: {
      fontSize: '24px',
    },
    text: {
      fontSize: '16px',
    },
    button: {
      fontSize: '16px',
    },
  },
  invoice: {},
  cart: {
    image: {
      paddingRight: '16px',
    },
    text: {
      textAlign: 'left',
      fontWeight: 'bold',
      fontSize: '14px',
    },
    heading: {
      textAlign: 'left',
    },
    button: {
      align: 'left',
    },
    divider: {
      paddingTop: '10px',
      paddingBottom: '10px',
    },
  },
  gallery: {
    heading: {
      textAlign: 'left',
      fontSize: '20px',
      paddingBottom: '16px',
    },
    text: {
      textAlign: 'left',
      fontSize: '16px',
    },
    button: {
      align: 'left',
      paddingTop: '0px',
      paddingBottom: '0px',
    },
    link: {
      fontSize: '16px',
      align: 'left',
    },
    // Default column widths for gallery will be handled in getColumnDefaultAttributes
  },
  header: {
    socials: {
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      paddingRight: '0px',
    },
    image: {
      borderRadius: '0',
    },
    heading: {
      fontSize: '32px',
    },
  },
  discount: {
    text: {
      fontSize: '14px',
    },
    heading: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#4184f3',
    },
  },
  footer: {
    divider: {
      paddingTop: '22px',
      paddingBottom: '12px',
      borderColor: '#D1D5DB',
    },
    socials: {
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      paddingRight: '0px',
    },
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

// Add combination-specific block styles
export const combinedTypeBlockDefaults: Record<string, Record<string, VariantBlockStyles>> = {
  outline: {
    newsletter: {
      header: {
        socials: {
          paddingBottom: '0px',
          paddingTop: '0px',
          paddingLeft: '0px',
          paddingRight: '0px',
          align: 'right',
        },
      },
      footer: {},
      default: {},
    },
    marketing: {},
    transactional: {},
  },
  default: {
    newsletter: {},
  },
}

// Helper function to get merged style defaults
function getMergedStyleDefaults(
  block: EmailBlock,
  email: Email | null,
  parentRow: RowBlock,
  company?: Company | null
): BlockStyleModifier {
  const emailAttributes = getEmailAttributes(email)

  // Check if the block is in a title row - if so, don't apply row-specific styles to text and heading
  if (email && (block.type === 'text' || block.type === 'heading')) {
    const isTitleRowCheck = isTitleRow(parentRow, email)
    if (isTitleRowCheck) {
      // For title rows, don't apply row-specific styles to text and heading
      return {} as BlockStyleModifier
    }
  }

  // For non-title rows or non-text/heading blocks, apply normal styling
  const baseDefaults = parentRow.attributes.type
    ? rowTypeBlockDefaults[parentRow.attributes.type]?.[block.type as keyof BlockStyleModifier]
    : {}

  // Merge styles with priority: base < email type < variant < row-specific
  return {
    ...baseDefaults,
  } as BlockStyleModifier
}

// Function to get block-specific style overrides
function getBlockSpecificOverrides(
  block: EmailBlock,
  parentRow: RowBlock,
  company?: Company | null
): Partial<BlockStyleModifier> {
  // Initialize image styles if this is an image block, otherwise an empty object which we won't use
  const imageStyles: Record<string, any> = {}

  // High-priority overrides for specific row types
  if (parentRow.attributes.type === 'cart' && block.type === 'text') {
    return { text: { textAlign: 'left' } }
  }

  if (parentRow.attributes.type === 'feature-list' && block.type === 'icon' && block.attributes.position === 'left') {
    return { icon: { align: 'left', size: '32px' } }
  }

  if (parentRow.attributes.type === 'cart' && block.type === 'heading') {
    return { heading: { textAlign: 'left' } }
  }

  // Special styling for footer with two columns
  if (parentRow.attributes.type === 'footer' && parentRow.columns.length === 2) {
    // Find which column this block is in
    const columnIndex = parentRow.columns.findIndex((column) => column.blocks.some((b) => b.id === block.id))

    if (columnIndex === 0) {
      // First column: align left
      if (block.type === 'text') {
        return { text: { textAlign: 'left', color: '#4b5563', fontSize: '14px' } }
      } else if (block.type === 'heading') {
        return { heading: { textAlign: 'left', color: '#4b5563', fontSize: '20px' } }
      } else if (block.type === 'socials') {
        return { socials: { align: 'left' } }
      } else if (block.type === 'link') {
        return { link: { align: 'left', color: '#4b5563' } }
      } else if (block.type === 'button') {
        return { button: { align: 'left' } }
      } else if (block.type === 'image') {
        // Set alignment but don't return yet for images
        imageStyles.align = 'left'
      }
    } else if (columnIndex === 1) {
      // Second column: align right
      if (block.type === 'text') {
        return { text: { textAlign: 'right', color: '#4b5563', fontSize: '14px' } }
      } else if (block.type === 'heading') {
        return { heading: { textAlign: 'right', color: '#4b5563', fontSize: '20px' } }
      } else if (block.type === 'socials') {
        return { socials: { align: 'right' } }
      } else if (block.type === 'link') {
        return { link: { align: 'right', color: '#4b5563' } }
      } else if (block.type === 'button') {
        return { button: { align: 'right' } }
      } else if (block.type === 'image') {
        // Set alignment but don't return yet for images
        imageStyles.align = 'right'
      }
    }
  }

  // Special styling for header with two columns
  if (parentRow.attributes.type === 'header' && parentRow.columns.length === 2) {
    // Find which column this block is in
    const columnIndex = parentRow.columns.findIndex((column) => column.blocks.some((b) => b.id === block.id))

    if (columnIndex === 0) {
      // First column: align left (primarily for logo)
      if (block.type === 'image') {
        imageStyles.align = 'left'
      } else if (block.type === 'socials') {
        return { socials: { align: 'left' } }
      } else if (block.type === 'text') {
        return { text: { textAlign: 'left' } }
      } else if (block.type === 'heading') {
        return { heading: { textAlign: 'left' } }
      } else if (block.type === 'link') {
        return { link: { align: 'left' } }
      } else if (block.type === 'button') {
        return { button: { align: 'left' } }
      }
    } else if (columnIndex === 1) {
      // Second column: align right (primarily for socials)
      if (block.type === 'socials') {
        return { socials: { align: 'right' } }
      } else if (block.type === 'image') {
        imageStyles.align = 'right'
      } else if (block.type === 'text') {
        return { text: { textAlign: 'right' } }
      } else if (block.type === 'heading') {
        return { heading: { textAlign: 'right' } }
      } else if (block.type === 'link') {
        return { link: { align: 'right' } }
      } else if (block.type === 'button') {
        return { button: { align: 'right' } }
      }
    }
  }

  // For footer with one column (non-divided footer or second divided footer)
  if (parentRow.attributes.type === 'footer' && parentRow.columns.length === 1) {
    if (block.type === 'text') {
      return { text: { textAlign: 'center', color: '#4b5563', fontSize: '14px' } }
    } else if (block.type === 'heading') {
      return { heading: { textAlign: 'center', color: '#4b5563', fontSize: '20px' } }
    } else if (block.type === 'socials') {
      return { socials: { align: 'center' } }
    } else if (block.type === 'link') {
      return { link: { align: 'center', color: '#4b5563' } }
    } else if (block.type === 'button') {
      return { button: { align: 'center' } }
    } else if (block.type === 'image') {
      // Set alignment but don't return yet for images
      imageStyles.align = 'center'
      imageStyles.marginLeft = 'auto'
      imageStyles.marginRight = 'auto'
    }
  }

  // Text block following a heading should have no top padding
  if (block.type === 'text') {
    const columnIndex = parentRow.columns.findIndex((column) => column.blocks.some((b) => b.id === block.id))

    if (columnIndex >= 0) {
      const blockIndex = parentRow.columns[columnIndex].blocks.findIndex((b) => b.id === block.id)
      const prevBlock = blockIndex > 0 ? parentRow.columns[columnIndex].blocks[blockIndex - 1] : null

      if (prevBlock && prevBlock.type === 'heading') {
        return { text: { paddingTop: '0px', color: parentRow.attributes.type === 'hero' ? '#374151' : '#4b5563' } }
      }
    }
  }

  // Continue with width calculation for images in header/footer
  if (block.type === 'image' && (parentRow.attributes.type === 'header' || parentRow.attributes.type === 'footer')) {
    const attributes = block.attributes

    // Skip margin setting here if already set above
    if (parentRow.attributes.type === 'footer' && parentRow.columns.length === 1 && !imageStyles.marginLeft) {
      imageStyles.marginLeft = 'auto'
      imageStyles.marginRight = 'auto'
    }

    // Calculate width if not explicitly set
    if (!attributes.width) {
      const img = new Image()
      img.src = getImgSrc(attributes.src, company) || ''

      // Get column count
      const columnCount = parentRow.columns.length

      // If company logo dimensions are available, use them directly
      if (attributes.src === 'logo' && company?.logoWidth && company?.logoHeight) {
        // Get aspect ratio to determine appropriate sizing
        const logoWidth = company.logoWidth
        const logoHeight = company.logoHeight

        if (logoWidth && logoHeight) {
          const aspectRatio = logoWidth / logoHeight

          // Set a reasonable width based on aspect ratio
          let width = 140 // Default size in pixels

          // For wider logos (landscape orientation), use larger width
          if (aspectRatio > 2) {
            width = 160
          } else if (aspectRatio > 1) {
            // For moderately wide logos
            width = 120
          } else {
            // For square or tall logos (portrait orientation)
            width = 60
          }

          imageStyles.width = `${width}px`
        } else {
          // Fallback if dimensions exist but are zero
          let baseWidth = columnCount === 1 ? 140 : 120
          imageStyles.width = `${baseWidth}px`
        }
      } else {
        // Default fallback dimensions (will be used for SSR)
        let baseWidth = columnCount === 1 ? 140 : 120
        imageStyles.width = `${baseWidth}px`

        // Try to detect if we're on the client side
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
          // We're on the client side, we can try to load the image to get dimensions
          const img = new Image()
          img.src = getImgSrc(attributes.src, company) || ''

          // Create the image element to load and get dimensions
          img.onload = function () {
            // Once the image loads, we can get its natural dimensions
            const naturalWidth = img.naturalWidth
            const naturalHeight = img.naturalHeight

            if (naturalWidth && naturalHeight) {
              const aspectRatio = naturalWidth / naturalHeight

              // Calculate width based on aspect ratio
              let width = 140 // Default size

              // Adjust width based on aspect ratio
              if (aspectRatio > 2) {
                width = 160 // Wide logo
              } else if (aspectRatio > 1) {
                width = 120 // Moderately wide logo
              } else {
                width = 60 // Square or tall logo
              }

              // Directly set the width in the imageStyles
              imageStyles.width = `${width}px`
            }
          }

          // Start loading the image to trigger onload
          if (img.src) {
            // If the image is already cached, onload might not fire
            // Check if complete and naturalWidth is available
            if (img.complete && img.naturalWidth) {
              // Call onload handler directly in this case
              img.onload && (img.onload as Function)()
            }
          }
        }
      }
    }

    // Return all image styles if we have any
    if (Object.keys(imageStyles).length > 0) {
      return { image: imageStyles }
    }
  }

  return {}
}

// Helper function to get merged styles
function getMergedStyles(block: EmailBlock, email: Email | null, parentRow: RowBlock, company?: Company | null) {
  const mergedDefaults = getMergedStyleDefaults(block, email, parentRow, company)
  const specificOverrides = getBlockSpecificOverrides(block, parentRow, company)
  const emailAttributes = getEmailAttributes(email)

  // Get combined variant and email type specific styles
  const combinedStyles =
    emailAttributes?.styleVariant && emailAttributes?.type
      ? combinedTypeBlockDefaults[emailAttributes.styleVariant]?.[emailAttributes.type]?.[
          parentRow.attributes.type || 'default'
        ]?.[block.type as keyof BlockStyleModifier] || {}
      : {}

  // Apply styles in order of increasing priority
  return {
    ...mergedDefaults,
    ...combinedStyles,
    ...specificOverrides[block.type as keyof BlockStyleModifier], // The specific overrides now have highest priority
  }
}

// Main function to get CSS properties
export function getBlockCSSProperties(
  block: EmailBlock,
  email: Email | null,
  parentRow: RowBlock,
  company?: Company | null
): React.CSSProperties {
  return getMergedStyles(block, email, parentRow, company) as React.CSSProperties
}

// Function to get block attributes
export function getBlockDefaultAttributes<T extends keyof BlockStyleModifier>(
  block: { type: T } & EmailBlock,
  email: Email | null,
  parentRow: RowBlock,
  company?: Company | null
): Partial<BlockAttributeMap[T]> {
  return getMergedStyles(block, email, parentRow, company) as Partial<BlockAttributeMap[T]>
}

// Function to get column-specific style overrides
export function getColumnDefaultAttributes(
  columnIndex: number,
  parentRow: RowBlock,
  email: Email | null
): Partial<ColumnBlockAttributes> {
  const rowType = parentRow.attributes.type || 'default'

  // Get base column styles from row type defaults
  const baseStyles = rowTypeBlockDefaults[rowType]?.column || {}

  // Apply specific overrides based on row type and column position
  let overrides: Partial<ColumnBlockAttributes> = {}

  if (rowType === 'gallery' && parentRow.columns.length === 2) {
    // For gallery rows with 2 columns
    if (columnIndex === 0 && parentRow.columns[0].blocks.some((b) => b.type === 'image')) {
      overrides = { width: '40' } // Image column
    } else if (columnIndex === 1) {
      overrides = { width: '60' } // Content column
    }
  }

  // Special case for cards: don't apply card styling to title/heading-only columns
  if (rowType === 'cards' && columnIndex < parentRow.columns.length) {
    const column = parentRow.columns[columnIndex]
    const hasTitleBlocksOnly = column.blocks.every((block) => block.type === 'heading' || block.type === 'text')

    // If this column only has heading/text blocks, it's a title column - don't apply card styling
    if (hasTitleBlocksOnly) {
      return {
        ...baseStyles,
        backgroundColor: undefined,
        borderRadius: undefined,
      }
    }
  }

  return {
    ...baseStyles,
    ...overrides,
  }
}
