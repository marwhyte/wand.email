import { useEmailStore } from '@/lib/stores/emailStore'
import { getHeadingProps } from '@/lib/utils/attributes'
import { getBlockAttributes } from '@/lib/utils/attributes/attributes'
import { Heading } from '@react-email/components'
import parse from 'html-react-parser'
import { HeadingBlock, RowBlock } from '../types'

type Props = {
  block: HeadingBlock
  parentRow: RowBlock
}

export default function EmailHeading({ block, parentRow }: Props) {
  const { email } = useEmailStore()
  const linkAttributes = getBlockAttributes(block, parentRow, email)
  const options = {
    replace: (domNode: any) => {
      if (domNode.name === 'a' && (!domNode.attribs.style || !domNode.attribs.style.includes('color'))) {
        domNode.attribs.style = `color: ${linkAttributes.color};`
        return domNode
      }
    },
  }

  const headingProps = getHeadingProps(block, parentRow, email)

  const { style, ...restHeadingProps } = headingProps

  const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyles } = style || {}

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
        {parse(linkAttributes.content, options)}
      </Heading>
    </div>
  )
}
