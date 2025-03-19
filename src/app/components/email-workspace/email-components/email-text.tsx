import { useEmailStore } from '@/lib/stores/emailStore'
import { useMobileViewStore } from '@/lib/stores/mobleViewStore'
import { generateTextProps, getEmailAttributes } from '@/lib/utils/attributes'
import { Text } from '@react-email/components'
import parse from 'html-react-parser'
import { RowBlock, TextBlock } from '../types'

type Props = {
  block: TextBlock
  parentRow: RowBlock
}

export default function EmailText({ block, parentRow }: Props) {
  const { mobileView } = useMobileViewStore()
  const { email } = useEmailStore()

  const emailAttributes = getEmailAttributes(email)

  const options = {
    replace: (domNode: any) => {
      if (domNode.name === 'a' && (!domNode.attribs.style || !domNode.attribs.style.includes('color'))) {
        domNode.attribs.style = `color: ${emailAttributes.linkColor ?? '#0066CC'};`
        return domNode
      }
    },
  }

  // Get all text props
  const textProps = generateTextProps(block, parentRow, mobileView, email)

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
        {parse(block.attributes.content, options)}
      </Text>
    </div>
  )
}
