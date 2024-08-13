import { applyCommonAttributes, joinClassNames } from '@/lib/utils/misc'
import { Heading } from '@react-email/components'
import parse from 'html-react-parser'
import { useBlock } from '../block-provider'

type Props = {
  block: HeadingBlock
}

export default function EmailHeading({ block }: Props) {
  const { currentBlock, setCurrentBlock } = useBlock()

  const isEditable = !!setCurrentBlock
  const className = isEditable
    ? joinClassNames(
        'cursor-pointer outline-blue-200 hover:outline',
        currentBlock?.id === block.id ? 'outline !outline-blue-500' : ''
      )
    : ''

  const additionalStyles = {
    fontFamily: block.attributes.fontFamily,
    letterSpacing: block.attributes.letterSpacing,
    textIndent: block.attributes.textIndent,
  }

  return (
    <Heading
      as={block.attributes.as}
      className={className}
      onClick={isEditable ? () => setCurrentBlock(block) : undefined}
      style={{ ...applyCommonAttributes(block.attributes), ...additionalStyles }}
    >
      {parse(block.content)}
    </Heading>
  )
}
