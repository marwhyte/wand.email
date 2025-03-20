import { useEmailStore } from '@/lib/stores/emailStore'
import { generateLinkProps } from '@/lib/utils/attributes'
import { Link } from '@react-email/components'
import parse from 'html-react-parser'
import { LinkBlock, RowBlock } from '../types'

type Props = {
  block: LinkBlock
  parentRow: RowBlock
}

export default function EmailLink({ block, parentRow }: Props) {
  const { email } = useEmailStore()

  const linkProps = generateLinkProps(block, parentRow, email)

  // Extract align and style properties
  // @ts-expect-error
  const { align, style, ...linkPropsWithoutAlignAndStyle } = linkProps

  // Extract padding-related styles for the div
  const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyles } = style || {}

  // Create div style with padding properties and align
  const divStyle = {
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  }

  return (
    // @ts-expect-error
    <div align={align} style={divStyle}>
      <Link {...linkPropsWithoutAlignAndStyle} style={restStyles} href={undefined}>
        {parse(block.attributes.content)}
      </Link>
    </div>
  )
}
