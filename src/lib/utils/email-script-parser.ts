import {
  ButtonBlockAttributes,
  ColumnBlock,
  ColumnBlockAttributes,
  COMMON_SOCIAL_ICONS,
  ComponentType,
  DividerBlockAttributes,
  Email,
  HeadingBlockAttributes,
  ImageBlockAttributes,
  LinkBlockAttributes,
  PaddingAttributes,
  RowBlock,
  RowBlockAttributes,
  SocialIconFolders,
  SocialIconName,
  SocialsBlockAttributes,
  SurveyBlockAttributes,
  TextAttributes,
  TextBlockAttributes,
} from '@/app/components/email-workspace/types'
import { createBlock, createColumn, createRow } from './email-helpers'
import { resolveImageSrc } from './image-service'
import { ensurePx } from './misc'

// ===== Base Parser Types =====
type RawAttributes = Record<string, string>
type AttributeParser<T> = (raw: RawAttributes) => T
type BlockParserMap = typeof blockParsers
type BlockType = keyof BlockParserMap

// ===== Helper Functions =====
function parsePadding(padding: string | undefined): Record<string, string> {
  if (!padding) {
    return {} // Return empty object when padding is undefined
  }

  const values: string[] = padding.split(',').map((p) => `${p}px`)
  const result: Record<string, string> = {}

  // Handle different value counts according to CSS shorthand rules
  switch (values.length) {
    case 1: // All sides
      result.paddingTop = values[0]
      result.paddingRight = values[0]
      result.paddingBottom = values[0]
      result.paddingLeft = values[0]
      break
    case 2: // Vertical, Horizontal
      result.paddingTop = values[0]
      result.paddingBottom = values[0]
      result.paddingRight = values[1]
      result.paddingLeft = values[1]
      break
    case 3: // Top, Horizontal, Bottom
      result.paddingTop = values[0]
      result.paddingRight = values[1]
      result.paddingLeft = values[1]
      result.paddingBottom = values[2]
      break
    case 4: // Top, Right, Bottom, Left
      result.paddingTop = values[0]
      result.paddingRight = values[1]
      result.paddingBottom = values[2]
      result.paddingLeft = values[3]
      break
  }

  return result
}

function parseEscapeSequences(text: string): string {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\')
}

function ensureString(value: unknown, defaultValue: string = ''): string {
  return typeof value === 'string' ? value : defaultValue
}

// ===== Type Guards =====
function isTextAlign(value: string | undefined): value is TextBlockAttributes['textAlign'] {
  return typeof value === 'string' && ['left', 'center', 'right', 'justify'].includes(value)
}

function isFontWeight(value: string | undefined): value is TextAttributes['fontWeight'] {
  return typeof value === 'string' && ['normal', 'bold', 'lighter', 'bolder'].includes(value)
}

function isBorderStyle(value: string | undefined): value is NonNullable<RowBlockAttributes['borderStyle']> {
  return typeof value === 'string' && ['solid', 'dashed', 'dotted'].includes(value)
}

function isVerticalAlign(value: string | undefined): value is RowBlockAttributes['verticalAlign'] {
  return typeof value === 'string' && ['top', 'middle', 'bottom'].includes(value)
}

function isAlign(value: string | undefined): value is ButtonBlockAttributes['align'] {
  return typeof value === 'string' && ['left', 'center', 'right'].includes(value)
}

function isSocialIconFolder(value: string | undefined): value is SocialIconFolders {
  return (
    typeof value === 'string' &&
    [
      'socials-blue',
      'socials-color',
      'socials-dark-gray',
      'socials-dark-round',
      'socials-dark',
      'socials-outline-black',
      'socials-outline-color',
      'socials-outline-gray',
      'socials-outline-white',
      'socials-white',
    ].includes(value)
  )
}

function isSocialIconName(value: string | undefined): value is SocialIconName {
  // Get all possible values by combining common icons and folder-specific icons
  const validIcons = new Set(
    [
      ...Object.keys(COMMON_SOCIAL_ICONS),
      'twitter', // Add Twitter/X as valid option
      'x', // Support both names
    ].map((icon) => icon.toLowerCase())
  )

  return typeof value === 'string' && validIcons.has(value.toLowerCase())
}

// ===== Base Attribute Parsers =====
function handlePadding(raw: RawAttributes): PaddingAttributes {
  const attrs: PaddingAttributes = {}

  if (raw.padding) {
    const paddingValues = parsePadding(raw.padding)
    Object.assign(attrs, paddingValues)
  } else {
    // Individual padding values - only add non-zero values
    if (raw.paddingTop && raw.paddingTop !== '0') attrs.paddingTop = ensurePx(raw.paddingTop)
    if (raw.paddingRight && raw.paddingRight !== '0') attrs.paddingRight = ensurePx(raw.paddingRight)
    if (raw.paddingBottom && raw.paddingBottom !== '0') attrs.paddingBottom = ensurePx(raw.paddingBottom)
    if (raw.paddingLeft && raw.paddingLeft !== '0') attrs.paddingLeft = ensurePx(raw.paddingLeft)
  }

  return attrs
}

function handleTextAttributes(raw: RawAttributes): TextAttributes {
  const attrs: TextAttributes = {
    content: raw.content || '',
  }

  if (raw.color) attrs.color = raw.color
  if (isFontWeight(raw.fontWeight)) attrs.fontWeight = raw.fontWeight as TextAttributes['fontWeight']
  if (raw.fontSize) attrs.fontSize = ensurePx(raw.fontSize)
  if (raw.fontFamily) attrs.fontFamily = raw.fontFamily
  if (raw.letterSpacing) attrs.letterSpacing = ensurePx(raw.letterSpacing)
  if (raw.lineHeight) attrs.lineHeight = raw.lineHeight

  return attrs
}

function handleContentPadding(raw: RawAttributes): Record<string, string> {
  const attrs: Record<string, string> = {}

  if (raw.contentPadding) {
    const values: string[] = raw.contentPadding.split(',').map((p) => `${p}px`)

    // Handle different value counts according to CSS shorthand rules
    switch (values.length) {
      case 1: // All sides
        if (values[0] !== '0px') {
          attrs.contentPaddingTop = values[0]
          attrs.contentPaddingRight = values[0]
          attrs.contentPaddingBottom = values[0]
          attrs.contentPaddingLeft = values[0]
        }
        break
      case 2: // Vertical, Horizontal
        if (values[0] !== '0px') {
          attrs.contentPaddingTop = values[0]
          attrs.contentPaddingBottom = values[0]
        }
        if (values[1] !== '0px') {
          attrs.contentPaddingRight = values[1]
          attrs.contentPaddingLeft = values[1]
        }
        break
      case 3: // Top, Horizontal, Bottom
        if (values[0] !== '0px') attrs.contentPaddingTop = values[0]
        if (values[1] !== '0px') {
          attrs.contentPaddingRight = values[1]
          attrs.contentPaddingLeft = values[1]
        }
        if (values[2] !== '0px') attrs.contentPaddingBottom = values[2]
        break
      case 4: // Top, Right, Bottom, Left
        if (values[0] !== '0px') attrs.contentPaddingTop = values[0]
        if (values[1] !== '0px') attrs.contentPaddingRight = values[1]
        if (values[2] !== '0px') attrs.contentPaddingBottom = values[2]
        if (values[3] !== '0px') attrs.contentPaddingLeft = values[3]
        break
    }
  } else {
    // Individual contentPadding values - only add non-zero values
    if (raw.contentPaddingTop && raw.contentPaddingTop !== '0')
      attrs.contentPaddingTop = ensurePx(raw.contentPaddingTop)
    if (raw.contentPaddingRight && raw.contentPaddingRight !== '0')
      attrs.contentPaddingRight = ensurePx(raw.contentPaddingRight)
    if (raw.contentPaddingBottom && raw.contentPaddingBottom !== '0')
      attrs.contentPaddingBottom = ensurePx(raw.contentPaddingBottom)
    if (raw.contentPaddingLeft && raw.contentPaddingLeft !== '0')
      attrs.contentPaddingLeft = ensurePx(raw.contentPaddingLeft)
  }

  return attrs
}

function parseAttributes(attrString: string): RawAttributes {
  const attrs: RawAttributes = {}

  // Special handling for content - capture everything between <p> tags
  const contentMatch = attrString.match(/content=<p>(.*?)<\/p>/)
  if (contentMatch) {
    // Strip the <p> tags when storing the content
    attrs.content = parseEscapeSequences(contentMatch[1])
    attrString = attrString.replace(contentMatch[0], '')
  }

  // Special handling for links - match both quoted and unquoted keys
  const jsonMatch = attrString.match(/(\w+)=(\[[\s\S]*?\])/)
  if (jsonMatch) {
    const [fullMatch, key, jsonValue] = jsonMatch
    // Convert unquoted keys to quoted keys before parsing
    const normalizedJson = jsonValue.replace(/(\{|,)\s*(\w+):/g, '$1"$2":')
    attrs[key] = normalizedJson
    attrString = attrString.replace(fullMatch, '')
  }

  // Special handling for alt attribute - capture everything between quotes
  const altMatch = attrString.match(/alt="([^"]*)"/)
  if (altMatch) {
    attrs.alt = altMatch[1]
    attrString = attrString.replace(altMatch[0], '')
  }

  // Parse remaining attributes - improved regex to handle values with or without quotes
  // This regex matches key=value pairs where value can be:
  // 1. A quoted string: key="value with spaces"
  // 2. A non-quoted string without spaces: key=value
  const pairs = attrString.match(/(\w+)=(?:"([^"]*)"|([^\s"]+))/g) || []

  pairs.forEach((pair) => {
    // Split only at the first equals sign
    const equalIndex = pair.indexOf('=')
    if (equalIndex === -1) return

    const key = pair.substring(0, equalIndex)
    let value = pair.substring(equalIndex + 1)

    // Remove surrounding quotes if present
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1)
    }

    if (key === 'padding') {
      // Handle padding specially
      const paddingValues = parsePadding(value)
      Object.assign(attrs, paddingValues)
    } else if (key === 'contentPadding') {
      // Handle contentPadding specially
      const contentPaddingValues = parsePadding(value)
      // Convert regular padding keys to contentPadding keys
      Object.entries(contentPaddingValues).forEach(([paddingKey, paddingValue]) => {
        const contentKey = paddingKey.replace('padding', 'contentPadding')
        attrs[contentKey] = paddingValue
      })
    } else {
      attrs[key] = value
    }
  })

  return attrs
}

// ===== Structural Block Parsers =====
const parseRowAttributes: AttributeParser<RowBlockAttributes> = (raw) => {
  const attrs: RowBlockAttributes = {
    ...handlePadding(raw),
  }

  // Only add properties if they exist in raw (even if they're falsy but valid values)
  if ('backgroundColor' in raw) attrs.backgroundColor = raw.backgroundColor
  if ('borderColor' in raw) attrs.borderColor = raw.borderColor
  if ('borderRadius' in raw) attrs.borderRadius = ensurePx(raw.borderRadius)
  if ('borderStyle' in raw && isBorderStyle(raw.borderStyle)) attrs.borderStyle = raw.borderStyle
  if ('borderWidth' in raw) attrs.borderWidth = ensurePx(raw.borderWidth)
  if ('columnSpacing' in raw) attrs.columnSpacing = Number(raw.columnSpacing)
  if ('type' in raw) attrs.type = raw.type as ComponentType
  if ('verticalAlign' in raw && isVerticalAlign(raw.verticalAlign)) attrs.verticalAlign = raw.verticalAlign

  // Boolean fields need special handling
  if ('hideOnMobile' in raw) attrs.hideOnMobile = raw.hideOnMobile === 'true'
  if ('stackOnMobile' in raw) attrs.stackOnMobile = raw.stackOnMobile === 'true'

  return attrs
}

const parseColumnAttributes: AttributeParser<ColumnBlockAttributes> = (raw) => {
  let attrs: ColumnBlockAttributes = {}

  // Handle padding
  // attrs = handlePadding(raw, attrs)

  return attrs
}

// ===== Content Block Parsers =====
const parseButtonAttributes: AttributeParser<ButtonBlockAttributes> = (raw) => {
  const attrs: ButtonBlockAttributes = {
    ...handleTextAttributes(raw),
    ...handlePadding(raw),
    ...handleContentPadding(raw),
    href: raw.href || '#', // Default value is fine
  }

  if ('align' in raw && isAlign(raw.align)) attrs.align = raw.align
  if ('backgroundColor' in raw) attrs.backgroundColor = raw.backgroundColor
  if ('borderColor' in raw) attrs.borderColor = raw.borderColor
  if ('borderRadius' in raw) attrs.borderRadius = ensurePx(raw.borderRadius)
  if ('borderStyle' in raw && isBorderStyle(raw.borderStyle)) attrs.borderStyle = raw.borderStyle
  if ('borderWidth' in raw) attrs.borderWidth = ensurePx(raw.borderWidth)

  return attrs
}

const parseDividerAttributes: AttributeParser<DividerBlockAttributes> = (raw) => {
  const attrs: DividerBlockAttributes = {
    ...handlePadding(raw),
  }

  // Divider-specific attributes
  if (isBorderStyle(raw.borderStyle)) {
    attrs.borderStyle = raw.borderStyle as DividerBlockAttributes['borderStyle']
  }
  if (raw.borderWidth) attrs.borderWidth = ensurePx(raw.borderWidth)
  if (raw.borderColor) attrs.borderColor = raw.borderColor

  return attrs
}

const parseHeadingAttributes: AttributeParser<HeadingBlockAttributes> = (raw) => {
  const attrs: HeadingBlockAttributes = {
    ...handleTextAttributes(raw),
    ...handlePadding(raw),
    level: (raw.level as HeadingBlockAttributes['level']) || 'h2',
  }

  if (isTextAlign(raw.textAlign)) attrs.textAlign = raw.textAlign as HeadingBlockAttributes['textAlign']

  return attrs
}

const parseImageAttributes: AttributeParser<ImageBlockAttributes> = (raw) => {
  const attrs: ImageBlockAttributes = {
    ...handlePadding(raw),
    alt: raw.alt || '', // Default value is fine
    src: raw.src || '', // Default value is fine
  }

  if ('align' in raw && isAlign(raw.align)) attrs.align = raw.align
  if ('borderRadius' in raw) attrs.borderRadius = ensurePx(raw.borderRadius)
  if ('width' in raw) attrs.width = ensurePx(raw.width)

  return attrs
}

const parseLinkAttributes: AttributeParser<LinkBlockAttributes> = (raw) => {
  const attrs: LinkBlockAttributes = {
    ...handleTextAttributes(raw),
    ...handlePadding(raw),
    align: isAlign(raw.align) ? raw.align : undefined,
    href: raw.href || '#', // Default to '#' if not provided
  }

  return attrs
}

const parseSocialsAttributes: AttributeParser<SocialsBlockAttributes> = (raw) => {
  const attrs: SocialsBlockAttributes = {
    ...handlePadding(raw),
    align: isAlign(raw.align) ? raw.align : undefined,
    folder: isSocialIconFolder(raw.folder) ? raw.folder : 'socials-color',
    links: [],
  }

  // Parse social links from raw attributes
  try {
    const jsonStr = raw.links?.trim() || '[]'
    console.log('Parsing social links from:', jsonStr) // Debug log

    // Validate JSON string format
    if (!jsonStr.startsWith('[') || !jsonStr.endsWith(']')) {
      console.error('Invalid JSON array format:', jsonStr)
      throw new Error('Invalid JSON array format')
    }

    const rawLinks = JSON.parse(jsonStr)
    console.log('Parsed links:', rawLinks) // Debug log

    if (Array.isArray(rawLinks)) {
      attrs.links = rawLinks
        .filter((link) => isSocialIconName(link.icon))
        .map((link) => ({
          icon: link.icon.toLowerCase(), // Normalize to lowercase
          url: link.url || '',
          title: link.title || '',
          alt: link.alt || '',
        }))
    }
  } catch (e) {
    console.error('Failed to parse social links:', e)
    console.debug('Raw links value:', raw.links)
    console.debug('links type:', typeof raw.links)
  }

  console.log('Final socials attrs:', attrs) // Debug log
  return attrs
}

const parseSurveyAttributes: AttributeParser<SurveyBlockAttributes> = (raw) => {
  const attrs: SurveyBlockAttributes = {
    ...handlePadding(raw),
    kind: raw.kind as SurveyBlockAttributes['kind'],
    question: raw.question || '',
    color: raw.color,
  }

  return attrs
}

const parseTextAttributes: AttributeParser<TextBlockAttributes> = (raw) => {
  const attrs: TextBlockAttributes = {
    ...handleTextAttributes(raw),
    ...handlePadding(raw),
  }

  if (isTextAlign(raw.textAlign)) attrs.textAlign = raw.textAlign as TextBlockAttributes['textAlign']

  return attrs
}

// ===== Parser Registry =====
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

// ===== Image Processing Helpers =====
function determineImageOrientation(row: RowBlock): 'landscape' | 'portrait' | 'square' {
  // Count image blocks and total blocks in the row
  let imageCount = 0
  let totalBlocks = 0

  row.columns.forEach((column) => {
    const hasImage = column.blocks.some((block) => block.type === 'image')
    if (hasImage) imageCount++
    totalBlocks += column.blocks.length
  })

  // If there are more than 2 columns with images, use square
  if (imageCount > 2) return 'square'

  // If there's 1 image column and other content, use square
  if (imageCount === 1 && totalBlocks > imageCount) return 'square'

  // Default to landscape for 1-2 columns of just images
  return 'landscape'
}

async function processBlocks(blocks: any[], row: RowBlock): Promise<any[]> {
  const orientation = determineImageOrientation(row)

  return Promise.all(
    blocks.map(async (block) => {
      if (block.type === 'image' && block.attributes?.src?.startsWith('pexels:')) {
        // Resolve the image source with determined orientation
        const resolvedSrc = await resolveImageSrc(block.attributes.src, orientation)
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

async function processColumns(columns: any[], row: RowBlock): Promise<any[]> {
  return Promise.all(
    columns.map(async (column) => ({
      ...column,
      blocks: column.blocks ? await processBlocks(column.blocks, row) : [],
    }))
  )
}

async function processRows(rows: any[]): Promise<any[]> {
  return Promise.all(
    rows.map(async (row) => ({
      ...row,
      columns: row.columns ? await processColumns(row.columns, row) : [],
    }))
  )
}

// ===== Main Parser Functions =====
export function parseEmailScript(script: string, email: Email): Email {
  const rows: RowBlock[] = []
  const lines = script.trim().split('\n')
  let currentRow: RowBlock | null = null
  let currentColumn: ColumnBlock | null = null
  let depth = 0

  // Initialize email attributes
  const emailAttributes: Partial<Email> = {}

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Handle email start
    if (line.startsWith('<EMAIL')) {
      const emailMatch = line.match(/<EMAIL\s*([^>]*)>/)
      if (!emailMatch) continue

      const emailAttrs = parseAttributes(emailMatch[1])
      Object.assign(emailAttributes, emailAttrs)
      continue
    }

    // Handle row start
    if (line.startsWith('ROW')) {
      const rowMatch = line.match(/ROW\s*([^{]*)\{?/)
      if (!rowMatch) continue

      const rowAttrs = parseAttributes(rowMatch[1])

      currentRow = createRow(parseRowAttributes(rowAttrs))
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
          const socialAttrs = blockParsers.socials(attrs)
          createBlock('socials', '', socialAttrs, currentColumn)
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

  // Return the email object with parsed attributes and rows
  return {
    ...email,
    ...emailAttributes,
    rows,
  }
}

export async function processEmailImages(email: Email): Promise<Email> {
  return {
    ...email,

    rows: await processRows(email.rows),
  }
}
