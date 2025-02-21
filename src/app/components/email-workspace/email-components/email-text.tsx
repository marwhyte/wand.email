import { useMobileViewStore } from '@/lib/stores/mobleViewStore'
import { generateTextProps } from '@/lib/utils/attributes'
import { Text } from '@react-email/components'
import parse from 'html-react-parser'
import { useSearchParams } from 'next/navigation'
import { RowBlock, TextBlock } from '../types'

type Props = {
  block: TextBlock
  parentRow: RowBlock
}

export default function EmailText({ block, parentRow }: Props) {
  const searchParams = useSearchParams()
  const { mobileView } = useMobileViewStore()

  return <Text {...generateTextProps(block, parentRow, mobileView)}>{parse(block.content)}</Text>
}
