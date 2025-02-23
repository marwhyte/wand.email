import type {
  ButtonBlock,
  DividerBlock,
  EmailBlock,
  HeadingBlock,
  ImageBlock,
  LinkBlock,
  RowBlock,
  SurveyBlock,
  TextBlock,
} from '@/app/components/email-workspace/types'
import { Company } from '@/lib/database/types'
import type { Button, Heading, Hr, Img, Link, Section, Text } from '@react-email/components'
import { getImgFromKey } from '../../misc'
import { applyCommonAttributes, applyCommonClassName } from '../common'
import {
  getAdditionalButtonStyles,
  getAdditionalDividerStyles,
  getAdditionalHeadingStyles,
  getAdditionalImageStyles,
  getAdditionalLinkStyles,
  getAdditionalSurveyStyles,
  getAdditionalTextStyles,
} from '../defaults/blocks'

type OmitChildren<T> = Omit<T, 'children' | 'ref' | 'onToggle'>

export function generateTextProps(
  block: TextBlock,
  parentRow: RowBlock,
  mobileView = false
): OmitChildren<React.ComponentProps<typeof Text>> {
  return {
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalTextStyles(block, parentRow),
    },
    className: applyCommonClassName(block.attributes, mobileView),
  }
}

export function generateHeadingProps(
  block: HeadingBlock,
  parentRow: RowBlock,
  mobileView = false
): OmitChildren<React.ComponentProps<typeof Heading>> {
  return {
    as: block.attributes.as,
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalHeadingStyles(block, parentRow),
      marginBlockStart: 0,
      marginBlockEnd: 0,
    },
    className: applyCommonClassName(block.attributes, mobileView),
  }
}

export function generateImageProps(
  block: ImageBlock,
  parentRow: RowBlock,
  company: Company | null
): OmitChildren<React.ComponentProps<typeof Img>> {
  const src =
    block.attributes.src === 'logo'
      ? company?.logo_image_key
        ? getImgFromKey(company.logo_image_key)
        : getImgFromKey('dummy-logo.png')
      : block.attributes.src

  return {
    src,
    alt: block.attributes.alt,
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalImageStyles(block, parentRow),
    },
  }
}

export function generateButtonProps(
  block: ButtonBlock,
  parentRow: RowBlock,
  company: Company | null,
  mobileView = false
): OmitChildren<React.ComponentProps<typeof Button>> {
  const style = {
    ...applyCommonAttributes(block.attributes),
    ...getAdditionalButtonStyles(block, parentRow, company),
  }

  return {
    href: block.attributes.href,
    target: block.attributes.target,
    rel: block.attributes.rel,
    style,
    className: applyCommonClassName(block.attributes, mobileView),
  }
}

export function generateLinkProps(
  block: LinkBlock,
  parentRow: RowBlock,
  mobileView = false,
  defaultLinkColor?: string
): OmitChildren<React.ComponentProps<typeof Link>> {
  return {
    href: block.attributes.href,
    target: block.attributes.target,
    rel: block.attributes.rel,
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalLinkStyles(block, parentRow),
    },
    className: applyCommonClassName(block.attributes, mobileView),
  }
}

export function generateDividerProps(
  block: DividerBlock,
  parentRow: RowBlock,
  mobileView = false
): OmitChildren<React.ComponentProps<typeof Hr>> {
  return {
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalDividerStyles(block, parentRow),
    },
    className: applyCommonClassName(block.attributes, mobileView),
  }
}

export function generateSurveyProps(
  block: SurveyBlock,
  parentRow: RowBlock,
  mobileView = false
): OmitChildren<React.ComponentProps<typeof Section>> {
  return {
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalSurveyStyles(block, parentRow),
    },
    className: applyCommonClassName(block.attributes, mobileView),
  }
}

export function getBlockAttributes<T extends EmailBlock>(
  block: T,
  parentRow: RowBlock,
  mobileView = false,
  company: Company | null,
  defaultLinkColor?: string
): T extends TextBlock
  ? ReturnType<typeof generateTextProps>
  : T extends HeadingBlock
    ? ReturnType<typeof generateHeadingProps>
    : T extends ImageBlock
      ? ReturnType<typeof generateImageProps>
      : T extends ButtonBlock
        ? ReturnType<typeof generateButtonProps>
        : T extends LinkBlock
          ? ReturnType<typeof generateLinkProps>
          : T extends DividerBlock
            ? ReturnType<typeof generateDividerProps>
            : T extends SurveyBlock
              ? ReturnType<typeof generateSurveyProps>
              : never {
  switch (block.type) {
    case 'text':
      return generateTextProps(block as TextBlock, parentRow, mobileView) as any
    case 'heading':
      return generateHeadingProps(block as HeadingBlock, parentRow, mobileView) as any
    case 'image':
      return generateImageProps(block as ImageBlock, parentRow, company) as any
    case 'button':
      return generateButtonProps(block as ButtonBlock, parentRow, company, mobileView) as any
    case 'link':
      return generateLinkProps(block as LinkBlock, parentRow, mobileView, defaultLinkColor) as any
    case 'divider':
      return generateDividerProps(block as DividerBlock, parentRow, mobileView) as any
    case 'survey':
      return generateSurveyProps(block as SurveyBlock, parentRow, mobileView) as any
    default:
      return {} as never
  }
}
