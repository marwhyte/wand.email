import type { ColumnBlock, Email, EmailStyleVariant, RowBlock } from '@/app/components/email-workspace/types'
import type { Body, Column, Container, Row } from '@react-email/components'
import { applyPaddingAttributes } from '../common'
import {
  getAdditionalColumnStyles,
  getAdditionalContentStyles,
  getAdditionalEmailStyles,
  getAdditionalRowStyles,
  getTypeDefaults,
} from '../defaults'

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

export function generateRowProps(row: RowBlock, email: Email | null): OmitChildren<React.ComponentProps<typeof Row>> {
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

export function generateContainerProps(
  row: RowBlock,
  email: Email
): OmitChildren<React.ComponentProps<typeof Container>> {
  const rowAttributes = getRowAttributes(row, email)
  const emailAttributes = getEmailAttributes(email)
  return {
    className: rowAttributes.hideOnMobile ? 'mobile_hide' : 'row-content',
    style: {},
    width: emailAttributes.width,
  }
}

export function generateColumnProps(
  column: ColumnBlock,
  row: RowBlock,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Column>> {
  // Get column-specific defaults based on row type
  const defaultColumnAttributes: Partial<ColumnBlock['attributes']> = {
    width: '100%',
    wordBreak: 'break-word',
    verticalAlign: 'top',
  }

  const mergedAttributes = { ...defaultColumnAttributes, ...column.attributes }

  return {
    style: {
      ...getAdditionalColumnStyles(mergedAttributes, row),
    },
    className: 'column',
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

export function generateBodyProps(email: Email): OmitChildren<React.ComponentProps<typeof Body>> {
  const emailAttributes = getEmailAttributes(email)

  return {
    style: {
      ...getAdditionalEmailStyles(emailAttributes),
    },
  }
}

export function generateContentProps(email: Email): OmitChildren<React.ComponentProps<typeof Container>> {
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

  if (emailAttributes.styleVariant === 'floating') {
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
