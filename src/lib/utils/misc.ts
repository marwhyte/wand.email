export function getFirstTwoInitials(name: string) {
  // Split the name by spaces
  const words = name.trim().split(/\s+/)

  // Get the first letter of the first two words
  const initials = words.slice(0, 2).map((word) => word[0].toUpperCase())

  // Join the initials
  return initials.join('')
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getPhotoUrl(name: string, template: string) {
  return `https://swiftmailer-photos.imgix.net/${template}/${name}`
}

export function applyCommonAttributes(attributes: CommonAttributes) {
  const {
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    display,
    width,
    maxWidth,
    height,
    backgroundColor,
    borderRadius,
    border,
    textAlign,
    verticalAlign,
    fontSize,
    lineHeight,
    color,
    fontWeight,
    textDecoration,
    textTransform,
    whiteSpace,
    fontStyle,
  } = attributes

  return Object.fromEntries(
    Object.entries({
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      display,
      width,
      maxWidth,
      height,
      backgroundColor,
      borderRadius,
      border,
      textAlign,
      verticalAlign,
      fontSize,
      lineHeight,
      color,
      fontWeight,
      textDecoration,
      textTransform,
      whiteSpace,
      fontStyle,
    }).filter(([_, value]) => value !== undefined)
  )
}

export function joinClassNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
