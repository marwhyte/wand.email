import { ColumnBlockAttributes, Email, RowBlock, RowBlockAttributes } from '@/app/components/email-workspace/types'
import { ensurePx } from '../../misc'

export function getAdditionalRowStyles(attributes: RowBlockAttributes): React.CSSProperties {
  const {
    borderRadius,
    borderRadiusSide,
    borderSide,
    borderWidth,
    borderColor,
    borderStyle,
    columnSpacing,
    hideOnMobile,
    stackOnMobile,
    type,
    ...rest
  } = attributes
  const styles: React.CSSProperties = { ...rest }

  if (borderRadius) {
    styles.borderRadius = ensurePx(borderRadius)
  }

  if (borderRadiusSide && borderRadius) {
    if (borderRadiusSide === 'top') {
      styles.borderRadius = `${ensurePx(borderRadius)} ${ensurePx(borderRadius)} 0 0`
    } else if (borderRadiusSide === 'bottom') {
      styles.borderRadius = `0 0 ${ensurePx(borderRadius)} ${ensurePx(borderRadius)}`
    }
  }

  if (borderSide && borderWidth && borderColor) {
    if (borderSide === 'leftRight') {
      styles.borderLeft = `${ensurePx(borderWidth)} ${borderStyle || 'solid'} ${borderColor}`
      styles.borderRight = `${ensurePx(borderWidth)} ${borderStyle || 'solid'} ${borderColor}`
    } else if (borderSide === 'topBottom') {
      styles.borderTop = `${ensurePx(borderWidth)} ${borderStyle || 'solid'} ${borderColor}`
      styles.borderBottom = `${ensurePx(borderWidth)} ${borderStyle || 'solid'} ${borderColor}`
    } else if (borderSide === 'all') {
      styles.borderLeft = `${ensurePx(borderWidth)} ${borderStyle || 'solid'} ${borderColor}`
      styles.borderRight = `${ensurePx(borderWidth)} ${borderStyle || 'solid'} ${borderColor}`
      styles.borderTop = `${ensurePx(borderWidth)} ${borderStyle || 'solid'} ${borderColor}`
      styles.borderBottom = `${ensurePx(borderWidth)} ${borderStyle || 'solid'} ${borderColor}`
    }
  }
  return styles
}

export function getAdditionalColumnStyles(attributes: ColumnBlockAttributes, row: RowBlock): React.CSSProperties {
  const { width, ...rest } = attributes
  const styles: React.CSSProperties = { ...rest }

  if (width) {
    styles.width = `${width}%`
  }

  return styles
}

export function getAdditionalEmailStyles(attributes: Partial<Email>): React.CSSProperties {
  const { linkColor, rowBackgroundColor, width, rows, preview, styleVariant, theme, type, ...rest } = attributes
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
