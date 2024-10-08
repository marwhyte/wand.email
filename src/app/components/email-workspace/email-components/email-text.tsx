import { generateBlockProps } from '@/lib/utils/attributes'
import { Text } from '@react-email/components'
import parse from 'html-react-parser'

type Props = {
  block: TextBlock
}

export default function EmailText({ block }: Props) {
  return <Text {...generateBlockProps(block)}>{parse(block.content)}</Text>
}
