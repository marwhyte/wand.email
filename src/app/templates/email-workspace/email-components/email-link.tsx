import { applyCommonAttributes } from '@/lib/utils/misc'
import { Link } from '@react-email/components'
import parse from 'html-react-parser'

type Props = {
  block: LinkBlock
}

export default function EmailLink({ block }: Props) {
  return (
    <Link
      href={block.attributes.href}
      target={block.attributes.target}
      rel={block.attributes.rel}
      style={applyCommonAttributes(block.attributes)}
    >
      {parse(block.content)}
    </Link>
  )
}
