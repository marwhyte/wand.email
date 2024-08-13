import { applyCommonAttributes } from '@/lib/utils/misc'
import { Column } from '@react-email/components'
import EmailBlock from './email-block'

type Props = {
  block: ColumnBlock
}

export default function EmailColumn({ block }: Props) {
  return (
    <Column
      valign={block.attributes.valign}
      align={block.attributes.align}
      style={applyCommonAttributes(block.attributes)}
    >
      {block.blocks.map((block) => (
        <EmailBlock key={block.id} block={block} />
      ))}
    </Column>
  )
}
