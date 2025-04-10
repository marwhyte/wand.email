import { useEmailSave } from '@/app/hooks/useEmailSave'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { useImageStore } from '@/lib/stores/imageStore'
import { getImageProps } from '@/lib/utils/attributes'
import { getBlockAttributes } from '@/lib/utils/attributes/attributes'
import { determineAspectRatio } from '@/lib/utils/misc'
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
  const { isImageLoading, isImageFromPexels } = useImageStore()
  const saveEmail = useEmailSave()
  const { company } = useChatStore()
  const isLoading = isImageLoading(block.id)
  const isUsingPexels = isImageFromPexels(block.id)

  const imageAttributes = getBlockAttributes(block, parentRow, email)
  const src = imageAttributes.src || ''
  const aspectRatio = determineAspectRatio(parentRow)

  // Helper to get aspect ratio CSS class based on the aspect ratio
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '1:1':
        return 'aspect-square'
      case '4:3':
        return 'aspect-[4/3]'
      case '3:4':
        return 'aspect-[3/4]'
      case '16:9':
        return 'aspect-video'
      case '9:16':
        return 'aspect-[9/16]'
      default:
        return 'aspect-video'
    }
  }

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

  if (isLoading) {
    return (
      <div
        className={`flex w-full flex-col items-center justify-center rounded bg-gray-100 pb-2 ${getAspectRatioClass()}`}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
          <span className="sr-only">Loading AI image...</span>
        </div>
      </div>
    )
  }

  if (!imageAttributes.src || imageAttributes.src.includes('imagegen:') || imageAttributes.src.includes('pexels:')) {
    return (
      <div
        className={`flex w-full flex-col items-center justify-center rounded bg-gray-100 pb-2 ${getAspectRatioClass()}`}
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
    <div align={imageAttributes.align} style={divStyle} className="relative">
      <img {...restImageProps} style={restStyles} />

      {isUsingPexels && (
        <div className="absolute bottom-1 right-1 rounded bg-black/40 px-1 text-xs text-white">
          <a
            href="https://www.pexels.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white no-underline hover:underline"
          >
            Pexels
          </a>
        </div>
      )}
    </div>
  )
}
