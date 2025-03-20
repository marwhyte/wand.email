import type {
  ButtonBlock,
  ButtonBlockAttributes,
  DividerBlock,
  DividerBlockAttributes,
  Email,
  EmailBlock,
  EmailStyleVariant,
  EmailType,
  HeadingBlock,
  HeadingBlockAttributes,
  ImageBlock,
  ImageBlockAttributes,
  LinkBlock,
  LinkBlockAttributes,
  RowBlock,
  SocialsBlock,
  SocialsBlockAttributes,
  SurveyBlock,
  SurveyBlockAttributes,
  TableBlock,
  TableBlockAttributes,
  TextBlock,
  TextBlockAttributes,
} from '@/app/components/email-workspace/types'
import { Company } from '@/lib/database/types'
import { getTypeDefaults } from './defaults'
import { getBlockDefaultAttributes } from './defaults/rowTypeBlocks'

// LAYOUT ATTRIBUTES
export const getRowAttributes = (row: RowBlock, email: Email | null): Partial<RowBlock['attributes']> => {
  const baseRowDefaults: Partial<RowBlock['attributes']> = {
    paddingLeft: '16px',
    paddingRight: '16px',
    stackOnMobile: true,
    columnSpacing: 12,
  }

  if (email?.styleVariant === 'outline' && row.attributes.type !== 'header' && row.attributes.type !== 'footer') {
    baseRowDefaults.borderWidth = '1px'
    baseRowDefaults.borderColor = '#dadce0'
    baseRowDefaults.borderStyle = 'solid'
    baseRowDefaults.borderRadius = '8px'
    baseRowDefaults.paddingBottom = '12px'
  }

  const defaultAttributes = {
    ...baseRowDefaults,
    ...getTypeDefaults(row, email),
  }

  const mergedAttributes = { ...defaultAttributes, ...row.attributes }

  if (email && !mergedAttributes.backgroundColor) {
    const emailAttributes = getEmailAttributes(email)
    mergedAttributes.backgroundColor = emailAttributes.rowBackgroundColor ?? '#ffffff'
  }

  return mergedAttributes
}

type EmailAttributes = {
  backgroundColor: string
  color: string
  fontFamily: string
  linkColor: string
  rowBackgroundColor: string
  width: string
  styleVariant: EmailStyleVariant
  type: EmailType
}

export function getEmailAttributes(email: Email | null): EmailAttributes {
  const defaultAttributes: EmailAttributes = {
    backgroundColor: '#f4f4f4',
    color: '#000000',
    fontFamily: 'Arial, sans-serif',
    linkColor: '#3b82f6',
    rowBackgroundColor: '#FFFFFF',
    width: '600',
    styleVariant: 'floating',
    type: 'default',
  }

  if (email?.styleVariant === 'outline') {
    defaultAttributes.backgroundColor = '#ffffff'
    defaultAttributes.color = '#2d2d2d'
    defaultAttributes.fontFamily = 'Open Sans, Roboto, Helvetica, Arial, sans-serif'
  }

  if (email?.styleVariant === 'default') {
    defaultAttributes.backgroundColor = '#ffffff'
  }

  if (email?.styleVariant === 'floating') {
    defaultAttributes.backgroundColor = '#f4f4f4'
  }

  return {
    ...defaultAttributes,
    ...(email && Object.fromEntries(Object.entries(email).filter(([_, value]) => value !== undefined))),
  }
}

// BLOCK ATTRIBUTES

export function getTextAttributes(block: TextBlock, parentRow: RowBlock, email: Email | null): TextBlockAttributes {
  const defaults = getBlockDefaultAttributes(block, email, parentRow)
  return {
    ...defaults,
    ...block.attributes,
  }
}

export function getHeadingAttributes(
  block: HeadingBlock,
  parentRow: RowBlock,
  email: Email | null
): HeadingBlockAttributes {
  const defaults = getBlockDefaultAttributes(block, email, parentRow)
  return {
    ...defaults,
    ...block.attributes,
  }
}

export function getImageAttributes(
  block: ImageBlock,
  parentRow: RowBlock,
  email: Email | null,
  company: Company | null
): ImageBlockAttributes {
  const defaults = getBlockDefaultAttributes(block, email, parentRow, company)
  return {
    ...defaults,
    ...block.attributes,
    align: block.attributes.align ?? defaults.align ?? 'center',
  }
}

export function getButtonAttributes(
  block: ButtonBlock,
  parentRow: RowBlock,
  email: Email | null,
  company: Company | null
): ButtonBlockAttributes {
  const defaults = getBlockDefaultAttributes(block, email, parentRow, company)
  return {
    ...defaults,
    ...block.attributes,
    align: block.attributes.align ?? defaults.align ?? 'center',
  }
}

export function getLinkAttributes(block: LinkBlock, parentRow: RowBlock, email: Email | null): LinkBlockAttributes {
  const defaults = getBlockDefaultAttributes(block, email, parentRow)
  return {
    ...defaults,
    ...block.attributes,
    align: block.attributes.align ?? defaults.align ?? 'center',
  }
}

export function getDividerAttributes(
  block: DividerBlock,
  parentRow: RowBlock,
  email: Email | null
): DividerBlockAttributes {
  const defaults = getBlockDefaultAttributes(block, email, parentRow)
  return {
    ...defaults,
    ...block.attributes,
  }
}

export function getSurveyAttributes(
  block: SurveyBlock,
  parentRow: RowBlock,
  email: Email | null
): SurveyBlockAttributes {
  const defaults = getBlockDefaultAttributes(block, email, parentRow)
  return {
    color: '#4F46E5',
    ...defaults,
    ...block.attributes,
  }
}

export function getSocialsAttributes(
  block: SocialsBlock,
  parentRow: RowBlock,
  email: Email | null
): SocialsBlockAttributes {
  const defaults = getBlockDefaultAttributes(block, email, parentRow)

  return {
    ...defaults,
    ...block.attributes,
    align: block.attributes.align ?? defaults.align ?? 'center',
  }
}

export function getTableAttributes(block: TableBlock, parentRow: RowBlock, email: Email | null): TableBlockAttributes {
  const defaults = getBlockDefaultAttributes(block, email, parentRow)
  return {
    ...defaults,
    ...block.attributes,
  }
}

// Main function to get any block's attributes with proper type inference
export function getBlockAttributes<T extends EmailBlock>(
  block: T,
  parentRow: RowBlock,
  email: Email | null,
  company: Company | null = null
): T['attributes'] {
  switch (block.type) {
    case 'text':
      return getTextAttributes(block, parentRow, email)
    case 'heading':
      return getHeadingAttributes(block, parentRow, email)
    case 'image':
      return getImageAttributes(block, parentRow, email, company)
    case 'button':
      return getButtonAttributes(block, parentRow, email, company)
    case 'link':
      return getLinkAttributes(block, parentRow, email)
    case 'divider':
      return getDividerAttributes(block, parentRow, email)
    case 'survey':
      return getSurveyAttributes(block, parentRow, email)
    case 'socials':
      return getSocialsAttributes(block, parentRow, email)
    case 'table':
      return getTableAttributes(block, parentRow, email)
    default:
      return {} as never
  }
}
