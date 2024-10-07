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

export const getAdditionalLinkStyles = (attributes: LinkBlockAttributes) => {
  return {
    color: '#3b82f6',
    textDecoration: 'underline',
    fontSize: '16px',
    fontWeight: 'normal',
    cursor: 'pointer',
  }
}
