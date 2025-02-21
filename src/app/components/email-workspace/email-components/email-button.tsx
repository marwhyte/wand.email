import { useMobileViewStore } from '@/lib/stores/mobleViewStore'
import { generateButtonProps } from '@/lib/utils/attributes'
import { Button } from '@react-email/components'
import parse from 'html-react-parser'
import { useSearchParams } from 'next/dist/client/components/navigation'
import { ButtonBlock, RowBlock } from '../types'

type Props = {
  block: ButtonBlock
  parentRow: RowBlock
}

export default function EmailButton({ block, parentRow }: Props) {
  const searchParams = useSearchParams()
  const { mobileView } = useMobileViewStore()

  return (
    <Button {...generateButtonProps(block, parentRow, mobileView)} href={undefined}>
      {parse(block.content)}
    </Button>
  )
}
