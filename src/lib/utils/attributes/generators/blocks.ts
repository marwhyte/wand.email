import type {
  ButtonBlock,
  DividerBlock,
  Email,
  EmailBlock,
  HeadingBlock,
  ImageBlock,
  LinkBlock,
  RowBlock,
  SocialsBlock,
  SurveyBlock,
  TableBlock,
  TextBlock,
} from '@/app/components/email-workspace/types'
import { Table } from '@/app/components/table'
import { Company } from '@/lib/database/types'
import type { Button, Heading, Hr, Img, Link, Section, Text } from '@react-email/components'
import { getImgSrc } from '../../misc'
import { applyPaddingAttributes, applyTextAttributes } from '../common'
import {
  getAdditionalButtonStyles,
  getAdditionalDividerStyles,
  getAdditionalHeadingStyles,
  getAdditionalImageStyles,
  getAdditionalLinkStyles,
  getAdditionalSocialsStyles,
  getAdditionalSurveyStyles,
  getAdditionalTableStyles,
  getAdditionalTextStyles,
} from '../defaults/blocks'
import { getEmailAttributes } from './layout'

export type OmitChildren<T> = Omit<T, 'children' | 'ref' | 'onToggle'>

export function generateTextProps(
  block: TextBlock,
  parentRow: RowBlock,
  mobileView = false,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Text>> {
  return {
    style: {
      ...applyPaddingAttributes(block.attributes),
      ...applyTextAttributes(block.attributes),
      ...getAdditionalTextStyles(block, parentRow, email),
    },
  }
}

export function generateHeadingProps(
  block: HeadingBlock,
  parentRow: RowBlock,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Heading>> {
  return {
    as: block.attributes.level,
    style: {
      ...applyPaddingAttributes(block.attributes),
      ...applyTextAttributes(block.attributes),
      ...getAdditionalHeadingStyles(block, parentRow, email),
      marginBlockStart: 0,
      marginBlockEnd: 0,
    },
  }
}

export function generateImageProps(
  block: ImageBlock,
  parentRow: RowBlock,
  email: Email | null,
  company: Company | null
): OmitChildren<React.ComponentProps<typeof Img>> {
  const src = getImgSrc(block.attributes.src, company)
  const final = {
    align: block.attributes.align ?? 'center',
    src,
    alt: block.attributes.alt,
    style: {
      ...applyPaddingAttributes(block.attributes),
      ...getAdditionalImageStyles(block, parentRow, email, company),
    },
  }

  return final
}

export function generateButtonProps(
  block: ButtonBlock,
  parentRow: RowBlock,
  company: Company | null,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Button>> {
  const style = {
    ...applyPaddingAttributes(block.attributes),
    ...applyTextAttributes(block.attributes),
    ...getAdditionalButtonStyles(block, parentRow, email, company),
  }

  return {
    // @ts-expect-error
    align: block.attributes.align ?? 'center',
    href: block.attributes.href,
    style,
  }
}

export function generateLinkProps(
  block: LinkBlock,
  parentRow: RowBlock,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Link>> {
  const mergedAttributes: React.ComponentProps<typeof Link>['style'] = {
    ...applyPaddingAttributes(block.attributes),
    ...applyTextAttributes(block.attributes),
    ...getAdditionalLinkStyles(block, parentRow, email),
  }

  if (email && !mergedAttributes.color) {
    const emailAttributes = getEmailAttributes(email)
    mergedAttributes.color = emailAttributes.linkColor
  }

  return {
    // @ts-expect-error
    align: block.attributes.align ?? 'center',
    href: block.attributes.href,
    style: mergedAttributes,
  }
}

export function generateDividerProps(
  block: DividerBlock,
  parentRow: RowBlock,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Hr>> {
  return {
    style: {
      ...getAdditionalDividerStyles(block, parentRow, email),
    },
  }
}

export function generateSocialsProps(
  block: SocialsBlock,
  parentRow: RowBlock,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Section>> {
  return {
    align: block.attributes.align ?? 'center',
    style: {
      ...applyPaddingAttributes(block.attributes),
      ...getAdditionalSocialsStyles(block, parentRow, email),
    },
  }
}

export function generateSurveyProps(
  block: SurveyBlock,
  parentRow: RowBlock,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Section>> {
  return {
    color: block.attributes.color ?? '#4F46E5',
    style: {
      ...applyPaddingAttributes(block.attributes),
      ...getAdditionalSurveyStyles(block, parentRow, email),
    },
  }
}

export function generateTableProps(
  block: TableBlock,
  parentRow: RowBlock,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Table>> {
  return {
    style: {
      ...applyPaddingAttributes(block.attributes),
      ...getAdditionalTableStyles(block, parentRow, email),
    },
  }
}

export function getBlockAttributes<T extends EmailBlock>(
  block: T,
  parentRow: RowBlock,
  mobileView = false,
  company: Company | null,
  email: Email | null
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
              : T extends SocialsBlock
                ? ReturnType<typeof generateSocialsProps>
                : never {
  switch (block.type) {
    case 'text':
      return generateTextProps(block as TextBlock, parentRow, mobileView, email) as any
    case 'heading':
      return generateHeadingProps(block as HeadingBlock, parentRow, email) as any
    case 'image':
      return generateImageProps(block as ImageBlock, parentRow, email, company) as any
    case 'button':
      return generateButtonProps(block as ButtonBlock, parentRow, company, email) as any
    case 'link':
      return generateLinkProps(block as LinkBlock, parentRow, email) as any
    case 'divider':
      return generateDividerProps(block as DividerBlock, parentRow, email) as any
    case 'survey':
      return generateSurveyProps(block as SurveyBlock, parentRow, email) as any
    case 'socials':
      return generateSocialsProps(block as SocialsBlock, parentRow, email) as any
    case 'table':
      return generateTableProps(block as TableBlock, parentRow, email) as any
    default:
      return {} as never
  }
}
