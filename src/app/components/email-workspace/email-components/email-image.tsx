import { generateBlockProps } from '@/lib/utils/attributes'
import { Img } from '@react-email/components'
import Image from 'next/image'

type Props = {
  block: ImageBlock
}

export default function EmailImage({ block }: Props) {
  if (!block.attributes.src) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded bg-gray-100">
        <Image src="/no-image.svg" alt="No image" width={100} height={100} />
        {/* <FileUploader /> */}
      </div>
    )
  }

  return <Img {...generateBlockProps(block)} />
}
