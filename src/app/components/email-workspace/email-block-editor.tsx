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
import { Checkbox, CheckboxField, CheckboxGroup } from '../checkbox'
import Range from '../range'
import { Switch, SwitchField } from '../switch'
import {
  ButtonBlock,
  ButtonBlockAttributes,
  CommonAttributes,
  DividerBlock,
  HeadingBlock,
  ImageBlock,
  ImageBlockAttributes,
  LinkBlock,
  RowBlock,
  RowBlockAttributes,
  SocialsBlockAttributes,
  TextBlock,
} from './types'

enum Options {
  BORDER_RADIUS = 'border-radius',
  BORDER_STYLE = 'border-style',
  BORDER_WIDTH = 'border-width',
  BORDER_COLOR = 'border-color',
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
      CommonAttributes | TextBlock | ImageBlockAttributes | ButtonBlockAttributes | SocialsBlockAttributes
    >
  ) => void
}

const EmailBlockEditor = ({ block, onChange }: EmailBlockEditorProps) => {
  const { email } = useEmailStore()
  const { company } = useChatStore()
  const parentRow = email?.rows.find((row) =>
    row.columns.some((column) => column.blocks.some((b) => b.id === block.id))
  ) as RowBlock

  const processedAttributes = getBlockAttributes(block, parentRow, false, company)

  const optionsForItem = () => {
    switch (block.type) {
      case 'divider':
        return [
          Options.BORDER_STYLE,
          Options.BORDER_WIDTH,
          Options.BORDER_COLOR,
          Options.PADDING,
          Options.NO_PADDING_MOBILE,
        ]
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
          Options.BORDER_STYLE,
          Options.BORDER_WIDTH,
          Options.BORDER_COLOR,
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
      {options.includes(Options.TEXT) && 'content' in block && (
        <Field>
          <Label>Text</Label>
          <Textbox
            key={`textbox-${block.id}`}
            value={block.content || ''}
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
                checked={String(processedAttributes.style?.width).includes('px')}
                onChange={(checked) => {
                  const currentValue = parseInt(String(processedAttributes.style?.width).replace(/[%px]/g, '') || '100')
                  onChange({ width: `${currentValue}${checked ? '%' : 'px'}` })
                }}
              />
              <Label>{String(processedAttributes.style?.width).includes('px') ? 'px' : '%'}</Label>
            </SwitchField>
          </div>
          <Range
            key={`width-${block.id}`}
            min={3}
            max={String(processedAttributes.style?.width).includes('px') ? 400 : 100}
            isPercent={!String(processedAttributes.style?.width).includes('px')}
            value={parseInt(String(processedAttributes.style?.width).replace(/[%px]/g, '') || '100')}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0
              const unit = String(processedAttributes.style?.width).includes('px') ? 'px' : '%'
              const maxValue = unit === 'px' ? 1000 : 100
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

      {options.includes(Options.BORDER_WIDTH) && (
        <Field>
          <Label>Border Width</Label>
          <Range
            min={0}
            max={10}
            value={safeParseInt(String(processedAttributes.style?.borderWidth).replace('px', '')) || 1}
            onChange={(e) => onChange({ borderWidth: e.target.value + 'px' })}
          />
        </Field>
      )}

      {options.includes(Options.BORDER_STYLE) && (
        <Field>
          <Label>Border Style</Label>
          <CheckboxGroup className="mt-2">
            <CheckboxField>
              <Checkbox
                checked={processedAttributes.style?.borderStyle === 'solid' || !processedAttributes.style?.borderStyle}
                onChange={() => onChange({ borderStyle: 'solid' })}
              />
              <Label>Solid</Label>
            </CheckboxField>
            <CheckboxField>
              <Checkbox
                checked={processedAttributes.style?.borderStyle === 'dashed'}
                onChange={() => onChange({ borderStyle: 'dashed' })}
              />
              <Label>Dashed</Label>
            </CheckboxField>
            <CheckboxField>
              <Checkbox
                checked={processedAttributes.style?.borderStyle === 'dotted'}
                onChange={() => onChange({ borderStyle: 'dotted' })}
              />
              <Label>Dotted</Label>
            </CheckboxField>
          </CheckboxGroup>
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

      {options.includes(Options.BORDER_COLOR) && (
        <Field>
          <Label>Border Color</Label>
          <ColorInput
            value={processedAttributes.style?.borderColor || '#000000'}
            onChange={(value) => onChange({ borderColor: value })}
          />
        </Field>
      )}

      {options.includes(Options.PADDING) && (
        <Field>
          <Label>Padding</Label>
          <PaddingForm
            padding={{
              top: String(processedAttributes.style?.paddingTop ?? processedAttributes.style?.padding ?? '0px'),
              right: String(processedAttributes.style?.paddingRight ?? processedAttributes.style?.padding ?? '0px'),
              bottom: String(processedAttributes.style?.paddingBottom ?? processedAttributes.style?.padding ?? '0px'),
              left: String(processedAttributes.style?.paddingLeft ?? processedAttributes.style?.padding ?? '0px'),
            }}
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
