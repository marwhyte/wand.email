import type { ButtonBlock, DividerBlock, EmailBlock, HeadingBlock, ImageBlock, LinkBlock, RowBlock, SurveyBlock, TextBlock } from '@/app/components/email-workspace/types'
import type { Button, Heading, Hr, Img, Link, Section, Text } from '@react-email/components'
import { applyCommonAttributes, applyCommonClassName } from '../common'
import { getAdditionalButtonStyles, getAdditionalDividerStyles, getAdditionalHeadingStyles, getAdditionalImageStyles, getAdditionalLinkStyles, getAdditionalSurveyStyles, getAdditionalTextStyles } from '../defaults/blocks'

type OmitChildren<T> = Omit<T, 'children' | 'ref' | 'onToggle'>

export function generateTextProps(block: TextBlock, parentRow: RowBlock, mobileView = false): OmitChildren<React.ComponentProps<typeof Text>> {
  return {
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalTextStyles(block.attributes),
    },
    className: applyCommonClassName(block.attributes, mobileView),
  }
}

export function generateHeadingProps(block: HeadingBlock, parentRow: RowBlock, mobileView = false): OmitChildren<React.ComponentProps<typeof Heading>> {
  return {
    as: block.attributes.as,
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalHeadingStyles(block.attributes),
      marginBlockStart: 0,
      marginBlockEnd: 0,
    },
    className: applyCommonClassName(block.attributes, mobileView),
  }
}

export function generateImageProps(block: ImageBlock, parentRow: RowBlock): OmitChildren<React.ComponentProps<typeof Img>> {
  return {
    src: block.attributes.src,
    alt: block.attributes.alt,
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalImageStyles(block.attributes, parentRow),
    },
  }
}

export function generateButtonProps(block: ButtonBlock, parentRow: RowBlock, mobileView = false): OmitChildren<React.ComponentProps<typeof Button>> {
  return {
    href: block.attributes.href,
    target: block.attributes.target,
    rel: block.attributes.rel,
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalButtonStyles(block.attributes),
    },
    className: applyCommonClassName(block.attributes, mobileView),
  }
}

export function generateLinkProps(block: LinkBlock, parentRow: RowBlock, mobileView = false, defaultLinkColor?: string): OmitChildren<React.ComponentProps<typeof Link>> {
  return {
    href: block.attributes.href,
    target: block.attributes.target,
    rel: block.attributes.rel,
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalLinkStyles({
        ...block.attributes,
        color: block.attributes.color || defaultLinkColor || '#3b82f6',
      }),
    },
    className: applyCommonClassName(block.attributes, mobileView),
  }
}

export function generateDividerProps(block: DividerBlock, parentRow: RowBlock, mobileView = false): OmitChildren<React.ComponentProps<typeof Hr>> {
  return {
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalDividerStyles(block.attributes),
    },
    className: applyCommonClassName(block.attributes, mobileView),
  }
}

export function generateSurveyProps(block: SurveyBlock, parentRow: RowBlock, mobileView = false): OmitChildren<React.ComponentProps<typeof Section>> {
  return {
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalSurveyStyles(block.attributes),
    },
    className: applyCommonClassName(block.attributes, mobileView),
  }
}

export function generateBlockProps<T extends EmailBlock>(
  block: T,
  parentRow: RowBlock,
  defaultLinkColor?: string
): T extends TextBlock
  ? OmitChildren<React.ComponentProps<typeof Text>>
  : T extends HeadingBlock
    ? OmitChildren<React.ComponentProps<typeof Heading>>
    : T extends ImageBlock
      ? OmitChildren<React.ComponentProps<typeof Img>>
      : T extends ButtonBlock
        ? OmitChildren<React.ComponentProps<typeof Button>>
        : T extends LinkBlock
          ? OmitChildren<React.ComponentProps<typeof Link>>
          : T extends DividerBlock
            ? OmitChildren<React.ComponentProps<typeof Hr>>
            : T extends SurveyBlock
              ? OmitChildren<React.ComponentProps<typeof Section>>
              : never {
  switch (block.type) {
    case 'text':
      return generateTextProps(block as TextBlock, parentRow) as any
    case 'heading':
      return generateHeadingProps(block as HeadingBlock, parentRow) as any
    case 'image':
      return generateImageProps(block as ImageBlock, parentRow) as any
    case 'button':
      return generateButtonProps(block as ButtonBlock, parentRow) as any
    case 'link':
      return generateLinkProps(block as LinkBlock, parentRow, false, defaultLinkColor) as any
    case 'divider':
      return generateDividerProps(block as DividerBlock, parentRow) as any
    case 'survey':
      return generateSurveyProps(block as SurveyBlock, parentRow) as any
    default:
      return {} as never
  }
}
