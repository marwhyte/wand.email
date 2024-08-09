import { applyCommonAttributes, joinClassNames } from '@/lib/utils/misc'
import { Button } from '@react-email/components'
import parse from 'html-react-parser'
import { useBlock } from '../block-provider'

type Props = {
  block: ButtonBlock
}

export default function EmailButton({ block }: Props) {
  const { currentBlock, setCurrentBlock } = useBlock()

  const isEditable = !!setCurrentBlock
  const className = isEditable
    ? joinClassNames(
        'cursor-pointer outline-blue-200 hover:outline',
        currentBlock?.id === block.id ? 'outline !outline-blue-500' : ''
      )
    : ''

  return (
    <Button
      className={className}
      onClick={
        isEditable
          ? (e) => {
              e.preventDefault()
              setCurrentBlock(block)
            }
          : undefined
      }
      href={isEditable ? undefined : block.attributes.href}
      target={isEditable ? undefined : block.attributes.target}
      rel={isEditable ? undefined : block.attributes.rel}
      style={applyCommonAttributes(block)}
    >
      {parse(block.content)}
    </Button>
  )
}
