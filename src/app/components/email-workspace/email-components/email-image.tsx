import { generateBlockProps } from '@/lib/utils/attributes'
import { Img } from '@react-email/components'
import Image from 'next/image'
import FileUploader from '../../file-uploader'
import { useEmail } from '../email-provider'

type Props = {
  block: ImageBlock
}

export default function EmailImage({ block }: Props) {
  const { setEmail, email, setCurrentBlock } = useEmail()

  const handleUpload = (src: string) => {
    const updatedBlock = {
      ...block,
      attributes: { ...block.attributes, src },
    }

    const updatedEmail = {
      ...email,
      rows: email.rows.map((row) => ({
        ...row,
        columns: row.columns.map((column) => ({
          ...column,
          blocks: column.blocks.map((emailBlocks) => (block.id === emailBlocks.id ? updatedBlock : emailBlocks)),
        })),
      })),
    }

    setEmail(updatedEmail)
    setCurrentBlock(updatedBlock)
  }

  if (!block.attributes.src) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded bg-gray-100 pb-2">
        <Image src="/no-image.svg" alt="No image" width={100} height={100} />
        <FileUploader onUpload={handleUpload} />
      </div>
    )
  }

  return <Img {...generateBlockProps(block)} />
}
