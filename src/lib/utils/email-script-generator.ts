import { ColumnBlock, Email, EmailBlock, RowBlock } from '@/app/components/email-workspace/types'

function stringifyAttributes(attributes: Record<string, any>): string {
  const result: string[] = []

  // Create a copy of attributes to modify
  const attrs = { ...attributes }

  // Convert single-direction padding to full padding string
  const paddingProps = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']
  const hasSinglePadding = paddingProps.some((prop) => attrs[prop] != null)

  if (hasSinglePadding) {
    // Only include non-zero padding values
    const values = paddingProps.map((prop) => {
      const value = attrs[prop]?.replace('px', '') || '0'
      delete attrs[prop]
      return value
    })

    // Only add padding if at least one value is non-zero
    if (values.some((v) => v !== '0')) {
      attrs.padding = values.join(',')
    }
  }

  // Create a sorted list of all keys
  const sortedKeys = Object.keys(attrs).sort()

  // Define attributes that always need quotes
  const attributesNeedingQuotes = ['name', 'src', 'preview', 'alt', 'question', 'href']

  // Process each key in alphabetical order
  for (const key of sortedKeys) {
    const value = attrs[key]

    // Skip null values
    if (value == null) continue

    // Skip empty padding values (0, 0px, "0")
    if (key.startsWith('padding') && (value === 0 || value === '0' || value === '0px' || value === '"0"')) continue

    // Skip background properties if they're default values
    if (key.startsWith('background') && (value === 'none' || value === 'no-repeat' || value === 'top left')) continue

    // Handle special cases
    if (key === 'text') {
      result.push(`text=<p>${value.replace(/\n/g, '\\n')}</p>`)
      continue
    }

    if (key === 'socialLinks') {
      result.push(`socialLinks=${JSON.stringify(value)}`)
      continue
    }

    // Format the value
    let formattedValue = value
    if (typeof value === 'string') {
      // Remove 'px' suffix for fontSize and other numeric values
      if (
        key === 'fontSize' ||
        key === 'letterSpacing' ||
        key === 'lineHeight' ||
        key === 'borderWidth' ||
        key === 'borderRadius' ||
        key === 'textIndent'
      ) {
        formattedValue = value.replace('px', '')
      } else if (key !== 'width' && key !== 'maxWidth' && key !== 'height') {
        // For other properties except width/maxWidth/height, remove px
        formattedValue = value.replace('px', '')
      }

      // Format percentages to simple numbers, but preserve exact width percentages
      if (value.includes('%') && value.includes('.') && key !== 'width') {
        const percentage = parseFloat(value)
        if (!isNaN(percentage)) {
          formattedValue = Math.round(percentage) + '%'
        }
      }

      // Add quotes only for specific attributes or if they contain spaces
      const needsQuotes =
        attributesNeedingQuotes.includes(key) || (/\s/.test(formattedValue.toString()) && key !== 'padding')
      if (needsQuotes) {
        formattedValue = `"${formattedValue}"`
      }
    } else if (typeof value === 'boolean') {
      // Convert boolean values to strings
      formattedValue = value.toString()
    }

    result.push(`${key}=${formattedValue}`)
  }

  return result.join(' ')
}

function generateBlock(block: EmailBlock, indent: number = 2): string {
  const spaces = ' '.repeat(indent * 2)
  const type = block.type.toUpperCase()

  // Only include content for blocks that should have it
  const contentBlocks = ['heading', 'text', 'button', 'link']
  const hasContent = contentBlocks.includes(block.type) && 'content' in block

  // Create a copy of attributes to handle special cases
  const attrsObj = { ...block.attributes }

  // Handle content as text attribute for content blocks
  if (hasContent && 'text' in attrsObj) {
    attrsObj.text = (block as any).content
  }

  // Special handling for social links to ensure proper JSON formatting
  if (block.type === 'socials' && 'socialLinks' in attrsObj) {
    const links = attrsObj.socialLinks
    if (Array.isArray(links)) {
      // Store as array of objects, not as JSON string
      attrsObj.socialLinks = links.map((link) => ({
        icon: link.icon,
        url: link.url || '',
        title: link.title || '',
        alt: link.alt || '',
      }))
    }
  }

  const attrs = stringifyAttributes(attrsObj)
  const attrsStr = attrs ? ` ${attrs}` : ''

  return `${spaces}${type}${attrsStr}`
}

function generateColumn(column: ColumnBlock, indent: number = 1): string {
  const spaces = ' '.repeat(indent * 2)

  // Combine all attributes with width (only if provided)
  const allAttrs = {
    ...column.attributes,
    ...(column.width && column.width !== '100%' && { width: column.width }),
  }

  // Remove undefined values
  Object.keys(allAttrs).forEach((key) => {
    if (allAttrs[key as keyof typeof allAttrs] === undefined) {
      delete allAttrs[key as keyof typeof allAttrs]
    }
  })

  const attrs = stringifyAttributes(allAttrs)
  const attrsStr = attrs ? ` ${attrs}` : '' // Only add space if there are attributes

  const blocks = column.blocks.map((block: EmailBlock) => generateBlock(block, indent + 1)).join('\n')

  return `${spaces}COLUMN${attrsStr} {\n${blocks}\n${spaces}}`
}

function generateRow(row: RowBlock): string {
  // Combine row and container attributes, prioritizing row attributes
  const allAttrs = {
    ...row.attributes,
  }

  const attrs = stringifyAttributes(allAttrs)
  const attrsStr = attrs ? ` ${attrs}` : ''

  // Check if all columns have the same width
  const allSameWidth = row.columns.length > 0 && row.columns.every((col) => col.width === row.columns[0].width)

  // Generate columns, omitting width if they're all the same
  const columns = row.columns
    .map((col) => {
      const columnForGeneration = allSameWidth ? { ...col, width: undefined } : col
      return generateColumn(columnForGeneration)
    })
    .join('\n')

  return `ROW${attrsStr} {\n${columns}\n}`
}

export function generateEmailScript(email: Email): string {
  const rows = email.rows.map(generateRow).join('\n\n')

  // Create attributes object with all properties in alphabetical order
  const emailAttrs = stringifyAttributes({
    backgroundColor: email.bgColor,
    color: email.color,
    fontFamily: email.fontFamily,
    linkColor: email.linkColor,
    rowBackgroundColor: email.rowBgColor,
    width: email.width,
  })

  return `<EMAIL ${emailAttrs}>\n${rows}\n</EMAIL>`
}
