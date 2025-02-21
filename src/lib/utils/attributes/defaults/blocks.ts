import type { ButtonBlockAttributes, DividerBlockAttributes, HeadingBlockAttributes, ImageBlockAttributes, LinkBlockAttributes, RowBlock, SurveyBlockAttributes, TextBlockAttributes } from '@/app/components/email-workspace/types'
import type { Button, Heading, Hr, Img, Link, Section, Text } from '@react-email/components'

export const getAdditionalTextStyles = (attributes: TextBlockAttributes): React.ComponentProps<typeof Text>['style'] => ({
  paddingTop: attributes.paddingTop ?? '8px',
  paddingRight: attributes.paddingRight ?? '0',
  paddingBottom: attributes.paddingBottom ?? '8px',
  paddingLeft: attributes.paddingLeft ?? '0',
  margin: 0,
  fontFamily: attributes.fontFamily,
  letterSpacing: attributes.letterSpacing,
  textIndent: attributes.textIndent,
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
  fontSize: attributes.fontSize ?? '16px',
})

export const getAdditionalHeadingStyles = (attributes: HeadingBlockAttributes): React.ComponentProps<typeof Heading>['style'] => {
  const defaultHeadingSizes = {
    h1: '48px',
    h2: '32px',
    h3: '24px',
    h4: '16px',
    h5: '12px',
  }

  return {
    paddingTop: attributes.paddingTop ?? '12px',
    paddingRight: attributes.paddingRight ?? '0',
    paddingBottom: attributes.paddingBottom ?? '12px',
    paddingLeft: attributes.paddingLeft ?? '0',
    fontFamily: attributes.fontFamily,
    fontWeight: attributes.fontWeight ?? 'bold',
    letterSpacing: attributes.letterSpacing,
    textIndent: attributes.textIndent,
    lineHeight: '100%',
    fontSize: attributes.fontSize ?? defaultHeadingSizes[attributes.as as keyof typeof defaultHeadingSizes] ?? '16px',
  }
}

export const getAdditionalImageStyles = (attributes: ImageBlockAttributes, parentRow: RowBlock): React.ComponentProps<typeof Img>['style'] => {
  let width = attributes.width

  // If no width is set and this is in a header row, apply logo sizing defaults
  if (!width && parentRow?.attributes.type === 'header') {
    // Only set defaults if width is not already specified
    const img = new Image()
    img.src = attributes.src || ''

    if (img.naturalWidth && img.naturalHeight) {
      const aspectRatio = img.naturalWidth / img.naturalHeight
      width = aspectRatio >= 0.8 && aspectRatio <= 1.2 ? '50px' : '120px'
    } else {
      width = '120px'
    }
  }

  return {
    objectFit: 'contain',
    borderRadius: attributes.borderRadius ?? '16px',
    padding: 0,
    marginLeft: attributes.paddingLeft,
    marginRight: attributes.paddingRight,
    marginTop: attributes.paddingTop,
    marginBottom: attributes.paddingBottom,
    width: width ?? '100%',
  }
}

export const getAdditionalButtonStyles = (attributes: ButtonBlockAttributes): React.ComponentProps<typeof Button>['style'] => ({
  display: 'inline-block',
  backgroundColor: attributes.backgroundColor,
  color: attributes.color ?? '#ffffff',
  fontSize: attributes.fontSize ?? '14px',
  fontWeight: attributes.fontWeight,
  textDecoration: attributes.textDecoration,
  borderRadius: attributes.borderRadius ?? '24px',
  borderWidth: attributes.borderWidth,
  borderStyle: attributes.borderStyle,
  borderColor: attributes.borderColor,
  paddingTop: attributes.paddingTop ?? '10px',
  paddingRight: attributes.paddingRight ?? '14px',
  paddingBottom: attributes.paddingBottom ?? '10px',
  paddingLeft: attributes.paddingLeft ?? '14px',
  marginTop: attributes.marginTop ?? '12px',
  marginBottom: attributes.marginBottom ?? '12px',
  cursor: 'pointer',
})

export const getAdditionalLinkStyles = (attributes: LinkBlockAttributes): React.ComponentProps<typeof Link>['style'] => ({
  color: attributes.color || '#3b82f6',
  textDecoration: attributes.textDecoration || 'underline',
  fontSize: attributes.fontSize || '16px',
  fontWeight: attributes.fontWeight || 'normal',
  cursor: 'pointer',
})

export const getAdditionalDividerStyles = (attributes: DividerBlockAttributes): React.ComponentProps<typeof Hr>['style'] => ({
  borderTopStyle: attributes.borderStyle,
  borderTopWidth: attributes.borderWidth ?? '1px',
  borderTopColor: attributes.borderColor ?? '#E0E0E0',
  padding: 0,
  marginLeft: attributes.paddingLeft,
  marginRight: attributes.paddingRight,
  marginTop: attributes.paddingTop ?? '24px',
  marginBottom: attributes.paddingBottom ?? '24px',
})

export const getAdditionalSurveyStyles = (attributes: SurveyBlockAttributes): React.ComponentProps<typeof Section>['style'] => ({
  paddingTop: attributes.paddingTop ?? '12px',
  paddingRight: attributes.paddingRight ?? '12px',
  paddingBottom: attributes.paddingBottom ?? '12px',
  paddingLeft: attributes.paddingLeft ?? '12px',
  textAlign: 'center',
})
