'use client'

import { ColorInput } from '@/app/components/color-input'
import { Disclosure } from '@/app/components/disclosure'
import { Field, FieldGroup, Label } from '@/app/components/fieldset'
import FileUploader from '@/app/components/file-uploader'
import { Input, NumberInput } from '@/app/components/input'
import Textbox from '@/app/components/textbox'
import PaddingForm, { PaddingValues } from '@/app/forms/padding-form'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { getBlockProps } from '@/lib/utils/attributes'
import { getBlockAttributes } from '@/lib/utils/attributes/attributes'
import { capitalizeFirstLetter, isValidHttpUrl, safeParseInt } from '@/lib/utils/misc'
import { useMemo } from 'react'
import { Select } from '../select'
import SocialsEditor from './socials-editor'
import SurveyEditor from './survey-editor'
import TableEditor from './table-editor'
import {
  ButtonBlock,
  ButtonBlockAttributes,
  DividerBlock,
  HeadingBlock,
  HeadingBlockAttributes,
  ImageBlock,
  ImageBlockAttributes,
  LinkBlock,
  PaddingAttributes,
  RowBlockAttributes,
  SocialsBlock,
  SocialsBlockAttributes,
  SurveyBlock,
  SurveyBlockAttributes,
  TableBlock,
  TableBlockAttributes,
  TextAttributes,
  TextBlock,
} from './types'

enum Options {
  ALIGN = 'align',
  BORDER_RADIUS = 'border-radius',
  BORDER = 'border',
  TEXT = 'text',
  TEXT_ALIGN = 'text-align',
  TEXT_PROPERTIES = 'text-properties',
  BACKGROUND_COLOR = 'background-color',
  WIDTH = 'width',
  HREF = 'href',
  PADDING = 'padding',
  SRC = 'src',
  NO_PADDING_MOBILE = 'no-padding-mobile',
  HEADING_LEVEL = 'heading-level',
}

type EmailBlockEditorProps = {
  block:
    | TextBlock
    | SocialsBlock
    | ImageBlock
    | ButtonBlock
    | SurveyBlock
    | LinkBlock
    | HeadingBlock
    | DividerBlock
    | TableBlock
  onChange: (
    attributes: Partial<
      | PaddingAttributes
      | TextAttributes
      | SurveyBlockAttributes
      | ImageBlockAttributes
      | ButtonBlockAttributes
      | SocialsBlockAttributes
      | HeadingBlockAttributes
      | TableBlockAttributes
    >
  ) => void
}

const EmailBlockEditor = ({ block, onChange }: EmailBlockEditorProps) => {
  const { email } = useEmailStore()

  const { company } = useChatStore()
  const parentRow = email?.rows.find((row) =>
    row.columns.some((column) => column.blocks.some((b) => b.id === block.id))
  )

  const processedAttributes = parentRow ? getBlockProps(block, parentRow, company, email) : {}

  const blockPadding = useMemo(() => {
    return {
      top: String(processedAttributes.style?.paddingTop) ?? String(processedAttributes.style?.padding) ?? '0px',
      right: String(processedAttributes.style?.paddingRight) ?? String(processedAttributes.style?.padding) ?? '0px',
      bottom: String(processedAttributes.style?.paddingBottom) ?? String(processedAttributes.style?.padding) ?? '0px',
      left: String(processedAttributes.style?.paddingLeft) ?? String(processedAttributes.style?.padding) ?? '0px',
    }
  }, [block])

  const contentPadding = useMemo(() => {
    return {
      top: String(processedAttributes.style?.marginTop) ?? '0px',
      right: String(processedAttributes.style?.marginRight) ?? '0px',
      bottom: String(processedAttributes.style?.marginBottom) ?? '0px',
      left: String(processedAttributes.style?.marginLeft) ?? '0px',
    }
  }, [block])

  const optionsForItem = () => {
    switch (block.type) {
      case 'divider':
        return [Options.BORDER, Options.PADDING]
      case 'text':
        return [Options.TEXT_PROPERTIES, Options.TEXT, Options.TEXT_ALIGN, Options.PADDING]
      case 'image':
        return [Options.WIDTH, Options.BORDER_RADIUS, Options.PADDING, Options.SRC, Options.ALIGN]
      case 'button':
        return [
          Options.ALIGN,
          Options.TEXT,
          Options.HREF,
          Options.TEXT_PROPERTIES,
          Options.BACKGROUND_COLOR,
          Options.PADDING,
          Options.BORDER,
        ]
      case 'heading':
        return [Options.HEADING_LEVEL, Options.TEXT, Options.TEXT_PROPERTIES, Options.TEXT_ALIGN, Options.PADDING]
      case 'link':
        return [Options.TEXT_PROPERTIES, Options.HREF, Options.TEXT, Options.PADDING, Options.ALIGN]
      case 'socials':
        return [Options.PADDING, Options.ALIGN]
      case 'survey':
        return [Options.PADDING]
      case 'table':
        return [Options.PADDING]
      default:
        return []
    }
  }

  const options = optionsForItem()

  if (!parentRow) {
    return null
  }

  const blockAttributes = getBlockAttributes(block, parentRow, email)

  return (
    <div className="flex flex-col gap-4">
      {options.includes(Options.TEXT) && 'content' in blockAttributes && (
        <Textbox
          autofocus
          preventNewlines={block.type !== 'text'}
          hideToolbar={block.type === 'link' || block.type === 'button'}
          key={`textbox-${block.id}`}
          value={blockAttributes.content || ''}
          onChange={(value: string) => onChange({ content: value })}
        />
      )}

      {block.type !== 'text' && (
        <Disclosure title={`${capitalizeFirstLetter(block.type)} Attributes`} defaultOpen>
          <FieldGroup>
            {block.type === 'survey' && <SurveyEditor block={block} onChange={onChange} />}
            {block.type === 'socials' && email && (
              <SocialsEditor parentRow={parentRow} email={email} block={block} onChange={onChange} />
            )}
            {block.type === 'table' && email && (
              <TableEditor parentRow={parentRow} email={email} block={block} onChange={onChange} />
            )}
            {options.includes(Options.HEADING_LEVEL) && block.type === 'heading' && (
              <Field>
                <Label>Heading Level</Label>
                <div className="ml-auto w-24">
                  <Select
                    value={getBlockAttributes(block, parentRow, email).level || 'h2'}
                    onChange={(e) => onChange({ level: e.target.value as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' })}
                  >
                    <option value="h1">H1</option>
                    <option value="h2">H2</option>
                    <option value="h3">H3</option>
                    <option value="h4">H4</option>
                    <option value="h5">H5</option>
                    <option value="h6">H6</option>
                  </Select>
                </div>
              </Field>
            )}
            {options.includes(Options.HREF) && 'href' in processedAttributes && (
              <Field labelPosition="top">
                <Label>Link URL</Label>
                <Input
                  pattern="https?://.*"
                  title="Please enter a valid link"
                  invalid={!isValidHttpUrl(processedAttributes.href || '')}
                  error={!isValidHttpUrl(processedAttributes.href || '') ? 'Please enter a valid link' : undefined}
                  type="url"
                  value={processedAttributes.href || ''}
                  onChange={(e) => onChange({ href: e.target.value })}
                  placeholder="https://example.com"
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
            {options.includes(Options.SRC) && block.type === 'image' && (
              <>
                <Field>
                  <Label>Image URL</Label>
                  <FileUploader onUpload={(src) => onChange({ src })} />
                </Field>
                <Field labelPosition="top">
                  <Label>Alt Text</Label>
                  <Input
                    value={getBlockAttributes(block, parentRow, email).alt || ''}
                    onChange={(e) => onChange({ alt: e.target.value })}
                    placeholder="Describe the image for accessibility"
                  />
                </Field>
              </>
            )}
            {options.includes(Options.ALIGN) && 'align' in processedAttributes && (
              <Field>
                <Label>Alignment</Label>
                <Select
                  value={processedAttributes.align as 'left' | 'center' | 'right' | undefined}
                  onChange={(e) => onChange({ align: e.target.value as 'left' | 'center' | 'right' })}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </Select>
              </Field>
            )}
            {options.includes(Options.WIDTH) && (
              <Field>
                <Label>Width</Label>
                <NumberInput
                  key={`width-${block.id}`}
                  min={1}
                  max={100}
                  value={parseInt(String(processedAttributes.style?.width).replace(/[%px]/g, '') || '100')}
                  onChange={(value) => {
                    onChange({ width: `${Math.min(100, Math.max(0, value))}%` })
                  }}
                />
              </Field>
            )}

            {options.includes(Options.BORDER) && (block.type === 'button' || block.type === 'divider') && (
              <Field labelPosition="top">
                <Label>Border</Label>
                <div className="flex gap-2">
                  <div className="w-[106px]">
                    <Select
                      value={processedAttributes.style?.borderStyle || 'solid'}
                      onChange={(e) => onChange({ borderStyle: e.target.value as 'solid' | 'dashed' | 'dotted' })}
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                    </Select>
                  </div>
                  <NumberInput
                    min={0}
                    max={30}
                    value={
                      processedAttributes.style?.borderWidth
                        ? safeParseInt(String(processedAttributes.style?.borderWidth).replace('px', ''))
                        : 0
                    }
                    onChange={(value) => onChange({ borderWidth: `${value}px` })}
                  />

                  <ColorInput
                    value={processedAttributes.style?.borderColor || ''}
                    onChange={(e) => onChange({ borderColor: e })}
                  />
                </div>
              </Field>
            )}
            {options.includes(Options.BORDER_RADIUS) && (
              <Field>
                <Label>Border Radius</Label>
                <NumberInput
                  min={0}
                  max={200}
                  value={safeParseInt(String(processedAttributes.style?.borderRadius).replace('px', '')) || 0}
                  onChange={(value) => onChange({ borderRadius: `${value}px` })}
                />
              </Field>
            )}
          </FieldGroup>
        </Disclosure>
      )}
      {options.includes(Options.TEXT_PROPERTIES) && (
        <Disclosure title="Text Properties" defaultOpen>
          <FieldGroup>
            <Field>
              <Label>Font Size</Label>
              <NumberInput
                className="ml-auto"
                min={1}
                max={144}
                value={safeParseInt(String(processedAttributes.style?.fontSize).replace('px', '')) || 16}
                onChange={(value) => onChange({ fontSize: `${value}px` })}
              />
            </Field>

            <Field>
              <Label>Font Weight</Label>
              <div className="ml-auto w-24">
                <Select
                  value={processedAttributes.style?.fontWeight || 'normal'}
                  onChange={(e) => onChange({ fontWeight: e.target.value as 'normal' | 'bold' })}
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                </Select>
              </div>
            </Field>

            <Field>
              <Label>Letter Spacing</Label>
              <NumberInput
                className="ml-auto"
                min={0}
                max={100}
                value={
                  processedAttributes.style?.letterSpacing === 'normal'
                    ? 0
                    : safeParseInt(String(processedAttributes.style?.letterSpacing).replace('px', '')) || 0
                }
                onChange={(value) => onChange({ letterSpacing: value === 0 ? 'normal' : `${value}px` })}
              />
            </Field>

            <Field>
              <Label>Line Height</Label>
              <div className="ml-auto w-24">
                <Select
                  value={
                    processedAttributes.style?.lineHeight === '120%'
                      ? 'small'
                      : processedAttributes.style?.lineHeight === '150%'
                        ? 'medium'
                        : processedAttributes.style?.lineHeight === '180%'
                          ? 'large'
                          : processedAttributes.style?.lineHeight === '200%'
                            ? 'extra-large'
                            : 'medium'
                  }
                  onChange={(e) => {
                    const value = e.target.value
                    let lineHeight = '150%'
                    if (value === 'small') lineHeight = '120%'
                    if (value === 'large') lineHeight = '180%'
                    if (value === 'extra-large') lineHeight = '200%'
                    onChange({ lineHeight })
                  }}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="extra-large">XL</option>
                </Select>
              </div>
            </Field>

            <Field>
              <Label>Text Color</Label>
              <ColorInput
                value={processedAttributes.style?.color || '#000000'}
                onChange={(value) => onChange({ color: value })}
              />
            </Field>

            {options.includes(Options.TEXT_ALIGN) && (
              <Field>
                <Label>Text Alignment</Label>
                <div className="ml-auto w-24">
                  <Select
                    value={processedAttributes.style?.textAlign || 'left'}
                    onChange={(e) => onChange({ textAlign: e.target.value as 'left' | 'center' | 'right' })}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </Select>
                </div>
              </Field>
            )}
          </FieldGroup>
        </Disclosure>
      )}

      {options.includes(Options.PADDING) && (
        <Disclosure title={'Padding'} defaultOpen>
          <FieldGroup>
            <PaddingForm
              label="Padding"
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
            {block.type === 'button' && (
              <PaddingForm
                label="Content Padding"
                padding={contentPadding}
                onChange={(values: Partial<PaddingValues>) => {
                  const rowAttributes: Partial<ButtonBlockAttributes> = {
                    contentPaddingTop: values.top,
                    contentPaddingRight: values.right,
                    contentPaddingBottom: values.bottom,
                    contentPaddingLeft: values.left,
                  }
                  onChange(rowAttributes)
                }}
              />
            )}
          </FieldGroup>
        </Disclosure>
      )}
    </div>
  )
}

export default EmailBlockEditor
