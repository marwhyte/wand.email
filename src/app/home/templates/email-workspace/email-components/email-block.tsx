import { joinClassNames } from '@/lib/utils/misc'
import { useCallback, useState } from 'react'
import { useBlock } from '../block-provider'
import EmailButton from './email-button'
import EmailHeading from './email-heading'
import EmailImage from './email-image'
import EmailLink from './email-link'
import EmailText from './email-text'

type Props = {
  block: EmailBlock
  onHover?: (isHovered: boolean) => void
  onSelect?: (block: EmailBlock) => void
}

export default function EmailBlock({ block, onHover, onSelect }: Props) {
  const { currentBlock } = useBlock()
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    onHover?.(true)
  }, [onHover])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    onHover?.(false)
  }, [onHover])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation() // Prevent the click from bubbling up to the row
      onSelect?.(block)
    },
    [block, onSelect]
  )

  const renderBlock = () => {
    switch (block.type) {
      case 'text':
        return <EmailText block={block} />
      case 'heading':
        return <EmailHeading block={block} />
      case 'image':
        return <EmailImage block={block} />
      case 'button':
        return <EmailButton block={block} />
      case 'link':
        return <EmailLink block={block} />
      default:
        return null
    }
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={joinClassNames(
        'group relative inline-block',
        currentBlock?.id === block.id || isHovered ? 'outline outline-2 outline-blue-500' : ''
      )}
    >
      {/* Blue overlay div */}
      <div
        className={joinClassNames(
          'absolute inset-0 transition-opacity duration-200',
          currentBlock?.id !== block.id && isHovered ? 'opacity-20' : 'opacity-0'
        )}
        style={{ backgroundColor: 'rgb(59, 130, 246)', zIndex: 1 }}
      />
      {renderBlock()}
    </div>
  )
}
