import { generateBlockProps } from '@/lib/utils/attributes'
import { Heading } from '@react-email/components'
import parse from 'html-react-parser'

type Props = {
  block: HeadingBlock
}

export default function EmailHeading({ block }: Props) {
  return <Heading {...generateBlockProps(block)}>{parse(block.content)}</Heading>
}
