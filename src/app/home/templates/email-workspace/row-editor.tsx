import { Field, Label } from '@/app/components/fieldset'
import { Input } from '@/app/components/input'
import { Select } from '@/app/components/select'
import { Bars3Icon } from '@heroicons/react/24/solid'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface RowEditorProps {
  columns: ColumnBlock[]
  onColumnWidthChange: (newColumns: ColumnBlock[]) => void
  onColumnAttributeChange: (columnId: string, attribute: string, value: string) => void
}

export default function RowEditor({ columns, onColumnWidthChange, onColumnAttributeChange }: RowEditorProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [activeColumnIndex, setActiveColumnIndex] = useState(-1)
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>, columnIndex: number) => {
    setIsDragging(true)
    setActiveColumnIndex(columnIndex)
  }

  const handleDrag = useCallback(
    (e: MouseEvent) => {
      if (isDragging && containerRef.current && activeColumnIndex !== -1) {
        const bounds = containerRef.current.getBoundingClientRect()
        const x = e.clientX - bounds.left
        const containerWidth = bounds.width
        const newColumnWidth = Math.round((x / containerWidth) * 12)

        const newColumns = [...columns]
        const totalWidth = newColumns.reduce((sum, col) => sum + col.gridColumns, 0)
        const leftColumnWidth = Math.max(2, Math.min(10, newColumnWidth))

        // Determine which column to adjust (right if exists, otherwise left)
        const adjustIndex = activeColumnIndex + 1 < newColumns.length ? activeColumnIndex + 1 : activeColumnIndex - 1

        if (adjustIndex >= 0 && adjustIndex < newColumns.length) {
          const currentTotal = newColumns[activeColumnIndex].gridColumns + newColumns[adjustIndex].gridColumns
          const rightColumnWidth = Math.max(2, currentTotal - leftColumnWidth)

          if (leftColumnWidth + rightColumnWidth === currentTotal) {
            newColumns[activeColumnIndex].gridColumns = leftColumnWidth
            newColumns[adjustIndex].gridColumns = rightColumnWidth
            onColumnWidthChange(newColumns)
          }
        }
      }
    },
    [isDragging, columns, activeColumnIndex, onColumnWidthChange]
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    setActiveColumnIndex(-1)
  }, [])

  const handleAddColumn = () => {
    if (columns.length < 4) {
      const newColumn: ColumnBlock = {
        id: uuidv4(),
        type: 'column',
        gridColumns: 2,
        attributes: {},
        blocks: [],
      }

      let newColumns = [...columns]
      let spaceFound = false

      // Try to take space from the last column first
      if (newColumns[newColumns.length - 1].gridColumns >= 4) {
        newColumns[newColumns.length - 1].gridColumns -= 2
        spaceFound = true
      }

      // If not possible, look for space in other columns from right to left
      if (!spaceFound) {
        for (let i = newColumns.length - 1; i >= 0; i--) {
          if (newColumns[i].gridColumns >= 4) {
            newColumns[i].gridColumns -= 2
            spaceFound = true
            break
          }
        }
      }

      // If space is found, add the new column
      if (spaceFound) {
        newColumns.push(newColumn)
        onColumnWidthChange(newColumns)
      }
    }
  }

  const handleColumnClick = useCallback(
    (e: React.MouseEvent, columnId: string) => {
      e.stopPropagation() // Prevent event from bubbling up
      setSelectedColumnId(columnId === selectedColumnId ? null : columnId)
    },
    [selectedColumnId]
  )

  const handlePaddingChange = (columnId: string, side: 'Top' | 'Right' | 'Bottom' | 'Left', value: string) => {
    const numValue = parseInt(value, 10)
    const newValue = isNaN(numValue) ? '0px' : `${numValue}px`
    onColumnAttributeChange(columnId, `padding${side}`, newValue)
  }

  const handlePaddingToggle = (columnId: string, side: 'Top' | 'Right' | 'Bottom' | 'Left') => {
    const column = columns.find((col) => col.id === columnId)
    if (!column) return

    const currentPadding = column.attributes[`padding${side}` as keyof ColumnBlockAttributes] || '0px'
    const newPadding = currentPadding === '0px' ? '8px' : '0px'

    onColumnAttributeChange(columnId, `padding${side}`, newPadding)
  }

  const handleBorderChange = (columnId: string, attribute: string, value: string) => {
    onColumnAttributeChange(columnId, attribute, value)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag)
      window.addEventListener('mouseup', handleDragEnd)
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag)
      window.removeEventListener('mouseup', handleDragEnd)
    }
  }, [isDragging, handleDrag, handleDragEnd])

  console.log(columns.find((col) => col.id === selectedColumnId)?.attributes['paddingBottom'])

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="w-ful relative flex h-8">
        {columns.map((column, index) => (
          <Fragment key={column.id}>
            <div
              className={`relative z-10 flex items-center justify-center rounded-md border border-gray-300 ${
                selectedColumnId === column.id ? 'bg-blue-100 ring-2 ring-blue-500' : ''
              }`}
              style={{
                width: `${(column.gridColumns / 12) * 100}%`,
                margin: '0 2px',
              }}
              onClick={(e) => handleColumnClick(e, column.id)}
            >
              <div className={`text-xs font-medium ${isDragging ? 'select-none' : ''}`}>{column.gridColumns}</div>
            </div>
            {index < columns.length - 1 && (
              <div
                className="relative z-20 mr-[2px] flex h-full w-3 cursor-col-resize items-center justify-center"
                onMouseDown={(e) => handleDragStart(e, index)}
              >
                <Bars3Icon
                  className={`h-10 w-10 text-gray-400 hover:text-blue-500 ${
                    isDragging && activeColumnIndex === index ? 'text-blue-500' : ''
                  }`}
                />
              </div>
            )}
          </Fragment>
        ))}
      </div>
      {selectedColumnId && (
        <>
          <Field>
            <Label>Padding</Label>

            <div className="mt-2 flex flex-wrap gap-2">
              {(['Top', 'Right', 'Bottom', 'Left'] as const).map((side) => (
                <div key={side} className="flex items-center">
                  <Input
                    type="number"
                    value={
                      columns
                        .find((col) => col.id === selectedColumnId)
                        ?.attributes[`padding${side}`]?.replace('px', '') || '0'
                    }
                    onChange={(e) => handlePaddingChange(selectedColumnId, side, e.target.value)}
                    placeholder="In px"
                  />
                  <span className="ml-2 text-sm">{side}</span>
                </div>
              ))}
            </div>
          </Field>
          <Field>
            <Label>Border</Label>
            <div className="flex gap-2">
              <Select
                value={columns.find((col) => col.id === selectedColumnId)?.attributes.borderStyle || 'solid'}
                onChange={(e) => handleBorderChange(selectedColumnId, 'borderStyle', e.target.value)}
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </Select>
              <Input
                type="number"
                value={
                  columns.find((col) => col.id === selectedColumnId)?.attributes.borderWidth?.replace('px', '') || ''
                }
                onChange={(e) => handleBorderChange(selectedColumnId, 'borderWidth', `${e.target.value}px`)}
                placeholder="Width"
              />
              <Input
                type="color"
                value={columns.find((col) => col.id === selectedColumnId)?.attributes.borderColor || ''}
                onChange={(e) => handleBorderChange(selectedColumnId, 'borderColor', e.target.value)}
              />
            </div>
          </Field>
        </>
      )}
    </div>
  )
}
