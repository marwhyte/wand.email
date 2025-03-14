'use client'

import { ColorInput } from '@/app/components/color-input'
import { Field, Label } from '@/app/components/fieldset'
import FileUploader from '@/app/components/file-uploader'
import { Input } from '@/app/components/input'
import Textbox from '@/app/components/textbox'
import PaddingForm, { PaddingValues } from '@/app/forms/padding-form'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { getBlockAttributes } from '@/lib/utils/attributes'
import { isValidHttpUrl, safeParseInt } from '@/lib/utils/misc'
import { useMemo } from 'react'
import { Checkbox, CheckboxField, CheckboxGroup } from '../checkbox'
import Range from '../range'
import { Select } from '../select'
import { Switch, SwitchField } from '../switch'
import {
  ButtonBlock,
  ButtonBlockAttributes,
  DividerBlock,
  HeadingBlock,
  ImageBlock,
  ImageBlockAttributes,
  LinkBlock,
  PaddingAttributes,
  RowBlock,
  RowBlockAttributes,
  SocialsBlockAttributes,
  TextAttributes,
  TextBlock,
  TextBlockAttributes,
} from './types'

enum Options {
  BORDER_RADIUS = 'border-radius',
  BORDER = 'border',
  TEXT = 'text',
  FONT_SIZE = 'font-size',
  FONT_WEIGHT = 'font-weight',
  TEXT_ALIGN = 'text-align',
  MARGIN_ALIGNMENT = 'margin-alignment',
  TEXT_COLOR = 'text-color',
  BACKGROUND_COLOR = 'background-color',
  WIDTH = 'width',
  HREF = 'href',
  PADDING = 'padding',
  SRC = 'src',
  NO_PADDING_MOBILE = 'no-padding-mobile',
}

type EmailBlockEditorProps = {
  block: TextBlock | ImageBlock | ButtonBlock | LinkBlock | HeadingBlock | DividerBlock
  onChange: (
    attributes: Partial<
      | PaddingAttributes
      | TextAttributes
      | TextBlockAttributes
      | ImageBlockAttributes
      | ButtonBlockAttributes
      | SocialsBlockAttributes
    >
  ) => void
}

const EmailBlockEditor = ({ block, onChange }: EmailBlockEditorProps) => {
  const { email } = useEmailStore()
  const { company } = useChatStore()
  const parentRow = email?.rows.find((row) =>
    row.columns.some((column) => column.blocks.some((b) => b.id === block.id))
  ) as RowBlock

  const processedAttributes = getBlockAttributes(block, parentRow, false, company, email)

  const blockPadding = useMemo(() => {
    if (block.type === 'divider') {
      return {
        top:
          String(processedAttributes.style?.marginTop) ??
          String(processedAttributes.style?.paddingTop) ??
          String(processedAttributes.style?.padding) ??
          '0px',
        right:
          String(processedAttributes.style?.marginRight) ??
          String(processedAttributes.style?.paddingRight) ??
          String(processedAttributes.style?.padding) ??
          '0px',
        bottom:
          String(processedAttributes.style?.marginBottom) ??
          String(processedAttributes.style?.paddingBottom) ??
          String(processedAttributes.style?.padding) ??
          '0px',
        left:
          String(processedAttributes.style?.marginLeft) ??
          String(processedAttributes.style?.paddingLeft) ??
          String(processedAttributes.style?.padding) ??
          '0px',
      }
    } else {
      return {
        top: String(processedAttributes.style?.paddingTop) ?? String(processedAttributes.style?.padding) ?? '0px',
        right: String(processedAttributes.style?.paddingRight) ?? String(processedAttributes.style?.padding) ?? '0px',
        bottom: String(processedAttributes.style?.paddingBottom) ?? String(processedAttributes.style?.padding) ?? '0px',
        left: String(processedAttributes.style?.paddingLeft) ?? String(processedAttributes.style?.padding) ?? '0px',
      }
    }
  }, [block])

  const optionsForItem = () => {
    switch (block.type) {
      case 'divider':
        return [Options.BORDER, Options.PADDING, Options.NO_PADDING_MOBILE]
      case 'text':
        return [
          Options.FONT_SIZE,
          Options.FONT_WEIGHT,
          Options.TEXT_ALIGN,
          Options.TEXT_COLOR,
          Options.BACKGROUND_COLOR,
          Options.TEXT,
          Options.PADDING,
          Options.NO_PADDING_MOBILE,
        ]
      case 'image':
        return [Options.WIDTH, Options.MARGIN_ALIGNMENT, Options.BORDER_RADIUS, Options.PADDING, Options.SRC]
      case 'button':
        return [
          Options.TEXT,
          Options.HREF,
          Options.TEXT_COLOR,
          Options.BACKGROUND_COLOR,
          Options.PADDING,
          Options.BORDER,
          Options.NO_PADDING_MOBILE,
        ]
      case 'heading':
        return [
          Options.TEXT,
          Options.FONT_SIZE,
          Options.FONT_WEIGHT,
          Options.TEXT_COLOR,
          Options.TEXT_ALIGN,
          Options.PADDING,
          Options.NO_PADDING_MOBILE,
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
          Options.NO_PADDING_MOBILE,
        ]
      default:
        return []
    }
  }

  const options = optionsForItem()

  return (
    <div className="flex flex-col gap-4">
      {options.includes(Options.TEXT) && 'content' in block.attributes && (
        <Field>
          <Label>Text</Label>
          <Textbox
            key={`textbox-${block.id}`}
            value={block.attributes.content || ''}
            onChange={(value: string) => onChange({ content: value })}
          />
        </Field>
      )}

      {options.includes(Options.HREF) && 'href' in processedAttributes && (
        <Field>
          <Label>Link URL</Label>
          <Input
            pattern="https?://.*"
            title="Please enter a valid URL (e.g., https://example.com)"
            invalid={!isValidHttpUrl(processedAttributes.href || '')}
            error={
              !isValidHttpUrl(processedAttributes.href || '')
                ? 'Please enter a valid URL (e.g., https://example.com)'
                : undefined
            }
            type="url"
            value={processedAttributes.href || ''}
            onChange={(e) => onChange({ href: e.target.value })}
            placeholder="https://example.com"
          />
        </Field>
      )}

      {options.includes(Options.SRC) && (
        <Field>
          <Label>Image URL</Label>
          <FileUploader onUpload={(src) => onChange({ src })} />
        </Field>
      )}

      {options.includes(Options.TEXT_ALIGN) && (
        <Field>
          <Label>Text Alignment</Label>
          <CheckboxGroup className="mt-2">
            <CheckboxField>
              <Checkbox
                checked={processedAttributes.style?.textAlign === 'left'}
                onChange={() => onChange({ textAlign: 'left' })}
              />
              <Label>Left</Label>
            </CheckboxField>
            <CheckboxField>
              <Checkbox
                checked={processedAttributes.style?.textAlign === 'center'}
                onChange={() => onChange({ textAlign: 'center' })}
              />
              <Label>Center</Label>
            </CheckboxField>
            <CheckboxField>
              <Checkbox
                checked={processedAttributes.style?.textAlign === 'right'}
                onChange={() => onChange({ textAlign: 'right' })}
              />
              <Label>Right</Label>
            </CheckboxField>
          </CheckboxGroup>
        </Field>
      )}

      {options.includes(Options.MARGIN_ALIGNMENT) && (
        <Field>
          <Label>Alignment</Label>
          <CheckboxGroup className="mt-2">
            <CheckboxField>
              <Checkbox
                checked={
                  (processedAttributes.style?.marginLeft === '0px' &&
                    processedAttributes.style?.marginRight === 'auto') ||
                  (!processedAttributes.style?.marginLeft && !processedAttributes.style?.marginRight)
                }
                onChange={() => onChange({ marginLeft: '0px', marginRight: 'auto' })}
              />
              <Label>Left</Label>
            </CheckboxField>
            <CheckboxField>
              <Checkbox
                checked={
                  processedAttributes.style?.marginLeft === 'auto' && processedAttributes.style?.marginRight === 'auto'
                }
                onChange={() => onChange({ marginLeft: 'auto', marginRight: 'auto' })}
              />
              <Label>Center</Label>
            </CheckboxField>
            <CheckboxField>
              <Checkbox
                checked={
                  processedAttributes.style?.marginLeft === 'auto' && processedAttributes.style?.marginRight === '0px'
                }
                onChange={() => onChange({ marginLeft: 'auto', marginRight: '0px' })}
              />
              <Label>Right</Label>
            </CheckboxField>
          </CheckboxGroup>
        </Field>
      )}

      {options.includes(Options.FONT_SIZE) && (
        <Field>
          <Label>Font Size</Label>
          <Range
            min={4}
            max={144}
            value={safeParseInt(String(processedAttributes.style?.fontSize).replace('px', '')) || 16}
            onChange={(e) => onChange({ fontSize: e.target.value + 'px' })}
          />
        </Field>
      )}

      {options.includes(Options.FONT_WEIGHT) && (
        <Field>
          <Label>Font Weight</Label>
          <CheckboxGroup className="mt-2">
            <CheckboxField>
              <Checkbox
                checked={processedAttributes.style?.fontWeight === 'normal' || !processedAttributes.style?.fontWeight}
                onChange={() => onChange({ fontWeight: 'normal' })}
              />
              <Label>Normal</Label>
            </CheckboxField>
            <CheckboxField>
              <Checkbox
                checked={processedAttributes.style?.fontWeight === 'bold'}
                onChange={() => onChange({ fontWeight: 'bold' })}
              />
              <Label>Bold</Label>
            </CheckboxField>
          </CheckboxGroup>
        </Field>
      )}

      {options.includes(Options.WIDTH) && (
        <Field>
          <div className="flex items-center justify-between">
            <Label>Width</Label>
            <SwitchField>
              <Switch
                checked={String(processedAttributes.style?.width).includes('%')}
                onChange={(checked) => {
                  const currentValue = parseInt(String(processedAttributes.style?.width).replace(/[%px]/g, '') || '100')
                  onChange({ width: `${currentValue}${checked ? '%' : 'px'}` })
                }}
              />
              <Label>{String(processedAttributes.style?.width).includes('%') ? '%' : 'px'}</Label>
            </SwitchField>
          </div>
          <Range
            key={`width-${block.id}`}
            min={3}
            max={String(processedAttributes.style?.width).includes('%') ? 100 : 400}
            isPercent={String(processedAttributes.style?.width).includes('%')}
            value={parseInt(String(processedAttributes.style?.width).replace(/[%px]/g, '') || '100')}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0
              const unit = String(processedAttributes.style?.width).includes('%') ? '%' : 'px'
              const maxValue = unit === '%' ? 100 : 1000
              onChange({ width: `${Math.min(maxValue, Math.max(0, value))}${unit}` })
            }}
          />
        </Field>
      )}

      {options.includes(Options.BORDER_RADIUS) && (
        <Field>
          <Label>Border Radius</Label>
          <Range
            min={0}
            max={200}
            value={safeParseInt(String(processedAttributes.style?.borderRadius).replace('px', '')) || 0}
            onChange={(e) => onChange({ borderRadius: e.target.value + 'px' })}
          />
        </Field>
      )}

      {options.includes(Options.BORDER) &&
        'borderStyle' in block.attributes &&
        'borderWidth' in block.attributes &&
        'borderColor' in block.attributes && (
          <Field>
            <Label>Row Border</Label>
            <div className="flex gap-2">
              <Select
                value={block.attributes?.borderStyle || 'solid'}
                onChange={(e) => onChange({ borderStyle: e.target.value as 'solid' | 'dashed' | 'dotted' })}
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </Select>
              <Input
                type="number"
                value={String(block.attributes?.borderWidth)?.replace('px', '') || ''}
                onChange={(e) => onChange({ borderWidth: `${e.target.value}px` })}
                placeholder="Width"
              />
              <ColorInput value={block.attributes?.borderColor || ''} onChange={(e) => onChange({ borderColor: e })} />
            </div>
          </Field>
        )}

      {options.includes(Options.TEXT_COLOR) && (
        <Field>
          <Label>Text Color</Label>
          <ColorInput
            value={processedAttributes.style?.color || '#000000'}
            onChange={(value) => onChange({ color: value })}
          />
        </Field>
      )}

      {options.includes(Options.BACKGROUND_COLOR) && (
        <Field>
          <Label>Background Color</Label>
          <ColorInput
            value={processedAttributes.style?.backgroundColor || '#ffffff'}
            onChange={(value) => onChange({ backgroundColor: value })}
          />
        </Field>
      )}

      {options.includes(Options.PADDING) && (
        <Field>
          <Label>Padding</Label>
          <PaddingForm
            padding={blockPadding}
            onChange={(values: Partial<PaddingValues>) => {
              const rowAttributes: Partial<RowBlockAttributes> = {
                paddingTop: values.top,
                paddingRight: values.right,
                paddingBottom: values.bottom,
                paddingLeft: values.left,
              }

              onChange(rowAttributes)
            }}
          />
        </Field>
      )}
    </div>
  )
}

export default EmailBlockEditor
