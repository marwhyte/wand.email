import { getAdditionalTextStyles } from '@/lib/utils/defaultStyles'
import { applyCommonAttributes } from '@/lib/utils/misc'
import { Text } from '@react-email/components'
import parse from 'html-react-parser'

type Props = {
  block: TextBlock
}

export default function EmailText({ block }: Props) {
  return (
    <Text style={{ ...applyCommonAttributes(block.attributes), ...getAdditionalTextStyles(block.attributes) }}>
      {parse(block.content)}
    </Text>
  )
}
