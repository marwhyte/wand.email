import { generateLinkProps } from '@/lib/utils/attributes'
import { Link } from '@react-email/components'
import parse from 'html-react-parser'
import { useSearchParams } from 'next/navigation'

type Props = {
  block: LinkBlock
}

export default function EmailLink({ block }: Props) {
  const searchParams = useSearchParams()
  const mobileView = searchParams.get('mobileView') === 'true'

  return (
    <Link {...generateLinkProps(block, mobileView)} href={undefined}>
      {parse(block.content)}
    </Link>
  )
}
