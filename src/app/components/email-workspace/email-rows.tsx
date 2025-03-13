import { useDrag } from 'react-dnd'
import { v4 as uuidv4 } from 'uuid'

const EmailRows = () => {
  const rowOptions = [
    [100],
    [83.33, 16.67],
    [66.67, 33.33],
    [50, 50],
    [33.33, 66.67],
    [16.67, 83.33],
    [33.33, 33.33, 33.33],
    [25, 25, 25, 25],
    [25, 50, 25],
  ]
  return (
    <div className="space-y-6 p-4">
      {rowOptions.map((row, index) => (
        <DraggableRow widths={row} key={index} />
      ))}
    </div>
  )
}

export default EmailRows

type DraggableRowProps = {
  widths: number[]
}

const DraggableRow = ({ widths }: DraggableRowProps) => {
  const [, drag] = useDrag(() => ({
    type: 'newRow',
    item: { type: 'newRow', id: uuidv4(), widths: widths.map((w) => `${w}%`) },
  }))

  return (
    // @ts-ignore
    <button ref={drag} className="group flex w-full gap-2">
      {widths.map((columnWidth, index) => (
        <div
          key={index}
          className="h-14 rounded-md bg-gray-200 transition-colors duration-200 group-hover:bg-gray-300 dark:bg-gray-700 dark:group-hover:bg-gray-600"
          style={{ flexBasis: `${columnWidth}%` }}
        >
          <div className="h-full w-full px-2 py-4">
            <div className="h-full w-full rounded-md border border-dashed border-gray-300 transition-colors duration-200 group-hover:border-gray-400 dark:border-gray-500 dark:group-hover:border-gray-400"></div>
          </div>
        </div>
      ))}
    </button>
  )
}
