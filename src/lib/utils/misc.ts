export function getFirstTwoInitials(name: string) {
  // Split the name by spaces
  const words = name.trim().split(/\s+/)

  // Get the first letter of the first two words
  const initials = words.slice(0, 2).map((word) => word[0].toUpperCase())

  // Join the initials
  return initials.join('')
}

export function getPhotoUrl(name: string, template: string) {
  return `https://swiftmailer-photos.imgix.net/${template}/${name}`
}

export function applyCommonAttributes(block: EmailBlock) {
  return {
    paddingTop: block.attributes.paddingTop,
    paddingRight: block.attributes.paddingRight,
    paddingBottom: block.attributes.paddingBottom,
    paddingLeft: block.attributes.paddingLeft,
    marginTop: block.attributes.marginTop,
    marginRight: block.attributes.marginRight,
    marginBottom: block.attributes.marginBottom,
    marginLeft: block.attributes.marginLeft,
    display: block.attributes.display,
    width: block.attributes.width,
    maxWidth: block.attributes.maxWidth,
    height: block.attributes.height,
    backgroundColor: block.attributes.backgroundColor,
    borderRadius: block.attributes.borderRadius,
    border: block.attributes.border,
    textAlign: block.attributes.textAlign,
    verticalAlign: block.attributes.verticalAlign,
    fontSize: block.attributes.fontSize,
    lineHeight: block.attributes.lineHeight,
    color: block.attributes.color,
    fontWeight: block.attributes.fontWeight,
    textDecoration: block.attributes.textDecoration,
    textTransform: block.attributes.textTransform,
    whiteSpace: block.attributes.whiteSpace,
    fontStyle: block.attributes.fontStyle,
  }
}

export function joinClassNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
