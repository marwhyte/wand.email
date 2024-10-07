import { getAdditionalButtonStyles } from '@/lib/utils/defaultStyles'
import { applyCommonAttributes } from '@/lib/utils/misc'
import { Button } from '@react-email/components'
import parse from 'html-react-parser'

type Props = {
  block: ButtonBlock
  isEditing: boolean
}

export default function EmailButton({ block, isEditing }: Props) {
  return (
    <Button
      href={isEditing ? undefined : block.attributes.href}
      target={block.attributes.target}
      rel={block.attributes.rel}
      style={{
        ...getAdditionalButtonStyles(block.attributes),
        ...applyCommonAttributes(block.attributes),
      }}
    >
      {parse(block.content)}
    </Button>
  )
}
