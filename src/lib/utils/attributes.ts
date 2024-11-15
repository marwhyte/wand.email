import { Body, Button, Column, Container, Heading, Hr, Img, Link, Row, Text } from '@react-email/components'

type OmitChildren<T> = Omit<T, 'children' | 'ref' | 'onToggle'>

export const getAdditionalTextStyles = (
  attributes: TextBlockAttributes
): React.ComponentProps<typeof Text>['style'] => {
  return {
    margin: 0,
    fontFamily: attributes.fontFamily,
    letterSpacing: attributes.letterSpacing,
    textIndent: attributes.textIndent,
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  }
}

export const getAdditionalHeadingStyles = (
  attributes: HeadingBlockAttributes
): React.ComponentProps<typeof Heading>['style'] => {
  return {
    fontFamily: attributes.fontFamily,
    letterSpacing: attributes.letterSpacing,
    textIndent: attributes.textIndent,
    lineHeight: '100%',
  }
}

export const getAdditionalImageStyles = (
  attributes: ImageBlockAttributes
): React.ComponentProps<typeof Img>['style'] => {
  return {
    objectFit: 'contain',
    borderRadius: attributes.borderRadius,
    padding: 0,
    marginLeft: attributes.paddingLeft,
    marginRight: attributes.paddingRight,
    marginTop: attributes.paddingTop,
    marginBottom: attributes.paddingBottom,
  }
}

export const getAdditionalButtonStyles = (
  attributes: ButtonBlockAttributes
): React.ComponentProps<typeof Button>['style'] => {
  return {
    display: 'inline-block',
    backgroundColor: attributes.backgroundColor,
    color: attributes.color,
    fontSize: attributes.fontSize,
    fontWeight: attributes.fontWeight,
    textDecoration: attributes.textDecoration,
    borderRadius: attributes.borderRadius,
    borderWidth: attributes.borderWidth,
    borderStyle: attributes.borderStyle,
    borderColor: attributes.borderColor,
    cursor: 'pointer',
  }
}

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
    'lineHeight',
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

export const getAdditionalLinkStyles = (
  attributes: LinkBlockAttributes
): React.ComponentProps<typeof Link>['style'] => {
  return {
    color: attributes.color || '#3b82f6',
    textDecoration: attributes.textDecoration || 'underline',
    fontSize: attributes.fontSize || '16px',
    fontWeight: attributes.fontWeight || 'normal',
    cursor: 'pointer',
  }
}

export function generateContainerProps(
  row: RowBlock,
  email: Email
): OmitChildren<React.ComponentProps<typeof Container>> {
  return {
    className: row.attributes.hideOnMobile ? 'hide-on-mobile' : undefined,
    style: {
      ...applyCommonAttributes(row.container.attributes),
      minWidth: row.container.attributes.minWidth,
      maxWidth: email.width,
    },
    width: email.width,
  }
}

export function generateRowProps(row: RowBlock): OmitChildren<React.ComponentProps<typeof Row>> {
  return {
    style: {
      ...applyCommonAttributes(row.attributes),
      backgroundImage: row.attributes.backgroundImage,
      borderColor: row.attributes.borderColor,
      borderWidth: row.attributes.borderWidth,
      borderStyle: row.attributes.borderStyle,
      minWidth: row.attributes.minWidth,
    },
    align: row.attributes.align,
    bgcolor: row.attributes.backgroundColor ?? 'transparent',
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

export function generateColumnProps(
  column: ColumnBlock,
  row: RowBlock,
  mobileView = false
): OmitChildren<React.ComponentProps<typeof Column>> {
  const desktopWidth = `${(column.gridColumns / 12) * 100}%`
  console.log(row.attributes.stackOnMobile && mobileView)
  return {
    valign: column.attributes.valign,
    align: column.attributes.align,

    style: {
      width: desktopWidth,
      borderStyle: column.attributes.borderStyle,
      borderWidth: column.attributes.borderWidth,
      borderColor: column.attributes.borderColor,
      borderSpacing: column.attributes.borderSpacing,
    },
    className:
      mobileView && row.attributes.stackOnMobile
        ? 'mobile-forced-full-width'
        : row.attributes.stackOnMobile
          ? 'mobile-full-width'
          : undefined,
  }
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

export function generateTextProps(
  block: TextBlock,
  mobileView = false
): OmitChildren<React.ComponentProps<typeof Text>> {
  return {
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalTextStyles(block.attributes),
    },
    className: applyCommonClassName(block.attributes, mobileView),
  }
}

export function generateHeadingProps(
  block: HeadingBlock,
  mobileView = false
): OmitChildren<React.ComponentProps<typeof Heading>> {
  return {
    as: block.attributes.as,
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalHeadingStyles(block.attributes),
      marginBlockStart: 0,
      marginBlockEnd: 0,
    },
    className: applyCommonClassName(block.attributes, mobileView),
  }
}

export function generateImageProps(block: ImageBlock): OmitChildren<React.ComponentProps<typeof Img>> {
  return {
    src: block.attributes.src,
    alt: block.attributes.alt,
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalImageStyles(block.attributes),
    },
  }
}

export function generateButtonProps(
  block: ButtonBlock,
  mobileView = false
): OmitChildren<React.ComponentProps<typeof Button>> {
  return {
    href: block.attributes.href,
    target: block.attributes.target,
    rel: block.attributes.rel,
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalButtonStyles(block.attributes),
    },
    className: applyCommonClassName(block.attributes, mobileView),
  }
}

export function generateLinkProps(
  block: LinkBlock,
  mobileView = false
): OmitChildren<React.ComponentProps<typeof Link>> {
  return {
    href: block.attributes.href,
    target: block.attributes.target,
    rel: block.attributes.rel,
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalLinkStyles(block.attributes),
    },
    className: applyCommonClassName(block.attributes, mobileView),
  }
}

export const getAdditionalDividerStyles = (
  attributes: DividerBlockAttributes
): React.ComponentProps<typeof Hr>['style'] => {
  return {
    borderTopStyle: attributes.borderStyle,
    borderTopWidth: attributes.borderWidth,
    borderTopColor: attributes.borderColor,
    padding: 0,
    marginLeft: attributes.paddingLeft,
    marginRight: attributes.paddingRight,
    marginTop: attributes.paddingTop,
    marginBottom: attributes.paddingBottom,
  }
}

export function generateDividerProps(
  block: DividerBlock,
  mobileView = false
): OmitChildren<React.ComponentProps<typeof Hr>> {
  return {
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalDividerStyles(block.attributes),
    },
    className: applyCommonClassName(block.attributes, mobileView),
  }
}

export function generateBlockProps<T extends EmailBlock>(
  block: T
): T extends TextBlock
  ? OmitChildren<React.ComponentProps<typeof Text>>
  : T extends HeadingBlock
    ? OmitChildren<React.ComponentProps<typeof Heading>>
    : T extends ImageBlock
      ? OmitChildren<React.ComponentProps<typeof Img>>
      : T extends ButtonBlock
        ? OmitChildren<React.ComponentProps<typeof Button>>
        : T extends LinkBlock
          ? OmitChildren<React.ComponentProps<typeof Link>>
          : T extends DividerBlock
            ? OmitChildren<React.ComponentProps<typeof Hr>>
            : never {
  switch (block.type) {
    case 'text':
      return generateTextProps(block as TextBlock) as any
    case 'heading':
      return generateHeadingProps(block as HeadingBlock) as any
    case 'image':
      return generateImageProps(block as ImageBlock) as any
    case 'button':
      return generateButtonProps(block as ButtonBlock) as any
    case 'link':
      return generateLinkProps(block as LinkBlock) as any
    case 'divider':
      return generateDividerProps(block as DividerBlock) as any
    default:
      return {} as never
  }
}
