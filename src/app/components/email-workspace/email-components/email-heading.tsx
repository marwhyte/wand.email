import { useMobileViewStore } from '@/lib/stores/mobleViewStore'
import { generateHeadingProps } from '@/lib/utils/attributes'
import { Heading } from '@react-email/components'
import parse from 'html-react-parser'
import { useSearchParams } from 'next/navigation'
import { HeadingBlock, RowBlock } from '../types'

type Props = {
  block: HeadingBlock
  parentRow: RowBlock
}

export default function EmailHeading({ block, parentRow }: Props) {
  const searchParams = useSearchParams()
  const { mobileView } = useMobileViewStore()

  return <Heading {...generateHeadingProps(block, parentRow, mobileView)}>{parse(block.content)}</Heading>
}
