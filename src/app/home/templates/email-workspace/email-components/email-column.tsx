import { applyCommonAttributes } from '@/lib/utils/misc'
import { ArrowUpCircleIcon } from '@heroicons/react/20/solid'
import { Column } from '@react-email/components'
import React, { useRef } from 'react'
import { useDrop } from 'react-dnd'
import EmailBlock from './email-block'

type Props = {
  column: ColumnBlock
  onBlockHover: (isHovered: boolean) => void
  onBlockSelect: (block: EmailBlock) => void
  onColumnClick?: () => void
  dropTarget: { type: 'block' | 'column'; id: string; position: 'above' | 'below' } | null
  setDropTarget: React.Dispatch<
    React.SetStateAction<{ type: 'block' | 'column'; id: string; position: 'above' | 'below' } | null>
  >
  onBlockDrop: (blockId: string, targetType: 'block' | 'column', targetId: string, position: 'above' | 'below') => void
}

export default function EmailColumn({
  column,
  onBlockHover,
  onBlockSelect,
  onColumnClick,
  dropTarget,
  setDropTarget,
  onBlockDrop,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const handleColumnClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onColumnClick?.()
    }
  }

  const width = `${(column.gridColumns / 12) * 100}%`

  const [, drop] = useDrop({
    accept: 'block',
    hover(item: { type: string; id: string }, monitor) {
      const hoverRect = ref.current?.getBoundingClientRect()
      if (!hoverRect) return
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset!.y - hoverRect.top

      if (column.blocks.length === 0) {
        setDropTarget({ type: 'column', id: column.id, position: 'above' })
      } else if (hoverClientY < hoverMiddleY) {
        setDropTarget({ type: 'block', id: column.blocks[0].id, position: 'above' })
      } else {
        setDropTarget({ type: 'block', id: column.blocks[column.blocks.length - 1].id, position: 'below' })
      }
    },
    drop(item: { type: string; id: string }) {
      if (dropTarget) {
        onBlockDrop(item.id, dropTarget.type, dropTarget.id, dropTarget.position)
      }
    },
  })

  return (
    <Column
      valign={column.attributes.valign}
      align={column.attributes.align}
      style={{
        ...applyCommonAttributes(column.attributes),
        width: width,
        borderStyle: column.attributes.borderStyle,
        borderWidth: column.attributes.borderWidth,
        borderColor: column.attributes.borderColor,
      }}
      className={column.blocks.length === 0 ? 'border-2 border-dashed border-blue-500 bg-blue-50 text-blue-500' : ''}
      onClick={handleColumnClick}
      width={width}
      // @ts-ignore
      ref={drop}
    >
      {column.blocks.length === 0 && (
        <div className="justify-cente flex h-full w-full flex-col items-center">
          <ArrowUpCircleIcon className="h-4 w-4" />
          <div className="mt-2 text-center text-xs font-medium">Drag content here</div>
        </div>
      )}
      {column.blocks.map((block) => (
        <EmailBlock
          key={block.id}
          block={block}
          onHover={onBlockHover}
          onSelect={onBlockSelect}
          dropTarget={dropTarget}
          setDropTarget={setDropTarget}
        />
      ))}
    </Column>
  )
}
