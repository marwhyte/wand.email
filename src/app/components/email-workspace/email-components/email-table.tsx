import { useEmailStore } from '@/lib/stores/emailStore'
import { useTableStore } from '@/lib/stores/tableStore'
import { generateTableProps, getEmailAttributes } from '@/lib/utils/attributes'
import parse from 'html-react-parser'
import { useEffect } from 'react'
import { RowBlock, TableBlock } from '../types'
type Props = {
  block: TableBlock
  parentRow: RowBlock
}

export default function EmailTable({ block, parentRow }: Props) {
  const { email, currentBlock } = useEmailStore()
  const { selectedCell, setSelectedCell, selectedCellValue, setSelectedCellValue } = useTableStore()
  const emailAttributes = getEmailAttributes(email)
  const attributes = generateTableProps(block, parentRow, email)

  useEffect(() => {
    if (currentBlock?.id !== block.id) {
      setSelectedCell(null)
      setSelectedCellValue(null)
    }
  }, [currentBlock?.id])

  const { style, ...restAttributes } = attributes
  const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyles } = style || {}

  // Combine padding values
  const divStyles = {
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  }

  return (
    <div style={divStyles}>
      <table style={{ ...restStyles }} {...restAttributes}>
        <tbody>
          {block.attributes.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  onClick={() => {
                    setSelectedCell({ row: rowIndex, column: cellIndex, value: cell })
                    if (selectedCell?.row !== rowIndex || selectedCell?.column !== cellIndex) {
                      setSelectedCellValue(cell)
                    }
                  }}
                  width={`${100 / row.length}%`}
                  key={cellIndex}
                  style={{
                    padding: '10px',
                    wordBreak: 'break-word',
                    borderTop: '1px solid #dddddd',
                    borderRight: '1px solid #dddddd',
                    borderBottom: '1px solid #dddddd',
                    borderLeft: '1px solid #dddddd',
                    boxShadow:
                      selectedCell?.row === rowIndex && selectedCell?.column === cellIndex
                        ? '0 0 0 2px #6b46c1'
                        : 'none',
                    outline:
                      selectedCell?.row === rowIndex && selectedCell?.column === cellIndex
                        ? '2px solid #6b46c1'
                        : 'none',
                  }}
                  className={`table-cell hover:bg-purple-200`}
                >
                  {parse(
                    selectedCell?.row === rowIndex && selectedCell?.column === cellIndex
                      ? selectedCellValue || cell
                      : cell
                  ) || '\u200B'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
