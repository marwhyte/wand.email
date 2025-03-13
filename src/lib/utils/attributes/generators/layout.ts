import type { ColumnBlock, Email, RowBlock } from '@/app/components/email-workspace/types'
import type { Body, Column, Container, Row } from '@react-email/components'
import { applyCommonAttributes } from '../common'
import { getRowTypeBlockDefaults } from '../defaults/rowTypeBlocks'
import { getTypeDefaults } from '../defaults/rowTypes'
import { variantDefaults } from '../defaults/variants'

type OmitChildren<T> = Omit<T, 'children' | 'ref' | 'onToggle'>

export function getDefaultRowAttributes(row: RowBlock): Partial<RowBlock['attributes']> {
  const baseRowDefaults: Partial<RowBlock['attributes']> = {
    paddingLeft: '16px',
    paddingRight: '16px',
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
    className: `row-content${rowAttributes.hideOnMobile ? ' mobile_hide' : ''}`,
    style: {
      ...applyCommonAttributes(row.container.attributes),
      minWidth: row.container.attributes.minWidth,
      maxWidth: email.width,
    },
    width: email.width,
  }
}

export function generateRowProps(row: RowBlock, email: Email | null): OmitChildren<React.ComponentProps<typeof Row>> {
  const mergedAttributes = getRowAttributes(row, email)

  return {
    className: `row-content${mergedAttributes.stackOnMobile ? ' stack' : ''}`,
    style: {
      ...applyCommonAttributes(mergedAttributes),
      backgroundImage: mergedAttributes.backgroundImage,
      borderColor: mergedAttributes.borderColor,
      borderWidth: mergedAttributes.borderWidth,
      borderStyle: mergedAttributes.borderStyle,
      minWidth: mergedAttributes.minWidth,
      tableLayout: 'fixed',
    },
    align: mergedAttributes.align,
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

  console.log('column.width', column.width)

  let style: React.CSSProperties = {
    ...(rowTypeDefaults as React.CSSProperties),
    width: column.width ?? '100%',
    borderStyle: column.attributes.borderStyle,
    borderWidth: column.attributes.borderWidth,
    borderColor: column.attributes.borderColor,
    borderSpacing: column.attributes.borderSpacing,
    verticalAlign: column.attributes.verticalAlign ?? rowTypeDefaults.verticalAlign ?? 'top',
    wordBreak: 'break-word',
  }

  return {
    align: column.attributes.align,
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
      backgroundImage: email.bgImage ? `url(${email.bgImage})` : undefined,
      backgroundSize: email.bgSize ? email.bgSize : undefined,
      backgroundPosition: email.bgPosition ? email.bgPosition : undefined,
      backgroundRepeat: email.bgRepeat ? email.bgRepeat : undefined,
      color: email.color,
      fontFamily: email.fontFamily,
    },
  }
}
