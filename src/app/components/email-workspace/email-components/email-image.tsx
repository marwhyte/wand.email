import { getAdditionalImageStyles } from '@/lib/utils/defaultStyles'
import { applyCommonAttributes } from '@/lib/utils/misc'
import { Img } from '@react-email/components'
import Image from 'next/image'

type Props = {
  block: ImageBlock
}

export default function EmailImage({ block }: Props) {
  if (!block.attributes.src) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded bg-gray-100">
        <Image src="/no-image.svg" alt="No image" width={100} height={100} />
      </div>
    )
  }

  return (
    <Img
      src={block.attributes.src}
      alt={block.attributes.alt}
      style={{ ...applyCommonAttributes(block.attributes), ...getAdditionalImageStyles(block.attributes) }}
    />
  )
}
