import type {
  ButtonBlock,
  ButtonBlockAttributes,
  ColumnBlock,
  DividerBlock,
  DividerBlockAttributes,
  Email,
  EmailBlock,
  EmailStyleVariant,
  EmailType,
  HeadingBlock,
  HeadingBlockAttributes,
  IconBlock,
  IconBlockAttributes,
  ImageBlock,
  ImageBlockAttributes,
  LinkBlock,
  LinkBlockAttributes,
  ListBlock,
  ListBlockAttributes,
  RowBlock,
  SocialsBlock,
  SocialsBlockAttributes,
  SpacerBlock,
  SpacerBlockAttributes,
  SurveyBlock,
  SurveyBlockAttributes,
  TableBlock,
  TableBlockAttributes,
  TextBlock,
  TextBlockAttributes,
} from '@/app/components/email-workspace/types'
import { BorderRadius, Company } from '@/lib/database/types'
import { getThemeColors } from '@/lib/utils/colors'
import { getTypeDefaults } from './defaults'
import { getBlockDefaultAttributes, getColumnDefaultAttributes } from './defaults/rowTypeBlocks'

// LAYOUT ATTRIBUTES
export const getRowAttributes = (row: RowBlock, email: Email | null): Partial<RowBlock['attributes']> => {
  const baseRowDefaults: Partial<RowBlock['attributes']> = {
    paddingTop: '32px',
    paddingBottom: '32px',
    paddingLeft: '24px',
    paddingRight: '24px',
    borderSide: 'all',
    verticalAlign: 'top',
    stackOnMobile: true,
    columnSpacing: 12,
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

export const getColumnAttributes = (
  column: ColumnBlock,
  parentRow: RowBlock,
  columnIndex: number,
  email: Email | null
): Partial<ColumnBlock['attributes']> => {
  // Get default attributes based on row type and column position
  const defaults = getColumnDefaultAttributes(columnIndex, parentRow, email)

  // Merge with explicit attributes, giving priority to explicit attributes
  return {
    ...defaults,
    ...column.attributes,
  }
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
  themeColor: string
  borderRadius: BorderRadius
}

export function getEmailAttributes(email: Email | null): EmailAttributes {
  const themeColor = email?.themeColor ?? '#8e6ff7' // Default to purple
  const themeColors = getThemeColors(themeColor)

  const defaultAttributes: EmailAttributes = {
    backgroundColor: '#F9FAFB',
    color: '#111827',
    fontFamily: 'Arial, Helvetica, Arial, sans-serif',
    linkColor: themeColors.action,
    rowBackgroundColor: themeColors.base,
    width: email?.type === 'transactional' ? '500' : '600',
    styleVariant: email?.styleVariant ?? 'default',
    type: email?.type ?? 'default',
    themeColor: themeColor,
    borderRadius: email?.borderRadius ?? 'default',
  }

  if (defaultAttributes?.styleVariant === 'clear') {
    defaultAttributes.backgroundColor = themeColors.base
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
    ...defaults,
    ...block.attributes,
    color: block.attributes.color ?? defaults.color ?? '#4F46E5',
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

export function getListAttributes(block: ListBlock, parentRow: RowBlock, email: Email | null): ListBlockAttributes {
  const defaults = getBlockDefaultAttributes(block, email, parentRow)
  return {
    ...defaults,
    ...block.attributes,
    type: block.attributes.type ?? defaults.type ?? 'ul',
    items: block.attributes.items ?? defaults.items ?? [],
  }
}

export function getSpacerAttributes(
  block: SpacerBlock,
  parentRow: RowBlock,
  email: Email | null
): SpacerBlockAttributes {
  const defaults = getBlockDefaultAttributes(block, email, parentRow)
  return {
    ...defaults,
    ...block.attributes,
  }
}

export function getIconAttributes(block: IconBlock, parentRow: RowBlock, email: Email | null): IconBlockAttributes {
  const baseDefaults: IconBlockAttributes = {
    icon: 'check',
    size: '56',
    position: 'left',
    align: 'center',
  }
  const defaults = getBlockDefaultAttributes(block, email, parentRow)
  return {
    ...baseDefaults,
    ...defaults,
    ...block.attributes,
  }
}

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
    case 'list':
      return getListAttributes(block, parentRow, email)
    case 'spacer':
      return getSpacerAttributes(block, parentRow, email)
    case 'icon':
      return getIconAttributes(block, parentRow, email)
    default:
      return {} as never
  }
}
