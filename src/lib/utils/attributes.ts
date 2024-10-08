export const getAdditionalTextStyles = (attributes: TextBlockAttributes) => {
  return {
    margin: 0,
    fontFamily: attributes.fontFamily,
    letterSpacing: attributes.letterSpacing,
    textIndent: attributes.textIndent,
  }
}

export const getAdditionalHeadingStyles = (attributes: HeadingBlockAttributes) => {
  return {
    fontFamily: attributes.fontFamily,
    letterSpacing: attributes.letterSpacing,
    textIndent: attributes.textIndent,
  }
}

export const getAdditionalImageStyles = (attributes: ImageBlockAttributes) => {
  return {
    aspectRatio: attributes.aspectRatio,
    objectFit: attributes.objectFit,
  }
}

export const getAdditionalButtonStyles = (attributes: ButtonBlockAttributes) => {
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

export function applyCommonAttributes(attributes: CommonAttributes) {
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

export const getAdditionalLinkStyles = (attributes: LinkBlockAttributes) => {
  return {
    color: '#3b82f6',
    textDecoration: 'underline',
    fontSize: '16px',
    fontWeight: 'normal',
    cursor: 'pointer',
  }
}

export function generateContainerProps(row: RowBlock, email: Email) {
  return {
    style: {
      ...applyCommonAttributes(row.container.attributes),
      maxWidth: email.width,
    },
    width: email.width,
  }
}

export function generateRowProps(row: RowBlock) {
  return {
    style: {
      ...applyCommonAttributes(row.attributes),
    },
    align: row.attributes.align,
  }
}

export function generateBodyProps(email: Email, skipBackgroundColor = false) {
  return {
    style: {
      margin: 0,
      backgroundColor: skipBackgroundColor ? undefined : email.bgColor,
      color: email.color,
      fontFamily: email.fontFamily,
    },
  }
}

export function generateColumnProps(column: ColumnBlock) {
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

export function generateBlockProps(block: EmailBlock) {
  const commonProps = {
    style: {
      ...applyCommonAttributes(block.attributes),
    },
  }

  switch (block.type) {
    case 'text':
      return {
        ...commonProps,
        style: {
          ...commonProps.style,
          ...getAdditionalTextStyles(block.attributes),
        },
      }
    case 'heading':
      return {
        ...commonProps,
        as: block.attributes.as,
        style: {
          ...commonProps.style,
          ...getAdditionalHeadingStyles(block.attributes),
        },
      }
    case 'image':
      return {
        ...commonProps,
        src: block.attributes.src,
        alt: block.attributes.alt,
        style: {
          ...commonProps.style,
          ...getAdditionalImageStyles(block.attributes),
        },
      }
    case 'button':
    case 'link':
      return {
        ...commonProps,
        href: block.attributes.href,
        target: block.attributes.target,
        rel: block.attributes.rel,
        style: {
          ...commonProps.style,
          ...(block.type === 'button'
            ? getAdditionalButtonStyles(block.attributes)
            : getAdditionalLinkStyles(block.attributes)),
        },
      }
    default:
      return commonProps
  }
}
