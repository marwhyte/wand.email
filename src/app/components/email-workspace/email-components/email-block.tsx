import DragLine from '@/app/components/drag-line'
import { useEmailStore } from '@/lib/stores/emailStore'
import { classNames } from '@/lib/utils/misc'
import { ArrowsPointingOutIcon } from '@heroicons/react/24/solid'
import { useCallback, useEffect, useRef, useState } from 'react'
import { DragPreviewImage, useDrag, useDrop } from 'react-dnd'
import { createPortal } from 'react-dom'
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
  const { currentBlock, setCurrentBlock } = useEmailStore()
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const dragHandleRef = useRef<HTMLDivElement>(null)

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

  // Connect the drag handle to the drag icon
  useEffect(() => {
    if (dragHandleRef.current) {
      drag(dragHandleRef.current)
    }
  }, [drag])

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
        <div
          ref={dragHandleRef}
          className={classNames(
            'absolute -right-5 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-move items-center justify-center rounded-full bg-blue-500 shadow-md transition-all hover:bg-blue-600',
            currentBlock?.id === block.id || isHovered ? 'opacity-100' : 'opacity-0 transition-opacity duration-200'
          )}
          style={{ zIndex: 11 }}
        >
          <ArrowsPointingOutIcon className="h-4 w-4 text-white" />
        </div>

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
