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

  const defaultStyles = {
    h1: { fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', marginTop: '8px' },
    h2: { fontSize: '24px', fontWeight: 'bold', marginBottom: '7px', marginTop: '7px' },
    h3: { fontSize: '20px', fontWeight: 'bold', marginBottom: '6px', marginTop: '6px' },
    h4: { fontSize: '18px', fontWeight: 'bold', marginBottom: '5px', marginTop: '5px' },
    h5: { fontSize: '16px', fontWeight: 'bold', marginBottom: '4px', marginTop: '4px' },
    h6: { fontSize: '14px', fontWeight: 'bold', marginBottom: '4px', marginTop: '4px' },
  }

  const headingStyle = {
    ...defaultStyles[block.attributes.as],
    ...applyCommonAttributes(block.attributes),
    ...additionalStyles,
  }

  return (
    <Heading as={block.attributes.as} style={headingStyle}>
      {parse(block.content)}
    </Heading>
  )
}
