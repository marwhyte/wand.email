import type {
  ButtonBlock,
  ColumnBlock,
  DividerBlock,
  Email,
  EmailBlock,
  HeadingBlock,
  ImageBlock,
  LinkBlock,
  ListBlock,
  RowBlock,
  SocialsBlock,
  SpacerBlock,
  SurveyBlock,
  TableBlock,
  TextBlock,
} from '@/app/components/email-workspace/types'
import { Table } from '@/app/components/table'
import { Company } from '@/lib/database/types'
import type {
  Body,
  Button,
  Column,
  Container,
  Heading,
  Hr,
  Img,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { getImgSrc } from '../misc'
import { getBlockAttributes, getEmailAttributes, getRowAttributes } from './attributes'
import { applyPaddingAttributes, applyTextAttributes } from './common'
import {
  getAdditionalButtonStyles,
  getAdditionalDividerStyles,
  getAdditionalHeadingStyles,
  getAdditionalImageStyles,
  getAdditionalLinkStyles,
  getAdditionalListStyles,
  getAdditionalSocialsStyles,
  getAdditionalSurveyStyles,
  getAdditionalTableStyles,
  getAdditionalTextStyles,
} from './defaults/blocks'
import {
  getAdditionalColumnStyles,
  getAdditionalContentStyles,
  getAdditionalEmailStyles,
  getAdditionalRowStyles,
} from './defaults/layout'

export type OmitChildren<T> = Omit<T, 'children' | 'ref' | 'onToggle'>

// BLOCK SPECIFIC PROPS

export function getButtonProps(
  block: ButtonBlock,
  parentRow: RowBlock,
  company: Company | null,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Button>> {
  const buttonAttributes = getBlockAttributes(block, parentRow, email)
  const style = {
    ...applyPaddingAttributes(buttonAttributes),
    ...applyTextAttributes(buttonAttributes),
    ...getAdditionalButtonStyles(block, parentRow, email, company),
  }

  return {
    href: buttonAttributes.href,
    style,
  }
}

export function getHeadingProps(
  block: HeadingBlock,
  parentRow: RowBlock,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Heading>> {
  const headingAttributes = getBlockAttributes(block, parentRow, email)
  return {
    as: headingAttributes.level,
    style: {
      ...applyPaddingAttributes(headingAttributes),
      ...applyTextAttributes(headingAttributes),
      ...getAdditionalHeadingStyles(block, parentRow, email),
      marginBlockStart: 0,
      marginBlockEnd: 0,
    },
  }
}

export function getDividerProps(
  block: DividerBlock,
  parentRow: RowBlock,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Hr>> {
  const dividerAttributes = getBlockAttributes(block, parentRow, email)
  return {
    style: {
      ...getAdditionalDividerStyles(block, parentRow, email),
    },
  }
}

export function getImageProps(
  block: ImageBlock,
  parentRow: RowBlock,
  email: Email | null,
  company: Company | null
): OmitChildren<React.ComponentProps<typeof Img>> {
  const imageAttributes = getBlockAttributes(block, parentRow, email)
  const src = getImgSrc(imageAttributes.src, company)

  const final = {
    src,
    alt: imageAttributes.alt,
    style: {
      ...applyPaddingAttributes(imageAttributes),
      ...getAdditionalImageStyles(block, parentRow, email, company),
    },
  }

  return final
}
export function getLinkProps(
  block: LinkBlock,
  parentRow: RowBlock,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Link>> {
  const linkAttributes = getBlockAttributes(block, parentRow, email)
  const mergedAttributes: React.ComponentProps<typeof Link>['style'] = {
    ...applyPaddingAttributes(linkAttributes),
    ...applyTextAttributes(linkAttributes),
    ...getAdditionalLinkStyles(block, parentRow, email),
  }

  if (email && !mergedAttributes.color) {
    const emailAttributes = getEmailAttributes(email)
    mergedAttributes.color = emailAttributes.linkColor
  }

  return {
    href: linkAttributes.href,
    style: mergedAttributes,
  }
}

export function getListProps(
  block: ListBlock,
  parentRow: RowBlock,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Section>> {
  const listAttributes = getBlockAttributes(block, parentRow, email)
  return {
    style: {
      ...applyPaddingAttributes(listAttributes),
      ...getAdditionalListStyles(block, parentRow, email),
    },
  }
}

export function getSocialsProps(
  block: SocialsBlock,
  parentRow: RowBlock,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Section>> {
  const socialsAttributes = getBlockAttributes(block, parentRow, email)
  return {
    style: {
      ...applyPaddingAttributes(socialsAttributes),
      ...getAdditionalSocialsStyles(block, parentRow, email),
    },
  }
}

export function getSurveyProps(
  block: SurveyBlock,
  parentRow: RowBlock,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Section>> {
  const surveyAttributes = getBlockAttributes(block, parentRow, email)
  return {
    style: {
      ...applyPaddingAttributes(surveyAttributes),
      ...getAdditionalSurveyStyles(block, parentRow, email),
    },
  }
}

export function getTableProps(
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

export function getTextProps(
  block: TextBlock,
  parentRow: RowBlock,
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

export function getSpacerProps(
  block: SpacerBlock,
  parentRow: RowBlock,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Section>> {
  const spacerAttributes = getBlockAttributes(block, parentRow, email)
  return {
    style: {
      height: `${spacerAttributes.height}px`,
      fontSize: '1px',
      lineHeight: `${spacerAttributes.height}px`,
      // @ts-ignore - MSO property for Outlook compatibility
      msoLineHeightRule: 'exactly',
    },
  }
}

export function getBlockProps<T extends EmailBlock>(
  block: T,
  parentRow: RowBlock,
  company: Company | null,
  email: Email | null
): T extends TextBlock
  ? ReturnType<typeof getTextProps>
  : T extends HeadingBlock
    ? ReturnType<typeof getHeadingProps>
    : T extends ImageBlock
      ? ReturnType<typeof getImageProps>
      : T extends ButtonBlock
        ? ReturnType<typeof getButtonProps>
        : T extends LinkBlock
          ? ReturnType<typeof getLinkProps>
          : T extends DividerBlock
            ? ReturnType<typeof getDividerProps>
            : T extends ListBlock
              ? ReturnType<typeof getListProps>
              : T extends SurveyBlock
                ? ReturnType<typeof getSurveyProps>
                : T extends SocialsBlock
                  ? ReturnType<typeof getSocialsProps>
                  : T extends SpacerBlock
                    ? ReturnType<typeof getSpacerProps>
                    : never {
  switch (block.type) {
    case 'text':
      return getTextProps(block as TextBlock, parentRow, email) as any
    case 'heading':
      return getHeadingProps(block as HeadingBlock, parentRow, email) as any
    case 'image':
      return getImageProps(block as ImageBlock, parentRow, email, company) as any
    case 'button':
      return getButtonProps(block as ButtonBlock, parentRow, company, email) as any
    case 'link':
      return getLinkProps(block as LinkBlock, parentRow, email) as any
    case 'divider':
      return getDividerProps(block as DividerBlock, parentRow, email) as any
    case 'survey':
      return getSurveyProps(block as SurveyBlock, parentRow, email) as any
    case 'socials':
      return getSocialsProps(block as SocialsBlock, parentRow, email) as any
    case 'table':
      return getTableProps(block as TableBlock, parentRow, email) as any
    case 'list':
      return getListProps(block as ListBlock, parentRow, email) as any
    case 'spacer':
      return getSpacerProps(block as SpacerBlock, parentRow, email) as any
    default:
      return {} as never
  }
}

// LAYOUT PROPS

export function getRowProps(row: RowBlock, email: Email | null): OmitChildren<React.ComponentProps<typeof Row>> {
  const mergedAttributes = getRowAttributes(row, email)
  const emailAttributes = getEmailAttributes(email)

  const width = emailAttributes.width ? `${emailAttributes.width}px` : '100%'

  return {
    className: `row-content${mergedAttributes.stackOnMobile ? ' stack' : ''}${
      mergedAttributes.hideOnMobile ? ' mobile_hide' : ''
    }`,
    style: {
      ...applyPaddingAttributes(mergedAttributes),
      ...getAdditionalRowStyles(mergedAttributes),
      width,
      maxWidth: width,
    },
    align: 'center',
    bgcolor: mergedAttributes.backgroundColor ?? '#ffffff',
    width,
  }
}

export function getContainerProps(row: RowBlock, email: Email): OmitChildren<React.ComponentProps<typeof Container>> {
  const rowAttributes = getRowAttributes(row, email)
  const emailAttributes = getEmailAttributes(email)
  return {
    className: rowAttributes.hideOnMobile ? 'mobile_hide' : 'row-content',
    style: {},
    width: emailAttributes.width,
  }
}

export function getColumnProps(
  column: ColumnBlock,
  row: RowBlock,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Column>> {
  // Get column-specific defaults based on row type
  const defaultColumnAttributes: Partial<ColumnBlock['attributes']> = {}

  const mergedAttributes = { ...defaultColumnAttributes, ...column.attributes }

  return {
    style: {
      ...getAdditionalColumnStyles(mergedAttributes, row),
    },
    className: 'column',
  }
}

export function getBodyProps(email: Email): OmitChildren<React.ComponentProps<typeof Body>> {
  const emailAttributes = getEmailAttributes(email)

  return {
    style: {
      ...getAdditionalEmailStyles(emailAttributes),
    },
  }
}

export function getContentProps(email: Email): OmitChildren<React.ComponentProps<typeof Container>> {
  const emailAttributes = getEmailAttributes(email)
  const defaultStyles: React.CSSProperties = {
    color: '#000000',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '100%',
    width: '100%',
    margin: '0 auto',
    // @ts-ignore - MSO properties for Outlook compatibility
    msoTableLspace: '0pts',
    // @ts-ignore - MSO properties for Outlook compatibility
    msoTableRspace: '0pts',
  }

  if (emailAttributes.styleVariant === 'outline') {
    defaultStyles.paddingTop = '20px'
  }

  if (emailAttributes.styleVariant === 'default') {
    defaultStyles.paddingTop = '20px'
  }

  return {
    width: '100%',
    border: 0,
    cellPadding: '0',
    cellSpacing: '0',
    role: 'presentation',
    style: {
      ...defaultStyles,
      ...getAdditionalContentStyles(emailAttributes),
    },
  }
}
