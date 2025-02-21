import { Button } from '@/app/components/button'
import { Checkbox } from '@/app/components/checkbox'
import Disclosure, { DisclosureBody } from '@/app/components/disclosure'
import { Field, Label } from '@/app/components/fieldset'
import { Input } from '@/app/components/input'
import { Select } from '@/app/components/select'
import PaddingForm, { PaddingValues } from '@/app/forms/padding-form'
import { getRowAttributes } from '@/lib/utils/attributes'
import { Bars3Icon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ColorInput } from '../color-input'
import { ColumnBlock, ColumnBlockAttributes, RowBlock, RowBlockAttributes } from './types'

interface RowEditorProps {
  row: RowBlock
  onColumnWidthChange: (newColumns: ColumnBlock[]) => void
  onColumnAttributeChange: (columnId: string, attributes: Partial<ColumnBlockAttributes>) => void
  onRowAttributeChange: (attributes: Partial<RowBlockAttributes>) => void
}

export default function RowEditor({ row, onColumnWidthChange, onColumnAttributeChange, onRowAttributeChange }: RowEditorProps) {
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
        const newWidthPercent = Math.round((x / containerWidth) * 100) // Round to nearest whole number

        const newColumns = [...row.columns]
        const adjustIndex = activeColumnIndex + 1 < newColumns.length ? activeColumnIndex + 1 : activeColumnIndex - 1

        if (adjustIndex >= 0 && adjustIndex < newColumns.length) {
          // Calculate total width of the two columns being adjusted
          const totalWidth = Math.round(parseFloat(newColumns[activeColumnIndex].width || '100')) + Math.round(parseFloat(newColumns[adjustIndex].width || '100'))

          // Ensure minimum width of 10% for each column
          const leftColumnWidth = Math.max(10, Math.min(90, newWidthPercent))
          const rightColumnWidth = totalWidth - leftColumnWidth

          // Only update if both columns maintain minimum width
          if (rightColumnWidth >= 10 && rightColumnWidth <= 90) {
            newColumns[activeColumnIndex].width = `${leftColumnWidth}%`
            newColumns[adjustIndex].width = `${rightColumnWidth}%`
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
        width: '16.67%', // 2/12 in percentage
        attributes: {},
        blocks: [],
      }

      let newColumns = [...row.columns]
      let spaceFound = false

      // Check for space in grid units (4/12 = 33.33%)
      if ((parseFloat(newColumns[newColumns.length - 1].width || '100') / 100) * 12 >= 4) {
        const currentWidth = parseFloat(newColumns[newColumns.length - 1].width || '100')
        newColumns[newColumns.length - 1].width = `${(currentWidth - 16.67).toFixed(2)}%`
        spaceFound = true
      }

      if (!spaceFound) {
        for (let i = newColumns.length - 1; i >= 0; i--) {
          if ((parseFloat(newColumns[i].width || '100') / 100) * 12 >= 4) {
            const currentWidth = parseFloat(newColumns[i].width || '100')
            newColumns[i].width = `${(currentWidth - 16.67).toFixed(2)}%`
            spaceFound = true
            break
          }
        }
      }

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

  const handleDeleteColumn = (columnId: string) => {
    if (row.columns.length > 1) {
      const newColumns = row.columns.filter((col) => col.id !== columnId)
      const deletedColumn = row.columns.find((col) => col.id === columnId)

      if (deletedColumn) {
        const widthToDistribute = parseFloat(deletedColumn.width || '100')
        const columnsToAdjust = newColumns.length

        const baseWidth = widthToDistribute / columnsToAdjust
        const remainderWidth = widthToDistribute % columnsToAdjust

        newColumns.forEach((col, index) => {
          const currentWidth = parseFloat(col.width || '100')
          let newWidth = currentWidth + baseWidth
          if (index === 0) {
            newWidth += remainderWidth
          }
          col.width = `${newWidth.toFixed(2)}%`
        })
      }

      onColumnWidthChange(newColumns)
      setSelectedColumnId(newColumns[0].id)
    }
  }

  const rowAttributes = getRowAttributes(row)

  return (
    <div className="space-y-4">
      <Disclosure title="Layout">
        <DisclosureBody>
          <div className="space-y-4">
            <Field>
              <div className="flex items-center gap-2">
                <Checkbox id="stackOnMobile" checked={rowAttributes.stackOnMobile ?? false} onChange={(e) => onRowAttributeChange({ stackOnMobile: e })} />
                <Label htmlFor="stackOnMobile">Stack columns on mobile</Label>
              </div>
            </Field>
            <Field>
              <div className="flex items-center gap-2">
                <Checkbox id="hideOnMobile" checked={rowAttributes.hideOnMobile ?? false} onChange={(e) => onRowAttributeChange({ hideOnMobile: e })} />
                <Label htmlFor="hideOnMobile">Hide on mobile</Label>
              </div>
            </Field>
            <Field>
              <div className="flex items-center gap-2">
                <Checkbox id="twoColumnsOnMobile" checked={rowAttributes.twoColumnsOnMobile ?? false} onChange={(e) => onRowAttributeChange({ twoColumnsOnMobile: e })} />
                <Label htmlFor="twoColumnsOnMobile">Two columns on mobile</Label>
              </div>
            </Field>
            <PaddingForm
              padding={{
                top: rowAttributes.paddingTop ?? rowAttributes.padding ?? '0px',
                right: rowAttributes.paddingRight ?? rowAttributes.padding ?? '0px',
                bottom: rowAttributes.paddingBottom ?? rowAttributes.padding ?? '0px',
                left: rowAttributes.paddingLeft ?? rowAttributes.padding ?? '0px',
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
          </div>
        </DisclosureBody>
      </Disclosure>
      <Disclosure title="Borders">
        <DisclosureBody>
          <Field>
            <Label>Row Border</Label>
            <div className="flex gap-2">
              <Select value={rowAttributes.borderStyle || 'solid'} onChange={(e) => handleRowBorderChange('borderStyle', e.target.value)}>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </Select>
              <Input type="number" value={rowAttributes.borderWidth?.replace('px', '') || ''} onChange={(e) => handleRowBorderChange('borderWidth', `${e.target.value}px`)} placeholder="Width" />
              <ColorInput value={rowAttributes.borderColor || ''} onChange={(e) => handleRowBorderChange('borderColor', e)} />
            </div>
          </Field>
        </DisclosureBody>
      </Disclosure>

      <Disclosure title="Background">
        <DisclosureBody>
          <Field>
            <Label>Row Background Color</Label>
            <ColorInput value={rowAttributes.backgroundColor || ''} onChange={(e) => handleRowBackgroundColorChange(e)} />
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
          <div ref={containerRef} className="relative flex h-12 w-full">
            {row.columns.map((column, index) => (
              <Fragment key={column.id}>
                <div
                  className={`relative z-10 flex flex-col items-center justify-center rounded-md border border-gray-300 ${selectedColumnId === column.id ? 'bg-blue-100 ring-2 ring-blue-500' : ''}`}
                  style={{
                    width: column.width,
                    margin: '0 2px',
                  }}
                  onClick={(e) => handleColumnClick(e, column.id)}
                >
                  <div className={`text-xs font-medium ${isDragging ? 'select-none' : ''}`}>{`${parseFloat(column.width || '100')}%`}</div>
                  {row.columns.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteColumn(column.id)
                      }}
                      className="absolute -right-2 -top-2 rounded-full bg-white p-0.5 text-gray-400 hover:text-red-500"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {index < row.columns.length - 1 && (
                  <div className="relative z-20 mr-[2px] flex h-full w-3 cursor-col-resize items-center justify-center" onMouseDown={(e) => handleDragStart(e, index)}>
                    <Bars3Icon className={`h-10 w-10 text-gray-400 hover:text-blue-500 ${isDragging && activeColumnIndex === index ? 'text-blue-500' : ''}`} />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </DisclosureBody>
      </Disclosure>
    </div>
  )
}
