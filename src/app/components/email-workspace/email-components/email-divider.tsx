import { generateDividerProps } from '@/lib/utils/attributes'
import { Hr } from '@react-email/components'

type Props = {
  block: DividerBlock
}

const EmailDivider = ({ block }: Props) => {
  return <Hr {...generateDividerProps(block)} />
}

export default EmailDivider
