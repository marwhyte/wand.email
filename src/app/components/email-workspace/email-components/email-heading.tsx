import { getAdditionalHeadingStyles } from '@/lib/utils/defaultStyles'
import { applyCommonAttributes } from '@/lib/utils/misc'
import { Heading } from '@react-email/components'
import parse from 'html-react-parser'

type Props = {
  block: HeadingBlock
}

export default function EmailHeading({ block }: Props) {
  const headingStyle = {
    ...applyCommonAttributes(block.attributes),
    ...getAdditionalHeadingStyles(block.attributes),
  }

  return (
    <Heading as={block.attributes.as} style={headingStyle}>
      {parse(block.content)}
    </Heading>
  )
}
