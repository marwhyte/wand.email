'use client'

import { Field, Label } from '@/app/components/fieldset'
import { Input } from '@/app/components/input'
import { Select } from '@/app/components/select'
import { useCallback } from 'react'
import { useEmail } from './email-provider'

import { Button } from '@/app/components/button'
import { ColorInput } from '@/app/components/color-input'
import { Divider } from '@/app/components/divider'
import FileUploader from '@/app/components/file-uploader'
import { Switch, SwitchField } from '@/app/components/switch'
import { Text } from '@/app/components/text'
import Textbox from '@/app/components/textbox'
import PaddingForm, { PaddingValues } from '@/app/forms/padding-form'
import { capitalizeFirstLetter, isValidHttpUrl } from '@/lib/utils/misc'
import { Square2StackIcon, TrashIcon, XMarkIcon } from '@heroicons/react/20/solid'
import 'react-quill/dist/quill.snow.css'
import { v4 as uuidv4 } from 'uuid' // Add this import for generating new IDs
import Range from '../range'
import RowEditor from './row-editor'
import SocialsEditor from './socials-editor'

enum Options {
  BORDER_RADIUS = 'border-radius',
  BORDER_STYLE = 'border-style',
  BORDER_WIDTH = 'border-width',
  BORDER_COLOR = 'border-color',
  TEXT = 'text',
  FONT_SIZE = 'font-size',
  FONT_WEIGHT = 'font-weight',
  TEXT_ALIGN = 'text-align',
  TEXT_COLOR = 'text-color',
  BACKGROUND_COLOR = 'background-color',
  WIDTH = 'width',
  HREF = 'href',
  GRID_COLUMNS = 'grid-columns',
  PADDING = 'padding',
  SRC = 'src',
}

const BlockEditor = () => {
  const { currentBlock, setCurrentBlock, email, setEmail } = useEmail()

  const optionsForItem = () => {
    switch (currentBlock?.type) {
      case 'divider':
        return [Options.BORDER_STYLE, Options.BORDER_WIDTH, Options.BORDER_COLOR, Options.PADDING]
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
        return [Options.WIDTH, Options.BORDER_RADIUS, Options.PADDING, Options.SRC]
      case 'button':
        return [
          Options.TEXT,
          Options.HREF,
          Options.TEXT_COLOR,
          Options.BACKGROUND_COLOR,
          Options.PADDING,
          Options.BORDER_STYLE,
          Options.BORDER_WIDTH,
          Options.BORDER_COLOR,
        ]
      case 'heading':
        return [
          Options.TEXT,
          Options.FONT_SIZE,
          Options.FONT_WEIGHT,
          Options.TEXT_COLOR,
          Options.TEXT_ALIGN,
          Options.PADDING,
        ]
      case 'link':
        return [
          Options.TEXT_COLOR,
          Options.HREF,
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
    (updatedTemplate: Email) => {
      setEmail(updatedTemplate)
    },
    // debounce((updatedTemplate: Email) => {
    //   onSave(updatedTemplate)
    // }, 300)
    [setEmail]
  )

  const handleChange = useCallback(
    (
      attributes: Partial<
        CommonAttributes | TextBlock | ImageBlockAttributes | ButtonBlockAttributes | SocialsBlockAttributes
      >
    ) => {
      if (currentBlock) {
        const updatedBlock = {
          ...currentBlock,
          attributes: { ...currentBlock.attributes, ...attributes },
        } as EmailBlock
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

  const deleteBlock = useCallback(() => {
    if (currentBlock) {
      let updatedEmail: Email
      if (currentBlock.type === 'row') {
        updatedEmail = {
          ...email,
          rows: email.rows.filter((row) => row.id !== currentBlock.id),
        }
      } else {
        updatedEmail = {
          ...email,
          rows: email.rows.map((row) => ({
            ...row,
            columns: row.columns.map((column) => ({
              ...column,
              blocks: column.blocks.filter((block) => block.id !== currentBlock.id),
            })),
          })),
        }
      }

      setCurrentBlock(null)
      debouncedSave(updatedEmail)
    }
  }, [currentBlock, email, setCurrentBlock, debouncedSave])

  const duplicateBlock = useCallback(() => {
    if (currentBlock) {
      const newBlock = {
        ...currentBlock,
        id: uuidv4(), // Generate a new ID for the duplicated block
      }

      let updatedEmail: Email
      if (newBlock.type === 'row') {
        const rowIndex = email.rows.findIndex((row) => row.id === currentBlock.id)
        updatedEmail = {
          ...email,
          rows: [...email.rows.slice(0, rowIndex + 1), newBlock as RowBlock, ...email.rows.slice(rowIndex + 1)],
        }
      } else {
        updatedEmail = {
          ...email,
          rows: email.rows.map((row) => ({
            ...row,
            columns: row.columns.map((column) => {
              const blockIndex = column.blocks.findIndex((block) => block.id === currentBlock.id)
              if (blockIndex !== -1) {
                return {
                  ...column,
                  blocks: [...column.blocks.slice(0, blockIndex + 1), newBlock, ...column.blocks.slice(blockIndex + 1)],
                }
              }
              return column
            }),
          })),
        }
      }

      setCurrentBlock(newBlock)
      debouncedSave(updatedEmail)
    }
  }, [currentBlock, email, setCurrentBlock, debouncedSave])

  if (!currentBlock) return null

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-4">
        <Text>{capitalizeFirstLetter(currentBlock.type)} Properties</Text>
        <div className="flex gap-2">
          <Button onClick={deleteBlock} outline tooltip={currentBlock.type === 'row' ? 'Delete Row' : 'Delete Block'}>
            <TrashIcon className="!h-4 !w-4" />
          </Button>
          <Button
            onClick={duplicateBlock}
            outline
            tooltip={currentBlock.type === 'row' ? 'Duplicate Row' : 'Duplicate Block'}
          >
            <Square2StackIcon className="!h-4 !w-4" />
          </Button>
          <Button
            tooltipTransform="-translate-x-3/4"
            onClick={() => setCurrentBlock(null)}
            outline
            tooltip="Close Editor"
          >
            <XMarkIcon className="!h-4 !w-4" />
          </Button>
        </div>
      </div>
      <Divider className="mb-2" />
      {options.includes(Options.SRC) && currentBlock && 'src' in currentBlock.attributes && (
        <Field>
          <Label>Image</Label>
          <FileUploader onUpload={(src) => handleChange({ src })} />
        </Field>
      )}
      {options.includes(Options.TEXT) && currentBlock && 'content' in currentBlock && (
        <Field>
          <Label>Content</Label>
          <Textbox
            key={currentBlock.id}
            value={
              currentBlock.content
              // currentBlock.type === 'heading'
              //   ? `<${currentBlock.attributes.as}>${currentBlock.content}</${currentBlock.attributes.as}>`
              //   : `<p>${currentBlock.content}</p>`
            }
            onChange={(e) => {
              // const content =
              //   currentBlock.type === 'heading'
              //     ? e.replace(new RegExp(`^<${currentBlock.attributes.as}>|</${currentBlock.attributes.as}>$`, 'g'), '')
              //     : e.replace(/^<p>|<\/p>$/g, '')
              handleChange({ content: e })
            }}
          />
        </Field>
      )}
      {options.includes(Options.HREF) && currentBlock && 'href' in currentBlock.attributes && (
        <Field>
          <Label>Link</Label>
          <Input
            key={`href-${currentBlock?.id}`}
            type="url"
            invalid={!isValidHttpUrl(currentBlock?.attributes.href || '')}
            value={currentBlock?.attributes.href || ''}
            onChange={(e) => {
              handleChange({ href: e.target.value })
            }}
            error={
              !isValidHttpUrl(currentBlock?.attributes.href || '')
                ? 'Please enter a valid URL (e.g., https://example.com)'
                : undefined
            }
            placeholder="https://example.com"
            pattern="https?://.*"
            title="Please enter a valid URL (e.g., https://example.com)"
          />
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
          <div className="mt-2 flex gap-2">
            <Button onClick={() => handleChange({ textAlign: 'left' })}>Left</Button>
            <Button onClick={() => handleChange({ textAlign: 'center' })}>Center</Button>
            <Button onClick={() => handleChange({ textAlign: 'right' })}>Right</Button>
          </div>
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
          <div className="flex items-center justify-between">
            <Label>Width</Label>
            <SwitchField>
              <Switch
                checked={!currentBlock?.attributes.width?.includes('px')}
                onChange={(checked) => {
                  const currentValue = parseInt(currentBlock?.attributes.width?.replace(/[%px]/g, '') || '100')
                  handleChange({ width: `${currentValue}${checked ? '%' : 'px'}` })
                }}
              />
              <Label>{currentBlock?.attributes.width?.includes('px') ? 'px' : '%'}</Label>
            </SwitchField>
          </div>
          <Range
            key={`width-${currentBlock?.id}`}
            min={3}
            max={currentBlock?.attributes.width?.includes('px') ? 400 : 100}
            isPercent={!currentBlock?.attributes.width?.includes('px')}
            value={parseInt(currentBlock?.attributes.width?.replace(/[%px]/g, '') || '100')}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0
              const unit = currentBlock?.attributes.width?.includes('px') ? 'px' : '%'
              const maxValue = unit === 'px' ? 1000 : 100
              handleChange({ width: `${Math.min(maxValue, Math.max(0, value))}${unit}` })
            }}
          />
        </Field>
      )}

      {options.includes(Options.BORDER_RADIUS) && (
        <Field>
          <Label>Border Radius</Label>
          <Input
            value={currentBlock?.attributes.borderRadius || ''}
            onChange={(e) => handleChange({ borderRadius: e.target.value })}
          />
        </Field>
      )}
      {options.includes(Options.BORDER_STYLE) && currentBlock && 'borderStyle' in currentBlock.attributes && (
        <Field>
          <Label>Border Style</Label>
          <Select
            key={`borderStyle-${currentBlock?.id}`}
            value={currentBlock?.attributes.borderStyle || ''}
            onChange={(e) => handleChange({ borderStyle: e.target.value as DividerBlockAttributes['borderStyle'] })}
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </Select>
        </Field>
      )}
      {options.includes(Options.BORDER_WIDTH) && currentBlock && 'borderWidth' in currentBlock.attributes && (
        <Field>
          <Label>Border Width</Label>
          <Input
            key={`borderWidth-${currentBlock?.id}`}
            type="number"
            value={currentBlock?.attributes.borderWidth?.replace('px', '') || ''}
            onChange={(e) => handleChange({ borderWidth: e.target.value + 'px' })}
          />
        </Field>
      )}
      {options.includes(Options.BORDER_COLOR) && currentBlock && 'borderColor' in currentBlock.attributes && (
        <Field>
          <Label>Border Color</Label>
          <ColorInput
            key={`borderColor-${currentBlock?.id}`}
            value={currentBlock?.attributes.borderColor || ''}
            onChange={(e) => handleChange({ borderColor: e })}
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
      {currentBlock?.type === 'socials' && (
        <SocialsEditor
          socialLinks={currentBlock.attributes.socialLinks}
          iconFolder={currentBlock.attributes.folder}
          onChange={(updates) => handleChange(updates as Partial<SocialsBlockAttributes>)}
        />
      )}
    </div>
  )
}

export default BlockEditor
