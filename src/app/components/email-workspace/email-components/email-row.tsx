import DragLine from '@/app/components/drag-line'
import { applyCommonAttributes, generateRowProps } from '@/lib/utils/attributes'
import { joinClassNames } from '@/lib/utils/misc'
import { ArrowsPointingOutIcon } from '@heroicons/react/24/solid'
import { Container, Row } from '@react-email/components'
import { useRef, useState } from 'react'
import { DragPreviewImage, useDrag, useDrop } from 'react-dnd'
import { useEmail } from '../email-provider'
import EmailColumn from './email-column'

type Props = {
  row: RowBlock
  moveRow: (dragId: string, hoverId: string) => void
  addRow: (gridColumns: number[], hoverId: string) => void
  mobileView: boolean
  dropLine: string | null
  onHover: (id: string, hoverClientY: number, hoverMiddleY: number) => void
  onDragEnd: () => void
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

export default function EmailRow({
  row,
  moveRow,
  addRow,
  dropLine,
  onHover,
  onDragEnd,
  dropTarget,
  setDropTarget,
  mobileView,
  onBlockDrop,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { currentBlock, setCurrentBlock, email } = useEmail()
  const [isChildHovered, setIsChildHovered] = useState(false)

  const [{ isDraggingRow }, drag, preview] = useDrag({
    type: 'row',
    item: { type: 'row', id: row.id },
    collect: (monitor) => ({
      isDraggingRow: monitor.isDragging(),
    }),
    end: onDragEnd,
  })

  const [{ isOverRow }, drop] = useDrop({
    accept: ['row', 'newBlock', 'block', 'newRow'],
    hover(item: { type: 'row' | 'newBlock' | 'block' | 'newRow'; id: string }, monitor) {
      if (!ref.current) return

      if (item.type !== 'row' && item.type !== 'newRow') return

      const dragId = item.id
      const hoverId = row.id

      if (dragId === hoverId) {
        // When hovering over its own position, always show the line at the bottom
        onHover(hoverId, Number.MAX_SAFE_INTEGER, 0)
        return
      }

      const hoverRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset!.y - hoverRect.top

      onHover(hoverId, hoverClientY, hoverMiddleY)
    },
    drop(item: {
      type: 'row' | 'newBlock' | 'block' | 'newRow'
      id: string
      newBlockType?: EmailBlockType
      gridColumns?: number[]
    }) {
      if (item.type === 'row' && dropLine !== null && item.id !== row.id) {
        moveRow(item.id, row.id)
      } else if (dropLine !== null && item.type === 'newRow') {
        addRow(item.gridColumns ?? [12], row.id)
      } else if (dropTarget && item.type !== 'row' && item.type !== 'newRow') {
        onBlockDrop(item.type, item.id, dropTarget.type, dropTarget.id, dropTarget.position, item.newBlockType)
      }
    },
    collect: (monitor) => ({
      isOverRow: monitor.isOver({ shallow: true }),
    }),
  })

  drop(ref)

  const opacity = isDraggingRow ? 0.4 : 1

  const handleRowOrColumnClick = () => {
    setCurrentBlock?.(row)
  }

  const handleBlockSelect = (block: EmailBlock) => {
    setCurrentBlock?.(block)
  }

  return (
    <div onClick={handleRowOrColumnClick} ref={ref} className="group relative mx-4" style={{ opacity }}>
      {/* Outline pseudo-element */}
      <div
        className={joinClassNames(
          'pointer-events-none absolute bottom-0 left-0 right-0 top-0 transition-opacity duration-200',
          currentBlock?.id === row.id
            ? 'opacity-100'
            : isChildHovered
              ? 'opacity-0'
              : 'opacity-0 group-hover:opacity-100'
        )}
        style={{
          zIndex: 10,
          boxShadow: '0 0 0 2px rgb(59, 130, 246)',
          borderRadius: '2px',
        }}
      />

      {/* Blue overlay pseudo-element */}
      <div
        className={joinClassNames(
          'pointer-events-none absolute inset-0 transition-opacity duration-200',
          currentBlock?.id === row.id || isChildHovered ? 'opacity-0' : 'opacity-0 group-hover:opacity-20'
        )}
        style={{ backgroundColor: 'rgb(59, 130, 246)', zIndex: 5 }}
      />

      {dropLine === row.id && isOverRow && <DragLine direction="above" />}
      <DragPreviewImage connect={preview} src="/row.svg" />

      <div
        // @ts-ignore
        ref={drag}
        className={joinClassNames(
          'absolute left-0 top-1/2 flex h-8 w-10 -translate-y-1/2 cursor-move items-center justify-center rounded-r-full bg-blue-500',
          currentBlock?.id === row.id
            ? 'opacity-100'
            : isChildHovered
              ? 'opacity-0'
              : 'opacity-0 transition-opacity duration-200 group-hover:opacity-100'
        )}
        style={{ zIndex: 11 }}
      >
        <ArrowsPointingOutIcon className="h-6 w-6 text-white" />
      </div>

      {/* Wrap the content in a relative div */}
      <div className="relative" style={{ zIndex: 2 }}>
        <Container
          bgcolor={email.bgColor}
          width={mobileView ? '360' : `${email.width}`}
          style={{
            backgroundColor: email.bgColor,
            ...applyCommonAttributes(row.container.attributes),
            maxWidth: mobileView ? '360px' : `${email.width}px`,
          }}
        >
          <Row {...generateRowProps(row)}>
            {row.columns.map((column) => (
              <EmailColumn
                column={column}
                key={column.id}
                onBlockHover={(isHovered) => setIsChildHovered(isHovered)}
                onBlockSelect={handleBlockSelect}
                onColumnClick={handleRowOrColumnClick}
                dropTarget={dropTarget}
                setDropTarget={setDropTarget}
                onBlockDrop={onBlockDrop}
              />
            ))}
          </Row>
        </Container>

        {/* Purple "Row" box */}
        <div
          className={`absolute -bottom-7 right-1 bg-blue-500 px-2 py-1 text-sm font-semibold text-white transition-opacity duration-200 ${
            currentBlock?.id !== row.id && !isChildHovered ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
          }`}
          style={{ zIndex: 12 }}
        >
          Row
        </div>
      </div>
    </div>
  )
}
