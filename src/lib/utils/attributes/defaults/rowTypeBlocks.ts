import type {
  ButtonBlockAttributes,
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
}

type VariantBlockStyles = Record<string, BlockStyleModifier>

export const rowTypeBlockDefaults: Record<RowBlockType, BlockStyleModifier> = {
  default: {},
  hero: {
    heading: {
      textAlign: 'center',
      paddingTop: '0px',
      paddingBottom: '16px',
    },
    text: {
      textAlign: 'center',
      paddingTop: '0px',
      paddingBottom: '32px',
    },
    image: {
      align: 'center',
      paddingTop: '0px',
      paddingBottom: '32px',
    },
    button: {
      paddingTop: '0px',
      paddingBottom: '0px',
    },
  },
  'key-features': {},
  cards: {},
  article: {},
  list: {},
  cta: {},
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
      fontSize: '24px',
      paddingBottom: '16px',
    },
    text: {
      fontSize: '14px',
    },
    button: {
      align: 'left',
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
  discount: {
    text: {
      fontSize: '14px',
      textAlign: 'center',
    },
    heading: {
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#4184f3',
    },
  },
  footer: {
    heading: {
      textAlign: 'center',
    },
    image: {
      borderRadius: '0',
      align: 'center',
    },
    text: {
      color: '#414141',
      fontSize: '12px',
      paddingTop: '4px',
      paddingBottom: '4px',
      textAlign: 'center',
    },
    button: {
      align: 'center',
    },
    link: {
      align: 'center',
    },
    socials: {},
  },
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
  // High-priority overrides for specific row types
  if (parentRow.attributes.type === 'cart' && block.type === 'text') {
    return { text: { textAlign: 'left' } }
  }

  if (parentRow.attributes.type === 'cart' && block.type === 'heading') {
    return { heading: { textAlign: 'left' } }
  }

  // Gallery row with multiple columns and images - center text and headings
  if (parentRow.attributes.type === 'gallery' && parentRow.columns.length >= 2) {
    // Check if there are at least 2 columns with images
    const columnsWithImages = parentRow.columns.filter((column) => column.blocks.some((b) => b.type === 'image'))

    if (columnsWithImages.length >= 2) {
      if (block.type === 'text') {
        return { text: { textAlign: 'center' } }
      }
      if (block.type === 'heading') {
        return { heading: { textAlign: 'center' } }
      }
    }
  }

  // Existing overrides logic
  switch (block.type) {
    case 'image':
      if (parentRow.attributes.type === 'header' || parentRow.attributes.type === 'footer') {
        const attributes = block.attributes
        let width = attributes.width
        let additionalStyles = {}

        if (parentRow.attributes.type === 'footer' && parentRow.columns.length === 1) {
          additionalStyles = { marginLeft: 'auto', marginRight: 'auto' }
        }

        if (!width) {
          const img = new Image()
          img.src = getImgSrc(attributes.src, company) || ''

          if (img.naturalWidth && img.naturalHeight) {
            const aspectRatio = img.naturalWidth / img.naturalHeight
            width = aspectRatio >= 0.8 && aspectRatio <= 1.2 ? '15%' : '22%'
          } else {
            width = '22%'
          }

          return { image: { ...additionalStyles, width } }
        }

        return { image: additionalStyles }
      }
      break
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
