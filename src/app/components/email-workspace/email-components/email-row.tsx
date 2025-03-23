import DragLine from '@/app/components/drag-line'
import { useEmailStore } from '@/lib/stores/emailStore'
import { getEmailAttributes, getRowAttributes, getRowProps } from '@/lib/utils/attributes'
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
  const emailAttributes = getEmailAttributes(email)

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

  // Add this function to determine the position of the row in the email
  const getRowPosition = () => {
    if (!email?.rows) return { isFirstRow: false, isLastRow: false }
    const rowIndex = email.rows.findIndex((r) => r.id === row.id)
    return {
      isFirstRow: rowIndex === 0,
      isLastRow: rowIndex === email.rows.filter((r) => r.attributes.type !== 'footer').length - 1,
    }
  }

  const { isFirstRow, isLastRow } = getRowPosition()
  const needsRounding = emailAttributes.styleVariant === 'floating'

  // Define border radius styles
  const borderRadiusStyle =
    needsRounding && (isFirstRow || isLastRow)
      ? {
          borderRadius: isFirstRow ? '8px 8px 0 0' : isLastRow ? '0 0 8px 8px' : undefined,
          overflow: 'hidden',
        }
      : {}

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
      <div className="relative" style={{ zIndex: 2, ...borderRadiusStyle }}>
        <Container
          bgcolor={emailAttributes.backgroundColor}
          width={mobileView ? '360' : `${emailAttributes.width}`}
          className={rowAttributes.hideOnMobile && mobileView ? 'hidden' : undefined}
          style={{
            backgroundColor: emailAttributes.backgroundColor,
            width: emailAttributes.width,
            maxWidth: emailAttributes.width,
            ...borderRadiusStyle,
          }}
        >
          {/* Simplified row rendering that matches email-renderer-final.tsx approach */}
          <Row
            {...getRowProps(row, email)}
            style={{
              ...getRowProps(row, email).style,
              maxWidth: mobileView ? '360px' : undefined,
            }}
            className={mobileView && rowAttributes.stackOnMobile ? 'stack' : undefined}
          >
            {row.columns.map((column, index) => {
              // Convert pixel spacing to percentage of total width
              const emailWidth = Number(emailAttributes.width)
              const totalSpacerWidthPercent =
                rowAttributes.columnSpacing && rowAttributes.columnSpacing > 0
                  ? ((rowAttributes.columnSpacing * (row.columns.length - 1)) / emailWidth) * 100
                  : 0

              let adjustedWidth: string | undefined = undefined
              // Adjust column width by distributing the spacer width proportionally
              if (column.attributes.width) {
                const originalWidth = parseFloat(column.attributes.width)
                const totalColumnsWidth = row.columns.reduce(
                  (sum, col) => sum + parseFloat(col.attributes.width || '100'),
                  0
                )

                // Only adjust width when not in mobile view or not stacking
                if (!mobileView || !rowAttributes.stackOnMobile) {
                  adjustedWidth = `${(originalWidth / totalColumnsWidth) * (100 - totalSpacerWidthPercent)}%`
                } else {
                  // In mobile view with stacking, use the original width
                  adjustedWidth = column.attributes.width
                }
              }

              return (
                <React.Fragment key={column.id}>
                  <EmailColumn
                    column={{
                      ...column,
                      attributes: {
                        ...column.attributes,
                        width: mobileView && rowAttributes.stackOnMobile ? '100%' : adjustedWidth,
                      },
                    }}
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
