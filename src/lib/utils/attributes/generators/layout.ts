import type { ColumnBlock, Email, RowBlock } from '@/app/components/email-workspace/types'
import type { Body, Column, Container, Row } from '@react-email/components'
import { applyCommonAttributes } from '../common'
import { getRowTypeBlockDefaults } from '../defaults/rowTypeBlocks'
import { getTypeDefaults } from '../defaults/rowTypes'
import { variantDefaults } from '../defaults/variants'

type OmitChildren<T> = Omit<T, 'children' | 'ref' | 'onToggle'>

export function getDefaultRowAttributes(row: RowBlock): Partial<RowBlock['attributes']> {
  const baseRowDefaults: Partial<RowBlock['attributes']> = {}

  return {
    ...baseRowDefaults,
    ...(row.attributes.variant ? variantDefaults[row.attributes.variant] : {}),
    ...(row.attributes.type ? getTypeDefaults(row) : {}),
  }
}

export const getRowAttributes = (row: RowBlock): Partial<RowBlock['attributes']> => {
  const defaultAttributes = getDefaultRowAttributes(row)
  const mergedAttributes = { ...defaultAttributes, ...row.attributes }

  return mergedAttributes
}

export function generateContainerProps(row: RowBlock, email: Email): OmitChildren<React.ComponentProps<typeof Container>> {
  const rowAttributes = getRowAttributes(row)

  return {
    className: rowAttributes.hideOnMobile ? 'hide-on-mobile' : undefined,
    style: {
      ...applyCommonAttributes(row.container.attributes),
      minWidth: row.container.attributes.minWidth,
      maxWidth: email.width,
    },
    width: email.width,
  }
}

export function generateRowProps(row: RowBlock): OmitChildren<React.ComponentProps<typeof Row>> {
  const mergedAttributes = getRowAttributes(row)

  return {
    style: {
      ...applyCommonAttributes(mergedAttributes),
      backgroundImage: mergedAttributes.backgroundImage,
      borderColor: mergedAttributes.borderColor,
      borderWidth: mergedAttributes.borderWidth,
      borderStyle: mergedAttributes.borderStyle,
      minWidth: mergedAttributes.minWidth,
    },
    align: mergedAttributes.align,
    bgcolor: mergedAttributes.backgroundColor ?? 'transparent',
  }
}

export function generateColumnProps(column: ColumnBlock, row: RowBlock, mobileView = false): OmitChildren<React.ComponentProps<typeof Column>> {
  const columnIndex = row.columns.indexOf(column)
  const isGallery = row.attributes.type === 'gallery'
  const rowAttributes = getRowAttributes(row)

  // Get column-specific defaults based on row type
  const rowTypeDefaults = getRowTypeBlockDefaults(column, row)

  let style: React.CSSProperties = {
    ...rowTypeDefaults,
    width: column.width,
    borderStyle: column.attributes.borderStyle,
    borderWidth: column.attributes.borderWidth,
    borderColor: column.attributes.borderColor,
    borderSpacing: column.attributes.borderSpacing,
    verticalAlign: column.attributes.verticalAlign ?? rowTypeDefaults.verticalAlign ?? 'top',
  }

  if (rowAttributes.twoColumnsOnMobile && mobileView) {
    style.paddingBottom = '12px'
  }

  if (rowAttributes.stackOnMobile && mobileView) {
    style.width = '100%'
    style.paddingBottom = '12px'
  }

  return {
    align: column.attributes.align,
    style,
  }
}

export function generateBodyProps(email: Email, skipBackgroundColor = false): OmitChildren<React.ComponentProps<typeof Body>> {
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
