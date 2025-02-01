function stringifyAttributes(attributes: Record<string, any>): string {
  const result: string[] = []

  // Handle special cases first
  if (attributes.text) {
    result.push(`text=<p>${attributes.text.replace(/\n/g, '\\n')}</p>`)
  }

  // Handle socialLinks as JSON if present
  if (attributes.socialLinks) {
    result.push(`socialLinks=${JSON.stringify(attributes.socialLinks)}`)
  }

  // Create a copy of attributes to modify
  const attrs = { ...attributes }

  // Convert single-direction padding to full padding string
  const paddingProps = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']
  const hasSinglePadding = paddingProps.some((prop) => attrs[prop] != null)

  if (hasSinglePadding) {
    const values = paddingProps.map((prop) => {
      const value = attrs[prop]?.replace('px', '') || '0'
      delete attrs[prop]
      return value
    })
    result.push(`padding=${values.join(',')}`)
  }

  // Handle all other attributes
  for (const [key, value] of Object.entries(attrs)) {
    // Skip already handled special cases and null values
    if (key === 'text' || key === 'socialLinks' || value == null) continue

    // Skip background properties if they're default values
    if (key.startsWith('background') && (value === 'none' || value === 'no-repeat' || value === 'top left')) continue

    // Format the value
    let formattedValue = value
    if (typeof value === 'string') {
      // Remove 'px' suffix
      formattedValue = value.replace('px', '')

      // Format percentages to simple numbers
      if (value.includes('.')) {
        const percentage = parseFloat(value)
        if (!isNaN(percentage)) {
          formattedValue = Math.round(percentage) + '%'
        }
      }

      // Add quotes if needed
      const needsQuotes = formattedValue.includes(' ') || formattedValue.includes(',')
      if (needsQuotes) {
        formattedValue = `"${formattedValue}"`
      }
    }

    result.push(`${key}=${formattedValue}`)
  }

  return result.join(' ')
}

function generateBlock(block: EmailBlock, indent: number = 2): string {
  const spaces = ' '.repeat(indent)
  const type = block.type.toUpperCase()

  // Only include content for blocks that have it
  const hasContent = 'content' in block
  const attrs = stringifyAttributes({
    ...block.attributes,
    ...(hasContent && { text: (block as any).content }),
  })

  return `${spaces}${type} ${attrs}`
}

function generateColumn(column: ColumnBlock, indent: number = 1): string {
  const spaces = ' '.repeat(indent * 2)
  const attrs = stringifyAttributes({
    ...column.attributes,
    width: `${(column.gridColumns / 12) * 100}%`,
  })

  const blocks = column.blocks.map((block: EmailBlock) => generateBlock(block, indent + 1)).join('\n')

  return `${spaces}COLUMN ${attrs} {\n${blocks}\n${spaces}}`
}

function generateRow(row: RowBlock): string {
  const containerAttrs = stringifyAttributes(row.container.attributes)
  const rowAttrs = stringifyAttributes(row.attributes)
  const attrs = [rowAttrs, containerAttrs].filter(Boolean).join(' ')

  const columns = row.columns.map((col) => generateColumn(col)).join('\n')

  return `ROW ${attrs} {\n${columns}\n}`
}

export function generateEmailScript(email: Email): string {
  const rows = email.rows.map(generateRow).join('\n\n')

  const emailAttrs = stringifyAttributes({
    name: email.name,
    backgroundColor: email.bgColor,
    linkColor: email.linkColor,
    fontFamily: email.fontFamily,
    width: email.width,
    ...(email.bgImage && { backgroundImage: email.bgImage }),
    ...(email.bgPosition && { backgroundPosition: email.bgPosition }),
    ...(email.bgRepeat && { backgroundRepeat: email.bgRepeat }),
    ...(email.bgSize && { backgroundSize: email.bgSize }),
  })

  return `<EMAIL ${emailAttrs}>\n${rows}\n</EMAIL>`
}
