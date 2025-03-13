import { useChatStore } from '@/lib/stores/chatStore'
import { useMobileViewStore } from '@/lib/stores/mobleViewStore'
import { generateButtonProps } from '@/lib/utils/attributes'
import { Button } from '@react-email/components'
import parse from 'html-react-parser'
import { ButtonBlock, RowBlock } from '../types'

type Props = {
  block: ButtonBlock
  parentRow: RowBlock
}

export default function EmailButton({ block, parentRow }: Props) {
  const { mobileView } = useMobileViewStore()
  const { company } = useChatStore()

  return (
    <Button {...generateButtonProps(block, parentRow, company, mobileView)} href={undefined}>
      {parse(block.content)}
    </Button>
  )
}
