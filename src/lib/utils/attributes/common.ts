import type { PaddingAttributes, TextAttributes } from '@/app/components/email-workspace/types'

export function applyTextAttributes(attributes: TextAttributes): React.CSSProperties {
  const textProps = ['color', 'fontSize', 'fontWeight', 'textAlign', 'fontFamily', 'letterSpacing'] as const

  return Object.fromEntries(
    textProps.map((prop) => [prop, attributes[prop]]).filter(([_, value]) => value !== undefined)
  )
}

export function applyPaddingAttributes(attributes: PaddingAttributes): React.CSSProperties {
  const paddingProps = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'] as const

  return Object.fromEntries(
    paddingProps.map((prop) => [prop, attributes[prop]]).filter(([_, value]) => value !== undefined)
  )
}
