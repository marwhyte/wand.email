import { applyCommonAttributes } from '@/lib/utils/misc'
import { Heading } from '@react-email/components'
import parse from 'html-react-parser'

type Props = {
  block: HeadingBlock
}

export default function EmailHeading({ block }: Props) {
  const additionalStyles = {
    fontFamily: block.attributes.fontFamily,
    letterSpacing: block.attributes.letterSpacing,
    textIndent: block.attributes.textIndent,
  }

  return (
    <Heading as={block.attributes.as} style={{ ...applyCommonAttributes(block.attributes), ...additionalStyles }}>
      {parse(block.content)}
    </Heading>
  )
}
