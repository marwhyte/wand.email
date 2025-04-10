import {
  ButtonBlockAttributes,
  ColumnBlock,
  ColumnBlockAttributes,
  COMMON_SOCIAL_ICONS,
  ComponentType,
  DividerBlockAttributes,
  Email,
  HeadingBlockAttributes,
  IconBlockAttributes,
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

function isBorderRadius(value: string | undefined): value is RowBlockAttributes['borderRadius'] {
  return typeof value === 'string' && ['default', 'rounded', 'square'].includes(value)
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
  if (raw.type && ['ul', 'ol'].includes(raw.type)) {
    attrs.type = raw.type as ListBlockAttributes['type']
  }
  // SECOND: If listStyle is specified, map it to the correct type
  else if (raw.listStyle) {
    // Map listStyle values to correct type values
    if (raw.listStyle === 'bullet') attrs.type = 'ul'
    else if (raw.listStyle === 'number') attrs.type = 'ol'
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

const parseIconAttributes: AttributeParser<IconBlockAttributes> = (raw) => {
  const attrs: IconBlockAttributes = {
    ...handlePadding(raw),
    icon: raw.icon || 'check', // Default to check icon if none provided
  }

  // Handle title if present
  if (raw.title) {
    attrs.title = parseEscapeSequences(raw.title)
  }

  // Handle description if present
  if (raw.description) {
    attrs.description = parseEscapeSequences(raw.description)
  }

  // Handle color if present
  if (raw.color) {
    attrs.color = raw.color
  }

  // Handle size if present
  if (raw.size) {
    attrs.size = raw.size
  }

  // Handle alignment if present
  if (raw.align && isAlign(raw.align)) {
    attrs.align = raw.align
  }

  if (raw.s3IconUrl) {
    attrs.s3IconUrl = raw.s3IconUrl
  }

  // Handle position if present (top or left)
  if (raw.position && (raw.position === 'top' || raw.position === 'left')) {
    attrs.position = raw.position
  } else {
    // Default to left if not specified
    attrs.position = 'left'
  }

  return attrs
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
  icon: parseIconAttributes,
} as const

// ===== Main Parser Functions =====
export function parseEmailScript(
  script: string,
  themeColor: string,
  borderRadius: 'default' | 'rounded' | 'square',
  organizeFooter: boolean = false
): Email {
  const rows: RowBlock[] = []
  const lines = script.trim().split('\n')
  let currentRow: RowBlock | null = null
  let currentColumn: ColumnBlock | null = null
  let depth = 0

  // Counters for debugging
  let textBlockCount = 0
  let buttonBlockCount = 0
  let headingBlockCount = 0

  // Initialize email attributes with the default theme color
  const emailAttributes: Partial<Email> = {
    themeColor: themeColor,
    borderRadius: borderRadius,
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Handle email start
    if (line.startsWith('<EMAIL')) {
      const emailMatch = line.match(/<EMAIL\s*([^>]*)>/)
      if (!emailMatch) continue

      const emailAttrs = parseAttributes(emailMatch[1])
      // Only override theme if explicitly set in the email script
      if (emailAttrs.themeColor) {
        emailAttributes.themeColor = emailAttrs.themeColor
      }

      if (emailAttrs.borderRadius && isBorderRadius(emailAttrs.borderRadius)) {
        emailAttributes.borderRadius = emailAttrs.borderRadius as 'default' | 'rounded' | 'square'
      }

      Object.assign(emailAttributes, emailAttrs)
      continue
    }

    // Handle row start
    if (line.startsWith('<ROW')) {
      const rowMatch = line.match(/<ROW\s*([^>]*)>/)
      if (!rowMatch) continue

      const rowAttrs = parseAttributes(rowMatch[1])

      // Special handling for footers if organizeFooter is true
      if (rowAttrs.type === 'footer' && organizeFooter) {
        console.log(`🦶 Found footer row at line ${i}, organizingFooter=${organizeFooter}`)
        console.log(`🔍 Row attributes:`, rowAttrs)

        // Process the footer row specially to organize content
        const footerRowResult = processOrganizedFooterRow(i, lines, rowAttrs)

        // Add all footer rows to our email
        rows.push(...footerRowResult.rows)

        // Update our line index to skip processed lines
        i = footerRowResult.newIndex - 1 // Adjust for the loop increment
        continue
      } else if (rowAttrs.type === 'footer') {
        console.log(`🦶 Found footer row at line ${i}, but not organizing it (organizeFooter=${organizeFooter})`)
      }

      // Special handling for HEADING and TEXT blocks outside of columns in any row type
      // Look ahead to find HEADING and TEXT blocks before any COLUMN or ICON
      let j = i + 1
      let titleComponents = []
      let foundColumnOrIcon = false
      let titleLineIndices = new Set<number>()

      while (j < lines.length && !foundColumnOrIcon && !lines[j].trim().startsWith('</ROW>')) {
        const nextLine = lines[j].trim()

        // Check if we've reached a COLUMN or ICON tag
        if (nextLine.startsWith('<COLUMN') || nextLine.startsWith('<ICON')) {
          foundColumnOrIcon = true
          break
        }

        // Collect HEADING and TEXT blocks for the title row
        if (nextLine.startsWith('<HEADING') || nextLine.startsWith('<TEXT')) {
          titleComponents.push(j)
          titleLineIndices.add(j)

          // If this is a multi-line block, track all its lines
          const tagName = nextLine.match(/<(\w+)/)?.[1]?.toLowerCase()
          const closingTag = `</${tagName?.toUpperCase()}>`

          if (!nextLine.includes(closingTag)) {
            let k = j + 1
            while (k < lines.length && !lines[k].trim().includes(closingTag)) {
              titleLineIndices.add(k)
              k++
            }
            if (k < lines.length) {
              titleLineIndices.add(k) // Add the line with closing tag
            }
          }
        }

        j++
      }

      // If we found title components, create a separate row for them
      if (titleComponents.length > 0) {
        // Create the title row with the same attributes as the original row
        const titleRow = createRow({
          ...parseRowAttributes(rowAttrs),
        })

        // Add the title row to our email
        rows.push(titleRow)

        // Create a single column for the title row
        const titleColumn = createColumn([], '100%', {})
        titleRow.columns.push(titleColumn)

        // Process the title components (HEADING and TEXT blocks)
        for (const lineIndex of titleComponents) {
          const blockLine = lines[lineIndex].trim()
          const tagName = blockLine.match(/<(\w+)/)?.[1]?.toLowerCase()

          // Skip if no tag name found
          if (!tagName) continue

          // Handle HEADING
          if (tagName === 'heading') {
            // Extract attributes and content
            const attrMatch = blockLine.match(/<HEADING\s*([^>]*)>/)
            const attrs = attrMatch ? parseAttributes(attrMatch[1]) : {}

            // Extract content between tags
            let content = ''
            const singleLineMatch = blockLine.match(/<HEADING[^>]*>(.*?)<\/HEADING>/)

            if (singleLineMatch) {
              content = singleLineMatch[1].trim()
            } else {
              // Handle multi-line content
              const openingTagEnd = blockLine.indexOf('>') + 1
              if (openingTagEnd < blockLine.length) {
                content = blockLine.substring(openingTagEnd).trim()
              }

              let k = lineIndex + 1
              let closingTagFound = false

              while (k < lines.length && !closingTagFound) {
                const currentLine = lines[k].trim()
                const closingTagIndex = currentLine.indexOf('</HEADING>')

                if (closingTagIndex !== -1) {
                  if (closingTagIndex > 0) {
                    const contentBeforeClosing = currentLine.substring(0, closingTagIndex).trim()
                    content += (content && contentBeforeClosing ? ' ' : '') + contentBeforeClosing
                  }
                  closingTagFound = true
                } else {
                  content += (content && currentLine ? ' ' : '') + currentLine
                }

                k++
              }
            }

            // Add content to attributes
            attrs.content = content

            // Create the HEADING block in the title column
            createBlock('heading', content, blockParsers.heading(attrs), titleColumn)
          }

          // Handle TEXT
          if (tagName === 'text') {
            // Extract attributes and content
            const attrMatch = blockLine.match(/<TEXT\s*([^>]*)>/)
            const attrs = attrMatch ? parseAttributes(attrMatch[1]) : {}

            // Extract content between tags
            let content = ''
            const singleLineMatch = blockLine.match(/<TEXT[^>]*>(.*?)<\/TEXT>/)

            if (singleLineMatch) {
              content = singleLineMatch[1].trim()
            } else {
              // Handle multi-line content
              const openingTagEnd = blockLine.indexOf('>') + 1
              if (openingTagEnd < blockLine.length) {
                content = blockLine.substring(openingTagEnd).trim()
              }

              let k = lineIndex + 1
              let closingTagFound = false

              while (k < lines.length && !closingTagFound) {
                const currentLine = lines[k].trim()
                const closingTagIndex = currentLine.indexOf('</TEXT>')

                if (closingTagIndex !== -1) {
                  if (closingTagIndex > 0) {
                    const contentBeforeClosing = currentLine.substring(0, closingTagIndex).trim()
                    content += (content && contentBeforeClosing ? ' ' : '') + contentBeforeClosing
                  }
                  closingTagFound = true
                } else {
                  content += (content && currentLine ? ' ' : '') + currentLine
                }

                k++
              }
            }

            // Add content to attributes
            attrs.content = content

            // Create the TEXT block in the title column
            createBlock('text', content, blockParsers.text(attrs), titleColumn)
          }
        }

        // Create a new row for the columns with the same attributes as the original row
        currentRow = createRow({
          ...parseRowAttributes(rowAttrs),
        })
        rows.push(currentRow)

        // Skip to the line with the first COLUMN or ICON tag
        i = j - 1 // Adjust for the loop increment
      } else {
        // No title components, create a normal row
        currentRow = createRow(parseRowAttributes(rowAttrs))
        rows.push(currentRow)
      }

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

      // Special handling for rows to ensure equal column widths
      // This applies to any row with columns that don't have explicit widths set
      if (currentRow) {
        const columnsCount = currentRow.columns.length

        // Only apply equal widths if at least one column exists
        if (columnsCount > 0) {
          const columnsWithoutWidth = currentRow.columns.filter((column) => !column.attributes.width)

          // If any columns don't have width specified, distribute equally
          if (columnsWithoutWidth.length > 0) {
            // Calculate equal width percentage
            const equalWidth = `${Math.floor(100 / columnsCount)}%`

            // Update columns without width specified
            columnsWithoutWidth.forEach((column) => {
              column.attributes.width = equalWidth
            })
          }
        }
      }

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
      const icons: string[] = []

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
        if (currentLine.startsWith('<LI')) {
          // Extract icon attribute if present
          const iconMatch = currentLine.match(/icon="([^"]*)"/)
          if (iconMatch) {
            icons.push(iconMatch[1])
          } else {
            // If no icon specified, add a default icon or empty string
            icons.push('')
          }

          // Check if opening and closing tags are on same line
          const singleLineLiMatch = currentLine.match(/<LI[^>]*>(.*?)<\/LI>/)

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

      // If we found icons, add them to the attributes
      if (icons.length > 0) {
        attrs.icons = JSON.stringify(icons)
        // If type is not already set to 'icon', set it now
        if (!attrs.type || attrs.type !== 'icon') {
          attrs.type = 'icon'
        }
      }

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
          const socialMatch = currentLine.match(/<SOCIAL\s+([^>\/]*)(?:\/>|>)/)

          if (socialMatch) {
            const socialAttrs = parseAttributes(socialMatch[1])

            // Only process if we have an icon
            if (isSocialIconName(socialAttrs.icon)) {
              socialLinks.push({
                icon: socialAttrs.icon as SocialIconName,
                url: socialAttrs.url || '#',
                title: socialAttrs.title || socialAttrs.icon,
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
    if (blockMatch && currentRow) {
      const [, blockType, blockDef = ''] = blockMatch
      const attrs = parseAttributes(blockDef)

      // Special handling for ICON in any row type when outside a column
      if (blockType.toLowerCase() === 'icon' && !currentColumn) {
        // Make sure we have a current row
        if (!currentRow) {
          console.warn('Found ICON without a parent ROW, ignoring')
          continue
        }

        // Create a new column for this icon
        const iconColumn = createColumn([], '', {})
        currentRow.columns.push(iconColumn)

        // Create the icon block in this column
        createBlock('icon', '', blockParsers.icon(attrs), iconColumn)
      }
      // Regular block handling when column exists
      else if (currentColumn) {
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
          case 'icon':
            createBlock('icon', '', blockParsers.icon(attrs), currentColumn)
            break
        }
      }
    }
  }

  return {
    ...emailAttributes,
    rows,
  }
}

// Special handling for footer rows
function processFooterRow(
  startIndex: number,
  lines: string[],
  rowAttributes: RawAttributes
): { rows: RowBlock[]; newIndex: number } {
  const footerRows: RowBlock[] = []

  // Create two rows for the footer
  const headerRow = createRow(parseRowAttributes(rowAttributes))
  const contentRow = createRow(parseRowAttributes(rowAttributes))

  // Create columns for both rows
  const logoColumn = createColumn([], '50%', {})
  const socialsColumn = createColumn([], '50%', {})
  const contentColumn = createColumn([], '100%', {})

  // Add columns to rows
  headerRow.columns.push(logoColumn)
  headerRow.columns.push(socialsColumn)
  contentRow.columns.push(contentColumn)

  // Add divider at the top of the content row
  createBlock('divider', '', blockParsers.divider({}), contentColumn)

  // Add rows to footer
  footerRows.push(headerRow)
  footerRows.push(contentRow)

  let i = startIndex + 1
  let depth = 1 // Start at 1 for the ROW tag
  let inColumn = false

  // Arrays to categorize footer content for proper distribution
  const logoBlocks: number[] = []
  const socialsBlocks: number[] = []
  const contentBlocks: number[] = []

  // First pass: categorize all blocks in the footer
  let scanIndex = i
  while (scanIndex < lines.length) {
    const line = lines[scanIndex].trim()

    // Skip empty lines
    if (!line) {
      scanIndex++
      continue
    }

    // End of row
    if (line.startsWith('</ROW>')) {
      if (depth === 1) break
      depth--
    } else if (line.startsWith('<ROW')) {
      depth++
    } else if (line.startsWith('<COLUMN')) {
      inColumn = true
    } else if (line.startsWith('</COLUMN>')) {
      inColumn = false
    }
    // Look for content elements
    else if (line.startsWith('<')) {
      // Extract tag name
      const tagMatch = line.match(/<(\w+)/)
      if (tagMatch) {
        const blockType = tagMatch[1].toLowerCase()
        if (blockType !== 'row' && blockType !== 'column') {
          // Categorize by block type
          if (blockType === 'image') {
            const attrMatch = line.match(/<IMAGE\s*([^>\/]*)(?:\/>|>)/)
            if (attrMatch) {
              const attrs = parseAttributes(attrMatch[1])
              if (attrs.src === 'logo') {
                logoBlocks.push(scanIndex)
              } else {
                contentBlocks.push(scanIndex)
              }
            }
          } else if (blockType === 'socials') {
            socialsBlocks.push(scanIndex)
          } else {
            contentBlocks.push(scanIndex)
          }
        }
      }
    }

    scanIndex++
  }

  // Second pass: process blocks in the right order and place them in the correct columns

  // 1. Process logo blocks for the top-left
  for (const blockIndex of logoBlocks) {
    const line = lines[blockIndex].trim()
    const tagMatch = line.match(/<(\w+)/)
    if (tagMatch) {
      const blockType = tagMatch[1].toLowerCase()
      processBlockInColumn(blockType, blockIndex, lines, logoColumn)
    }
  }

  // 2. Process socials blocks for the top-right
  for (const blockIndex of socialsBlocks) {
    const line = lines[blockIndex].trim()
    const tagMatch = line.match(/<(\w+)/)
    if (tagMatch) {
      const blockType = tagMatch[1].toLowerCase()
      processBlockInColumn(blockType, blockIndex, lines, socialsColumn)
    }
  }

  // 3. Process all other content for the bottom row
  for (const blockIndex of contentBlocks) {
    const line = lines[blockIndex].trim()
    const tagMatch = line.match(/<(\w+)/)
    if (tagMatch) {
      const blockType = tagMatch[1].toLowerCase()
      processBlockInColumn(blockType, blockIndex, lines, contentColumn)
    }
  }

  // Return the last line index and the generated rows
  return { rows: footerRows, newIndex: scanIndex }
}

// Special handling for footer rows with organization
function processOrganizedFooterRow(
  startIndex: number,
  lines: string[],
  rowAttributes: RawAttributes
): { rows: RowBlock[]; newIndex: number } {
  console.log('🔍 Starting footer organization...')
  console.log('📌 Row attributes:', rowAttributes)

  // Find the closing row tag to determine the full content range
  let i = startIndex + 1
  let endRowIndex = i
  let rowDepth = 1

  while (endRowIndex < lines.length) {
    const line = lines[endRowIndex].trim()
    if (line.startsWith('<ROW')) rowDepth++
    else if (line.startsWith('</ROW>')) {
      rowDepth--
      if (rowDepth === 0) break
    }
    endRowIndex++
  }

  console.log(`📋 Scanning content from line ${startIndex + 1} to ${endRowIndex}`)

  // Scan the content to identify logo, socials, and other content
  let hasLogo = false
  let hasSocials = false
  const contentElements: { type: string; lineIndex: number }[] = []

  // Special check for the problematic footer pattern
  let footerContent = ''
  for (let j = i; j < endRowIndex; j++) {
    footerContent += lines[j].trim() + '\n'
  }

  // Log the entire footer content for inspection
  console.log('📄 FOOTER CONTENT:\n', footerContent)

  // Check for the specific pattern in the example
  if (
    footerContent.includes('<COLUMN>') &&
    footerContent.includes('<IMAGE src="logo"') &&
    footerContent.includes('<SOCIALS')
  ) {
    console.log('🚨 Found the problematic footer pattern with COLUMN, logo, and SOCIALS in one column!')
  }

  for (let j = i; j < endRowIndex; j++) {
    const line = lines[j].trim()
    if (!line) continue

    // Skip COLUMN tags but keep track of them
    if (line.startsWith('<COLUMN') || line.startsWith('</COLUMN')) {
      continue
    }

    if (line.startsWith('<IMAGE')) {
      const attrMatch = line.match(/<IMAGE\s*([^>\/]*)(?:\/>|>)/)
      if (attrMatch) {
        const attrs = parseAttributes(attrMatch[1])
        console.log('🔍 Checking image attributes:', attrs)
        if (attrs.src === 'logo') {
          console.log(`🖼️ Found logo image at line ${j}: ${line}`)
          hasLogo = true
          // Add to content for processing
          contentElements.push({ type: 'logo', lineIndex: j })
          continue
        } else {
          console.log(`🖼️ Found non-logo image at line ${j}: ${line} with src=${attrs.src || 'undefined'}`)
          contentElements.push({
            type: 'image',
            lineIndex: j,
          })
        }
      }
    }

    if (line.startsWith('<SOCIALS')) {
      console.log(`🔗 Found socials at line ${j}: ${line}`)
      hasSocials = true
      // Add to content for processing
      contentElements.push({ type: 'socials', lineIndex: j })
      continue
    }

    // Look for other content tags (skip COLUMN, ROW tags and comments)
    if (
      line.startsWith('<') &&
      !line.startsWith('</') &&
      !line.startsWith('<COLUMN') &&
      !line.startsWith('</COLUMN') &&
      !line.startsWith('<ROW') &&
      !line.startsWith('</ROW') &&
      !line.startsWith('<!--')
    ) {
      // Get tag name for proper categorization
      const tagMatch = line.match(/<(\w+)/)
      if (tagMatch && tagMatch[1]) {
        console.log(`📄 Found content element ${tagMatch[1]} at line ${j}: ${line}`)
        contentElements.push({
          type: tagMatch[1].toLowerCase(),
          lineIndex: j,
        })
      }
    }
  }

  console.log(`📊 Content summary: logo=${hasLogo}, socials=${hasSocials}, other elements=${contentElements.length}`)
  console.log('📑 All content elements:', contentElements)

  // Prepare the rows based on content
  const footerRows: RowBlock[] = []

  // If we have both logo and socials, create a top row with two columns
  if (hasLogo && hasSocials) {
    console.log('✅ Creating organized footer with logo and socials')

    // Special handling for the case where both logo and socials were inside a single column
    if (
      footerContent.includes('<COLUMN>') &&
      footerContent.includes('<IMAGE src="logo"') &&
      footerContent.includes('<SOCIALS')
    ) {
      console.log('🔧 Applying special fix for logo+socials in one column pattern')

      // Create more targeted content extraction
      const logoElements: number[] = []
      const socialsElements: number[] = []
      const otherElements: { type: string; lineIndex: number }[] = []

      // Re-analyze content elements to better separate them
      for (const element of contentElements) {
        if (element.type === 'logo') {
          logoElements.push(element.lineIndex)
        } else if (element.type === 'socials') {
          socialsElements.push(element.lineIndex)
        } else {
          otherElements.push(element)
        }
      }

      console.log(
        `🔍 After extraction: logo=${logoElements.length}, socials=${socialsElements.length}, other=${otherElements.length}`
      )
    }

    const headerRow = createRow(parseRowAttributes({ ...rowAttributes, type: 'footer' }))
    const logoColumn = createColumn([], '50%', {})
    const socialsColumn = createColumn([], '50%', {})

    headerRow.columns.push(logoColumn)
    headerRow.columns.push(socialsColumn)
    footerRows.push(headerRow)

    // Create a second row for all other content
    const contentRow = createRow(parseRowAttributes({ ...rowAttributes, type: 'footer' }))
    const fullWidthColumn = createColumn([], '100%', {})
    contentRow.columns.push(fullWidthColumn)

    // Add divider at the top of content row
    createBlock('divider', '', blockParsers.divider({}), fullWidthColumn)
    footerRows.push(contentRow)

    // Process each content element
    for (const element of contentElements) {
      switch (element.type) {
        case 'logo':
          console.log(`🔄 Processing logo at line ${element.lineIndex}`)
          processImageBlock(element.lineIndex, lines, logoColumn)
          break
        case 'socials':
          console.log(`🔄 Processing socials at line ${element.lineIndex}`)
          processSocialsBlock(element.lineIndex, lines, socialsColumn)
          break
        default:
          // All other content goes to the full width column
          console.log(`🔄 Processing ${element.type} content at line ${element.lineIndex}`)
          processBlockInColumn(element.type, element.lineIndex, lines, fullWidthColumn)
          break
      }
    }
  } else {
    // If we don't have both logo and socials, create a regular row and process normally
    console.log('ℹ️ Creating regular footer (missing logo or socials)')
    const row = createRow(parseRowAttributes(rowAttributes))
    const column = createColumn([], '100%', {})
    row.columns.push(column)
    footerRows.push(row)

    // Process each content element in the normal column
    for (const element of contentElements) {
      console.log(`🔄 Processing ${element.type} in regular column at line ${element.lineIndex}`)
      processBlockInColumn(element.type, element.lineIndex, lines, column)
    }
  }

  console.log(`🏁 Footer processing complete. Created ${footerRows.length} rows.`)
  return { rows: footerRows, newIndex: endRowIndex + 1 }
}

// Helper function to process a block and add it to a column
function processBlockInColumn(blockType: string, lineIndex: number, lines: string[], column: ColumnBlock) {
  const blockLine = lines[lineIndex].trim()

  // Handle different block types
  switch (blockType.toLowerCase()) {
    case 'text':
      processTextBlock(lineIndex, lines, column)
      break
    case 'heading':
      processHeadingBlock(lineIndex, lines, column)
      break
    case 'image':
      processImageBlock(lineIndex, lines, column)
      break
    case 'button':
      processButtonBlock(lineIndex, lines, column)
      break
    case 'socials':
      processSocialsBlock(lineIndex, lines, column)
      break
    case 'link':
      processLinkBlock(lineIndex, lines, column)
      break
    case 'divider':
      processDividerBlock(lineIndex, lines, column)
      break
    // Add more block types as needed
  }
}

// Process text blocks
function processTextBlock(lineIndex: number, lines: string[], column: ColumnBlock) {
  const blockLine = lines[lineIndex].trim()
  const attrMatch = blockLine.match(/<TEXT\s*([^>]*)>/)
  const attrs = attrMatch ? parseAttributes(attrMatch[1]) : {}

  // Extract content between tags
  let content = ''
  const singleLineMatch = blockLine.match(/<TEXT[^>]*>(.*?)<\/TEXT>/)

  if (singleLineMatch) {
    content = singleLineMatch[1].trim()
  } else {
    // Handle multi-line content
    const openingTagEnd = blockLine.indexOf('>') + 1
    if (openingTagEnd < blockLine.length) {
      content = blockLine.substring(openingTagEnd).trim()
    }

    let k = lineIndex + 1
    let closingTagFound = false

    while (k < lines.length && !closingTagFound) {
      const currentLine = lines[k].trim()
      const closingTagIndex = currentLine.indexOf('</TEXT>')

      if (closingTagIndex !== -1) {
        if (closingTagIndex > 0) {
          const contentBeforeClosing = currentLine.substring(0, closingTagIndex).trim()
          content += (content && contentBeforeClosing ? ' ' : '') + contentBeforeClosing
        }
        closingTagFound = true
      } else {
        content += (content && currentLine ? ' ' : '') + currentLine
      }

      k++
    }
  }

  // Add content to attributes
  attrs.content = content

  // Create the TEXT block
  createBlock('text', content, blockParsers.text(attrs), column)
}

// Process heading blocks
function processHeadingBlock(lineIndex: number, lines: string[], column: ColumnBlock) {
  const blockLine = lines[lineIndex].trim()
  const attrMatch = blockLine.match(/<HEADING\s*([^>]*)>/)
  const attrs = attrMatch ? parseAttributes(attrMatch[1]) : {}

  // Extract content between tags
  let content = ''
  const singleLineMatch = blockLine.match(/<HEADING[^>]*>(.*?)<\/HEADING>/)

  if (singleLineMatch) {
    content = singleLineMatch[1].trim()
  } else {
    // Handle multi-line content
    const openingTagEnd = blockLine.indexOf('>') + 1
    if (openingTagEnd < blockLine.length) {
      content = blockLine.substring(openingTagEnd).trim()
    }

    let k = lineIndex + 1
    let closingTagFound = false

    while (k < lines.length && !closingTagFound) {
      const currentLine = lines[k].trim()
      const closingTagIndex = currentLine.indexOf('</HEADING>')

      if (closingTagIndex !== -1) {
        if (closingTagIndex > 0) {
          const contentBeforeClosing = currentLine.substring(0, closingTagIndex).trim()
          content += (content && contentBeforeClosing ? ' ' : '') + contentBeforeClosing
        }
        closingTagFound = true
      } else {
        content += (content && currentLine ? ' ' : '') + currentLine
      }

      k++
    }
  }

  // Add content to attributes
  attrs.content = content

  // Create the HEADING block
  createBlock('heading', content, blockParsers.heading(attrs), column)
}

// Process image blocks
function processImageBlock(lineIndex: number, lines: string[], column: ColumnBlock) {
  const blockLine = lines[lineIndex].trim()
  const attrMatch = blockLine.match(/<IMAGE\s*([^>\/]*)(?:\/>|>)/)

  if (attrMatch) {
    const attrs = parseAttributes(attrMatch[1])
    createBlock('image', '', blockParsers.image(attrs), column)
  }
}

// Process button blocks
function processButtonBlock(lineIndex: number, lines: string[], column: ColumnBlock) {
  const blockLine = lines[lineIndex].trim()
  const attrMatch = blockLine.match(/<BUTTON\s*([^>]*)>/)
  const attrs = attrMatch ? parseAttributes(attrMatch[1]) : {}

  // Extract content between tags
  let content = ''
  const singleLineMatch = blockLine.match(/<BUTTON[^>]*>(.*?)<\/BUTTON>/)

  if (singleLineMatch) {
    content = singleLineMatch[1].trim()
  } else {
    // Handle multi-line content
    const openingTagEnd = blockLine.indexOf('>') + 1
    if (openingTagEnd < blockLine.length) {
      content = blockLine.substring(openingTagEnd).trim()
    }

    let k = lineIndex + 1
    let closingTagFound = false

    while (k < lines.length && !closingTagFound) {
      const currentLine = lines[k].trim()
      const closingTagIndex = currentLine.indexOf('</BUTTON>')

      if (closingTagIndex !== -1) {
        if (closingTagIndex > 0) {
          const contentBeforeClosing = currentLine.substring(0, closingTagIndex).trim()
          content += (content && contentBeforeClosing ? ' ' : '') + contentBeforeClosing
        }
        closingTagFound = true
      } else {
        content += (content && currentLine ? ' ' : '') + currentLine
      }

      k++
    }
  }

  // Add content to attributes
  attrs.content = content

  // Create the BUTTON block
  createBlock('button', content, blockParsers.button(attrs), column)
}

// Process link blocks
function processLinkBlock(lineIndex: number, lines: string[], column: ColumnBlock) {
  const blockLine = lines[lineIndex].trim()
  const attrMatch = blockLine.match(/<LINK\s*([^>]*)>/)
  const attrs = attrMatch ? parseAttributes(attrMatch[1]) : {}

  // Extract content between tags
  let content = ''
  const singleLineMatch = blockLine.match(/<LINK[^>]*>(.*?)<\/LINK>/)

  if (singleLineMatch) {
    content = singleLineMatch[1].trim()
  } else {
    // Handle multi-line content
    const openingTagEnd = blockLine.indexOf('>') + 1
    if (openingTagEnd < blockLine.length) {
      content = blockLine.substring(openingTagEnd).trim()
    }

    let k = lineIndex + 1
    let closingTagFound = false

    while (k < lines.length && !closingTagFound) {
      const currentLine = lines[k].trim()
      const closingTagIndex = currentLine.indexOf('</LINK>')

      if (closingTagIndex !== -1) {
        if (closingTagIndex > 0) {
          const contentBeforeClosing = currentLine.substring(0, closingTagIndex).trim()
          content += (content && contentBeforeClosing ? ' ' : '') + contentBeforeClosing
        }
        closingTagFound = true
      } else {
        content += (content && currentLine ? ' ' : '') + currentLine
      }

      k++
    }
  }

  // Add content to attributes
  attrs.content = content

  // Create the LINK block
  createBlock('link', content, blockParsers.link(attrs), column)
}

// Process divider blocks
function processDividerBlock(lineIndex: number, lines: string[], column: ColumnBlock) {
  const blockLine = lines[lineIndex].trim()
  const attrMatch = blockLine.match(/<DIVIDER\s*([^>\/]*)(?:\/>|>)/)

  if (attrMatch) {
    const attrs = parseAttributes(attrMatch[1])
    createBlock('divider', '', blockParsers.divider(attrs), column)
  }
}

// Process socials blocks
function processSocialsBlock(lineIndex: number, lines: string[], column: ColumnBlock) {
  const blockLine = lines[lineIndex].trim()
  const attrMatch = blockLine.match(/<SOCIALS\s*([^>]*)>/)

  if (!attrMatch) return

  const attrs = parseAttributes(attrMatch[1])

  // Check if this is a self-closing SOCIALS tag
  if (blockLine.endsWith('/>')) {
    createBlock('socials', '', blockParsers.socials(attrs), column)
    return
  }

  // If not self-closing, collect all SOCIAL elements
  const links: { icon: SocialIconName; url: string; title: string; alt: string }[] = []

  let j = lineIndex + 1
  while (j < lines.length && !lines[j].trim().startsWith('</SOCIALS>')) {
    const currentLine = lines[j].trim()

    if (currentLine.startsWith('<SOCIAL')) {
      const socialMatch = currentLine.match(/<SOCIAL\s*([^>\/]*)(?:\/>|>)/)

      if (socialMatch) {
        const socialAttrs = parseAttributes(socialMatch[1])

        if (isSocialIconName(socialAttrs.icon)) {
          links.push({
            icon: socialAttrs.icon as SocialIconName,
            url: socialAttrs.url || '#',
            title: socialAttrs.title || socialAttrs.icon,
            alt: socialAttrs.alt || socialAttrs.title || socialAttrs.icon,
          })
        }
      }
    }

    j++
  }

  // Add links to the attributes
  attrs.links = JSON.stringify(links)

  // Create the SOCIALS block
  createBlock('socials', '', blockParsers.socials(attrs), column)
}
