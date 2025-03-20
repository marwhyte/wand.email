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
      // Simplify padding notation when possible
      const [top, right, bottom, left] = values

      if (top === right && right === bottom && bottom === left) {
        // All sides equal - use single value: padding=10
        attrs.padding = top
      } else if (top === bottom && right === left) {
        // Top/bottom and left/right pairs are equal - use two values: padding=10,20
        attrs.padding = `${top},${right}`
      } else {
        // Use full four-value format
        attrs.padding = values.join(',')
      }
    }
  }

  // Convert single-direction contentPadding to full contentPadding string
  const contentPaddingProps = ['contentPaddingTop', 'contentPaddingRight', 'contentPaddingBottom', 'contentPaddingLeft']
  const hasContentPadding = contentPaddingProps.some((prop) => attrs[prop] != null)

  if (hasContentPadding) {
    // Only include non-zero contentPadding values
    const values = contentPaddingProps.map((prop) => {
      const value = attrs[prop]?.replace('px', '') || '0'
      delete attrs[prop]
      return value
    })

    // Only add contentPadding if at least one value is non-zero
    if (values.some((v) => v !== '0')) {
      // Simplify contentPadding notation when possible
      const [top, right, bottom, left] = values

      if (top === right && right === bottom && bottom === left) {
        // All sides equal - use single value: contentPadding=10
        attrs.contentPadding = top
      } else if (top === bottom && right === left) {
        // Top/bottom and left/right pairs are equal - use two values: contentPadding=10,20
        attrs.contentPadding = `${top},${right}`
      } else {
        // Use full four-value format
        attrs.contentPadding = values.join(',')
      }
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
    if (key === 'content') {
      result.push(`content=<p>${value.replace(/\n/g, '\\n')}</p>`)
      continue
    }

    if (key === 'links') {
      result.push(`links=${JSON.stringify(value)}`)
      continue
    }

    if (key === 'rows') {
      // Format rows as a nested array with <p> tags around each cell
      if (Array.isArray(value) && value.every((row) => Array.isArray(row))) {
        const formattedRows = value.map((row) =>
          row.map((cell) => {
            // If the cell already has <p> tags, use it as is
            if (typeof cell === 'string' && cell.startsWith('<p>') && cell.endsWith('</p>')) {
              return cell
            }
            // Otherwise, wrap the cell content in <p> tags
            return `<p>${cell}</p>`
          })
        )

        // Convert to the expected string format: [[<p>cell1</p>,<p>cell2</p>],[<p>cell3</p>,<p>cell4</p>]]
        let rowsStr = JSON.stringify(formattedRows)
          .replace(/"/g, '') // Remove quotes around the HTML tags
          .replace(/\\\\/g, '\\') // Fix escaped backslashes
          .replace(/\\n/g, '\\n') // Preserve newlines

        // Fix style attributes - replace \\" with " for HTML attributes
        rowsStr = rowsStr.replace(/style=\\([^\\]+)\\>/g, 'style="$1">')

        // Fix any remaining escaped quotes in HTML attributes
        rowsStr = rowsStr.replace(/\\"/g, '"')

        result.push(`rows=${rowsStr}`)
      } else {
        // Fallback to standard JSON for other formats
        result.push(`rows=${JSON.stringify(value)}`)
      }
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

  // Create a copy of attributes to handle special cases
  const attrsObj = { ...block.attributes }

  // Handle content for all content blocks consistently
  const contentBlocks = ['heading', 'text', 'button', 'link']
  if (contentBlocks.includes(block.type)) {
    // For heading blocks, convert text to content
    if ('content' in attrsObj) {
      attrsObj.content = attrsObj.content.replace(/<p>([^]*?)<\/p>/, '$1').trim()
    }
  }

  // Special handling for social links to ensure proper JSON formatting
  if (block.type === 'socials' && 'links' in attrsObj) {
    const links = attrsObj.links
    if (Array.isArray(links)) {
      // Store as array of objects, not as JSON string
      attrsObj.links = links.map((link) => ({
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
    ...(email.backgroundColor && { backgroundColor: email.backgroundColor }),
    ...(email.color && { color: email.color }),
    ...(email.fontFamily && { fontFamily: email.fontFamily }),
    ...(email.linkColor && { linkColor: email.linkColor }),
    ...(email.rowBackgroundColor && { rowBackgroundColor: email.rowBackgroundColor }),
    ...(email.width && { width: email.width }),
    ...(email.preview ? { preview: email.preview } : {}),
  })

  return `<EMAIL ${emailAttrs}>\n${rows}\n</EMAIL>`
}
