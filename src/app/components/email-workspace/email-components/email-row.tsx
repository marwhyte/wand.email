import DragLine from '@/app/components/drag-line'
import { useEmailStore } from '@/lib/stores/emailStore'
import { generateRowProps, getRowAttributes } from '@/lib/utils/attributes'
import { classNames } from '@/lib/utils/misc'
import { ArrowsPointingOutIcon } from '@heroicons/react/24/solid'
import { Container, Row } from '@react-email/components'
import React, { useRef, useState } from 'react'
import { DragPreviewImage, useDrag, useDrop } from 'react-dnd'
import { EmailBlock, EmailBlockType, RowBlock } from '../types'
import EmailColumn from './email-column'

type Props = {
  row: RowBlock
  moveRow: (dragId: string, hoverId: string) => void
  addRow: (widths: string[], hoverId: string) => void
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
  const { currentBlock, setCurrentBlock, email } = useEmailStore()
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
      widths?: string[]
    }) {
      if (item.type === 'newBlock' || item.type === 'block') return

      if (item.type === 'row' && dropLine !== null && item.id !== row.id) {
        moveRow(item.id, row.id)
      } else if (dropLine !== null && item.type === 'newRow') {
        console.log('newRow123', item.widths)

        addRow(item.widths ?? ['100%'], row.id)
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

  const rowAttributes = getRowAttributes(row, email)

  return (
    <div onClick={handleRowOrColumnClick} ref={ref} className="group relative w-full px-4" style={{ opacity }}>
      {/* Outline pseudo-element */}
      <div
        className={classNames(
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
        className={classNames(
          'pointer-events-none absolute inset-0 w-full transition-opacity duration-200',
          currentBlock?.id === row.id || isChildHovered ? 'opacity-0' : 'opacity-0 group-hover:opacity-20'
        )}
        style={{ backgroundColor: 'rgb(59, 130, 246)', zIndex: 5 }}
      />

      {dropLine === row.id && isOverRow && <DragLine direction="above" />}
      {dropLine === 'end' && row.id === email?.rows[email.rows.length - 1].id && <DragLine direction="below" />}
      <DragPreviewImage connect={preview} src="/row.svg" />

      <div
        // @ts-ignore
        ref={drag}
        className={classNames(
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
          bgcolor={email?.bgColor}
          width={mobileView ? '360' : `${email?.width}`}
          className={rowAttributes.hideOnMobile && mobileView ? 'hidden' : undefined}
          style={{
            backgroundColor: email?.bgColor,
          }}
        >
          {/* Simplified row rendering that matches email-renderer-final.tsx approach */}
          <Row
            {...generateRowProps(row, email)}
            className={mobileView && rowAttributes.stackOnMobile ? 'stack' : undefined}
          >
            {row.columns.map((column, index) => {
              // Convert pixel spacing to percentage of total width
              const emailWidth = Number(email?.width || 600)
              const totalSpacerWidthPercent =
                rowAttributes.columnSpacing && rowAttributes.columnSpacing > 0
                  ? ((rowAttributes.columnSpacing * (row.columns.length - 1)) / emailWidth) * 100
                  : 0

              let adjustedWidth: string | undefined = undefined
              // Adjust column width by distributing the spacer width proportionally
              if (column.width) {
                const originalWidth = parseFloat(column.width)
                const totalColumnsWidth = row.columns.reduce((sum, col) => sum + parseFloat(col.width || '100'), 0)
                adjustedWidth = `${(originalWidth / totalColumnsWidth) * (100 - totalSpacerWidthPercent)}%`
              }

              return (
                <React.Fragment key={column.id}>
                  <EmailColumn
                    column={{ ...column, width: adjustedWidth }}
                    row={row}
                    onBlockHover={(isHovered) => setIsChildHovered(isHovered)}
                    onBlockSelect={handleBlockSelect}
                    onColumnClick={handleRowOrColumnClick}
                    dropTarget={dropTarget}
                    setDropTarget={setDropTarget}
                    onBlockDrop={onBlockDrop}
                  />
                  {/* Add spacing td between columns, but not after the last column */}
                  {!mobileView &&
                    rowAttributes.columnSpacing !== undefined &&
                    rowAttributes.columnSpacing > 0 &&
                    index < row.columns.length - 1 && (
                      <td width={rowAttributes.columnSpacing} style={{ width: `${rowAttributes.columnSpacing}px` }} />
                    )}
                </React.Fragment>
              )
            })}
          </Row>
        </Container>

        <div
          className={`absolute bottom-0 right-1 translate-y-full bg-blue-500 px-2 py-1 text-sm font-semibold text-white transition-opacity duration-200 ${currentBlock?.id !== row.id && !isChildHovered ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}
          style={{ zIndex: 12 }}
        >
          Row
        </div>
      </div>
    </div>
  )
}
