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
  ListBlockAttributes,
  PaddingAttributes,
  RowBlock,
  RowBlockAttributes,
  SocialIconFolders,
  SocialIconName,
  SocialsBlockAttributes,
  SpacerBlockAttributes,
  SurveyBlockAttributes,
  TableBlockAttributes,
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

  // Normalize whitespace - convert newlines and multiple spaces to single spaces
  const normalizedAttrString = attrString.replace(/\s+/g, ' ').trim()

  // Special handling for content - capture everything between <p> tags
  const contentMatch = normalizedAttrString.match(/content=<p>(.*?)<\/p>/)
  if (contentMatch) {
    // Strip the <p> tags when storing the content
    attrs.content = parseEscapeSequences(contentMatch[1])
    attrString = normalizedAttrString.replace(contentMatch[0], '')
  }

  // Special handling for complex JSON arrays (like table rows)
  // This needs to happen before other attribute parsing
  const complexJsonMatch = normalizedAttrString.match(/(\w+)=(\[[\s\S]*?\])(?=\s+\w+=|\s*$)/)
  if (complexJsonMatch) {
    const [fullMatch, key, jsonValue] = complexJsonMatch
    attrs[key] = jsonValue
    attrString = normalizedAttrString.replace(fullMatch, '')
  }

  // Special handling for links - match both quoted and unquoted keys
  const jsonMatch = normalizedAttrString.match(/(\w+)=(\[[\s\S]*?\])/)
  if (jsonMatch) {
    const [fullMatch, key, jsonValue] = jsonMatch
    // Convert unquoted keys to quoted keys before parsing
    const normalizedJson = jsonValue.replace(/(\{|,)\s*(\w+):/g, '$1"$2":')
    attrs[key] = normalizedJson
    attrString = normalizedAttrString.replace(fullMatch, '')
  }

  // Special handling for alt attribute - capture everything between quotes
  const altMatch = normalizedAttrString.match(/alt="([^"]*)"/)
  if (altMatch) {
    attrs.alt = altMatch[1]
    attrString = normalizedAttrString.replace(altMatch[0], '')
  }

  // Parse remaining attributes - improved regex to handle values with or without quotes
  // This regex matches key=value pairs where value can be:
  // 1. A quoted string: key="value with spaces"
  // 2. A non-quoted string without spaces: key=value
  const pairs = normalizedAttrString.match(/(\w+)=(?:"([^"]*)"|([^\s"]+))/g) || []

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
  if ('borderRadiusSide' in raw) attrs.borderRadiusSide = raw.borderRadiusSide as RowBlockAttributes['borderRadiusSide']
  if ('borderSide' in raw) attrs.borderSide = raw.borderSide as RowBlockAttributes['borderSide']
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

  // Parse social links from raw attributes - only if the links attribute exists
  if (raw.links) {
    try {
      const jsonStr = raw.links.trim()

      // Try to parse the JSON, but don't throw if it fails
      try {
        const rawLinks = JSON.parse(jsonStr)

        if (Array.isArray(rawLinks)) {
          attrs.links = rawLinks
            .filter((link) => isSocialIconName(link.icon))
            .map((link) => ({
              // Handle twitter -> x conversion
              icon: link.icon.toLowerCase() === 'twitter' ? 'x' : link.icon.toLowerCase(),
              url: link.url || '',
              title: link.title || '',
              alt: link.alt || '',
            }))
        }
      } catch (jsonError) {
        console.warn('Could not parse social links as JSON, will use child SOCIAL elements instead')
      }
    } catch (e) {
      console.warn('Failed to process social links attribute')
      console.debug('Raw links value:', raw.links)
    }
  }
  // If no links attribute, that's fine - we'll let the SOCIAL child elements handling take over

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

const parseTableAttributes: AttributeParser<TableBlockAttributes> = (raw) => {
  const attrs: TableBlockAttributes = {
    ...handlePadding(raw),
    rows: [],
  }

  if (raw.rows) {
    try {
      // First, normalize the JSON string to handle HTML content
      let rowsStr = raw.rows.trim()

      // Try direct JSON parsing first
      try {
        const rowsData = JSON.parse(rowsStr)
        if (Array.isArray(rowsData) && rowsData.every((row) => Array.isArray(row))) {
          attrs.rows = rowsData
        }
      } catch (jsonError) {
        // If direct parsing fails, extract HTML content with <p> tags
        // Match the overall structure of rows
        const rowsRegex = /\[\[(.*)\]\]/s
        const rowsMatch = rowsStr.match(rowsRegex)

        if (rowsMatch) {
          // Split into individual rows
          const rowsContent = rowsMatch[1]
          const rowStrings = rowsContent.split('],[')

          // Process each row
          const parsedRows = rowStrings.map((rowStr) => {
            // Extract all <p> tags in this row
            const pTagRegex = /<p>.*?<\/p>/g
            const cells = rowStr.match(pTagRegex) || []
            return cells
          })

          attrs.rows = parsedRows
        }
      }
    } catch (e) {
      console.error('Failed to parse table rows:', e)
      console.debug('Raw rows value:', raw.rows)
    }
  }

  return attrs
}

const parseListAttributes: AttributeParser<ListBlockAttributes> = (raw) => {
  const attrs: ListBlockAttributes = {
    ...handlePadding(raw),
    items: [],
    type: 'ul',
  }

  // Parse items from raw attributes
  try {
    if (raw.items) {
      const itemsStr = raw.items.trim()

      // Handle items with <p> tags
      if (itemsStr.includes('<p>')) {
        // Extract content from <p> tags
        const pTagRegex = /<p>(.*?)<\/p>/g
        const matches = [...itemsStr.matchAll(pTagRegex)]

        if (matches.length > 0) {
          attrs.items = matches.map((match) => match[1])
        }
      }
      // Handle JSON array format
      else if (itemsStr.startsWith('[') && itemsStr.endsWith(']')) {
        // Try to parse as JSON
        try {
          const rawItems = JSON.parse(itemsStr)

          if (Array.isArray(rawItems)) {
            // Check if items in array contain <p> tags
            attrs.items = rawItems.map((item) => {
              const match = String(item).match(/<p>(.*?)<\/p>/)
              return match ? match[1] : String(item)
            })
          }
        } catch {
          // If JSON parsing fails, fall back to comma splitting
          attrs.items = itemsStr.split(',').map((item) => {
            const match = item.match(/<p>(.*?)<\/p>/)
            return match ? match[1].trim() : item.trim()
          })
        }
      }
      // Handle comma-separated format
      else {
        attrs.items = itemsStr.split(',').map((item) => item.trim())
      }
    }
  } catch (e) {
    console.error('Failed to parse list items:', e)
    console.debug('Raw items value:', raw.items)
  }

  // FIRST: Check if type is directly specified (this should take precedence)
  if (raw.type && ['ul', 'ol', 'icon'].includes(raw.type)) {
    attrs.type = raw.type as ListBlockAttributes['type']
  }
  // SECOND: If listStyle is specified, map it to the correct type
  else if (raw.listStyle) {
    // Map listStyle values to correct type values
    if (raw.listStyle === 'bullet') attrs.type = 'ul'
    else if (raw.listStyle === 'number') attrs.type = 'ol'
    else if (raw.listStyle === 'icon') attrs.type = 'icon'
  }

  // Handle icons if present and type is icon
  if (raw.icons && attrs.type === 'icon') {
    try {
      const iconStr = raw.icons.trim()

      // Check if it's a valid JSON array format
      if (iconStr.startsWith('[') && iconStr.endsWith(']')) {
        try {
          // Try parsing as JSON first
          const rawIcons = JSON.parse(iconStr)

          if (Array.isArray(rawIcons)) {
            attrs.icons = rawIcons.map((icon) => String(icon))
          }
        } catch (jsonError) {
          // If JSON parsing fails, treat it as a comma-separated list
          // Remove the brackets first if present
          const cleanedStr = iconStr.replace(/^\[|\]$/g, '')
          attrs.icons = cleanedStr.split(',').map((icon) => icon.trim())
        }
      } else {
        // If not JSON format, just split by comma
        attrs.icons = iconStr.split(',').map((icon) => icon.trim())
      }
    } catch (e) {
      console.error('Failed to parse list icons:', e)
      console.debug('Raw icons value:', raw.icons)
    }
  }

  return attrs
}

// ===== Parser Registry =====
const parseSpacerAttributes: AttributeParser<SpacerBlockAttributes> = (raw) => {
  // Get the height attribute with a default value of '20' if not provided
  return {
    height: raw.height || '10',
  }
}

const blockParsers = {
  heading: parseHeadingAttributes,
  text: parseTextAttributes,
  button: parseButtonAttributes,
  image: parseImageAttributes,
  link: parseLinkAttributes,
  divider: parseDividerAttributes,
  socials: parseSocialsAttributes,
  survey: parseSurveyAttributes,
  table: parseTableAttributes,
  list: parseListAttributes,
  spacer: parseSpacerAttributes,
} as const

// ===== Image Processing Helpers =====
function determineImageOrientation(row: RowBlock): 'landscape' | 'portrait' | 'square' {
  // Count image blocks and total blocks in the row
  let imageCount = 0
  let totalBlocks = 0

  if (row.attributes.type === 'cart') {
    return 'square'
  }

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
export function parseEmailScript(script: string): Email {
  const rows: RowBlock[] = []
  const lines = script.trim().split('\n')
  let currentRow: RowBlock | null = null
  let currentColumn: ColumnBlock | null = null
  let depth = 0

  // Counters for debugging
  let textBlockCount = 0
  let buttonBlockCount = 0
  let headingBlockCount = 0

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
    if (line.startsWith('<ROW')) {
      const rowMatch = line.match(/<ROW\s*([^>]*)>/)
      if (!rowMatch) continue

      const rowAttrs = parseAttributes(rowMatch[1])
      currentRow = createRow(parseRowAttributes(rowAttrs))
      rows.push(currentRow)
      depth++
      continue
    }

    // Handle column start
    if (line.startsWith('<COLUMN')) {
      if (!currentRow) continue

      const columnMatch = line.match(/<COLUMN\s*([^>]*)>/)
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
          col.attributes.width = `${evenWidth}%`
        })
      } else {
        // Use provided width
        width = columnAttrs.width.endsWith('%') ? columnAttrs.width : `${columnAttrs.width}%`
      }

      currentColumn = createColumn([], width, parseColumnAttributes(columnAttrs))
      currentRow.columns.push(currentColumn)
      depth++

      // Special handling for cart rows
      if (currentRow.attributes.type === 'cart') {
        // Collect all CART_ITEM elements that will appear in this column
        let cartItems = []
        let j = i + 1
        let columnDepth = 1

        while (j < lines.length) {
          const currentLine = lines[j].trim()

          // Track column depth to properly detect the end of this column
          if (currentLine.startsWith('<COLUMN')) {
            columnDepth++
          } else if (currentLine.startsWith('</COLUMN>')) {
            columnDepth--
            if (columnDepth === 0) {
              break // End of this column
            }
          }

          // Collect cart items
          if (currentLine.startsWith('<CART_ITEM')) {
            const itemMatch = currentLine.match(/<CART_ITEM\s*([^>\/]*)(?:\/>|>)/)
            if (itemMatch) {
              const itemAttrs = parseAttributes(itemMatch[1])
              cartItems.push(itemAttrs)
            }
          }

          j++
        }

        // If we found cart items, replace the current row and generate new rows
        if (cartItems.length > 0) {
          // Remove the current row from rows array since we'll replace it
          rows.pop()

          // Process cart items and create new rows for each item
          for (let itemIndex = 0; itemIndex < cartItems.length; itemIndex++) {
            const item = cartItems[itemIndex]
            const isFirstItem = itemIndex === 0
            const isLastItem = itemIndex === cartItems.length - 1

            // Determine border radius side
            let borderRadiusSide: 'top' | 'bottom' | 'both' | undefined = undefined
            if (cartItems.length === 1) {
              borderRadiusSide = 'both'
            } else if (isFirstItem) {
              borderRadiusSide = 'top'
            } else if (isLastItem) {
              borderRadiusSide = 'bottom'
            }

            // Create row for this cart item
            const cartRow = createRow({
              type: 'cart',
              borderRadius: '12',
              borderRadiusSide,
            })

            // Create first column with image
            const imageColumn = createColumn([], '33%', {})
            if (item.image) {
              createBlock(
                'image',
                '',
                {
                  src: item.image,
                  alt: item.name || 'Product image',
                },
                imageColumn
              )
            }
            cartRow.columns.push(imageColumn)

            // Create second column with item details
            const detailsColumn = createColumn([], '66%', {})

            // Add heading with product name
            if (item.name) {
              createBlock('heading', item.name, { content: item.name }, detailsColumn)
            }

            // Add price text
            if (item.price) {
              createBlock('text', item.price, { content: item.price }, detailsColumn)
            }

            // Add description text
            if (item.description) {
              createBlock('text', item.description, { content: item.description }, detailsColumn)
            }

            // Add quantity text
            if (item.quantity) {
              createBlock(
                'text',
                `Quantity: ${item.quantity}`,
                {
                  content: `Quantity: ${item.quantity}`,
                },
                detailsColumn
              )
            }

            // Add buy button
            createBlock(
              'button',
              'Buy now',
              {
                content: 'Buy now',
                href: '#',
              },
              detailsColumn
            )

            // Add divider if this isn't the last item
            if (!isLastItem) {
              createBlock('divider', '', {}, detailsColumn)
            }

            cartRow.columns.push(detailsColumn)
            rows.push(cartRow)
          }

          // Skip to the end of the column to avoid processing the cart items again
          i = j

          // Reset current column and row since we've replaced them
          currentColumn = null
          currentRow = null
          depth--
        }
      }

      continue
    }

    // Direct handler for CART_ITEM elements
    if (line.startsWith('<CART_ITEM') && currentColumn && currentRow?.attributes.type === 'cart') {
      // Get all cart items in this column
      let cartItems = []
      const rowIndex = rows.indexOf(currentRow)

      // The current cart item might span multiple lines
      let currentItemLines = [line]
      let j = i + 1

      // Collect lines until the closing /> is found
      while (j < lines.length && !currentItemLines.join(' ').includes('/>')) {
        currentItemLines.push(lines[j].trim())
        j++
      }

      // Combine all lines of the current cart item
      const fullItemTag = currentItemLines.join(' ').trim()

      // Extract attributes from the combined tag
      const itemMatch = fullItemTag.match(/<CART_ITEM\s+([^>]*)(?:\/>|>)/)
      if (itemMatch) {
        const itemAttrs = parseAttributes(itemMatch[1])
        cartItems.push(itemAttrs)
      }

      // Look ahead for more cart items in this column
      while (j < lines.length && !lines[j].trim().startsWith('</COLUMN>')) {
        const nextLine = lines[j].trim()

        if (nextLine.startsWith('<CART_ITEM')) {
          // This is the start of another cart item
          let nextItemLines = [nextLine]
          let k = j + 1

          // Collect lines until the closing /> is found
          while (k < lines.length && !nextItemLines.join(' ').includes('/>')) {
            nextItemLines.push(lines[k].trim())
            k++
          }

          // Combine all lines of this cart item
          const fullNextItemTag = nextItemLines.join(' ').trim()

          // Extract attributes from the combined tag
          const nextMatch = fullNextItemTag.match(/<CART_ITEM\s+([^>]*)(?:\/>|>)/)
          if (nextMatch) {
            const nextAttrs = parseAttributes(nextMatch[1])
            cartItems.push(nextAttrs)
          }

          // Update j to skip past this cart item
          j = k
        } else {
          j++
        }
      }

      // Remove the original row - we'll create separate rows for each cart item
      if (rowIndex !== -1) {
        rows.splice(rowIndex, 1)
      }

      // Create rows for each cart item (and dividers between them)
      let insertIndex = rowIndex

      for (let itemIndex = 0; itemIndex < cartItems.length; itemIndex++) {
        const item = cartItems[itemIndex]
        const isFirstItem = itemIndex === 0
        const isLastItem = itemIndex === cartItems.length - 1
        const isSingleItem = cartItems.length === 1

        // Determine border radius side
        let borderRadiusSide: 'top' | 'bottom' | 'both' | undefined = undefined
        if (isSingleItem) {
          borderRadiusSide = 'both'
        } else if (isFirstItem) {
          borderRadiusSide = 'top'
        } else if (isLastItem) {
          borderRadiusSide = 'bottom'
        }

        // Only apply the border radius on first/last items
        const borderRadius = isFirstItem || isLastItem || isSingleItem ? '12' : undefined

        // Setup padding based on position
        const rowPadding: Record<string, string> = {}

        if (isFirstItem || isSingleItem) {
          rowPadding.paddingTop = '16px'
        }

        if (isLastItem || isSingleItem) {
          rowPadding.paddingBottom = '16px'
        }

        // Create a new row for this cart item with appropriate padding
        const cartRow = createRow({
          type: 'cart',
          borderRadius,
          borderRadiusSide,
          ...rowPadding,
        })

        // Image column (33%)
        const imageColumn = createColumn([], '33%', {})
        if (item.image) {
          createBlock(
            'image',
            '',
            {
              src: item.image,
              alt: item.name || 'Product image',
            },
            imageColumn
          )
        }
        cartRow.columns.push(imageColumn)

        // Details column (66%)
        const detailsColumn = createColumn([], '66%', {})

        if (item.name) {
          createBlock('heading', item.name, { content: item.name }, detailsColumn)
        }

        if (item.price) {
          createBlock('text', item.price, { content: item.price }, detailsColumn)
        }

        if (item.description) {
          createBlock('text', item.description, { content: item.description }, detailsColumn)
        }

        if (item.quantity) {
          createBlock(
            'text',
            `Quantity: ${item.quantity}`,
            {
              content: `Quantity: ${item.quantity}`,
            },
            detailsColumn
          )
        }

        createBlock(
          'button',
          'Buy now',
          {
            content: 'Buy now',
            href: '#',
          },
          detailsColumn
        )

        cartRow.columns.push(detailsColumn)

        // Insert the cart item row
        rows.splice(insertIndex, 0, cartRow)
        insertIndex++

        // If this is not the last item, add a divider row
        if (!isLastItem) {
          // Create a separate row for the divider
          const dividerRow = createRow({
            type: 'cart',
            // No border radius for divider rows
          })

          // Single column for the divider
          const dividerColumn = createColumn([], '100%', {})
          createBlock('divider', '', {}, dividerColumn)
          dividerRow.columns.push(dividerColumn)

          // Insert the divider row
          rows.splice(insertIndex, 0, dividerRow)
          insertIndex++
        }
      }

      // Skip to after all the cart items we processed
      i = j - 1

      // Reset current row and column since we've replaced them
      currentRow = null
      currentColumn = null
      depth--

      continue
    }

    // Handle closing tags
    if (line.startsWith('</ROW>')) {
      depth--

      // Special handling for cart rows: adjust the last item
      if (currentRow?.attributes.type === 'cart') {
        // Find all cart rows that were generated
        const cartRows = rows.filter((row) => row.attributes.type === 'cart')

        if (cartRows.length > 0) {
          // Set the last item's borderRadiusSide to 'bottom'
          const lastCartRow = cartRows[cartRows.length - 1]
          lastCartRow.attributes.borderRadiusSide = cartRows.length === 1 ? 'all' : 'bottom'

          // Remove the divider from the last item's details column
          if (lastCartRow.columns.length >= 2) {
            const detailsColumn = lastCartRow.columns[1]
            // Find and remove the last divider block
            const dividerIndex = detailsColumn.blocks.findIndex((block) => block.type === 'divider')
            if (dividerIndex !== -1) {
              detailsColumn.blocks.splice(dividerIndex, 1)
            }
          }
        }
      }

      currentRow = null
      currentColumn = null
      continue
    }

    if (line.startsWith('</COLUMN>')) {
      depth--
      currentColumn = null
      continue
    }

    // Handle LIST component specially to capture LI elements
    if (line.startsWith('<LIST') && currentColumn) {
      // Use a more permissive regex that matches both <LIST> and <LIST attributes>
      let attrMatch = line.match(/<LIST(?:\s+([^>]*))?>/)
      let attrs: RawAttributes = {}

      if (attrMatch && attrMatch[1]) {
        // Only parse attributes if there's content between tag name and >
        attrs = parseAttributes(attrMatch[1])
      }

      const items: string[] = []

      // Check if this is a self-closing LIST tag (items attribute provided directly)
      if (line.endsWith('/>') || attrs.items) {
        // The existing parser will handle this case
        createBlock('list', '', blockParsers.list(attrs), currentColumn)
        continue
      }

      // If not self-closing, collect all LI elements until </LIST>
      let j = i + 1
      let foundClosingTag = false
      while (j < lines.length && !lines[j].trim().startsWith('</LIST>')) {
        const currentLine = lines[j].trim()

        // Match LI element - either self-contained on one line or spanning multiple lines
        if (currentLine.startsWith('<LI>')) {
          // Check if opening and closing tags are on same line
          const singleLineLiMatch = currentLine.match(/<LI>(.*?)<\/LI>/)

          if (singleLineLiMatch) {
            // Single line LI
            items.push(singleLineLiMatch[1].trim())
          } else {
            // Multi-line LI - collect content until </LI>
            let liContent = ''

            // Extract any content after the opening tag
            const openingTagEndPos = currentLine.indexOf('>')
            if (openingTagEndPos !== -1 && openingTagEndPos < currentLine.length - 1) {
              liContent = currentLine.substring(openingTagEndPos + 1).trim()
            }

            let k = j + 1
            let foundLiClosingTag = false
            while (k < lines.length && !lines[k].trim().includes('</LI>')) {
              liContent += (liContent ? ' ' : '') + lines[k].trim()
              k++
            }

            // Handle the closing tag line if found
            if (k < lines.length) {
              const closingLine = lines[k].trim()
              foundLiClosingTag = true
              const closingTagPos = closingLine.indexOf('</LI>')

              if (closingTagPos > 0) {
                // Add content before closing tag
                const contentBeforeClosing = closingLine.substring(0, closingTagPos).trim()
                liContent += (liContent ? ' ' : '') + contentBeforeClosing
              }

              j = k // Skip to the line with closing tag
            }

            items.push(liContent.trim())
          }
        }

        j++
      }

      // Skip to the line with closing LIST tag
      i = j

      // Convert items array to JSON string format for the parser
      attrs.items = JSON.stringify(items)

      // Now use the blockParser which will handle converting from string to string[]
      createBlock('list', '', blockParsers.list(attrs), currentColumn)
      continue
    }

    // Handle TABLE component specially to capture TR/TD elements
    if (line.startsWith('<TABLE') && currentColumn) {
      const attrMatch = line.match(/<TABLE\s*([^>]*)>/)
      if (!attrMatch) continue

      const attrs = parseAttributes(attrMatch[1])

      // Check if this is a self-closing TABLE tag (rows attribute provided directly)
      if (line.endsWith('/>') || attrs.rows) {
        // The existing parser will handle this case
        createBlock('table', '', blockParsers.table(attrs), currentColumn)
        continue
      }

      // If not self-closing, collect all TR/TD elements until </TABLE>
      const tableRows: string[][] = []
      let currentRowData: string[] = []

      let j = i + 1
      while (j < lines.length && !lines[j].trim().startsWith('</TABLE>')) {
        const currentLine = lines[j].trim()

        // Handle row start
        if (currentLine.startsWith('<TR>')) {
          // Start a new row
          currentRowData = []
        }

        // Handle row end - add the row to our table data
        else if (currentLine.startsWith('</TR>')) {
          if (currentRowData.length > 0) {
            tableRows.push([...currentRowData])
          }
        }

        // Handle cell content - can be on single line or multiple lines
        else if (currentLine.startsWith('<TD>')) {
          // Check if TD is self-contained on one line
          const singleLineTdMatch = currentLine.match(/<TD>(.*?)<\/TD>/)

          if (singleLineTdMatch) {
            // Single line TD
            currentRowData.push(singleLineTdMatch[1].trim())
          } else {
            // Multi-line TD - collect content until </TD>
            let cellContent = ''

            // Extract any content after the opening tag
            const openingTagEndPos = currentLine.indexOf('>')
            if (openingTagEndPos !== -1 && openingTagEndPos < currentLine.length - 1) {
              cellContent = currentLine.substring(openingTagEndPos + 1).trim()
            }

            let k = j + 1
            while (k < lines.length && !lines[k].trim().includes('</TD>')) {
              cellContent += (cellContent ? ' ' : '') + lines[k].trim()
              k++
            }

            // Handle the closing tag line if found
            if (k < lines.length) {
              const closingLine = lines[k].trim()
              const closingTagPos = closingLine.indexOf('</TD>')

              if (closingTagPos > 0) {
                // Add content before closing tag
                cellContent += (cellContent ? ' ' : '') + closingLine.substring(0, closingTagPos).trim()
              }

              j = k // Skip to the line with closing tag
            }

            currentRowData.push(cellContent.trim())
          }
        }

        j++
      }

      // Skip to the line with closing TABLE tag
      i = j

      // Set the rows attribute to the collected table data
      attrs.rows = JSON.stringify(tableRows)

      // Create the table block
      createBlock('table', '', blockParsers.table(attrs), currentColumn)
      continue
    }

    // Handle LINK, TEXT, BUTTON, HEADING specially to capture content between tags
    if (
      (line.startsWith('<LINK') ||
        line.startsWith('<TEXT') ||
        line.startsWith('<BUTTON') ||
        line.startsWith('<HEADING')) &&
      currentColumn
    ) {
      const tagName = line.match(/<(\w+)/)?.[1]?.toLowerCase()

      // If no tag name found, skip this line
      if (!tagName) {
        continue
      }

      // Modified to handle tags without attributes
      // This regex now handles both cases: <TAG attributes> and <TAG>
      let attrMatch = line.match(/<\w+(\s+[^>]*)?>/)
      let attrs: RawAttributes = {}

      if (attrMatch && attrMatch[1] && attrMatch[1].trim()) {
        // Only parse attributes if there's actual content between tag name and >
        attrs = parseAttributes(attrMatch[1])
      }

      // Check if the opening and closing tags are on the same line
      const singleLinePattern = new RegExp(`<${tagName.toUpperCase()}[^>]*>(.*?)</${tagName.toUpperCase()}>`)
      const singleLineMatch = line.match(singleLinePattern)

      let content = ''

      if (singleLineMatch) {
        // If opening and closing tags are on the same line, extract content directly
        content = singleLineMatch[1].trim()
      } else {
        // Multi-line content - start by checking if there's content after the opening tag
        const openingTagEnd = line.indexOf('>') + 1
        if (openingTagEnd < line.length) {
          content = line.substring(openingTagEnd).trim()
        }

        // Continue to next line
        let j = i + 1
        let closingTagFound = false

        while (j < lines.length && !closingTagFound) {
          const currentLine = lines[j].trim()
          const closingTagIndex = currentLine.indexOf(`</${tagName.toUpperCase()}>`)

          if (closingTagIndex !== -1) {
            // Found closing tag - add content up to that point
            if (closingTagIndex > 0) {
              const lineContentBeforeClosing = currentLine.substring(0, closingTagIndex).trim()
              content += (content && lineContentBeforeClosing ? ' ' : '') + lineContentBeforeClosing
            }
            closingTagFound = true
          } else {
            // No closing tag on this line - add entire line
            content += (content && currentLine ? ' ' : '') + currentLine
          }

          j++
        }

        // Update index to point to the line after the closing tag
        if (closingTagFound) {
          i = j - 1 // Set i to the line with closing tag (j-1 because the loop will increment i)
        }
      }

      // Create the block with the extracted content
      switch (tagName) {
        case 'link':
          attrs.content = content
          createBlock('link', content, blockParsers.link(attrs), currentColumn)
          break
        case 'text':
          attrs.content = content
          textBlockCount++
          createBlock('text', content, blockParsers.text(attrs), currentColumn)
          break
        case 'button':
          attrs.content = content
          buttonBlockCount++
          createBlock('button', content, blockParsers.button(attrs), currentColumn)
          break
        case 'heading':
          attrs.content = content
          headingBlockCount++
          createBlock('heading', content, blockParsers.heading(attrs), currentColumn)
          break
      }

      continue
    }

    // Handle SOCIALS component specially to capture SOCIAL elements
    if (line.startsWith('<SOCIALS') && currentColumn) {
      const attrMatch = line.match(/<SOCIALS\s*([^>]*)>/)
      if (!attrMatch) continue

      const attrs = parseAttributes(attrMatch[1])

      // Check if this is a self-closing SOCIALS tag (links attribute provided directly)
      if (line.endsWith('/>') || attrs.links) {
        // The existing parser will handle this case
        const socialAttrs = blockParsers.socials(attrs)
        createBlock('socials', '', socialAttrs, currentColumn)
        continue
      }

      // If not self-closing, collect all SOCIAL elements until </SOCIALS>
      const socialLinks: Array<{ icon: string; url: string; title: string; alt: string }> = []

      let j = i + 1
      while (j < lines.length && !lines[j].trim().startsWith('</SOCIALS>')) {
        const currentLine = lines[j].trim()

        // Handle SOCIAL element - must be self-closing
        if (currentLine.startsWith('<SOCIAL')) {
          const socialMatch = currentLine.match(/<SOCIAL\s+([^>]*)(?:\/>|>)/)

          if (socialMatch) {
            const socialAttrs = parseAttributes(socialMatch[1])

            // Only process if we have an icon
            if (socialAttrs.icon) {
              socialLinks.push({
                icon: socialAttrs.icon,
                url: socialAttrs.url || '#',
                title: socialAttrs.title || socialAttrs.icon.charAt(0).toUpperCase() + socialAttrs.icon.slice(1),
                alt: socialAttrs.alt || socialAttrs.title || socialAttrs.icon,
              })
            }
          }
        }

        j++
      }

      // Skip to the line with closing SOCIALS tag
      i = j

      // Set the links attribute to the collected social links
      attrs.links = JSON.stringify(socialLinks)

      // Create the socials block
      const socialAttrs = blockParsers.socials(attrs)
      createBlock('socials', '', socialAttrs, currentColumn)
      continue
    }

    // Handle other block types (self-closing tags)
    const blockMatch = line.match(/<(\w+)\s*([^>]*)>/)
    if (blockMatch && currentColumn) {
      const [, blockType, blockDef = ''] = blockMatch
      const attrs = parseAttributes(blockDef)

      switch (blockType.toLowerCase() as BlockType) {
        case 'image':
          createBlock('image', '', blockParsers.image(attrs), currentColumn)
          break
        case 'divider':
          createBlock('divider', '', blockParsers.divider(attrs), currentColumn)
          break
        case 'spacer':
          createBlock('spacer', '', blockParsers.spacer(attrs), currentColumn)
          break
        case 'socials':
          const socialAttrs = blockParsers.socials(attrs)
          createBlock('socials', '', socialAttrs, currentColumn)
          break
        case 'survey':
          createBlock('survey', '', blockParsers.survey(attrs), currentColumn)
          break
        case 'table':
          createBlock('table', '', blockParsers.table(attrs), currentColumn)
          break
        case 'list':
          createBlock('list', '', blockParsers.list(attrs), currentColumn)
          break
      }
    }
  }

  return {
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

// Helper function to parse list items from attribute value
function parseListItems(itemsStr: string): string[] {
  if (!itemsStr) return []

  try {
    // Try parsing as JSON array
    if (itemsStr.startsWith('[') && itemsStr.endsWith(']')) {
      try {
        const rawItems = JSON.parse(itemsStr)
        if (Array.isArray(rawItems)) {
          return rawItems.map((item) => String(item).trim())
        }
      } catch (e) {
        // If JSON parsing fails, try to clean up the string
        const cleanStr = itemsStr
          .replace(/^\[|\]$/g, '') // Remove outer brackets
          .replace(/'/g, '"') // Replace single quotes with double quotes

        try {
          // Try parsing again with fixed quotes
          const rawItems = JSON.parse(`[${cleanStr}]`)
          if (Array.isArray(rawItems)) {
            return rawItems.map((item) => String(item).trim())
          }
        } catch {
          // If that also fails, split by comma
          return cleanStr
            .split(',')
            .map((item) => item.trim())
            .map((item) => item.replace(/^['"]|['"]$/g, '')) // Remove quotes from each item
        }
      }
    }

    // Handle comma-separated format
    return itemsStr.split(',').map((item) => item.trim())
  } catch (e) {
    console.error('Failed to parse list items:', e)
    return []
  }
}
