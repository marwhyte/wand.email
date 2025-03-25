import type {
  ButtonBlockAttributes,
  DividerBlockAttributes,
  Email,
  EmailBlock,
  HeadingBlockAttributes,
  ImageBlockAttributes,
  LinkBlockAttributes,
  ListBlockAttributes,
  RowBlock,
  SocialsBlockAttributes,
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
  survey?: Partial<SurveyBlockAttributes>
  list?: Partial<ListBlockAttributes>
}

type VariantBlockStyles = Record<string, BlockStyleModifier>

// Add variant-specific styles
export const variantBlockDefaults: Record<string, VariantBlockStyles> = {
  outline: {
    default: {
      heading: {
        textAlign: 'center',
      },
      text: {
        textAlign: 'center',
      },
      image: {
        align: 'center',
      },
      button: {
        align: 'center',
        fontSize: '14px',
        paddingTop: '10px',
        paddingBottom: '10px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#4184f3',
        borderRadius: '5px',
      },
      link: {
        align: 'center',
        fontSize: '14px',
        color: '#4184f3',
      },
      socials: {},
    },
    h1: {
      heading: {
        fontSize: '28px',
      },
    },
    h2: {
      heading: {
        fontSize: '24px',
      },
    },
    footer: {
      text: {
        fontSize: '12px',
        color: 'rgba(0,0,0,0.54)',
      },
    },
  },
  default: {
    footer: {
      link: {
        align: 'center',
      },
    },
    default: {
      link: {
        align: 'center',
      },
      button: {
        align: 'center',
        paddingLeft: '0',
        contentPaddingLeft: '24px',
        contentPaddingRight: '24px',
        fontWeight: 'bold',
      },
    },
  },
  clear: {
    footer: {
      link: {
        align: 'center',
      },
    },
    default: {
      link: {
        align: 'center',
      },
      button: {
        align: 'center',
        paddingLeft: '0',
        contentPaddingLeft: '24px',
        contentPaddingRight: '24px',
        fontWeight: 'bold',
      },
    },
    h1: {
      heading: {
        color: '#0a2540',
        fontSize: '48px',
      },
    },
    h2: {
      heading: {
        color: '#0a2540',
        fontSize: '32px',
      },
    },
    h3: {
      heading: {
        color: '#2e3a55',
        fontSize: '20px',
      },
    },
    h4: {},
  },
}

// Add email type-specific styles
export const emailTypeBlockDefaults: Record<string, VariantBlockStyles> = {
  ecommerce: {
    default: {
      button: {
        align: 'center',
        paddingLeft: '0',
        contentPaddingLeft: '24px',
        contentPaddingRight: '24px',
        fontWeight: 'bold',
      },
    },
  },
  newsletter: {
    default: {
      heading: {
        color: '#0a2540',
        textAlign: 'center',
        paddingBottom: '10px',
        paddingTop: '10px',
      },
      text: {
        textAlign: 'center',
        fontSize: '16px',
        color: '#3f4b66',
      },
      list: {
        color: '#3f4b66',
      },
      button: {
        backgroundColor: '#635bff',
        fontWeight: 'bold',
        paddingLeft: '0',
        paddingRight: '0',
        align: 'left',
      },
      image: {
        paddingTop: '10px',
      },
    },
    header: {
      heading: {},
    },
    footer: {
      heading: {
        textAlign: 'center',
      },
      text: {
        fontSize: '12px',
        textAlign: 'center',
      },
    },
  },
  marketing: {
    default: {
      heading: {},
      text: {},
      button: {},
    },
    header: {
      image: {},
    },
  },
  transactional: {
    default: {
      heading: {},
      text: {
        fontSize: '14px',
      },
      button: {},
    },
    h1: {
      heading: {
        fontSize: '28px',
      },
    },
    h2: {
      heading: {
        fontSize: '24px',
      },
    },
  },
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

  // Get variant-specific styles
  const variantStyles = emailAttributes?.styleVariant
    ? variantBlockDefaults[emailAttributes.styleVariant]?.default?.[block.type as keyof BlockStyleModifier] || {}
    : {}

  // Get row-type specific variant styles
  const rowTypeVariantStyles =
    emailAttributes?.styleVariant && parentRow.attributes.type
      ? variantBlockDefaults[emailAttributes.styleVariant]?.[parentRow.attributes.type]?.[
          block.type as keyof BlockStyleModifier
        ] || {}
      : {}

  // Get email type-specific styles
  const emailTypeStyles = emailAttributes?.type
    ? emailTypeBlockDefaults[emailAttributes.type]?.default?.[block.type as keyof BlockStyleModifier] || {}
    : {}

  // Get row-type specific email type styles
  const rowTypeEmailTypeStyles =
    emailAttributes?.type && parentRow.attributes.type
      ? emailTypeBlockDefaults[emailAttributes.type]?.[parentRow.attributes.type]?.[
          block.type as keyof BlockStyleModifier
        ] || {}
      : {}

  // Apply variant-specific styles for heading levels
  if (block.type === 'heading' && emailAttributes?.styleVariant) {
    const headingLevel = block.attributes.level
    const levelSpecificStyles = variantBlockDefaults[emailAttributes.styleVariant]?.[headingLevel]?.heading || {}
    const emailTypeLevelSpecificStyles = emailTypeBlockDefaults[emailAttributes.type]?.[headingLevel]?.heading || {}
    Object.assign(variantStyles, levelSpecificStyles)
    Object.assign(variantStyles, emailTypeLevelSpecificStyles)
  }

  // Merge styles with priority: base < email type < variant < row-specific
  return {
    ...baseDefaults,
    ...variantStyles,
    ...rowTypeVariantStyles,
    ...emailTypeStyles,
    ...rowTypeEmailTypeStyles,
  } as BlockStyleModifier
}

// Function to get block-specific style overrides
function getBlockSpecificOverrides(
  block: EmailBlock,
  parentRow: RowBlock,
  company?: Company | null
): Partial<BlockStyleModifier> {
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

    case 'heading':
      if (parentRow.attributes.type === 'footer' && parentRow.columns.length === 1) {
        return { heading: { textAlign: 'center' } }
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

  return {
    ...mergedDefaults,
    ...specificOverrides[block.type as keyof BlockStyleModifier],
    ...combinedStyles,
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
