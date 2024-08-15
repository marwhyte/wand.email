import { applyCommonAttributes } from '@/lib/utils/misc'
import { Img } from '@react-email/components'

type Props = {
  block: ImageBlock
}

export default function EmailImage({ block }: Props) {
  const additionalStyles = {
    aspectRatio: block.attributes.aspectRatio,
    objectFit: block.attributes.objectFit,
  }

  return (
    <Img
      src={block.attributes.src}
      alt={block.attributes.alt}
      style={{ ...applyCommonAttributes(block.attributes), ...additionalStyles }}
    />
  )
}
