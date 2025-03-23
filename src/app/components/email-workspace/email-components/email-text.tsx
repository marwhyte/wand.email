import { useEmailStore } from '@/lib/stores/emailStore'
import { getEmailAttributes, getTextProps } from '@/lib/utils/attributes'
import { getBlockAttributes } from '@/lib/utils/attributes/attributes'
import { Text } from '@react-email/components'
import parse from 'html-react-parser'
import { RowBlock, TextBlock } from '../types'

type Props = {
  block: TextBlock
  parentRow: RowBlock
}

export default function EmailText({ block, parentRow }: Props) {
  const { email } = useEmailStore()

  const emailAttributes = getEmailAttributes(email)
  const textAttributes = getBlockAttributes(block, parentRow, email)

  const options = {
    replace: (domNode: any) => {
      if (domNode.name === 'a' && (!domNode.attribs.style || !domNode.attribs.style.includes('color'))) {
        domNode.attribs.style = `color: ${emailAttributes.linkColor};`
        return domNode
      }
    },
  }

  // Get all text props
  const textProps = getTextProps(block, parentRow, email)

  // Extract padding-related styles for the div
  const { style, ...restTextProps } = textProps
  const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyles } = style || {}

  // Create div style with only padding properties
  const divStyle = {
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  }

  return (
    <div style={divStyle}>
      <Text {...restTextProps} style={restStyles}>
        {parse(textAttributes.content, options)}
      </Text>
    </div>
  )
}
