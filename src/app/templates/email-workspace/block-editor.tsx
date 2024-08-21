'use client'

import { Field, Label } from '@/app/components/fieldset'
import { Input } from '@/app/components/input'
import { Select } from '@/app/components/select'
import debounce from 'lodash.debounce'
import { useCallback } from 'react'
import { useBlock } from './block-provider'

import { Button } from '@/app/components/button'
import { ColorInput } from '@/app/components/color-input'
import { Divider } from '@/app/components/divider'
import { Text } from '@/app/components/text'
import Textbox from '@/app/components/textbox'
import PaddingForm, { PaddingValues } from '@/app/forms/padding-form'
import { capitalizeFirstLetter } from '@/lib/utils/misc'
import { Square2StackIcon, TrashIcon, XMarkIcon } from '@heroicons/react/20/solid'
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
  PADDING = 'padding',
}

const BlockEditor = ({ email, onSave }: Props) => {
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
          Options.PADDING,
        ]
      case 'image':
        return [Options.WIDTH, Options.HEIGHT, Options.PADDING]
      case 'button':
        return [Options.TEXT, Options.TEXT_COLOR, Options.BACKGROUND_COLOR, Options.PADDING]
      case 'heading':
        return [Options.FONT_SIZE, Options.FONT_WEIGHT, Options.TEXT_COLOR, Options.TEXT, Options.PADDING]
      case 'link':
        return [
          Options.TEXT_COLOR,
          Options.BACKGROUND_COLOR,
          Options.FONT_SIZE,
          Options.FONT_WEIGHT,
          Options.TEXT_ALIGN,
          Options.TEXT,
          Options.PADDING,
        ]
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
    (attributes: Partial<CommonAttributes | TextBlock>) => {
      if (currentBlock) {
        const updatedBlock = {
          ...currentBlock,
          attributes: { ...currentBlock.attributes, ...attributes },
        } as EmailBlock
        console.log(attributes)
        if ('content' in updatedBlock && 'content' in attributes) {
          updatedBlock.content = attributes.content as string
        }

        if ('gridColumns' in updatedBlock && 'gridColumns' in attributes) {
          updatedBlock.gridColumns = attributes.gridColumns as string
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
    (columnId: string, attributes: Partial<ColumnBlockAttributes>) => {
      if (currentBlock && currentBlock.type === 'row') {
        const updatedBlock = {
          ...currentBlock,
          columns: currentBlock.columns.map((column) =>
            column.id === columnId ? { ...column, attributes: { ...column.attributes, ...attributes } } : column
          ),
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

  const handleRowAttributeChange = useCallback(
    (attributes: Partial<RowBlockAttributes>) => {
      if (currentBlock && currentBlock.type === 'row') {
        const updatedBlock = {
          ...currentBlock,
          attributes: { ...currentBlock.attributes, ...attributes },
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

  if (!currentBlock) return null

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-4">
        <Text>{capitalizeFirstLetter(currentBlock.type)} Properties</Text>
        <div className="mr-4 flex gap-2">
          <Button outline tooltip="Delete Block">
            <TrashIcon className="!h-6 !w-6" />
          </Button>
          <Button outline tooltip="Duplicate Block">
            <Square2StackIcon className="!h-6 !w-6" />
          </Button>
          <Button onClick={() => setCurrentBlock(null)} outline tooltip="Close Editor">
            <XMarkIcon className="!h-6 !w-6" />
          </Button>
        </div>
      </div>
      <Divider className="mb-2" />
      {options.includes(Options.TEXT) && currentBlock && 'content' in currentBlock && (
        <Field>
          <Label>Content</Label>
          <Textbox key={currentBlock.id} value={currentBlock.content} onChange={(e) => handleChange({ content: e })} />
        </Field>
      )}
      {options.includes(Options.FONT_SIZE) && (
        <Field>
          <Label>Font Size</Label>
          <Input
            key={`fontSize-${currentBlock?.id}`}
            type="number"
            value={currentBlock?.attributes.fontSize?.replace('px', '') || ''}
            onChange={(e) => handleChange({ fontSize: e.target.value + 'px' })}
          />
        </Field>
      )}
      {options.includes(Options.FONT_WEIGHT) && (
        <Field>
          <Label>Font Weight</Label>
          <Select
            key={`fontWeight-${currentBlock?.id}`}
            value={currentBlock?.attributes.fontWeight || ''}
            onChange={(e) => handleChange({ fontWeight: e.target.value as CommonAttributes['fontWeight'] })}
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
            onChange={(e) => handleChange({ textAlign: e.target.value as CommonAttributes['textAlign'] })}
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
          <ColorInput
            key={`color-${currentBlock?.id}`}
            value={currentBlock?.attributes.color || ''}
            onChange={(e) => handleChange({ color: e })}
          />
        </Field>
      )}
      {options.includes(Options.BACKGROUND_COLOR) && (
        <Field>
          <Label>Background Color</Label>
          <ColorInput
            key={`backgroundColor-${currentBlock?.id}`}
            value={currentBlock?.attributes.backgroundColor || ''}
            onChange={(e) => handleChange({ backgroundColor: e })}
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
            onChange={(e) => handleChange({ width: e.target.value + 'px' })}
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
            onChange={(e) => handleChange({ height: e.target.value + 'px' })}
          />
        </Field>
      )}
      {options.includes(Options.PADDING) && (
        <PaddingForm
          padding={{
            top: currentBlock?.attributes.paddingTop ?? currentBlock?.attributes.padding ?? '0px',
            right: currentBlock?.attributes.paddingRight ?? currentBlock?.attributes.padding ?? '0px',
            bottom: currentBlock?.attributes.paddingBottom ?? currentBlock?.attributes.padding ?? '0px',
            left: currentBlock?.attributes.paddingLeft ?? currentBlock?.attributes.padding ?? '0px',
          }}
          onChange={(values: Partial<PaddingValues>) => {
            const rowAttributes: Partial<RowBlockAttributes> = {
              paddingTop: values.top,
              paddingRight: values.right,
              paddingBottom: values.bottom,
              paddingLeft: values.left,
            }
            handleChange(rowAttributes)
          }}
        />
      )}
      {currentBlock?.type === 'row' && (
        <RowEditor
          row={currentBlock}
          onColumnWidthChange={handleColumnWidthChange}
          onColumnAttributeChange={handleColumnAttributeChange}
          onRowAttributeChange={handleRowAttributeChange}
        />
      )}
    </div>
  )
}

export default BlockEditor
