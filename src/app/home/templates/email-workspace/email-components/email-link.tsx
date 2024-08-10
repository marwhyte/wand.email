import { applyCommonAttributes, joinClassNames } from '@/lib/utils/misc'
import { Link } from '@react-email/components'
import parse from 'html-react-parser'
import { useBlock } from '../block-provider'

type Props = {
  block: LinkBlock
}

export default function EmailLink({ block }: Props) {
  const { currentBlock, setCurrentBlock } = useBlock()

  const isEditable = !!setCurrentBlock
  const className = isEditable
    ? joinClassNames(
        'cursor-pointer outline-blue-200 hover:outline',
        currentBlock?.id === block.id ? 'outline !outline-blue-500' : ''
      )
    : ''

  return (
    <Link
      href={isEditable ? undefined : block.attributes.href}
      target={isEditable ? undefined : block.attributes.target}
      rel={isEditable ? undefined : block.attributes.rel}
      className={className}
      onClick={
        isEditable
          ? (e) => {
              e.preventDefault()
              setCurrentBlock(block)
            }
          : undefined
      }
      style={applyCommonAttributes(block)}
    >
      {parse(block.content)}
    </Link>
  )
}
