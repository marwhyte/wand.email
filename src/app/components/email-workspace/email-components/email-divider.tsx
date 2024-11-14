import { generateDividerProps } from '@/lib/utils/attributes'
import { Hr } from '@react-email/components'
import { useSearchParams } from 'next/navigation'

type Props = {
  block: DividerBlock
}

const EmailDivider = ({ block }: Props) => {
  const searchParams = useSearchParams()
  const mobileView = searchParams.get('mobileView') === 'true'

  return <Hr {...generateDividerProps(block, mobileView)} />
}

export default EmailDivider
