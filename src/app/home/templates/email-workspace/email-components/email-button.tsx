import { applyCommonAttributes } from '@/lib/utils/misc'
import { Button } from '@react-email/components'
import parse from 'html-react-parser'

type Props = {
  block: ButtonBlock
}

export default function EmailButton({ block }: Props) {
  return (
    <Button
      href={block.attributes.href}
      target={block.attributes.target}
      rel={block.attributes.rel}
      style={applyCommonAttributes(block.attributes)}
    >
      {parse(block.content)}
    </Button>
  )
}
