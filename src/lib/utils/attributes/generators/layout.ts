import type { Email, EmailStyleVariant, EmailType, RowBlock } from '@/app/components/email-workspace/types'
import { getTypeDefaults } from '../defaults'

type OmitChildren<T> = Omit<T, 'children' | 'ref' | 'onToggle'>

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
