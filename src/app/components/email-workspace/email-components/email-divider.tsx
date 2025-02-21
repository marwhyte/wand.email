import { useMobileViewStore } from '@/lib/stores/mobleViewStore'
import { generateDividerProps } from '@/lib/utils/attributes'
import { Hr } from '@react-email/components'
import { useSearchParams } from 'next/navigation'
import { DividerBlock, RowBlock } from '../types'

type Props = {
  block: DividerBlock
  parentRow: RowBlock
}

const EmailDivider = ({ block, parentRow }: Props) => {
  const searchParams = useSearchParams()
  const { mobileView } = useMobileViewStore()

  return <Hr {...generateDividerProps(block, parentRow, mobileView)} />
}

export default EmailDivider
