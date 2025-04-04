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

  // Remove the exceptions list - all values will be quoted
  // const attributesNotNeedingQuotes = ['columnSpacing', 'hideOnMobile', 'stackOnMobile']

  // Process each key in alphabetical order
  for (const key of sortedKeys) {
    const value = attrs[key]

    // Skip null values
    if (value == null) continue

    // Skip empty string values for specific attributes
    if (key === 'question' && value === '') continue

    // Skip empty padding values (0, 0px, "0")
    if (key.startsWith('padding') && (value === 0 || value === '0' || value === '0px' || value === '"0"')) continue

    // Skip background properties if they're default values
    if (key.startsWith('background') && (value === 'none' || value === 'no-repeat' || value === 'top left')) continue

    // Handle special cases
    if (key === 'content') {
      // Don't include content as an attribute - it will be the content between tags
      continue
    }

    if (key === 'links') {
      result.push(`links="${JSON.stringify(value).replace(/"/g, '\\"')}"`)
      continue
    }

    // Special handling for list items
    if (key === 'items' && Array.isArray(value)) {
      // We won't include items as attributes for lists with LI children
      // Only include for self-closing LIST tags
      const formattedItems = value.map((item) => {
        // If the item already has <p> tags, use it as is
        if (typeof item === 'string' && item.startsWith('<p>') && item.endsWith('</p>')) {
          return item
        }
        // Otherwise, wrap the item in <p> tags
        return `<p>${item}</p>`
      })

      // Join without quotes, similar to rows handling
      let itemsStr = JSON.stringify(formattedItems)
        .replace(/"/g, '') // Remove quotes around the HTML tags
        .replace(/\\\\/g, '\\') // Fix escaped backslashes
        .replace(/\\n/g, '\\n') // Preserve newlines

      // Fix style attributes in case there are any
      itemsStr = itemsStr.replace(/style=\\([^\\]+)\\>/g, 'style="$1">')

      // Fix any remaining escaped quotes in HTML attributes
      itemsStr = itemsStr.replace(/\\"/g, '"')

      result.push(`items="${itemsStr}"`)
      continue
    }

    // Handle icons for icon list style
    if (key === 'icons' && Array.isArray(value)) {
      // For icon lists, icons should only be on individual LI elements,
      // not on the LIST element itself, so we'll skip this attribute
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

        result.push(`rows="${rowsStr}"`)
      } else {
        // Fallback to standard JSON for other formats
        result.push(`rows="${JSON.stringify(value).replace(/"/g, '\\"')}"`)
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

      // Quote all string values
      formattedValue = `"${formattedValue.toString().replace(/"/g, '\\"')}"`
    } else if (typeof value === 'boolean') {
      // Convert boolean values to strings and quote them
      formattedValue = `"${value.toString()}"`
    } else if (typeof value === 'number') {
      // Quote numbers too
      formattedValue = `"${value.toString()}"`
    } else {
      // For any other types, stringify and quote
      formattedValue = `"${JSON.stringify(value).replace(/"/g, '\\"')}"`
    }

    result.push(`${key}=${formattedValue}`)
  }

  return result.join(' ')
}

function generateBlock(block: EmailBlock, indent: number = 2): string {
  const spaces = ' '.repeat(indent * 3)
  const type = block.type.toUpperCase()

  // Create a copy of attributes to handle special cases
  const attrsObj = { ...block.attributes }

  // Handle blocks with content - these need opening and closing tags
  const contentBlocks = ['heading', 'text', 'button', 'link']

  if (contentBlocks.includes(block.type)) {
    // Extract content for blocks that have it
    const content = 'content' in attrsObj ? String(attrsObj.content || '') : ''

    // Create a new object without the content property rather than using delete
    const newAttrsObj = { ...attrsObj }
    if ('content' in newAttrsObj) {
      // @ts-ignore - We know content exists because we just checked
      delete newAttrsObj.content
    }

    // Generate the opening tag with attributes
    const attrs = stringifyAttributes(newAttrsObj)
    const attrsStr = attrs ? ` ${attrs}` : ''

    // Return the XML format with opening and closing tags
    return `${spaces}<${type}${attrsStr}>\n${spaces}  ${content}\n${spaces}</${type}>`
  }

  // Handle ICON elements specially
  if (block.type === 'icon') {
    // The ICON is self-closing but has its title and description as attributes
    const iconAttrs = { ...attrsObj }

    // Generate the attributes string
    const attrs = stringifyAttributes(iconAttrs)
    const attrsStr = attrs ? ` ${attrs}` : ''

    // Return the self-closing tag
    return `${spaces}<${type}${attrsStr} />`
  }

  // Handle LIST elements specially, based on whether they have items or not
  if (block.type === 'list') {
    if ('items' in attrsObj && Array.isArray(attrsObj.items) && attrsObj.items.length > 0) {
      // Get the list attributes without items
      const listAttrs = { ...attrsObj }
      // @ts-ignore - We know items exists because we just checked
      const items = [...attrsObj.items]

      // Create a new object without the items property rather than using delete
      if ('items' in listAttrs) {
        // @ts-ignore - We know items exists because we just checked
        delete listAttrs.items
      }

      // Fix: Ensure the type attribute is preserved with the exact value from attributes
      // We should never modify the type, just use what's already there or default to 'ul'
      if (!listAttrs.type) {
        listAttrs.type = 'ul'
      }

      // Generate the opening LIST tag
      const attrs = stringifyAttributes(listAttrs)
      const attrsStr = attrs ? ` ${attrs}` : ''

      // Generate LI elements for each item - no space in empty tag
      const liElements = items.map((item) => `${spaces}  <LI>${item}</LI>`).join('\n')

      // Return LIST with LI children
      return `${spaces}<${type}${attrsStr}>\n${liElements}\n${spaces}</${type}>`
    } else {
      // Self-closing LIST without items
      const attrs = stringifyAttributes(attrsObj)
      const attrsStr = attrs ? ` ${attrs}` : ''
      return `${spaces}<${type}${attrsStr} />`
    }
  }

  // Handle TABLE elements specially, based on whether they have rows or not
  if (block.type === 'table') {
    if ('rows' in attrsObj && Array.isArray(attrsObj.rows) && attrsObj.rows.length > 0) {
      // Get the table attributes without rows
      const tableAttrs = { ...attrsObj }
      // @ts-ignore - We know rows exists because we just checked
      const rows = [...attrsObj.rows]

      // Create a new object without the rows property
      if ('rows' in tableAttrs) {
        // @ts-ignore - We know rows exists because we just checked
        delete tableAttrs.rows
      }

      // Generate the opening TABLE tag
      const attrs = stringifyAttributes(tableAttrs)
      const attrsStr = attrs ? ` ${attrs}` : ''

      // Generate TR and TD elements for each row/cell
      let trElements = ''
      rows.forEach((row) => {
        if (Array.isArray(row)) {
          trElements += `${spaces}  <TR>\n`
          row.forEach((cell) => {
            trElements += `${spaces}    <TD>${cell}</TD>\n`
          })
          trElements += `${spaces}  </TR>\n`
        }
      })

      // Return TABLE with TR/TD structure
      return `${spaces}<${type}${attrsStr}>\n${trElements}${spaces}</${type}>`
    } else {
      // Self-closing TABLE without rows
      const attrs = stringifyAttributes(attrsObj)
      const attrsStr = attrs ? ` ${attrs}` : ''
      return `${spaces}<${type}${attrsStr} />`
    }
  }

  // Handle SOCIALS elements specially
  if (block.type === 'socials') {
    if ('links' in attrsObj && Array.isArray(attrsObj.links) && attrsObj.links.length > 0) {
      // Get the socials attributes without links
      const socialsAttrs = { ...attrsObj }
      // @ts-ignore - We know links exists because we just checked
      const links = [...attrsObj.links]

      // Create a new object without the links property
      if ('links' in socialsAttrs) {
        // @ts-ignore - We know links exists because we just checked
        delete socialsAttrs.links
      }

      // Generate the opening SOCIALS tag
      const attrs = stringifyAttributes(socialsAttrs)
      const attrsStr = attrs ? ` ${attrs}` : ''

      // Generate SOCIAL elements for each social link
      const socialElements = links
        .map((link) => {
          const socialAttrs = stringifyAttributes({
            icon: link.icon,
            url: link.url,
            title: link.title,
            alt: link.alt,
          })
          return `${spaces}  <SOCIAL ${socialAttrs} />`
        })
        .join('\n')

      // Return SOCIALS with SOCIAL children
      return `${spaces}<${type}${attrsStr}>\n${socialElements}\n${spaces}</${type}>`
    } else {
      // Self-closing SOCIALS without links
      const attrs = stringifyAttributes(attrsObj)
      const attrsStr = attrs ? ` ${attrs}` : ''
      return `${spaces}<${type}${attrsStr} />`
    }
  }

  // Handle all other elements as self-closing tags
  const attrs = stringifyAttributes(attrsObj)
  const attrsStr = attrs ? ` ${attrs}` : ''
  return `${spaces}<${type}${attrsStr} />`
}

function generateColumn(column: ColumnBlock, indent: number = 1): string {
  const spaces = ' '.repeat(indent * 4)

  // Create a copy of attributes to modify
  const allAttrs = { ...column.attributes }

  // If width is 100% or not provided, or if column was passed with width undefined
  // (which happens when all columns in a row have the same width), don't include it
  if (allAttrs.width === '100%' || !allAttrs.width) {
    delete allAttrs.width
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

  // Use XML format with opening and closing tags
  return `${spaces}<COLUMN${attrsStr}>\n${blocks}\n${spaces}</COLUMN>`
}

function generateRow(row: RowBlock): string {
  // Combine row and container attributes, prioritizing row attributes
  const allAttrs = {
    ...row.attributes,
  }

  const attrs = stringifyAttributes(allAttrs)
  const attrsStr = attrs ? ` ${attrs}` : ''

  // Check if all columns have the same width
  const allSameWidth =
    row.columns.length > 0 && row.columns.every((col) => col.attributes.width === row.columns[0].attributes.width)

  // Generate columns, omitting width if they're all the same
  const columns = row.columns
    .map((col) => {
      if (allSameWidth) {
        // Create a deep copy of the column with all attributes except width
        const columnWithoutWidth = {
          ...col,
          attributes: { ...col.attributes },
        }
        // Delete the width property from the attributes
        delete columnWithoutWidth.attributes.width
        return generateColumn(columnWithoutWidth)
      } else {
        return generateColumn(col)
      }
    })
    .join('\n')

  // Use XML format with opening and closing tags with 2 spaces indentation
  return `  <ROW${attrsStr}>\n${columns}\n  </ROW>`
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
    ...(email.type && { type: email.type }),
    ...(email.styleVariant && { styleVariant: email.styleVariant }),
  })

  return `<EMAIL ${emailAttrs}>\n${rows}\n</EMAIL>`
}
