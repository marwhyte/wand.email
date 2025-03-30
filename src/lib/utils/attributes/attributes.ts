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
import { Company } from '@/lib/database/types'
import { getTypeDefaults } from './defaults'
import { getBlockDefaultAttributes } from './defaults/rowTypeBlocks'

// LAYOUT ATTRIBUTES
export const getRowAttributes = (row: RowBlock, email: Email | null): Partial<RowBlock['attributes']> => {
  const baseRowDefaults: Partial<RowBlock['attributes']> = {
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingBottom: '16px',
    paddingTop: '16px',
    borderSide: 'all',
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
    width: email?.type === 'transactional' ? '500' : '600',
    styleVariant: email?.styleVariant ?? 'default',
    type: email?.type ?? 'default',
  }

  if (defaultAttributes?.styleVariant === 'outline') {
    defaultAttributes.backgroundColor = '#ffffff'
    defaultAttributes.color = '#2d2d2d'
    defaultAttributes.fontFamily = 'Open Sans, Helvetica, Arial, sans-serif'
  }

  if (defaultAttributes?.styleVariant === 'clear') {
    defaultAttributes.backgroundColor = '#ffffff'
  }

  if (defaultAttributes.styleVariant === 'clear' && defaultAttributes.type === 'ecommerce') {
    defaultAttributes.fontFamily = 'Helvetica, Arial, sans-serif'
  } else if (defaultAttributes.styleVariant === 'clear') {
    defaultAttributes.fontFamily = 'Helvetica, Arial, sans-serif'
  }

  if (defaultAttributes?.type === 'welcome-series') {
    defaultAttributes.fontFamily = 'Helvetica, Arial, sans-serif'
  }

  if (defaultAttributes?.type === 'cart') {
    defaultAttributes.fontFamily = '"Trebuchet MS", Trebuchet, Arial, sans-serif'
  }

  if (defaultAttributes?.styleVariant === 'default') {
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
    ...(block.attributes.type === 'icon'
      ? {
          icons: Array.isArray(block.attributes.icons)
            ? block.attributes.icons.length > 0
              ? block.attributes.icons
              : Array(block.attributes.items?.length || defaults.items?.length || 0).fill('check')
            : Array(block.attributes.items?.length || defaults.items?.length || 0).fill('check'),
        }
      : {}),
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
    default:
      return {} as never
  }
}
