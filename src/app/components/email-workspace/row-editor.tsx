import { Button } from '@/app/components/button'
import { Checkbox } from '@/app/components/checkbox'
import Disclosure, { DisclosureBody } from '@/app/components/disclosure'
import { Field, FieldGroup, Label } from '@/app/components/fieldset'
import { Input, NumberInput } from '@/app/components/input'
import { Select } from '@/app/components/select'
import PaddingForm, { PaddingValues } from '@/app/forms/padding-form'
import { useEmailStore } from '@/lib/stores/emailStore'
import { getRowAttributes } from '@/lib/utils/attributes'
import { safeParseInt } from '@/lib/utils/misc'
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

export default function RowEditor({
  row,
  onColumnWidthChange,
  onColumnAttributeChange,
  onRowAttributeChange,
}: RowEditorProps) {
  const { email } = useEmailStore()
  const [isDragging, setIsDragging] = useState(false)
  const [activeColumnIndex, setActiveColumnIndex] = useState(-1)
  const [selectedColumnId, setSelectedColumnId] = useState<string>(row.columns[0].id)
  const containerRef = useRef<HTMLDivElement>(null)

  // Convert percentage width to column units (1-12 scale)
  const percentToUnits = (percent: string): number => {
    const value = parseFloat(percent || '100')
    return Math.round((value / 100) * 12)
  }

  // Convert column units to percentage width
  const unitsToPercent = (units: number): string => {
    return `${((units / 12) * 100).toFixed(2)}%`
  }

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

        // Calculate units based on position (1-12 scale)
        const rawUnits = Math.round((x / containerWidth) * 12)
        const newUnits = Math.max(2, Math.min(10, rawUnits)) // Ensure between 2-10

        const newColumns = [...row.columns]
        const adjustIndex = activeColumnIndex + 1 < newColumns.length ? activeColumnIndex + 1 : activeColumnIndex - 1

        if (adjustIndex >= 0 && adjustIndex < newColumns.length) {
          // Calculate total units of the two columns being adjusted
          const activeColUnits = percentToUnits(newColumns[activeColumnIndex].width || '100')
          const adjustColUnits = percentToUnits(newColumns[adjustIndex].width || '100')
          const totalUnits = activeColUnits + adjustColUnits

          // Ensure minimum width of 2 units for each column
          if (newUnits >= 2 && totalUnits - newUnits >= 2) {
            newColumns[activeColumnIndex].width = unitsToPercent(newUnits)
            newColumns[adjustIndex].width = unitsToPercent(totalUnits - newUnits)
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
        width: unitsToPercent(2), // 2 units (out of 12)
        attributes: {},
        blocks: [],
      }

      let newColumns = [...row.columns]
      let spaceFound = false

      // Try to take space from the last column
      const lastColUnits = percentToUnits(newColumns[newColumns.length - 1].width || '100')
      if (lastColUnits >= 3) {
        newColumns[newColumns.length - 1].width = unitsToPercent(lastColUnits - 2)
        spaceFound = true
      }

      // If last column doesn't have enough space, check others
      if (!spaceFound) {
        for (let i = newColumns.length - 1; i >= 0; i--) {
          const colUnits = percentToUnits(newColumns[i].width || '100')
          if (colUnits >= 3) {
            newColumns[i].width = unitsToPercent(colUnits - 2)
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
        const unitsToDistribute = percentToUnits(deletedColumn.width || '100')
        const columnsToAdjust = newColumns.length

        // Calculate how to distribute the units
        const baseUnits = Math.floor(unitsToDistribute / columnsToAdjust)
        const remainderUnits = unitsToDistribute % columnsToAdjust

        newColumns.forEach((col, index) => {
          const currentUnits = percentToUnits(col.width || '100')
          let newUnits = currentUnits + baseUnits
          if (index === 0) {
            newUnits += remainderUnits
          }
          col.width = unitsToPercent(newUnits)
        })
      }

      onColumnWidthChange(newColumns)
      setSelectedColumnId(newColumns[0].id)
    }
  }

  const rowAttributes = getRowAttributes(row, email)

  return (
    <div className="space-y-4">
      <Disclosure defaultOpen title="Layout">
        <DisclosureBody>
          <FieldGroup>
            <Field>
              <Label htmlFor="stackOnMobile">Stack columns on mobile</Label>
              <div className="flex items-center justify-end">
                <Checkbox
                  id="stackOnMobile"
                  checked={rowAttributes.stackOnMobile ?? false}
                  onChange={(e) => onRowAttributeChange({ stackOnMobile: e })}
                />
              </div>
            </Field>

            <Field>
              <Label htmlFor="hideOnMobile">Hide on mobile</Label>
              <div className="flex justify-end">
                <Checkbox
                  id="hideOnMobile"
                  checked={rowAttributes.hideOnMobile ?? false}
                  onChange={(e) => onRowAttributeChange({ hideOnMobile: e })}
                />
              </div>
            </Field>

            <Field>
              <Label htmlFor="verticalAlign">Vertical Alignment</Label>
              <Select
                id="verticalAlign"
                value={rowAttributes.verticalAlign || 'top'}
                onChange={(e) => onRowAttributeChange({ verticalAlign: e.target.value as 'top' | 'middle' | 'bottom' })}
              >
                <option value="top">Top</option>
                <option value="middle">Middle</option>
                <option value="bottom">Bottom</option>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="columnSpacing">Column Spacing</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="columnSpacing"
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  value={rowAttributes.columnSpacing || 0}
                  onChange={(e) => onRowAttributeChange({ columnSpacing: Number(e.target.value) })}
                />
                <span className="text-sm text-gray-500">px</span>
              </div>
            </Field>
            <PaddingForm
              padding={{
                top: rowAttributes.paddingTop ?? '0px',
                right: rowAttributes.paddingRight ?? '0px',
                bottom: rowAttributes.paddingBottom ?? '0px',
                left: rowAttributes.paddingLeft ?? '0px',
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
          </FieldGroup>
        </DisclosureBody>
      </Disclosure>
      <Disclosure defaultOpen title="Borders">
        <DisclosureBody>
          <FieldGroup>
            <Field labelPosition="top">
              <Label>Border</Label>
              <div className="flex gap-2">
                <div className="w-[106px]">
                  <Select
                    value={rowAttributes.borderStyle || 'solid'}
                    onChange={(e) =>
                      handleRowBorderChange('borderStyle', e.target.value as 'solid' | 'dashed' | 'dotted')
                    }
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                  </Select>
                </div>
                <NumberInput
                  min={0}
                  max={30}
                  value={rowAttributes.borderWidth ? safeParseInt(rowAttributes.borderWidth.replace('px', '')) : 0}
                  onChange={(value) => handleRowBorderChange('borderWidth', `${value}px`)}
                />

                <ColorInput
                  value={rowAttributes.borderColor || ''}
                  onChange={(e) => handleRowBorderChange('borderColor', e)}
                />
              </div>
            </Field>

            <Field>
              <Label>Rounded Corners</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={rowAttributes.borderRadius?.replace('px', '') || ''}
                  onChange={(e) => handleRowBorderChange('borderRadius', `${e.target.value}px`)}
                />
                <span className="text-sm text-gray-500">px</span>
              </div>
            </Field>
          </FieldGroup>
        </DisclosureBody>
      </Disclosure>

      <Disclosure defaultOpen title="Background">
        <DisclosureBody>
          <Field>
            <Label>Background Color</Label>
            <ColorInput
              value={rowAttributes.backgroundColor || ''}
              onChange={(e) => handleRowBackgroundColorChange(e)}
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
                  <div
                    className={`text-xs font-medium ${isDragging ? 'select-none' : ''}`}
                  >{`${percentToUnits(column.width || '100')}`}</div>
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
                  <div
                    className="relative z-20 mx-2 flex h-full w-3 cursor-col-resize select-none items-center justify-center"
                    onMouseDown={(e) => handleDragStart(e, index)}
                    style={{ transform: 'translateX(-1px)' }}
                  >
                    <Bars3Icon
                      className={`h-20 w-20 text-gray-400 hover:text-blue-500 ${isDragging && activeColumnIndex === index ? 'text-blue-500' : ''}`}
                    />
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
