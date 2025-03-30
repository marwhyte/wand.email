import { getSpacerProps } from '@/lib/utils/attributes'
import { Email, RowBlock, SpacerBlock } from '../types'

type Props = {
  block: SpacerBlock
  parentRow: RowBlock
  email: Email | null
}

const EmailSpacer = ({ block, parentRow, email }: Props) => {
  const blockAttributes = getSpacerProps(block, parentRow, email)
  const { height, ...restStyles } = blockAttributes.style || {}

  return <div style={restStyles}>&#8202;</div>
}

export default EmailSpacer
