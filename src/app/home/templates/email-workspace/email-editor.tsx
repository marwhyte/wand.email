'use client'

import { Field, Label } from '@/app/components/fieldset'
import { Input } from '@/app/components/input'
import { Select } from '@/app/components/select'
import debounce from 'lodash.debounce'
import { useCallback } from 'react'
import { useBlock } from './block-provider'

import 'react-quill/dist/quill.snow.css'
import RowEditor from './row-editor'

type Props = {
  email: Email
  onSave: (template: Email) => void
}

enum Options {
  TEXT = 'text',
  FONT_SIZE = 'font-size',
  FONT_WEIGHT = 'font-weight',
  TEXT_ALIGN = 'text-align',
  TEXT_COLOR = 'text-color',
  BACKGROUND_COLOR = 'background-color',
  WIDTH = 'width',
  HEIGHT = 'height',
  GRID_COLUMNS = 'grid-columns',
}

export default function EmailEditor({ email, onSave }: Props) {
  const { currentBlock, setCurrentBlock } = useBlock()

  const optionsForItem = () => {
    switch (currentBlock?.type) {
      case 'text':
        return [
          Options.FONT_SIZE,
          Options.FONT_WEIGHT,
          Options.TEXT_ALIGN,
          Options.TEXT_COLOR,
          Options.BACKGROUND_COLOR,
          Options.TEXT,
        ]
      case 'image':
        return [Options.WIDTH, Options.HEIGHT]
      case 'button':
        return [Options.WIDTH, Options.HEIGHT, Options.TEXT, Options.TEXT_COLOR, Options.BACKGROUND_COLOR]
      case 'heading':
        return [Options.FONT_SIZE, Options.FONT_WEIGHT, Options.TEXT_COLOR, Options.TEXT]
      case 'link':
        return [
          Options.TEXT_COLOR,
          Options.BACKGROUND_COLOR,
          Options.FONT_SIZE,
          Options.FONT_WEIGHT,
          Options.TEXT_ALIGN,
          Options.TEXT,
        ]
      case 'row':
        return [Options.GRID_COLUMNS]
      default:
        return []
    }
  }

  const options = optionsForItem()

  const debouncedSave = useCallback(
    debounce((updatedTemplate: Email) => {
      onSave(updatedTemplate)
    }, 300),
    [onSave]
  )

  const handleChange = useCallback(
    (option: string, value: string) => {
      if (currentBlock) {
        const updatedBlock = {
          ...currentBlock,
          attributes: { ...currentBlock.attributes, [option]: value },
        } as EmailBlock

        if (option === 'value' && 'content' in updatedBlock) {
          updatedBlock.content = value
        }

        if (option === 'gridColumns' && 'gridColumns' in updatedBlock) {
          updatedBlock.gridColumns = value
        }

        // Check if there's an actual change
        if (JSON.stringify(updatedBlock) !== JSON.stringify(currentBlock)) {
          setCurrentBlock(updatedBlock)

          const updatedEmail = {
            ...email,
            rows: email.rows.map((row) => ({
              ...row,
              columns: row.columns.map((column) => ({
                ...column,
                blocks: column.blocks.map((block) => (block.id === updatedBlock.id ? updatedBlock : block)),
              })),
            })),
          }

          debouncedSave(updatedEmail)
        }
      }
    },
    [currentBlock, setCurrentBlock, email, debouncedSave]
  )

  const handleColumnWidthChange = useCallback(
    (newColumns: ColumnBlock[]) => {
      if (currentBlock && currentBlock.type === 'row') {
        const updatedBlock = {
          ...currentBlock,
          columns: newColumns,
        } as RowBlock

        setCurrentBlock(updatedBlock)

        const updatedEmail = {
          ...email,
          rows: email.rows.map((row) => (row.id === updatedBlock.id ? updatedBlock : row)),
        }

        debouncedSave(updatedEmail)
      }
    },
    [currentBlock, setCurrentBlock, email, debouncedSave]
  )

  const handleColumnAttributeChange = useCallback(
    (columnId: string, attribute: string, value: string) => {
      if (currentBlock && currentBlock.type === 'row') {
        const updatedBlock = {
          ...currentBlock,
          columns: currentBlock.columns.map((column) =>
            column.id === columnId ? { ...column, attributes: { ...column.attributes, [attribute]: value } } : column
          ),
        } as RowBlock

        console.log(updatedBlock)

        setCurrentBlock(updatedBlock)

        const updatedEmail = {
          ...email,
          rows: email.rows.map((row) => (row.id === updatedBlock.id ? updatedBlock : row)),
        }

        debouncedSave(updatedEmail)
      }
    },
    [currentBlock, setCurrentBlock, email, debouncedSave]
  )

  return (
    <div className="flex h-full w-full min-w-[180px] max-w-[226px] flex-col justify-between border-l-[0.5px] border-r-[0.5px] border-gray-300 border-zinc-200 bg-gray-50 bg-white lg:min-w-[270px] lg:max-w-[300px] dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 p-4">
        {options.includes(Options.TEXT) && currentBlock && 'content' in currentBlock && (
          <Field>
            <Label>Text</Label>
            <Input
              key={currentBlock.id}
              value={currentBlock.content}
              onChange={(e) => handleChange('value', e.target.value)}
            />
          </Field>
        )}
        {options.includes(Options.FONT_SIZE) && (
          <Field>
            <Label>Font Size</Label>
            <Input
              key={`fontSize-${currentBlock?.id}`}
              type="number"
              value={currentBlock?.attributes.fontSize || ''}
              onChange={(e) => handleChange('fontSize', e.target.value)}
            />
          </Field>
        )}
        {options.includes(Options.FONT_WEIGHT) && (
          <Field>
            <Label>Font Weight</Label>
            <Select
              key={`fontWeight-${currentBlock?.id}`}
              value={currentBlock?.attributes.fontWeight || ''}
              onChange={(e) => handleChange('fontWeight', e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </Select>
          </Field>
        )}
        {options.includes(Options.TEXT_ALIGN) && (
          <Field>
            <Label>Text Align</Label>
            <Select
              key={`textAlign-${currentBlock?.id}`}
              value={currentBlock?.attributes.textAlign || ''}
              onChange={(e) => handleChange('textAlign', e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </Select>
          </Field>
        )}
        {options.includes(Options.TEXT_COLOR) && (
          <Field>
            <Label>Text Color</Label>
            <Input
              key={`color-${currentBlock?.id}`}
              type="color"
              value={currentBlock?.attributes.color || ''}
              onChange={(e) => handleChange('color', e.target.value)}
            />
          </Field>
        )}
        {options.includes(Options.BACKGROUND_COLOR) && (
          <Field>
            <Label>Background Color</Label>
            <Input
              key={`backgroundColor-${currentBlock?.id}`}
              type="color"
              value={currentBlock?.attributes.backgroundColor || ''}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
            />
          </Field>
        )}
        {options.includes(Options.WIDTH) && (
          <Field>
            <Label>Width</Label>
            <Input
              key={`width-${currentBlock?.id}`}
              type="number"
              value={currentBlock?.attributes.width?.replace('px', '') || ''}
              onChange={(e) => handleChange('width', e.target.value + 'px')}
            />
          </Field>
        )}
        {options.includes(Options.HEIGHT) && (
          <Field>
            <Label>Height</Label>
            <Input
              key={`height-${currentBlock?.id}`}
              type="number"
              value={currentBlock?.attributes.height?.replace('px', '') || ''}
              onChange={(e) => handleChange('height', e.target.value + 'px')}
            />
          </Field>
        )}
        {options.includes(Options.GRID_COLUMNS) && currentBlock?.type === 'row' && (
          <Field>
            <Label>Column Widths</Label>
            <RowEditor
              columns={currentBlock.columns}
              onColumnWidthChange={handleColumnWidthChange}
              onColumnAttributeChange={handleColumnAttributeChange}
            />
          </Field>
        )}
      </div>
    </div>
  )
}
