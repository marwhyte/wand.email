import type { ColumnBlock, Email, RowBlock, RowBlockAttributes } from '@/app/components/email-workspace/types'
import type { Body, Column, Container, Row } from '@react-email/components'
import { ensurePx } from '../../misc'
import { applyPaddingAttributes } from '../common'
import { getRowTypeBlockDefaults } from '../defaults/rowTypeBlocks'
import { getTypeDefaults } from '../defaults/rowTypes'
import { variantDefaults } from '../defaults/variants'

type OmitChildren<T> = Omit<T, 'children' | 'ref' | 'onToggle'>

export function getDefaultRowAttributes(row: RowBlock): Partial<RowBlock['attributes']> {
  const baseRowDefaults: Partial<RowBlock['attributes']> = {
    paddingLeft: '16px',
    paddingRight: '16px',
    stackOnMobile: true,
    columnSpacing: 12,
  }

  return {
    ...baseRowDefaults,
    ...(row.attributes.variant ? variantDefaults[row.attributes.variant] : {}),
    ...(row.attributes.type ? getTypeDefaults(row) : {}),
  }
}

export const getRowAttributes = (row: RowBlock, email: Email | null): Partial<RowBlock['attributes']> => {
  const defaultAttributes = getDefaultRowAttributes(row)
  const mergedAttributes = { ...defaultAttributes, ...row.attributes }

  if (email && !mergedAttributes.backgroundColor) {
    mergedAttributes.backgroundColor = email.rowBgColor ?? '#ffffff'
  }

  return mergedAttributes
}

export function generateContainerProps(
  row: RowBlock,
  email: Email
): OmitChildren<React.ComponentProps<typeof Container>> {
  const rowAttributes = getRowAttributes(row, email)

  return {
    className: rowAttributes.hideOnMobile ? 'mobile_hide' : 'row-content',
    style: {},
    width: email.width,
  }
}

export function generateRowProps(row: RowBlock, email: Email | null): OmitChildren<React.ComponentProps<typeof Row>> {
  const mergedAttributes = getRowAttributes(row, email)

  const borderStyles =
    mergedAttributes.borderWidth && mergedAttributes.borderColor
      ? {
          borderLeft: `${ensurePx(mergedAttributes.borderWidth)} ${mergedAttributes.borderStyle || 'solid'} ${mergedAttributes.borderColor}`,
          borderRight: `${ensurePx(mergedAttributes.borderWidth)} ${mergedAttributes.borderStyle || 'solid'} ${mergedAttributes.borderColor}`,
          borderTop: `${ensurePx(mergedAttributes.borderWidth)} ${mergedAttributes.borderStyle || 'solid'} ${mergedAttributes.borderColor}`,
          borderBottom: `${ensurePx(mergedAttributes.borderWidth)} ${mergedAttributes.borderStyle || 'solid'} ${mergedAttributes.borderColor}`,
        }
      : {}

  return {
    className: `row-content${mergedAttributes.stackOnMobile ? ' stack' : ''}${
      mergedAttributes.hideOnMobile ? ' mobile_hide' : ''
    }`,
    style: {
      ...applyPaddingAttributes(mergedAttributes),
      ...getAdditionalRowStyles(mergedAttributes),
      ...borderStyles,
    },
    bgcolor: mergedAttributes.backgroundColor ?? 'transparent',
  }
}

export function generateColumnProps(
  column: ColumnBlock,
  row: RowBlock,
  email: Email | null
): OmitChildren<React.ComponentProps<typeof Column>> {
  const rowAttributes = getRowAttributes(row, email)

  // Get column-specific defaults based on row type
  const rowTypeDefaults = getRowTypeBlockDefaults(column, row)

  let style: React.CSSProperties = {
    ...(rowTypeDefaults as React.CSSProperties),
    width: column.width ?? '100%',
    wordBreak: 'break-word',
    verticalAlign: rowAttributes.verticalAlign ?? 'top',
  }

  return {
    style,
    className: 'column',
  }
}

export function generateBodyProps(
  email: Email,
  skipBackgroundColor = false
): OmitChildren<React.ComponentProps<typeof Body>> {
  return {
    style: {
      margin: 0,
      backgroundColor: skipBackgroundColor ? undefined : email.bgColor,
      color: email.color,
      fontFamily: email.fontFamily,
    },
  }
}

function getAdditionalRowStyles(attributes: RowBlockAttributes): React.CSSProperties {
  const styles: React.CSSProperties = {}

  if (attributes.borderRadius) {
    styles.borderRadius = attributes.borderRadius
  }

  return styles
}
