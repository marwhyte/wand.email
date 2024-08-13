import { applyCommonAttributes, joinClassNames } from '@/lib/utils/misc'
import { Img } from '@react-email/components'
import { useBlock } from '../block-provider'

type Props = {
  block: ImageBlock
}

export default function EmailImage({ block }: Props) {
  const { currentBlock, setCurrentBlock } = useBlock()
  const isEditable = !!setCurrentBlock
  const className = isEditable
    ? joinClassNames(
        'cursor-pointer outline-blue-200 hover:outline',
        currentBlock?.id === block.id ? 'outline !outline-blue-500' : ''
      )
    : ''

  const additionalStyles = {
    aspectRatio: block.attributes.aspectRatio,
    objectFit: block.attributes.objectFit,
  }

  return (
    <Img
      className={className}
      onClick={isEditable ? () => setCurrentBlock(block) : undefined}
      src={block.attributes.src}
      alt={block.attributes.alt}
      style={{ ...applyCommonAttributes(block.attributes), ...additionalStyles }}
    />
  )
}
