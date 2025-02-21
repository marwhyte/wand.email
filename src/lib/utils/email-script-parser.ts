import { ButtonBlockAttributes, ColumnBlock, ColumnBlockAttributes, COMMON_SOCIAL_ICONS, CommonAttributes, DividerBlockAttributes, Email, FOLDER_SPECIFIC_ICONS, HeadingBlockAttributes, ImageBlockAttributes, LinkBlockAttributes, RowBlock, RowBlockAttributes, SocialIconFolders, SocialIconName, SocialsBlockAttributes, SurveyBlockAttributes, TextBlockAttributes } from '@/app/components/email-workspace/types'
import { createBlock, createColumn, createRow } from './email-helpers'
import { resolveImageSrc } from './image-service'

type BlockAttributes = Record<string, string | number>

function parsePadding(padding: string | undefined): Record<string, string> {
  if (!padding) {
    return {
      paddingTop: '0px',
      paddingRight: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
    }
  }

  const values: string[] = padding.split(',').map((p) => `${p}px`)

  // Handle different value counts according to CSS shorthand rules
  switch (values.length) {
    case 1: // All sides
      return {
        paddingTop: values[0],
        paddingRight: values[0],
        paddingBottom: values[0],
        paddingLeft: values[0],
      }
    case 2: // Vertical, Horizontal
      return {
        paddingTop: values[0],
        paddingRight: values[1],
        paddingBottom: values[0],
        paddingLeft: values[1],
      }
    case 3: // Top, Horizontal, Bottom
      return {
        paddingTop: values[0],
        paddingRight: values[1],
        paddingBottom: values[2],
        paddingLeft: values[1],
      }
    case 4: // Top, Right, Bottom, Left
      return {
        paddingTop: values[0],
        paddingRight: values[1],
        paddingBottom: values[2],
        paddingLeft: values[3],
      }
    default:
      return {
        paddingTop: '0px',
        paddingRight: '0px',
        paddingBottom: '0px',
        paddingLeft: '0px',
      }
  }
}

function parseEscapeSequences(text: string): string {
  return text.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, '\\')
}

// First, let's improve our base types for parsing
type AttributeValue = string | number | boolean | undefined
type RawAttributes = Record<string, string> // What we get from initial parsing

// Type guard to check if a value is a valid text alignment
function isTextAlign(value: string | undefined): value is CommonAttributes['textAlign'] {
  return typeof value === 'string' && ['left', 'center', 'right', 'justify'].includes(value)
}

// Type guard for font weight
function isFontWeight(value: string | undefined): value is CommonAttributes['fontWeight'] {
  return typeof value === 'string' && ['normal', 'bold', 'lighter', 'bolder'].includes(value)
}

// Type guard for target
function isTarget(value: string | undefined): value is ButtonBlockAttributes['target'] {
  return typeof value === 'string' && ['_blank', '_self', '_parent', '_top'].includes(value)
}

// Type guard for border style
function isBorderStyle(value: string | undefined): value is NonNullable<RowBlockAttributes['borderStyle']> {
  return typeof value === 'string' && ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'].includes(value)
}

// Helper for ensuring string values
function ensureString(value: unknown, defaultValue: string = ''): string {
  return typeof value === 'string' ? value : defaultValue
}

// Parser types
type AttributeParser<T> = (raw: RawAttributes) => T

// Type guards for common attributes
function isVerticalAlign(value: string | undefined): value is CommonAttributes['verticalAlign'] {
  return typeof value === 'string' && ['top', 'middle', 'bottom'].includes(value)
}

function isTextTransform(value: string | undefined): value is NonNullable<CommonAttributes['textTransform']> {
  return typeof value === 'string' && ['none', 'uppercase', 'lowercase', 'capitalize'].includes(value)
}

function isWhiteSpace(value: string | undefined): value is NonNullable<CommonAttributes['whiteSpace']> {
  return typeof value === 'string' && ['normal', 'nowrap', 'pre', 'pre-wrap', 'pre-line'].includes(value)
}

function isFontStyle(value: string | undefined): value is NonNullable<CommonAttributes['fontStyle']> {
  return typeof value === 'string' && ['normal', 'italic', 'oblique'].includes(value)
}

// Parse common attributes with proper typing
const parseCommonAttributes = (raw: RawAttributes): Partial<CommonAttributes> => {
  const attrs: Partial<CommonAttributes> = {}

  // Boolean attributes
  if (raw.noSidePaddingOnMobile) {
    attrs.noSidePaddingOnMobile = raw.noSidePaddingOnMobile === 'true'
  }

  // Padding handling
  if (raw.padding) {
    const paddingValues = parsePadding(raw.padding)
    Object.assign(attrs, paddingValues)
  } else {
    // Individual padding values
    if (raw.paddingTop) attrs.paddingTop = ensurePx(raw.paddingTop)
    if (raw.paddingRight) attrs.paddingRight = ensurePx(raw.paddingRight)
    if (raw.paddingBottom) attrs.paddingBottom = ensurePx(raw.paddingBottom)
    if (raw.paddingLeft) attrs.paddingLeft = ensurePx(raw.paddingLeft)
  }

  // Display and dimensions
  if (raw.display) attrs.display = raw.display
  if (raw.width) attrs.width = ensurePx(raw.width)
  if (raw.maxWidth) attrs.maxWidth = ensurePx(raw.maxWidth)
  if (raw.height) attrs.height = ensurePx(raw.height)

  // Background properties
  if (raw.background) attrs.background = raw.background
  if (raw.backgroundColor) attrs.backgroundColor = raw.backgroundColor
  if (raw.backgroundImage) attrs.backgroundImage = raw.backgroundImage
  if (raw.backgroundSize) attrs.backgroundSize = raw.backgroundSize
  if (raw.backgroundPosition) attrs.backgroundPosition = raw.backgroundPosition
  if (raw.backgroundRepeat) attrs.backgroundRepeat = raw.backgroundRepeat

  // Border
  if (raw.borderRadius) attrs.borderRadius = ensurePx(raw.borderRadius)

  // Text formatting
  if (isTextAlign(raw.textAlign)) attrs.textAlign = raw.textAlign
  if (isVerticalAlign(raw.verticalAlign)) attrs.verticalAlign = raw.verticalAlign
  if (raw.fontSize) attrs.fontSize = ensurePx(raw.fontSize)
  if (raw.lineHeight) attrs.lineHeight = raw.lineHeight
  if (raw.color) attrs.color = raw.color
  if (isFontWeight(raw.fontWeight)) attrs.fontWeight = raw.fontWeight
  if (raw.textDecoration) attrs.textDecoration = raw.textDecoration
  if (isTextTransform(raw.textTransform)) attrs.textTransform = raw.textTransform
  if (isWhiteSpace(raw.whiteSpace)) attrs.whiteSpace = raw.whiteSpace
  if (isFontStyle(raw.fontStyle)) attrs.fontStyle = raw.fontStyle

  return attrs
}

// Helper functions
function ensurePx(value: string): string {
  // If value already has px or % suffix, return as is
  if (value.endsWith('px') || value.endsWith('%')) {
    return value
  }

  // Otherwise, append px∂
  return `${value}px`
}

// Block-specific parsers
const parseHeadingAttributes: AttributeParser<HeadingBlockAttributes> = (raw) => {
  const common = parseCommonAttributes(raw)
  const attrs: HeadingBlockAttributes = {
    ...common,
    as: (raw.as as HeadingBlockAttributes['as']) || 'h2',
  }

  // Heading-specific attributes
  if (raw.fontFamily) attrs.fontFamily = raw.fontFamily
  if (raw.letterSpacing) attrs.letterSpacing = ensurePx(raw.letterSpacing)
  if (raw.textIndent) attrs.textIndent = ensurePx(raw.textIndent)

  return attrs
}

const parseTextAttributes: AttributeParser<TextBlockAttributes> = (raw) => {
  return {
    ...parseCommonAttributes(raw),
    fontFamily: raw.fontFamily,
    letterSpacing: raw.letterSpacing,
    textIndent: raw.textIndent,
  }
}

const parseButtonAttributes: AttributeParser<ButtonBlockAttributes> = (raw) => {
  const common = parseCommonAttributes(raw)
  const attrs: ButtonBlockAttributes = {
    ...common,
    href: raw.href || '#',
    backgroundColor: raw.backgroundColor || '#000000',
    color: raw.color || '#ffffff',
    paddingTop: ensurePx(raw.paddingTop || '10'),
    paddingBottom: ensurePx(raw.paddingBottom || '10'),
    paddingLeft: ensurePx(raw.paddingLeft || '20'),
    paddingRight: ensurePx(raw.paddingRight || '20'),
  }

  if (isTarget(raw.target)) attrs.target = raw.target
  if (raw.rel) attrs.rel = raw.rel
  if (isBorderStyle(raw.borderStyle)) attrs.borderStyle = raw.borderStyle
  if (raw.borderWidth) attrs.borderWidth = ensurePx(raw.borderWidth)
  if (raw.borderColor) attrs.borderColor = raw.borderColor

  return attrs
}

const parseImageAttributes: AttributeParser<ImageBlockAttributes> = (raw) => {
  const common = parseCommonAttributes(raw)
  const attrs: ImageBlockAttributes = {
    ...common,
    src: raw.src || '', // Required attribute
  }

  // Optional image-specific attributes
  if (raw.alt) attrs.alt = raw.alt
  if (raw.borderRadius) attrs.borderRadius = ensurePx(raw.borderRadius)

  return attrs
}

const parseLinkAttributes: AttributeParser<LinkBlockAttributes> = (raw) => {
  const common = parseCommonAttributes(raw)
  const attrs: LinkBlockAttributes = {
    ...common,
    href: raw.href || '#', // Default to '#' if not provided
  }

  // Optional link-specific attributes
  if (isTarget(raw.target)) attrs.target = raw.target
  if (raw.rel) attrs.rel = raw.rel

  return attrs
}

const parseDividerAttributes: AttributeParser<DividerBlockAttributes> = (raw) => {
  const common = parseCommonAttributes(raw)
  const attrs: DividerBlockAttributes = {
    ...common,
  }

  // Divider-specific attributes
  if (raw.borderStyle && ['solid', 'dashed', 'dotted'].includes(raw.borderStyle)) {
    attrs.borderStyle = raw.borderStyle as DividerBlockAttributes['borderStyle']
  }
  if (raw.borderWidth) attrs.borderWidth = ensurePx(raw.borderWidth)
  if (raw.borderColor) attrs.borderColor = raw.borderColor

  return attrs
}

// Type guard for social icon folders
function isSocialIconFolder(value: string | undefined): value is SocialIconFolders {
  return typeof value === 'string' && ['socials-blue', 'socials-color', 'socials-dark-gray', 'socials-dark-round', 'socials-dark', 'socials-outline-black', 'socials-outline-color', 'socials-outline-gray', 'socials-outline-white', 'socials-white'].includes(value)
}

// Type guard for social icon names
function isSocialIconName(value: string | undefined): value is SocialIconName {
  // Get all possible values by combining common icons and folder-specific icons
  const validIcons = new Set([...Object.keys(COMMON_SOCIAL_ICONS), ...Object.values(FOLDER_SPECIFIC_ICONS).flatMap((icons) => Object.keys(icons))])
  return typeof value === 'string' && validIcons.has(value as SocialIconName)
}

const parseSocialsAttributes: AttributeParser<SocialsBlockAttributes> = (raw) => {
  const common = parseCommonAttributes(raw)

  // Parse social links from raw attributes
  const socialLinks: SocialsBlockAttributes['socialLinks'] = []

  try {
    const jsonStr = raw.socialLinks?.trim() || '[]'

    // Validate JSON string format
    if (!jsonStr.startsWith('[') || !jsonStr.endsWith(']')) {
      console.error('Invalid JSON array format:', jsonStr)
      throw new Error('Invalid JSON array format')
    }

    const rawLinks = JSON.parse(jsonStr)

    if (Array.isArray(rawLinks)) {
      for (const link of rawLinks) {
        if (isSocialIconName(link.icon)) {
          socialLinks.push({
            icon: link.icon,
            url: link.url || '',
            title: link.title || '',
            alt: link.alt || '',
          })
        }
      }
    }
  } catch (e) {
    console.error('Failed to parse social links:', e)
    console.debug('Raw socialLinks value:', raw.socialLinks)
    console.debug('socialLinks type:', typeof raw.socialLinks)
  }

  const attrs: SocialsBlockAttributes = {
    ...common,
    folder: isSocialIconFolder(raw.folder) ? raw.folder : 'socials-color',
    socialLinks,
  }

  return attrs
}

// Add survey block parser
const parseSurveyAttributes: AttributeParser<SurveyBlockAttributes> = (raw) => {
  const common = parseCommonAttributes(raw)
  const attrs: SurveyBlockAttributes = {
    ...common,
    kind: raw.kind as SurveyBlockAttributes['kind'],
    question: raw.question || '',
  }

  return attrs
}

// Update the parseAttributes function to be more specific
function parseAttributes(attrString: string): RawAttributes {
  const attrs: RawAttributes = {}

  // Special handling for JSON attributes (like socialLinks)
  // Using a more precise regex to capture the entire JSON array
  const jsonMatch = attrString.match(/(\w+)=(\[[\s\S]*\])/)
  if (jsonMatch) {
    const [fullMatch, key, jsonValue] = jsonMatch
    attrs[key] = jsonValue
    attrString = attrString.replace(fullMatch, '')
  }

  // Find text content between <p> tags
  const textMatch = attrString.match(/<p>(.*?)<\/p>/)
  if (textMatch) {
    attrs.text = parseEscapeSequences(textMatch[1])
    attrString = attrString.replace(textMatch[0], '')
  }

  // Special handling for alt attribute - capture everything between quotes
  const altMatch = attrString.match(/alt="([^"]*)"/)
  if (altMatch) {
    attrs.alt = altMatch[1]
    attrString = attrString.replace(altMatch[0], '')
  }

  // Parse remaining attributes
  const pairs = attrString.match(/(\w+)=([^"\s]+|"[^"]+")/g) || []
  pairs.forEach((pair) => {
    const [key, value] = pair.split('=')
    if (key === 'padding') {
      Object.assign(attrs, parsePadding(value))
    } else {
      // Remove quotes from non-text attributes
      attrs[key] = value.replace(/"/g, '')
    }
  })

  return attrs
}

// Update the block parsers map with all block types
const blockParsers = {
  heading: parseHeadingAttributes,
  text: parseTextAttributes,
  button: parseButtonAttributes,
  image: parseImageAttributes,
  link: parseLinkAttributes,
  divider: parseDividerAttributes,
  socials: parseSocialsAttributes,
  survey: parseSurveyAttributes,
} as const

// Type-safe block creation mapping
type BlockParserMap = typeof blockParsers
type BlockType = keyof BlockParserMap

// Add a new parser for row attributes
const parseRowAttributes: AttributeParser<RowBlockAttributes> = (raw) => {
  const common = parseCommonAttributes(raw)
  const attrs: RowBlockAttributes = {
    ...common,
  }

  // Row-specific attributes
  if (raw.align) attrs.align = raw.align as RowBlockAttributes['align']
  if (isBorderStyle(raw.borderStyle)) attrs.borderStyle = raw.borderStyle
  if (raw.borderWidth) attrs.borderWidth = ensurePx(raw.borderWidth)
  if (raw.borderColor) attrs.borderColor = raw.borderColor
  if (raw.minWidth) attrs.minWidth = ensurePx(raw.minWidth)
  if (raw.type) attrs.type = raw.type as RowBlockAttributes['type']
  if (raw.variant) attrs.variant = raw.variant as RowBlockAttributes['variant']

  // Boolean attributes
  if (raw.stackOnMobile) attrs.stackOnMobile = raw.stackOnMobile === 'true'
  if (raw.reverseStackOnMobile) attrs.reverseStackOnMobile = raw.reverseStackOnMobile === 'true'
  if (raw.hideOnMobile) attrs.hideOnMobile = raw.hideOnMobile === 'true'

  return attrs
}

// Type guard for column alignment
function isColumnAlign(value: string | undefined): value is ColumnBlockAttributes['align'] {
  return typeof value === 'string' && ['left', 'center', 'right'].includes(value)
}

// Parser for column attributes
const parseColumnAttributes: AttributeParser<ColumnBlockAttributes> = (raw) => {
  const attrs: ColumnBlockAttributes = {}

  // Parse column-specific attributes
  if (isColumnAlign(raw.align)) attrs.align = raw.align
  if (raw.borderSpacing) attrs.borderSpacing = ensurePx(raw.borderSpacing)
  if (isBorderStyle(raw.borderStyle)) attrs.borderStyle = raw.borderStyle
  if (raw.borderWidth) attrs.borderWidth = ensurePx(raw.borderWidth)
  if (raw.borderColor) attrs.borderColor = raw.borderColor

  return attrs
}

export function parseEmailScript(script: string): RowBlock[] {
  const rows: RowBlock[] = []
  const lines = script.trim().split('\n')
  let currentRow: RowBlock | null = null
  let currentColumn: ColumnBlock | null = null
  let depth = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Handle row start
    if (line.startsWith('ROW')) {
      const rowMatch = line.match(/ROW\s*([^{]*)\{?/)
      if (!rowMatch) continue

      const rowAttrs = parseAttributes(rowMatch[1])

      // Extract container-specific attributes
      const containerAttrs: Record<string, any> = {}
      const containerProps = ['align', 'maxWidth', 'minWidth', 'background', 'backgroundColor', 'backgroundImage', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat', 'height']

      containerProps.forEach((prop) => {
        if (rowAttrs[prop] !== undefined) {
          containerAttrs[prop] = rowAttrs[prop]
          delete rowAttrs[prop]
        }
      })

      currentRow = createRow(containerAttrs, parseRowAttributes(rowAttrs))
      rows.push(currentRow)
      depth++
      continue
    }

    // Handle column start
    if (line.startsWith('COLUMN')) {
      if (!currentRow) continue

      const columnMatch = line.match(/COLUMN\s*([^{]*)\{?/)
      if (!columnMatch) continue

      const columnAttrs = parseAttributes(columnMatch[1])

      // If width is not specified, count existing columns to determine even distribution
      let width: string
      if (!columnAttrs.width) {
        const currentColumnCount = currentRow.columns.length
        // Calculate even distribution based on total columns (including this new one)
        const evenWidth = Math.floor(100 / (currentColumnCount + 1))
        width = `${evenWidth}%`

        // Update existing columns to have even width
        currentRow.columns.forEach((col) => {
          col.width = `${evenWidth}%`
        })
      } else {
        // Use provided width
        width = columnAttrs.width.endsWith('%') ? columnAttrs.width : `${columnAttrs.width}%`
      }

      currentColumn = createColumn([], width, parseColumnAttributes(columnAttrs))
      currentRow.columns.push(currentColumn)
      depth++
      continue
    }

    // Handle block definitions
    const match = line.match(/(\w+)(?:\s+(.+))?/) // Made the attributes part optional
    if (match && currentColumn) {
      const [, blockType, blockDef = ''] = match // Provide default empty string for blockDef
      const attrs = parseAttributes(blockDef)

      switch (blockType.toLowerCase() as BlockType) {
        case 'heading':
          createBlock('heading', attrs.text || '', blockParsers.heading(attrs), currentColumn)
          break
        case 'text':
          createBlock('text', attrs.text || '', blockParsers.text(attrs), currentColumn)
          break
        case 'button':
          createBlock('button', attrs.text || '', blockParsers.button(attrs), currentColumn)
          break
        case 'image':
          createBlock('image', '', blockParsers.image(attrs), currentColumn)
          break
        case 'link':
          createBlock('link', attrs.text || '', blockParsers.link(attrs), currentColumn)
          break
        case 'divider':
          createBlock('divider', '', blockParsers.divider(attrs), currentColumn)
          break
        case 'socials':
          createBlock('socials', '', blockParsers.socials(attrs), currentColumn)
          break
        case 'survey':
          createBlock('survey', '', blockParsers.survey(attrs), currentColumn)
          break
      }
    }

    // Handle closing braces
    if (line === '}') {
      depth--
      if (depth === 0) {
        currentRow = null
      } else if (depth === 1) {
        currentColumn = null
      }
    }
  }

  return rows
}

// Helper function to process blocks recursively and update image sources
async function processBlocks(blocks: any[]): Promise<any[]> {
  return Promise.all(
    blocks.map(async (block) => {
      if (block.type === 'image' && block.attributes?.src?.startsWith('pexels:')) {
        // Resolve the image source
        const resolvedSrc = await resolveImageSrc(block.attributes.src)
        return {
          ...block,
          attributes: {
            ...block.attributes,
            src: resolvedSrc,
          },
        }
      }
      return block
    })
  )
}

// Helper function to process columns recursively
async function processColumns(columns: any[]): Promise<any[]> {
  return Promise.all(
    columns.map(async (column) => ({
      ...column,
      blocks: column.blocks ? await processBlocks(column.blocks) : [],
    }))
  )
}

// Helper function to process rows recursively
async function processRows(rows: any[]): Promise<any[]> {
  return Promise.all(
    rows.map(async (row) => ({
      ...row,
      columns: row.columns ? await processColumns(row.columns) : [],
    }))
  )
}

// Main function to process the entire email object
export async function processEmailImages(email: Email): Promise<Email> {
  return {
    ...email,
    rows: await processRows(email.rows),
  }
}
