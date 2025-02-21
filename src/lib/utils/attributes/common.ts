import type { CommonAttributes } from '@/app/components/email-workspace/types'

export function applyCommonAttributes(attributes: CommonAttributes): React.CSSProperties {
  const commonProps = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'display', 'width', 'maxWidth', 'height', 'background', 'backgroundColor', 'backgroundImage', 'backgroundPosition', 'backgroundSize', 'backgroundRepeat', 'borderRadius', 'textAlign', 'verticalAlign', 'fontSize', 'lineHeight', 'color', 'fontWeight', 'textDecoration', 'textTransform', 'whiteSpace', 'fontStyle'] as const

  return Object.fromEntries(commonProps.map((prop) => [prop, attributes[prop]]).filter(([_, value]) => value !== undefined))
}

export function applyCommonClassName(attributes: CommonAttributes, mobileView = false): string | undefined {
  const classNames: string[] = []

  if (attributes.noSidePaddingOnMobile && mobileView) {
    classNames.push('no-side-padding-mobile-forced')
  }
  if (attributes.noSidePaddingOnMobile) {
    classNames.push('no-side-padding-mobile')
  }

  return classNames.length > 0 ? classNames.join(' ') : undefined
}
