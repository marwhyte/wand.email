import { applyCommonAttributes } from '@/lib/utils/misc'
import { ArrowsPointingOutIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Container, Row } from '@react-email/components'
import { useRef } from 'react'
import { DragPreviewImage, useDrag, useDrop } from 'react-dnd'
import EmailColumn from './email-column'

type Props = {
  row: RowBlock
  email: Email
  onSave?: (email: Email) => void
  index: number
  moveRow: (dragIndex: number, hoverIndex: number) => void
  dropLine: number | null
  onHover: (index: number, hoverClientY: number, hoverMiddleY: number) => void
}

export default function EmailRow({ row, email, onSave, index, moveRow, dropLine, onHover }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'row',
    item: { type: 'row', id: row.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'row',
    hover(item: { type: string; id: string; index: number }, monitor) {
      if (!ref.current) return

      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset!.y - hoverRect.top

      onHover(index, hoverClientY, hoverMiddleY)
    },
    drop(item: { type: string; id: string; index: number }) {
      if (dropLine !== null && item.index !== index) {
        moveRow(item.index, dropLine > item.index ? dropLine - 1 : dropLine)
      }
    },
  })

  drop(ref)

  const opacity = isDragging ? 0.4 : 1

  return (
    <div ref={ref} className="relative" style={{ opacity }}>
      <DragPreviewImage connect={preview} src="/row.svg" />

      {onSave && (
        <div ref={drag} className="absolute bottom-0 left-0 top-0 flex cursor-move items-center p-2">
          <ArrowsPointingOutIcon className="h-5 w-5" />
        </div>
      )}
      <Container style={{ ...applyCommonAttributes(row.container.attributes) }}>
        <Row align={row.attributes.align} style={{ ...applyCommonAttributes(row.attributes) }}>
          {row.columns.map((column) => (
            <EmailColumn block={column} key={column.id} />
          ))}
        </Row>
      </Container>
      {dropLine === index + 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-10" style={{ transform: 'translateY(50%)' }}>
          <div className="flex items-center justify-center">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <button
                type="button"
                className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <PlusIcon aria-hidden="true" className="-ml-1 -mr-0.5 h-5 w-5 text-gray-400" />
                Button text
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
