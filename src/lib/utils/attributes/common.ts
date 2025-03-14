import type { CommonAttributes } from '@/app/components/email-workspace/types'

export function applyCommonAttributes(attributes: CommonAttributes): React.CSSProperties {
  const commonProps = [
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'display',
    'width',
    'maxWidth',
    'height',
    'background',
    'backgroundColor',
    'backgroundImage',
    'backgroundPosition',
    'backgroundSize',
    'backgroundRepeat',
    'borderRadius',
    'textAlign',
    'verticalAlign',
    'fontSize',
    'color',
    'fontWeight',
    'textDecoration',
    'textTransform',
    'whiteSpace',
    'fontStyle',
  ] as const

  return Object.fromEntries(
    commonProps.map((prop) => [prop, attributes[prop]]).filter(([_, value]) => value !== undefined)
  )
}
