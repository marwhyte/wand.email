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

  const headingStyle = {
    ...applyCommonAttributes(block.attributes),
    ...additionalStyles,
  }

  return (
    <Heading as={block.attributes.as} style={headingStyle}>
      {parse(block.content)}
    </Heading>
  )
}
