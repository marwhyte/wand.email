import { applyCommonAttributes } from '@/lib/utils/misc'
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/20/solid'
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
  onBlockDrop: (
    blockType: 'block' | 'newBlock',
    blockId: string,
    targetType: 'block' | 'column',
    targetId: string,
    position: 'above' | 'below',
    newBlockType?: EmailBlockType
  ) => void
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

  const isDropTarget = dropTarget?.type === 'column' && dropTarget.id === column.id

  const [{ isOver }, drop] = useDrop({
    accept: ['block', 'newBlock'],
    hover(item: { type: 'block' | 'newBlock'; id: string; newBlockType?: EmailBlockType }, monitor) {
      if (column.blocks.length === 0) {
        setDropTarget({ type: 'column', id: column.id, position: 'above' })
      }
    },
    drop(item: { type: 'block' | 'newBlock'; id: string; newBlockType?: EmailBlockType }) {
      if (!isOver) return
      if (dropTarget) {
        onBlockDrop(item.type, item.id, dropTarget.type, dropTarget.id, dropTarget.position)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
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
      className={`${column.blocks.length === 0 ? 'border-2 border-dashed bg-blue-50' : ''} ${isDropTarget ? 'border-green-500 bg-green-100' : 'border-blue-500'}`}
      onClick={handleColumnClick}
      width={width}
      // @ts-ignore
      ref={drop}
    >
      {column.blocks.length === 0 && (
        <div className="relative flex h-full w-full flex-col items-center justify-center py-2">
          {isDropTarget ? (
            <>
              <ArrowDownCircleIcon className="h-6 w-6 text-green-500" />
              <div className="mt-2 text-center text-sm font-medium text-green-600">Drop content here</div>
            </>
          ) : (
            <>
              <ArrowUpCircleIcon className="h-6 w-6" />
              <div className="mt-2 text-center text-sm font-medium">Drag content here</div>
            </>
          )}
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
