import { useEmailStore } from '@/lib/stores/emailStore'
import { getBlockAttributes } from '@/lib/utils/attributes'
import { Img } from '@react-email/components'
import Image from 'next/image'
import FileUploader from '../../file-uploader'
import { ImageBlock, RowBlock } from '../types'

type Props = {
  block: ImageBlock
  parentRow: RowBlock
}

export default function EmailImage({ block, parentRow }: Props) {
  const { setEmail, email, setCurrentBlock } = useEmailStore()

  const handleUpload = (src: string) => {
    if (!email) return

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
      <div style={{ marginTop: 10, marginBottom: 10 }} className="flex h-full w-full flex-col items-center justify-center rounded bg-gray-100 pb-2">
        <Image src="/no-image.svg" alt="No image" width={100} height={100} />
        <FileUploader onUpload={handleUpload} />
      </div>
    )
  }

  return <Img {...getBlockAttributes(block, parentRow)} />
}
