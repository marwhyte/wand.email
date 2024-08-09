import { applyCommonAttributes } from '@/lib/utils/misc'
import { Text } from '@react-email/components'
import parse from 'html-react-parser'
import { useBlock } from '../block-provider'

type Props = {
  block: TextBlock
}

export default function EmailText({ block }: Props) {
  const { currentBlock, setCurrentBlock } = useBlock()

  const additionalStyles = {
    marginTop: block.attributes.marginTop ?? '0',
    marginBottom: block.attributes.marginBottom ?? '0',
    marginLeft: block.attributes.marginLeft ?? '0',
    marginRight: block.attributes.marginRight ?? '0',
    fontFamily: block.attributes.fontFamily,
    letterSpacing: block.attributes.letterSpacing,
    textIndent: block.attributes.textIndent,
  }

  return (
    <Text
      className={currentBlock?.id === block.id ? 'outline' : 'hover:outline'}
      onClick={() => setCurrentBlock(block)}
      style={{ ...applyCommonAttributes(block), ...additionalStyles }}
    >
      {parse(block.content)}
    </Text>
  )
}
