import { Button } from '@/app/components/button'
import Disclosure, { DisclosureBody } from '@/app/components/disclosure'
import { Field, Label } from '@/app/components/fieldset'
import { Input } from '@/app/components/input'
import { Select } from '@/app/components/select'
import PaddingForm, { PaddingValues } from '@/app/forms/padding-form'
import { Bars3Icon, PlusIcon } from '@heroicons/react/20/solid'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface RowEditorProps {
  row: RowBlock
  onColumnWidthChange: (newColumns: ColumnBlock[]) => void
  onColumnAttributeChange: (columnId: string, attributes: Partial<ColumnBlockAttributes>) => void
  onRowAttributeChange: (attributes: Partial<RowBlockAttributes>) => void
}

export default function RowEditor({
  row,
  onColumnWidthChange,
  onColumnAttributeChange,
  onRowAttributeChange,
}: RowEditorProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [activeColumnIndex, setActiveColumnIndex] = useState(-1)
  const [selectedColumnId, setSelectedColumnId] = useState<string>(row.columns[0].id)
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

        const newColumns = [...row.columns]
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
    [isDragging, row.columns, activeColumnIndex, onColumnWidthChange]
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    setActiveColumnIndex(-1)
  }, [])

  const handleAddColumn = () => {
    if (row.columns.length < 4) {
      const newColumn: ColumnBlock = {
        id: uuidv4(),
        type: 'column',
        gridColumns: 2,
        attributes: {},
        blocks: [],
      }

      let newColumns = [...row.columns]
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

  const handleColumnClick = useCallback((e: React.MouseEvent, columnId: string) => {
    e.stopPropagation()
    setSelectedColumnId(columnId)
  }, [])

  const handlePaddingChange = (columnId: string, paddingValues: Partial<ColumnBlockAttributes>) => {
    onColumnAttributeChange(columnId, paddingValues)
  }

  const handleRowPaddingChange = (paddingValues: Partial<RowBlockAttributes>) => {
    onRowAttributeChange(paddingValues)
  }

  const handleBorderChange = (columnId: string, attribute: string, value: string) => {
    onColumnAttributeChange(columnId, { [attribute]: value })
  }

  const handleRowBorderChange = (attribute: string, value: string) => {
    onRowAttributeChange({ [attribute]: value })
  }

  const handleRowBackgroundColorChange = (value: string) => {
    onRowAttributeChange({ backgroundColor: value })
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

  const selectedColumn = row.columns.find((col) => col.id === selectedColumnId)

  return (
    <div className="space-y-4">
      <Disclosure title="Layout">
        <DisclosureBody>
          <PaddingForm
            padding={{
              top: row.attributes.paddingTop ?? row.attributes.padding ?? '0px',
              right: row.attributes.paddingRight ?? row.attributes.padding ?? '0px',
              bottom: row.attributes.paddingBottom ?? row.attributes.padding ?? '0px',
              left: row.attributes.paddingLeft ?? row.attributes.padding ?? '0px',
            }}
            onChange={(values: Partial<PaddingValues>) => {
              const rowAttributes: Partial<RowBlockAttributes> = {
                paddingTop: values.top,
                paddingRight: values.right,
                paddingBottom: values.bottom,
                paddingLeft: values.left,
              }
              handleRowPaddingChange(rowAttributes)
            }}
          />
        </DisclosureBody>
      </Disclosure>
      <Disclosure title="Borders">
        <DisclosureBody>
          <Field>
            <Label>Row Border</Label>
            <div className="flex gap-2">
              <Select
                value={row.attributes.borderStyle || 'solid'}
                onChange={(e) => handleRowBorderChange('borderStyle', e.target.value)}
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </Select>
              <Input
                type="number"
                value={row.attributes.borderWidth?.replace('px', '') || ''}
                onChange={(e) => handleRowBorderChange('borderWidth', `${e.target.value}px`)}
                placeholder="Width"
              />
              <Input
                type="color"
                value={row.attributes.borderColor || ''}
                onChange={(e) => handleRowBorderChange('borderColor', e.target.value)}
              />
            </div>
          </Field>
        </DisclosureBody>
      </Disclosure>

      <Disclosure title="Background">
        <DisclosureBody>
          <Field>
            <Label>Row Background Color</Label>
            <Input
              type="color"
              value={row.attributes.backgroundColor || ''}
              onChange={(e) => handleRowBackgroundColorChange(e.target.value)}
            />
          </Field>
        </DisclosureBody>
      </Disclosure>

      <Disclosure defaultOpen title="Column Structure">
        <DisclosureBody>
          <div className="flex justify-end">
            <Button plain onClick={handleAddColumn} disabled={row.columns.length >= 4} className="mb-2 text-blue-500">
              Add
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <div ref={containerRef} className="relative flex h-8 w-full">
            {row.columns.map((column, index) => (
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
                {index < row.columns.length - 1 && (
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
            <div className="mt-4 space-y-4">
              <PaddingForm
                padding={{
                  top: selectedColumn?.attributes.paddingTop ?? selectedColumn?.attributes.padding ?? '0px',
                  right: selectedColumn?.attributes.paddingRight ?? selectedColumn?.attributes.padding ?? '0px',
                  bottom: selectedColumn?.attributes.paddingBottom ?? selectedColumn?.attributes.padding ?? '0px',
                  left: selectedColumn?.attributes.paddingLeft ?? selectedColumn?.attributes.padding ?? '0px',
                }}
                onChange={(paddingValues) =>
                  handlePaddingChange(selectedColumnId, paddingValues as Partial<ColumnBlockAttributes>)
                }
              />

              <Field>
                <Label>Column Border</Label>
                <div className="flex gap-2">
                  <Select
                    value={selectedColumn?.attributes.borderStyle || 'solid'}
                    onChange={(e) => handleBorderChange(selectedColumnId, 'borderStyle', e.target.value)}
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                  </Select>
                  <Input
                    type="number"
                    value={selectedColumn?.attributes.borderWidth?.replace('px', '') || ''}
                    onChange={(e) => handleBorderChange(selectedColumnId, 'borderWidth', `${e.target.value}px`)}
                    placeholder="Width"
                  />
                  <Input
                    type="color"
                    value={selectedColumn?.attributes.borderColor || ''}
                    onChange={(e) => handleBorderChange(selectedColumnId, 'borderColor', e.target.value)}
                  />
                </div>
              </Field>

              <Field>
                <Label>Column Background Color</Label>
                <Input
                  type="color"
                  value={selectedColumn?.attributes.backgroundColor || ''}
                  onChange={(e) => onColumnAttributeChange(selectedColumnId, { backgroundColor: e.target.value })}
                />
              </Field>

              <Field>
                <Label>Column Align</Label>
                <div className="flex gap-2">
                  <Button onClick={() => onColumnAttributeChange(selectedColumnId, { align: 'left' })}>Left</Button>
                  <Button onClick={() => onColumnAttributeChange(selectedColumnId, { align: 'center' })}>Center</Button>
                  <Button onClick={() => onColumnAttributeChange(selectedColumnId, { align: 'right' })}>Right</Button>
                </div>
              </Field>
            </div>
          )}
        </DisclosureBody>
      </Disclosure>
    </div>
  )
}
