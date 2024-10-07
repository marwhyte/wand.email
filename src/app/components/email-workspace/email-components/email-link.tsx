import { getAdditionalLinkStyles } from '@/lib/utils/defaultStyles'
import { applyCommonAttributes } from '@/lib/utils/misc'
import { Link } from '@react-email/components'
import parse from 'html-react-parser'

type Props = {
  block: LinkBlock
  isEditing: boolean
}

export default function EmailLink({ block, isEditing }: Props) {
  return (
    <Link
      href={isEditing ? undefined : block.attributes.href}
      target={block.attributes.target}
      rel={block.attributes.rel}
      style={{
        ...getAdditionalLinkStyles(block.attributes),
        ...applyCommonAttributes(block.attributes),
      }}
    >
      {parse(block.content)}
    </Link>
  )
}
