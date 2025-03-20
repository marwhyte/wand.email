import { useTableStore } from '@/lib/stores/tableStore'
import { getBlockAttributes } from '@/lib/utils/attributes/attributes'
import { useEffect, useState } from 'react'
import { Field, FieldGroup, Label } from '../fieldset'
import { NumberInput } from '../input'
import Textbox from '../textbox'
import { Email, RowBlock, TableBlock, TableBlockAttributes } from './types'

interface TableEditorProps {
  block: TableBlock
  onChange: (block: TableBlockAttributes) => void
  parentRow: RowBlock
  email: Email
}

export default function TableEditor({ block, onChange, parentRow, email }: TableEditorProps) {
  const tableAttributes = getBlockAttributes(block, parentRow, email)
  const [table, setTable] = useState(tableAttributes.rows)
  const { selectedCell, setSelectedCell, setSelectedCellValue, selectedCellValue } = useTableStore()

  useEffect(() => {
    if (selectedCell && (selectedCell.row >= table.length || selectedCell.column >= table[0].length)) {
      setSelectedCell(null)
    }
  }, [block.id, table])

  return (
    <div>
      <FieldGroup>
        {selectedCell && (
          <Field labelPosition="top">
            <Textbox
              autofocus={selectedCell.row === 0 && selectedCell.column === 0}
              value={selectedCellValue ?? ''}
              onChange={(e) => {
                const newTable = [...table]
                newTable[selectedCell.row][selectedCell.column] = e
                setTable(newTable)
                onChange({ rows: newTable })
                setSelectedCellValue(e)
              }}
            />
          </Field>
        )}
        <Field>
          <Label>Rows</Label>
          <NumberInput
            value={table.length}
            min={1}
            max={10}
            onChange={(e) => {
              const newRowCount = e
              let newTable = [...table]

              if (newRowCount > table.length) {
                // Add new rows while preserving existing data
                const rowsToAdd = newRowCount - table.length
                const newRows = Array.from({ length: rowsToAdd }, () => new Array(table[0].length).fill(''))
                newTable = [...newTable, ...newRows]
              } else if (newRowCount < table.length) {
                // Remove rows while preserving remaining data
                newTable = newTable.slice(0, newRowCount)
              }

              setTable(newTable)
              onChange({ rows: newTable })
            }}
          />
        </Field>
        <Field>
          <Label>Columns</Label>
          <NumberInput
            value={table[0].length}
            min={1}
            max={10}
            onChange={(e) => {
              const newColCount = e
              let newTable = table.map((row) => [...row])

              if (newColCount > table[0].length) {
                // Add new columns while preserving existing data
                const colsToAdd = newColCount - table[0].length
                newTable = newTable.map((row) => [...row, ...Array(colsToAdd).fill('')])
              } else if (newColCount < table[0].length) {
                // Remove columns while preserving remaining data
                newTable = newTable.map((row) => row.slice(0, newColCount))
              }

              setTable(newTable)
              onChange({ rows: newTable })
            }}
          />
        </Field>
      </FieldGroup>
    </div>
  )
}
