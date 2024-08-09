import { applyCommonAttributes } from '@/lib/utils/misc'
import { Link } from '@react-email/components'

type Props = {
  block: LinkBlock
}

export default function EmailLink({ block }: Props) {
  return (
    <Link
      href={block.attributes.href}
      target={block.attributes.target}
      rel={block.attributes.rel}
      style={applyCommonAttributes(block)}
    >
      {block.content}
    </Link>
  )
}
