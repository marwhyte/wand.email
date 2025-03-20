import { useEmailSave } from '@/app/hooks/useEmailSave'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { getImageProps } from '@/lib/utils/attributes'
import { getBlockAttributes } from '@/lib/utils/attributes/attributes'
import Image from 'next/image'
import FileUploader from '../../file-uploader'
import { ImageBlock, RowBlock } from '../types'

type Props = {
  block: ImageBlock
  parentRow: RowBlock
}

export default function EmailImage({ block, parentRow }: Props) {
  const { email, setCurrentBlock } = useEmailStore()
  const { chatId } = useChatStore()
  const saveEmail = useEmailSave(chatId)
  const { company } = useChatStore()

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

    saveEmail(updatedEmail)
    setCurrentBlock(updatedBlock)
  }

  const imageAttributes = getBlockAttributes(block, parentRow, email)

  if (!imageAttributes.src) {
    return (
      <div
        style={{ marginTop: 10, marginBottom: 10 }}
        className="flex h-full w-full flex-col items-center justify-center rounded bg-gray-100 pb-2"
      >
        <Image src="/no-image.svg" alt="No image" width={100} height={100} />
        <FileUploader onUpload={handleUpload} />
      </div>
    )
  }

  const imageProps = getImageProps(block, parentRow, email, company)

  const { style, ...restImageProps } = imageProps

  const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyles } = style || {}

  const divStyle = {
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  }

  return (
    // @ts-expect-error align is not a valid prop for the div
    <div align={imageAttributes.align} style={divStyle}>
      <img {...restImageProps} style={restStyles} />
    </div>
  )
}
