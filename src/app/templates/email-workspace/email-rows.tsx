import { useDrag } from 'react-dnd'
import { v4 as uuidv4 } from 'uuid'

const EmailRows = () => {
  const rowOptions = [
    [12],
    [10, 2],
    [8, 4],
    [6, 6],
    [4, 8],
    [2, 10],
    [4, 4, 4],
    [3, 3, 3, 3],
    [3, 6, 3],
    [2, 2, 2, 2, 2, 2],
  ]
  return (
    <div className="space-y-6 p-4">
      {rowOptions.map((row, index) => (
        <DraggableRow width={row} key={index} />
      ))}
    </div>
  )
}

export default EmailRows

type DraggableRowProps = {
  width: number[]
}

const DraggableRow = ({ width }: DraggableRowProps) => {
  const [, drag] = useDrag(() => ({
    type: 'newRow',
    item: { type: 'newRow', id: uuidv4(), gridColumns: width },
  }))

  return (
    // @ts-ignore
    <button ref={drag} className="group flex w-full gap-2">
      {width.map((columnWidth, index) => (
        <div
          key={index}
          className="h-14 rounded-md bg-gray-200 transition-colors duration-200 group-hover:bg-gray-300 dark:bg-gray-700 dark:group-hover:bg-gray-600"
          style={{ flexBasis: `${(columnWidth / 12) * 100}%` }}
        >
          <div className="h-full w-full px-2 py-4">
            <div className="h-full w-full rounded-md border border-dashed border-gray-300 transition-colors duration-200 group-hover:border-gray-400 dark:border-gray-500 dark:group-hover:border-gray-400"></div>
          </div>
        </div>
      ))}
    </button>
  )
}
