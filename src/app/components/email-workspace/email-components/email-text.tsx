import { applyCommonAttributes } from '@/lib/utils/misc'
import { Text } from '@react-email/components'
import parse from 'html-react-parser'

type Props = {
  block: TextBlock
}

export default function EmailText({ block }: Props) {
  const additionalStyles = {
    margin: 0,
    fontFamily: block.attributes.fontFamily,
    letterSpacing: block.attributes.letterSpacing,
    textIndent: block.attributes.textIndent,
  }

  return <Text style={{ ...applyCommonAttributes(block.attributes), ...additionalStyles }}>{parse(block.content)}</Text>
}
