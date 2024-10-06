const getAdditionalTextStyles = (attributes: TextBlockAttributes) => {
  return {
    paddingTop: attributes.paddingTop ?? '10px',
    paddingRight: attributes.paddingRight ?? '0',
    paddingBottom: attributes.paddingBottom ?? '10px',
    paddingLeft: attributes.paddingLeft ?? '0',
    margin: 0,
    fontFamily: attributes.fontFamily,
    letterSpacing: attributes.letterSpacing,
    textIndent: attributes.textIndent,
  }
}
