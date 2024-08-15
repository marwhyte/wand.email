import { applyCommonAttributes } from '@/lib/utils/misc'
import { ArrowUpCircleIcon } from '@heroicons/react/20/solid'
import { Column } from '@react-email/components'
import EmailBlock from './email-block'

type Props = {
  column: ColumnBlock
  onBlockHover?: (isHovered: boolean) => void
  onBlockSelect?: (block: EmailBlock) => void
  onColumnClick?: () => void
}

export default function EmailColumn({ column, onBlockHover, onBlockSelect, onColumnClick }: Props) {
  const handleColumnClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onColumnClick?.()
    }
  }

  const width = `${(column.gridColumns / 12) * 100}%`

  console.log(column.attributes)

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
    >
      {column.blocks.length === 0 && (
        <div className="justify-cente flex h-full w-full flex-col items-center">
          <ArrowUpCircleIcon className="h-4 w-4" />
          <div className="mt-2 text-center text-xs font-medium">Drag content here</div>
        </div>
      )}
      {column.blocks.map((block) => (
        <EmailBlock key={block.id} block={block} onHover={onBlockHover} onSelect={onBlockSelect} />
      ))}
    </Column>
  )
}
