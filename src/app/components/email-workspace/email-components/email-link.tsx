import { applyCommonAttributes } from '@/lib/utils/misc'
import { Link } from '@react-email/components'
import parse from 'html-react-parser'

type Props = {
  block: LinkBlock
  isEditing: boolean
}

export default function EmailLink({ block, isEditing }: Props) {
  const defaultStyles = {
    color: '#3b82f6',
    textDecoration: 'underline',
    fontSize: '16px',
    fontWeight: 'normal',
    cursor: 'pointer',
  }

  return (
    <Link
      href={isEditing ? undefined : block.attributes.href}
      target={block.attributes.target}
      rel={block.attributes.rel}
      style={{
        ...defaultStyles,
        ...applyCommonAttributes(block.attributes),
      }}
    >
      {parse(block.content)}
    </Link>
  )
}
