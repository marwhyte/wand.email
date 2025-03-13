import { useEmailStore } from '@/lib/stores/emailStore'
import { useMobileViewStore } from '@/lib/stores/mobleViewStore'
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
  const { mobileView } = useMobileViewStore()

  return (
    <Link {...generateLinkProps(block, parentRow, mobileView, email)} href={undefined}>
      {parse(block.content)}
    </Link>
  )
}
