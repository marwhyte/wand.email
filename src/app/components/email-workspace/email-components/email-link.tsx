import { useEmailStore } from '@/lib/stores/emailStore'
import { useMobileViewStore } from '@/lib/stores/mobleViewStore'
import { generateLinkProps } from '@/lib/utils/attributes'
import { Link } from '@react-email/components'
import parse from 'html-react-parser'

type Props = {
  block: LinkBlock
}

export default function EmailLink({ block }: Props) {
  const { email } = useEmailStore()
  const { mobileView } = useMobileViewStore()

  return (
    <Link {...generateLinkProps(block, mobileView, email?.linkColor)} href={undefined}>
      {parse(block.content)}
    </Link>
  )
}
