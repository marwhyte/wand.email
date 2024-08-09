'use client'

import { Field, Label } from '@/app/components/fieldset'
import { Input } from '@/app/components/input'
import { Select } from '@/app/components/select'
import { useBlock } from './block-provider'

type Props = {
  template: Email
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
}

export default function EmailEditor({ template, onSave }: Props) {
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
      default:
        return []
    }
  }

  const options = optionsForItem()

  const handleChange = (option: string, value: string) => {
    if (currentBlock) {
      const updatedBlock = {
        ...currentBlock,
        attributes: { ...currentBlock.attributes, [option]: value },
      } as EmailBlock // Type assertion to EmailBlock
      if (option === 'value' && 'content' in updatedBlock) {
        updatedBlock.content = value
      }
      setCurrentBlock(updatedBlock)

      const updateBlockInTemplate = (blocks: EmailBlock[]): EmailBlock[] => {
        return blocks.map((block) => {
          if (block.id === updatedBlock.id) {
            return updatedBlock as EmailBlock
          }
          if ('rows' in block) {
            return {
              ...block,
              rows: block.rows.map((row) => ({ ...row, columns: updateBlockInTemplate(row.columns) })),
            } as EmailBlock
          }
          if ('columns' in block) {
            return { ...block, columns: updateBlockInTemplate(block.columns) } as EmailBlock
          }
          if ('blocks' in block) {
            return { ...block, blocks: updateBlockInTemplate(block.blocks) } as EmailBlock
          }
          return block
        })
      }

      const updatedTemplate = {
        ...template,
        blocks: updateBlockInTemplate(template.blocks),
      }
      onSave(updatedTemplate)
    }
  }

  return (
    <div className="relative h-full w-full rounded-xl bg-white shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.20),_0px_1px_0px_0px_rgba(255,_255,_255,_0.06)_inset] forced-colors:outline">
      <div className="flex flex-col gap-2 p-4">
        {options.includes(Options.TEXT) && currentBlock && 'content' in currentBlock && (
          <Field>
            <Label>Text</Label>
            <Input value={currentBlock.content} onChange={(e) => handleChange('value', e.target.value)} />
          </Field>
        )}
        {options.includes(Options.FONT_SIZE) && (
          <Field>
            <Label>Font Size</Label>
            <Input
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
              type="number"
              value={currentBlock?.attributes.width || ''}
              onChange={(e) => handleChange('width', e.target.value)}
            />
          </Field>
        )}
        {options.includes(Options.HEIGHT) && (
          <Field>
            <Label>Height</Label>
            <Input
              type="number"
              value={currentBlock?.attributes.height || ''}
              onChange={(e) => handleChange('height', e.target.value)}
            />
          </Field>
        )}
      </div>
    </div>
  )
}
