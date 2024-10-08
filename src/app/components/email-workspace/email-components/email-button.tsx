import { generateBlockProps } from '@/lib/utils/attributes'
import { Button } from '@react-email/components'
import parse from 'html-react-parser'

type Props = {
  block: ButtonBlock
}

export default function EmailButton({ block }: Props) {
  return (
    <Button {...generateBlockProps(block)} href={undefined}>
      {parse(block.content)}
    </Button>
  )
}
