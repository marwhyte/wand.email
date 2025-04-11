import { useEmailSave } from '@/app/hooks/useEmailSave'
import { useEmailStore } from '@/lib/stores/emailStore'
import { useTableStore } from '@/lib/stores/tableStore'
import { getTableProps } from '@/lib/utils/attributes'
import { getBlockAttributes } from '@/lib/utils/attributes/attributes'
import { useCallback, useEffect } from 'react'
import { RowBlock, TableBlock } from '../types'
import EditableContent from './editable-content'

type Props = {
  block: TableBlock
  parentRow: RowBlock
}

export default function EmailTable({ block, parentRow }: Props) {
  const { email, currentBlock, setCurrentBlock } = useEmailStore()
  const { selectedCell, setSelectedCell, selectedCellValue, setSelectedCellValue } = useTableStore()
  const tableProps = getTableProps(block, parentRow, email)
  const tableAttributes = getBlockAttributes(block, parentRow, email)
  const saveEmail = useEmailSave()

  useEffect(() => {
    if (currentBlock?.id !== block.id) {
      setSelectedCell(null)
      setSelectedCellValue(null)
    }
  }, [currentBlock?.id])

  const { style, ...restProps } = tableProps
  const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyles } = style || {}

  const divStyles = {
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  }

  const handleCellSelect = useCallback(
    (rowIndex: number, cellIndex: number, cellContent: string) => {
      setSelectedCell({ row: rowIndex, column: cellIndex, value: cellContent })
      if (selectedCell?.row !== rowIndex || selectedCell?.column !== cellIndex) {
        setSelectedCellValue(cellContent)
      }
    },
    [selectedCell, setSelectedCell, setSelectedCellValue]
  )

  const handleCellChange = useCallback(
    (rowIndex: number, cellIndex: number, newContent: string) => {
      if (!email) return

      // Create a deep copy of the table attributes to avoid mutating state directly
      const updatedRows = [...tableAttributes.rows]
      updatedRows[rowIndex] = [...updatedRows[rowIndex]]
      updatedRows[rowIndex][cellIndex] = newContent

      // Create an updated block with the new cell content
      const updatedBlock = {
        ...block,
        attributes: {
          ...block.attributes,
          rows: updatedRows,
        },
      }

      // Update the current block
      setCurrentBlock(updatedBlock)

      // Update the email with the new block
      const updatedEmail = {
        ...email,
        rows: email.rows.map((row) => ({
          ...row,
          columns: row.columns.map((column) => ({
            ...column,
            blocks: column.blocks.map((b) => (b.id === block.id ? updatedBlock : b)),
          })),
        })),
      }

      // Save the updated email
      saveEmail(updatedEmail)
    },
    [email, block, tableAttributes.rows, setCurrentBlock, saveEmail]
  )

  return (
    <div style={divStyles}>
      <table style={{ ...restStyles }} {...restProps}>
        <tbody>
          {tableAttributes.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
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
                  <EditableContent
                    content={cell}
                    block={block}
                    isSelected={selectedCell?.row === rowIndex && selectedCell?.column === cellIndex}
                    onSelect={() => handleCellSelect(rowIndex, cellIndex, cell)}
                    className="w-full"
                    style={{}}
                    onChange={(newContent) => handleCellChange(rowIndex, cellIndex, newContent)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
