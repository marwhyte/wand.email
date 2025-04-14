import DragLine from '@/app/components/drag-line'
import { useEmailSave } from '@/app/hooks/useEmailSave'
import { useEmailStore } from '@/lib/stores/emailStore'
import { classNames } from '@/lib/utils/misc'
import { ArrowsPointingOutIcon, Square2StackIcon, TrashIcon } from '@heroicons/react/24/solid'
import { motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { DragPreviewImage, useDrag, useDrop } from 'react-dnd'
import { createPortal } from 'react-dom'
import { v4 as uuidv4 } from 'uuid'
import RenderBlock from '../render-block'
import { EmailBlock as EmailBlockType, RowBlock } from '../types'

type Props = {
  block: EmailBlockType
  onHover: (isHovered: boolean) => void
  onSelect?: (block: EmailBlockType) => void
  dropTarget: { type: 'block' | 'column'; id: string; position: 'above' | 'below' } | null
  setDropTarget: React.Dispatch<
    React.SetStateAction<{ type: 'block' | 'column'; id: string; position: 'above' | 'below' } | null>
  >
  parentRow: RowBlock
}

export default function EmailBlock({ block, onHover, onSelect, dropTarget, setDropTarget, parentRow }: Props) {
  const { currentBlock, setCurrentBlock, email } = useEmailStore()
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const handleSave = useEmailSave()

  const [{ isDraggingBlock }, drag, preview] = useDrag({
    type: 'block',
    item: { type: 'block', id: block.id },
    collect: (monitor) => ({
      isDraggingBlock: monitor.isDragging(),
    }),
  })

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
      setCurrentBlock(block)
      onSelect?.(block)
    },
    [block, onSelect, setCurrentBlock]
  )

  // Delete the current block
  const deleteBlock = useCallback(() => {
    if (!currentBlock || !email) return

    if (currentBlock.type === 'row') {
      // Delete row
      const updatedRows = email.rows.filter((row) => row.id !== currentBlock.id)
      handleSave({ ...email, rows: updatedRows })
    } else {
      // Delete a regular block
      const updatedRows = email.rows.map((row) => ({
        ...row,
        columns: row.columns.map((column) => ({
          ...column,
          blocks: column.blocks.filter((block) => block.id !== currentBlock.id),
        })),
      }))

      handleSave({ ...email, rows: updatedRows })
    }

    // Clear the current block selection
    setCurrentBlock(null)
  }, [currentBlock, email, handleSave, setCurrentBlock])

  // Duplicate the current block
  const duplicateBlock = useCallback(() => {
    if (!currentBlock || !email) return

    if (currentBlock.type === 'row') {
      // Duplicate row
      const rowToDuplicate = email.rows.find((row) => row.id === currentBlock.id) as RowBlock
      if (!rowToDuplicate) return

      // Create a deep copy with new IDs
      const newRow: RowBlock = {
        ...rowToDuplicate,
        id: uuidv4(),
        columns: rowToDuplicate.columns.map((column) => ({
          ...column,
          id: uuidv4(),
          blocks: column.blocks.map((block) => ({
            ...block,
            id: uuidv4(),
          })),
        })),
      }

      // Find the index of the current row
      const rowIndex = email.rows.findIndex((row) => row.id === currentBlock.id)
      if (rowIndex === -1) return

      // Insert the new row after the current row
      const updatedRows = [...email.rows]
      updatedRows.splice(rowIndex + 1, 0, newRow)

      handleSave({ ...email, rows: updatedRows })
      setCurrentBlock(newRow)
    } else {
      // Find the block to duplicate
      let blockToDuplicate: EmailBlockType | null = null
      let parentRow: RowBlock | null = null
      let columnIndex = -1

      for (const row of email.rows) {
        for (let i = 0; i < row.columns.length; i++) {
          const column = row.columns[i]
          const block = column.blocks.find((b) => b.id === currentBlock.id)
          if (block) {
            blockToDuplicate = block
            parentRow = row
            columnIndex = i
            break
          }
        }
        if (blockToDuplicate) break
      }

      if (!blockToDuplicate || !parentRow || columnIndex === -1) return

      // Create a deep copy with a new ID
      const newBlock: EmailBlockType = {
        ...blockToDuplicate,
        id: uuidv4(),
      }

      // Find the block index
      const blockIndex = parentRow.columns[columnIndex].blocks.findIndex((block) => block.id === currentBlock.id)
      if (blockIndex === -1) return

      // Clone the email structure and insert the new block
      const updatedRows = email.rows.map((row) => {
        if (row.id === parentRow?.id) {
          return {
            ...row,
            columns: row.columns.map((column, idx) => {
              if (idx === columnIndex) {
                const updatedBlocks = [...column.blocks]
                updatedBlocks.splice(blockIndex + 1, 0, newBlock)
                return { ...column, blocks: updatedBlocks }
              }
              return column
            }),
          }
        }
        return row
      })

      handleSave({ ...email, rows: updatedRows })
      setCurrentBlock(newBlock)
    }
  }, [currentBlock, email, handleSave, setCurrentBlock])

  const [{ isOver }, drop] = useDrop({
    accept: ['block', 'newBlock'],
    hover(item: { type: string; id: string }, monitor) {
      if (item.id === block.id) return

      const hoverRect = ref.current?.getBoundingClientRect()
      if (!hoverRect) return
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset!.y - hoverRect.top

      if (hoverClientY < hoverMiddleY) {
        setDropTarget({ type: 'block', id: block.id, position: 'above' })
      } else {
        setDropTarget({ type: 'block', id: block.id, position: 'below' })
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  // Connect the drag preview and drop to the container ref
  useEffect(() => {
    if (ref.current) {
      drop(ref.current)
    }
  }, [drop])

  const [labelPosition, setLabelPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (isHovered && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setLabelPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 1, // -1 to align with the right edge
      })
    }
  }, [isHovered])

  return (
    <>
      <div
        ref={ref}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-block-id={block.id}
        className={classNames(
          'group relative inline-block w-full',
          currentBlock?.id === block.id || isHovered ? 'outline outline-2 outline-blue-500' : ''
        )}
        style={{ opacity: isDraggingBlock ? 0.4 : 1 }}
      >
        <div
          className={classNames(
            'pointer-events-none absolute inset-0 transition-opacity duration-200',
            currentBlock?.id === block.id || !isHovered ? 'opacity-0' : 'opacity-0 group-hover:opacity-20'
          )}
          style={{ backgroundColor: 'rgb(59, 130, 246)', zIndex: 5 }}
        />

        {/* Invisible hover bridge */}
        {isHovered && (
          <div
            className="z-5 absolute"
            style={{
              top: '0',
              right: '-42px',
              width: '42px',
              height: '100%',
              pointerEvents: 'auto',
              zIndex: 50,
            }}
            onMouseEnter={handleMouseEnter}
          />
        )}

        {/* Toolbar when only hovering (not selected) */}
        {isHovered && currentBlock?.id !== block.id && (
          <motion.div
            className="absolute flex flex-col gap-1 rounded-lg border bg-white p-1 shadow-lg"
            style={{
              top: 'calc(50% - 19px)', // Adjusted up by 5px from previous -14px
              right: '-42px',
              zIndex: 200,
            }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={handleMouseEnter}
          >
            <div
              className="cursor-move rounded p-1.5 text-blue-500 hover:bg-blue-50"
              title="Drag to reorder"
              // @ts-ignore
              ref={drag}
            >
              <ArrowsPointingOutIcon className="h-4 w-4" />
            </div>
          </motion.div>
        )}

        {/* Toolbar when selected - with buttons in different order to maintain center */}
        {currentBlock?.id === block.id && (
          <motion.div
            className="absolute flex flex-col gap-1 rounded-lg border bg-white p-1 shadow-lg"
            style={{
              top: 'calc(50% - 57px)', // Adjusted up by 5px from previous -52px
              right: '-42px',
              zIndex: 200,
            }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={handleMouseEnter}
          >
            <button onClick={deleteBlock} className="rounded p-1.5 text-red-500 hover:bg-red-50" title="Delete Block">
              <TrashIcon className="h-4 w-4" />
            </button>

            <div
              className="cursor-move rounded p-1.5 text-blue-500 hover:bg-blue-50"
              title="Drag to reorder"
              // @ts-ignore
              ref={drag}
            >
              <ArrowsPointingOutIcon className="h-4 w-4" />
            </div>

            <button
              onClick={duplicateBlock}
              className="rounded p-1.5 text-gray-600 hover:bg-gray-100"
              title="Duplicate Block"
            >
              <Square2StackIcon className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        <DragPreviewImage connect={preview} src="/block.svg" />

        <RenderBlock block={block} parentRow={parentRow} />

        {dropTarget && isOver && dropTarget.id === block.id && <DragLine direction={dropTarget.position} />}
      </div>

      {isHovered &&
        currentBlock?.id !== block.id &&
        createPortal(
          <div
            className="fixed bg-blue-500 px-2 py-1 text-sm font-semibold text-white transition-opacity duration-200"
            style={{
              zIndex: 13,
              top: `${labelPosition.top}px`,
              left: `${labelPosition.left}px`,
              transform: 'translateX(-94%)',
            }}
          >
            {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
          </div>,
          document.body
        )}
    </>
  )
}
