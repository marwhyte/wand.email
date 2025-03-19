import type {
  ButtonBlockAttributes,
  ColumnBlock,
  ColumnBlockAttributes,
  DividerBlockAttributes,
  Email,
  EmailBlock,
  HeadingBlockAttributes,
  ImageBlockAttributes,
  LinkBlockAttributes,
  RowBlock,
  SocialsBlockAttributes,
  SurveyBlockAttributes,
  TextBlockAttributes,
} from '@/app/components/email-workspace/types'
import { Company } from '@/lib/database/types'
import { getImgSrc } from '../../misc'
import { getEmailAttributes } from '../generators/layout'

type BlockStyleModifier = {
  text?: Partial<TextBlockAttributes>
  heading?: Partial<HeadingBlockAttributes>
  image?: Partial<ImageBlockAttributes>
  link?: Partial<LinkBlockAttributes>
  divider?: Partial<DividerBlockAttributes>
  social?: Partial<SocialsBlockAttributes>
  button?: Partial<ButtonBlockAttributes>
  column?: Partial<ColumnBlockAttributes>
  survey?: Partial<SurveyBlockAttributes>
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
        fontSize: '14px',
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
      social: {
        align: 'center',
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
  },
}

export function getRowTypeBlockDefaults(
  block: EmailBlock | ColumnBlock,
  email: Email | null,
  parentRow: RowBlock,
  company?: Company | null
): React.CSSProperties {
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

  // Apply variant-specific styles for heading levels
  if (block.type === 'heading' && emailAttributes?.styleVariant) {
    const headingLevel = (block.attributes as HeadingBlockAttributes).level
    const levelSpecificStyles = variantBlockDefaults[emailAttributes.styleVariant]?.[headingLevel]?.heading || {}
    Object.assign(variantStyles, levelSpecificStyles)
  }

  // Merge styles with variant styles taking priority
  const mergedDefaults = {
    ...baseDefaults,
    ...variantStyles,
    ...rowTypeVariantStyles,
  }

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
            width = '100px'
          }

          return {
            ...mergedDefaults,
            ...additionalStyles,
            width,
          }
        }

        return {
          ...mergedDefaults,
          ...additionalStyles,
        }
      }
      break

    case 'column':
      // Footer column handling
      if (parentRow.attributes.type === 'footer' && parentRow.columns.length === 1) {
        return {
          ...mergedDefaults,
          textAlign: 'center',
        }
      }
      // Gallery column handling
      if (parentRow.attributes.type === 'gallery' && parentRow.columns.length === 2) {
        const photoColumns = parentRow.columns.filter((col) => col.blocks.some((b) => b.type === 'image'))
        if (photoColumns.length === 1) {
          return {
            ...mergedDefaults,
            verticalAlign: 'middle',
          }
        }
      }

      // Header column handling
      if (parentRow.attributes.type === 'header' && parentRow.columns.length === 2) {
        const columnIndex = parentRow.columns.findIndex((col) => col.id === block.id)
        return {
          ...mergedDefaults,
          verticalAlign: 'middle',
          textAlign: columnIndex === 1 ? 'right' : 'left',
        }
      }
      break

    case 'heading':
      if (parentRow.attributes.type === 'footer' && parentRow.columns.length === 1) {
        return {
          ...mergedDefaults,
          textAlign: 'center',
        }
      }
      break

    case 'text':
    case 'button':
      break
  }

  return mergedDefaults
}
