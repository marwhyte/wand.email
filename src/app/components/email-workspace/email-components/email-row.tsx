import DragLine from '@/app/components/drag-line'
import { useIsMobile } from '@/app/hooks'
import { useEmailSave } from '@/app/hooks/useEmailSave'
import { useEmailStore } from '@/lib/stores/emailStore'
import { getEmailAttributes, getRowAttributes, getRowProps } from '@/lib/utils/attributes'
import { classNames } from '@/lib/utils/misc'
import { ArrowsPointingOutIcon, Square2StackIcon, TrashIcon } from '@heroicons/react/24/solid'
import { Container, Row } from '@react-email/components'
import React, { useCallback, useRef, useState } from 'react'
import { DragPreviewImage, useDrag, useDrop } from 'react-dnd'
import { v4 as uuidv4 } from 'uuid'
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
  const handleSave = useEmailSave()
  const [isHovered, setIsHovered] = useState(false)

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
  const needsRounding = emailAttributes.styleVariant === 'default'

  const isMobile = useIsMobile()

  // Delete the current row
  const deleteRow = useCallback(() => {
    if (!email) return

    // Delete row
    const updatedRows = email.rows.filter((r) => r.id !== row.id)
    handleSave({ ...email, rows: updatedRows })

    // Clear the current selection
    setCurrentBlock(null)
  }, [email, handleSave, row.id, setCurrentBlock])

  // Duplicate the current row
  const duplicateRow = useCallback(() => {
    if (!email) return

    // Create a deep copy with new IDs
    const newRow: RowBlock = {
      ...row,
      id: uuidv4(),
      columns: row.columns.map((column) => ({
        ...column,
        id: uuidv4(),
        blocks: column.blocks.map((block) => ({
          ...block,
          id: uuidv4(),
        })),
      })),
    }

    // Find the index of the current row
    const rowIndex = email.rows.findIndex((r) => r.id === row.id)
    if (rowIndex === -1) return

    // Insert the new row after the current row
    const updatedRows = [...email.rows]
    updatedRows.splice(rowIndex + 1, 0, newRow)

    handleSave({ ...email, rows: updatedRows })
    setCurrentBlock(newRow)
  }, [email, handleSave, row, setCurrentBlock])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  return (
    <div
      onClick={handleRowOrColumnClick}
      ref={ref}
      className="group relative w-full px-4"
      style={{ opacity }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Row toolbar - shown when hovering over row or when selected */}
      {((isHovered && !isChildHovered) || currentBlock?.id === row.id) && (
        <div
          className="absolute flex flex-col gap-1 rounded-lg border bg-white p-1 shadow-lg"
          style={{
            top: '50%',
            left: '4px',
            transform: 'translateY(-50%)',
            zIndex: 20,
          }}
        >
          {currentBlock?.id === row.id && (
            <button onClick={deleteRow} className="rounded p-1.5 text-red-500 hover:bg-red-50" title="Delete Row">
              <TrashIcon className="h-4 w-4" />
            </button>
          )}

          <div
            // @ts-ignore
            ref={drag}
            className="cursor-move rounded p-1.5 text-blue-500 hover:bg-blue-50"
            title="Drag to reorder"
          >
            <ArrowsPointingOutIcon className="h-4 w-4" />
          </div>

          {currentBlock?.id === row.id && (
            <button
              onClick={duplicateRow}
              className="rounded p-1.5 text-gray-600 hover:bg-gray-100"
              title="Duplicate Row"
            >
              <Square2StackIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

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

      {/* Wrap the content in a relative div */}
      <div className="relative" style={{ zIndex: 2 }}>
        <Container
          bgcolor={emailAttributes.backgroundColor}
          width={isMobile ? '100%' : mobileView ? '360' : `${emailAttributes.width}`}
          className={rowAttributes.hideOnMobile && (isMobile || mobileView) ? 'hidden' : undefined}
          style={{
            backgroundColor: emailAttributes.backgroundColor,
            width: isMobile ? '100%' : emailAttributes.width,
            maxWidth: isMobile ? '100%' : emailAttributes.width,
          }}
        >
          {/* Simplified row rendering that matches email-renderer-final.tsx approach */}
          <Row
            {...getRowProps(row, email)}
            style={{
              ...getRowProps(row, email).style,
              maxWidth: isMobile ? '100%' : mobileView ? '360px' : undefined,
              width: isMobile ? '100%' : mobileView ? '360px' : getRowProps(row, email).style?.width,
            }}
            className={(isMobile || mobileView) && rowAttributes.stackOnMobile ? 'stack' : undefined}
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
                if ((isMobile || mobileView) && !rowAttributes.stackOnMobile) {
                  adjustedWidth = `${(originalWidth / totalColumnsWidth) * (100 - totalSpacerWidthPercent)}%`
                } else {
                  // In mobile view with stacking, use the original width
                  adjustedWidth = column.attributes.width
                }
              } else if (rowAttributes.columnSpacing !== undefined && rowAttributes.columnSpacing > 0) {
                adjustedWidth = `${(rowAttributes.columnSpacing / emailWidth) * 100}%`
              }

              return (
                <React.Fragment key={column.id}>
                  <EmailColumn
                    column={{
                      ...column,
                      attributes: {
                        ...column.attributes,

                        width: (isMobile || mobileView) && rowAttributes.stackOnMobile ? '100%' : adjustedWidth,
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
                  {rowAttributes.columnSpacing !== undefined &&
                    rowAttributes.columnSpacing > 0 &&
                    index < row.columns.length - 1 &&
                    !((isMobile || mobileView) && rowAttributes.stackOnMobile) && (
                      <td width={rowAttributes.columnSpacing} style={{ width: `${rowAttributes.columnSpacing}px` }}>
                        <table
                          width={rowAttributes.columnSpacing}
                          style={{
                            width: `${rowAttributes.columnSpacing}px`,
                            height: `${rowAttributes.columnSpacing}px`,
                          }}
                        />
                      </td>
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
