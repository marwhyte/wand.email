import { useEmailSave } from '@/app/hooks/useEmailSave'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { getBlockAttributes } from '@/lib/utils/attributes'
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

  if (!block.attributes.src) {
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

  const attributes = getBlockAttributes(block, parentRow, false, company, email)

  // Extract align and style properties
  // @ts-expect-error
  const { align, style, ...imageAttributes } = attributes

  // Extract padding-related styles for the div
  const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyles } = style || {}

  // Create div style with padding properties
  const divStyle = {
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  }

  return (
    // @ts-expect-error
    <div align={align} style={divStyle}>
      <img {...imageAttributes} style={restStyles} />
    </div>
  )
}
