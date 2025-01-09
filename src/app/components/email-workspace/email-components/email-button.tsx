import { useMobileViewStore } from '@/lib/stores/mobleViewStore'
import { generateButtonProps } from '@/lib/utils/attributes'
import { Button } from '@react-email/components'
import parse from 'html-react-parser'
import { useSearchParams } from 'next/dist/client/components/navigation'

type Props = {
  block: ButtonBlock
}

export default function EmailButton({ block }: Props) {
  const searchParams = useSearchParams()
  const { mobileView } = useMobileViewStore()

  return (
    <Button {...generateButtonProps(block, mobileView)} href={undefined}>
      {parse(block.content)}
    </Button>
  )
}
