import { applyCommonAttributes } from '@/lib/utils/misc'
import { Link } from '@react-email/components'
import parse from 'html-react-parser'
import { useBlock } from '../block-provider'

type Props = {
  block: LinkBlock
}

export default function EmailLink({ block }: Props) {
  const { setCurrentBlock } = useBlock()
  const defaultStyles = {
    color: '#3b82f6',
    textDecoration: 'underline',
    fontSize: '16px',
    fontWeight: 'normal',
    cursor: 'pointer',
  }

  return (
    <Link
      href={setCurrentBlock ? undefined : block.attributes.href}
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
