import { Body, Button, Column, Container, Heading, Img, Link, Row, Text } from '@react-email/components'

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
  }
}

export const getAdditionalImageStyles = (
  attributes: ImageBlockAttributes
): React.ComponentProps<typeof Img>['style'] => {
  return {
    aspectRatio: attributes.aspectRatio,
    objectFit: attributes.objectFit,
  }
}

export const getAdditionalButtonStyles = (
  attributes: ButtonBlockAttributes
): React.ComponentProps<typeof Button>['style'] => {
  return {
    display: 'inline-block',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '20px',
    paddingRight: '20px',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    borderRadius: '4px',
    border: 'none',
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
    'backgroundColor',
    'borderRadius',
    'border',
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
    color: '#3b82f6',
    textDecoration: 'underline',
    fontSize: '16px',
    fontWeight: 'normal',
    cursor: 'pointer',
  }
}

export function generateContainerProps(
  row: RowBlock,
  email: Email
): OmitChildren<React.ComponentProps<typeof Container>> {
  return {
    style: {
      ...applyCommonAttributes(row.container.attributes),
      maxWidth: email.width,
    },
    width: email.width,
  }
}

export function generateRowProps(row: RowBlock): OmitChildren<React.ComponentProps<typeof Row>> {
  return {
    style: {
      ...applyCommonAttributes(row.attributes),
    },
    align: row.attributes.align,
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

export function generateColumnProps(column: ColumnBlock): OmitChildren<React.ComponentProps<typeof Column>> {
  const width = `${(column.gridColumns / 12) * 100}%`

  return {
    valign: column.attributes.valign,
    align: column.attributes.align,
    style: {
      ...applyCommonAttributes(column.attributes),
      width: width,
      borderStyle: column.attributes.borderStyle,
      borderWidth: column.attributes.borderWidth,
      borderColor: column.attributes.borderColor,
    },
  }
}

export function generateTextProps(block: TextBlock): OmitChildren<React.ComponentProps<typeof Text>> {
  return {
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalTextStyles(block.attributes),
    },
  }
}

export function generateHeadingProps(block: HeadingBlock): OmitChildren<React.ComponentProps<typeof Heading>> {
  return {
    as: block.attributes.as,
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalHeadingStyles(block.attributes),
    },
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

export function generateButtonProps(block: ButtonBlock): OmitChildren<React.ComponentProps<typeof Button>> {
  return {
    href: block.attributes.href,
    target: block.attributes.target,
    rel: block.attributes.rel,
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalButtonStyles(block.attributes),
    },
  }
}

export function generateLinkProps(block: LinkBlock): OmitChildren<React.ComponentProps<typeof Link>> {
  return {
    href: block.attributes.href,
    target: block.attributes.target,
    rel: block.attributes.rel,
    style: {
      ...applyCommonAttributes(block.attributes),
      ...getAdditionalLinkStyles(block.attributes),
    },
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
    default:
      return {} as never
  }
}
