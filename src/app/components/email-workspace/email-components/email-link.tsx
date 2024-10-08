import { generateBlockProps } from '@/lib/utils/attributes'
import { Link } from '@react-email/components'
import parse from 'html-react-parser'

type Props = {
  block: LinkBlock
}

export default function EmailLink({ block }: Props) {
  return (
    <Link {...generateBlockProps(block)} href={undefined}>
      {parse(block.content)}
    </Link>
  )
}
