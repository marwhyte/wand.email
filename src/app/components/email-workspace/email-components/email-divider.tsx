import { useMobileViewStore } from '@/lib/stores/mobleViewStore'
import { generateDividerProps } from '@/lib/utils/attributes'
import { Hr } from '@react-email/components'
import { DividerBlock, RowBlock } from '../types'

type Props = {
  block: DividerBlock
  parentRow: RowBlock
}

const EmailDivider = ({ block, parentRow }: Props) => {
  const { mobileView } = useMobileViewStore()

  const { style, ...attributes } = generateDividerProps(block, parentRow, mobileView)

  const { paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyle } = style || {}

  return (
    <div style={{ paddingTop, paddingRight, paddingBottom, paddingLeft }}>
      <Hr style={restStyle} {...attributes} />
    </div>
  )
}

export default EmailDivider
