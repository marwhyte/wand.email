import { applyCommonAttributes } from '@/lib/utils/misc'
import { Heading } from '@react-email/components'
import parse from 'html-react-parser'
import { useBlock } from '../block-provider'

type Props = {
  block: HeadingBlock
}

export default function EmailHeading({ block }: Props) {
  const { currentBlock, setCurrentBlock } = useBlock()

  const additionalStyles = {
    fontFamily: block.attributes.fontFamily,
    letterSpacing: block.attributes.letterSpacing,
    textIndent: block.attributes.textIndent,
  }

  return (
    <Heading
      as={block.attributes.as}
      className={currentBlock?.id === block.id ? 'outline' : 'hover:outline'}
      onClick={() => setCurrentBlock(block)}
      style={{ ...applyCommonAttributes(block), ...additionalStyles }}
    >
      {parse(block.content)}
    </Heading>
  )
}
