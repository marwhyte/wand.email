import { ColumnBlockAttributes, Email, RowBlock, RowBlockAttributes } from '@/app/components/email-workspace/types'
import { ensurePx } from '../../misc'

export function getAdditionalRowStyles(attributes: RowBlockAttributes): React.CSSProperties {
  const { borderWidth, borderColor, borderStyle, columnSpacing, hideOnMobile, stackOnMobile, type, ...rest } =
    attributes
  const styles: React.CSSProperties = { ...rest }

  if (borderWidth && borderColor) {
    styles.borderLeft = `${ensurePx(borderWidth)} ${borderStyle || 'solid'} ${borderColor}`
    styles.borderRight = `${ensurePx(borderWidth)} ${borderStyle || 'solid'} ${borderColor}`
    styles.borderTop = `${ensurePx(borderWidth)} ${borderStyle || 'solid'} ${borderColor}`
    styles.borderBottom = `${ensurePx(borderWidth)} ${borderStyle || 'solid'} ${borderColor}`
  }

  return styles
}

export function getAdditionalColumnStyles(attributes: ColumnBlockAttributes, row: RowBlock): React.CSSProperties {
  return {}
}

export function getAdditionalEmailStyles(attributes: Partial<Email>): React.CSSProperties {
  const { linkColor, rowBackgroundColor, width, ...rest } = attributes
  const styles: React.CSSProperties = { ...rest, margin: 0, WebkitTextSizeAdjust: 'none', MozTextSizeAdjust: 'none' }

  return styles
}

export function getAdditionalContentStyles(attributes: Partial<Email>): React.CSSProperties {
  const { backgroundColor, color, fontFamily } = attributes
  const styles: React.CSSProperties = {
    backgroundColor,
    color,
    fontFamily,
    margin: 0,
    WebkitTextSizeAdjust: 'none',
    MozTextSizeAdjust: 'none',
  }

  return styles
}
