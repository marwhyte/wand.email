type Email = {
  id: string
  name: string
  preview: string
  fontFamily: string
  bgColor: string
  color: string
  width: string
  rows: RowBlock[]
}

type EmailBlockType = EmailBlock['type']

type RowBlock = {
  id: string
  type: 'row'
  attributes: RowBlockAttributes
  container: {
    align?: 'left' | 'center' | 'right'
    attributes: ContainerBlockAttributes
  }
  columns: ColumnBlock[]
}

type EmailBlock = TextBlock | ImageBlock | ButtonBlock | LinkBlock | HeadingBlock

type ColumnBlock = {
  id: string
  type: 'column'
  gridColumns: number
  attributes: ColumnBlockAttributes
  blocks: (TextBlock | ImageBlock | ButtonBlock | LinkBlock | HeadingBlock)[]
}

type HeadingBlock = {
  id: string
  type: 'heading'
  content: string
  attributes: HeadingBlockAttributes
}

type TextBlock = {
  id: string
  type: 'text'
  content: string
  attributes: TextBlockAttributes
}

type ImageBlock = {
  id: string
  type: 'image'
  content: string
  attributes: ImageBlockAttributes
}

type ButtonBlock = {
  id: string
  type: 'button'
  content: string
  attributes: ButtonBlockAttributes
}

type LinkBlock = {
  id: string
  type: 'link'
  content: string
  attributes: LinkBlockAttributes
}

type CommonAttributes = {
  paddingTop?: string
  paddingRight?: string
  paddingBottom?: string
  paddingLeft?: string
  padding?: string
  display?: string
  width?: string
  maxWidth?: string
  height?: string
  backgroundColor?: string
  backgroundImage?: string
  backgroundSize?: string
  backgroundPosition?: string
  backgroundRepeat?: string
  borderRadius?: string
  border?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  verticalAlign?: 'top' | 'middle' | 'bottom'
  fontSize?: string
  lineHeight?: string
  color?: string
  fontWeight?: 'normal' | 'bold' | 'lighter' | 'bolder'
  textDecoration?: string
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'
  fontStyle?: 'normal' | 'italic' | 'oblique'
}

type ContainerBlockAttributes = CommonAttributes & {
  align?: 'left' | 'center' | 'right'
  // Add any specific attributes for containers here
}

type RowBlockAttributes = CommonAttributes & {
  align?: 'left' | 'center' | 'right'
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset'
  borderWidth?: string
  borderColor?: string
  // Add any specific attributes for rows here
}

type ColumnBlockAttributes = CommonAttributes & {
  align?: 'left' | 'center' | 'right'
  valign?: 'top' | 'middle' | 'bottom'
  borderSpacing?: string
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset'
  borderWidth?: string
  borderColor?: string
  // Add any specific attributes for columns here
}

type TextBlockAttributes = CommonAttributes & {
  fontFamily?: string
  letterSpacing?: string
  textIndent?: string
}

type HeadingBlockAttributes = CommonAttributes & {
  fontFamily?: string
  letterSpacing?: string
  textIndent?: string
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

type ImageBlockAttributes = CommonAttributes & {
  aspectRatio?: string
  src: string
  alt?: string
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
}

type ButtonBlockAttributes = CommonAttributes & {
  href: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
}

type LinkBlockAttributes = CommonAttributes & {
  href: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
}
