import { applyCommonAttributes } from '@/lib/utils/misc'
import { Row } from '@react-email/components'
import EmailColumn from './email-column'

type Props = {
  block: RowBlock
}

export default function EmailRow({ block }: Props) {
  return (
    <Row align={block.attributes.align} style={{ ...applyCommonAttributes(block) }}>
      {block.columns.map((column) => (
        <EmailColumn block={column} key={column.id} />
      ))}
    </Row>
  )
}
