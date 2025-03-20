import { useEmailStore } from '@/lib/stores/emailStore'
import { getLinkProps } from '@/lib/utils/attributes'
import { getBlockAttributes } from '@/lib/utils/attributes/attributes'
import { Link } from '@react-email/components'
import parse from 'html-react-parser'
import { LinkBlock, RowBlock } from '../types'

type Props = {
  block: LinkBlock
  parentRow: RowBlock
}

export default function EmailLink({ block, parentRow }: Props) {
  const { email } = useEmailStore()

  const linkProps = getLinkProps(block, parentRow, email)
  const linkAttributes = getBlockAttributes(block, parentRow, email)

  const { style, ...restLinkProps } = linkProps

  const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyles } = style || {}

  const divStyle = {
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  }

  return (
    // @ts-expect-error align is not a valid prop for the div
    <div align={linkAttributes.align} style={divStyle}>
      <Link {...restLinkProps} style={restStyles} href={undefined}>
        {parse(linkAttributes.content)}
      </Link>
    </div>
  )
}
