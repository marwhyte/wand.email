import { applyCommonAttributes } from '@/lib/utils/misc'
import { Container } from '@react-email/components'
import EmailRow from './email-row'

type Props = {
  block: ContainerBlock
}

export default function EmailContainer({ block }: Props) {
  return (
    <Container align={block.attributes.align} style={applyCommonAttributes(block)}>
      {block.rows.map((row) => (
        <EmailRow key={row.id} block={row} />
      ))}
    </Container>
  )
}
