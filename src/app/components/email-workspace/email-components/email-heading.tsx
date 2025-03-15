import { useEmailStore } from '@/lib/stores/emailStore'
import { useMobileViewStore } from '@/lib/stores/mobleViewStore'
import { generateHeadingProps } from '@/lib/utils/attributes'
import { Heading } from '@react-email/components'
import parse from 'html-react-parser'
import { HeadingBlock, RowBlock } from '../types'

type Props = {
  block: HeadingBlock
  parentRow: RowBlock
}

export default function EmailHeading({ block, parentRow }: Props) {
  const { mobileView } = useMobileViewStore()
  const { email } = useEmailStore()
  const options = {
    replace: (domNode: any) => {
      if (domNode.name === 'a' && (!domNode.attribs.style || !domNode.attribs.style.includes('color'))) {
        domNode.attribs.style = `color: ${email?.linkColor ?? '#0066CC'};`
        return domNode
      }
    },
  }

  // Get all heading props
  const headingProps = generateHeadingProps(block, parentRow, mobileView)

  // Extract style properties
  const { style, ...restHeadingProps } = headingProps

  // Extract padding-related styles for the div
  const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyles } = style || {}

  // Create div style with padding properties
  const divStyle = {
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  }

  return (
    <div style={divStyle}>
      <Heading {...restHeadingProps} style={restStyles}>
        {parse(block.attributes.content, options)}
      </Heading>
    </div>
  )
}
