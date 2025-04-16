'use client'

import { ColorInput } from '@/app/components/color-input'
import { Disclosure } from '@/app/components/disclosure'
import { Field, FieldGroup, Label } from '@/app/components/fieldset'
import FileUploader from '@/app/components/file-uploader'
import { Input, NumberInput } from '@/app/components/input'
import PaddingForm, { PaddingValues } from '@/app/forms/padding-form'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { getBlockProps } from '@/lib/utils/attributes'
import { getBlockAttributes } from '@/lib/utils/attributes/attributes'
import { capitalizeFirstLetter, safeParseInt } from '@/lib/utils/misc'
import { useMemo } from 'react'
import { Select } from '../select'
import HrefEditor from './href-editor'
import IconEditor from './icon-editor'
import ListEditor from './list-editor'
import SocialsEditor from './socials-editor'
import SurveyEditor from './survey-editor'
import TableEditor from './table-editor'
import {
  ButtonBlock,
  ButtonBlockAttributes,
  DividerBlock,
  DividerBlockAttributes,
  HeadingBlock,
  HeadingBlockAttributes,
  IconBlock,
  IconBlockAttributes,
  ImageBlock,
  ImageBlockAttributes,
  LinkBlock,
  LinkBlockAttributes,
  ListBlock,
  ListBlockAttributes,
  PaddingAttributes,
  RowBlockAttributes,
  SocialsBlock,
  SocialsBlockAttributes,
  SpacerBlock,
  SpacerBlockAttributes,
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
  LINK_TYPE = 'link-type',
  HEIGHT = 'height',
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
    | ListBlock
    | SpacerBlock
    | IconBlock
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
      | ListBlockAttributes
      | DividerBlockAttributes
      | SpacerBlockAttributes
      | IconBlockAttributes
    >
  ) => void
}

const EmailBlockEditor = ({ block, onChange }: EmailBlockEditorProps) => {
  const { email } = useEmailStore()

  const { company } = useChatStore()
  const parentRow = email?.rows.find((row) =>
    row.columns.some((column) => column.blocks.some((b) => b.id === block.id))
  )

  const processedProps = parentRow ? getBlockProps(block, parentRow, company, email) : {}
  const processedAttributes = parentRow ? getBlockAttributes(block, parentRow, email) : {}

  const blockPadding = useMemo(() => {
    return {
      top: String(processedProps.style?.paddingTop) ?? String(processedProps.style?.padding) ?? '0px',
      right: String(processedProps.style?.paddingRight) ?? String(processedProps.style?.padding) ?? '0px',
      bottom: String(processedProps.style?.paddingBottom) ?? String(processedProps.style?.padding) ?? '0px',
      left: String(processedProps.style?.paddingLeft) ?? String(processedProps.style?.padding) ?? '0px',
    }
  }, [block])

  const contentPadding = useMemo(() => {
    return {
      top: String(processedProps.style?.marginTop) ?? '0px',
      right: String(processedProps.style?.marginRight) ?? '0px',
      bottom: String(processedProps.style?.marginBottom) ?? '0px',
      left: String(processedProps.style?.marginLeft) ?? '0px',
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
          Options.BORDER_RADIUS,
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
      case 'list':
        return [Options.TEXT_PROPERTIES, Options.PADDING]
      case 'spacer':
        return [Options.HEIGHT]
      case 'icon':
        return [Options.PADDING, Options.ALIGN]
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
      {block.type !== 'text' && (
        <Disclosure title={`${capitalizeFirstLetter(block.type)} Attributes`} defaultOpen>
          <FieldGroup>
            {block.type === 'spacer' && 'height' in blockAttributes && (
              <Field>
                <Label>Height</Label>
                <NumberInput
                  value={safeParseInt(String(blockAttributes.height).replace('px', '')) || 0}
                  onChange={(value) => onChange({ height: `${value}` })}
                />
              </Field>
            )}
            {block.type === 'survey' && <SurveyEditor block={block} onChange={onChange} />}
            {block.type === 'socials' && email && (
              <SocialsEditor parentRow={parentRow} email={email} block={block} onChange={onChange} />
            )}
            {block.type === 'table' && email && (
              <TableEditor parentRow={parentRow} email={email} block={block} onChange={onChange} />
            )}
            {block.type === 'list' && email && (
              <ListEditor parentRow={parentRow} block={block} onChange={onChange} email={email} />
            )}
            {block.type === 'icon' && email && (
              <IconEditor parentRow={parentRow} block={block} onChange={onChange} email={email} />
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

            {options.includes(Options.HREF) && (block.type === 'button' || block.type === 'link') && (
              <Field labelPosition="top">
                <Label>Link</Label>
                <HrefEditor
                  href={(blockAttributes as any).href || ''}
                  onChange={(href: string) => {
                    if (block.type === 'button') {
                      onChange({ href } as Partial<ButtonBlockAttributes>)
                    } else if (block.type === 'link') {
                      onChange({ href } as Partial<LinkBlockAttributes>)
                    }
                  }}
                />
              </Field>
            )}

            {options.includes(Options.TEXT) && block.type !== 'list' && (
              <Field labelPosition="top">
                <Label>Text</Label>
                <Input
                  value={(blockAttributes as any).text || ''}
                  onChange={(e) => {
                    if (block.type === 'button') {
                      onChange({ text: e.target.value } as Partial<ButtonBlockAttributes>)
                    } else if (block.type === 'link') {
                      onChange({ text: e.target.value } as Partial<LinkBlockAttributes>)
                    } else if (block.type === 'heading') {
                      onChange({ text: e.target.value } as Partial<HeadingBlockAttributes>)
                    } else {
                      onChange({ text: e.target.value } as any)
                    }
                  }}
                  placeholder="Enter text"
                />
              </Field>
            )}

            {options.includes(Options.BACKGROUND_COLOR) && (
              <Field>
                <Label>Background Color</Label>
                <ColorInput
                  value={processedProps.style?.backgroundColor || '#ffffff'}
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
                  value={parseInt(String(processedProps.style?.width).replace(/[%px]/g, '') || '100')}
                  onChange={(value) => {
                    onChange({ width: `${Math.min(100, Math.max(0, value))}%` })
                  }}
                />
              </Field>
            )}

            {options.includes(Options.BORDER) && (block.type === 'button' || block.type === 'divider') && (
              <Field labelPosition="top">
                <Label>Border</Label>
                <div className="flex items-center gap-2">
                  <div className="w-[106px]">
                    <Select
                      value={processedProps.style?.borderStyle || 'solid'}
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
                      processedProps.style?.borderWidth
                        ? safeParseInt(String(processedProps.style?.borderWidth).replace('px', ''))
                        : 0
                    }
                    onChange={(value) => onChange({ borderWidth: `${value}px` })}
                  />

                  <ColorInput
                    showTransparent={false}
                    value={processedProps.style?.borderColor || ''}
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
                  value={safeParseInt(String(processedProps.style?.borderRadius).replace('px', '')) || 0}
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
              <div className="ml-auto w-24">
                <NumberInput
                  min={1}
                  max={144}
                  value={
                    processedProps.style?.fontSize
                      ? parseInt(String(processedProps.style.fontSize).replace('px', ''))
                      : 16
                  }
                  onChange={(value) => onChange({ fontSize: `${value}px` })}
                />
              </div>
            </Field>

            <Field>
              <Label>Font Weight</Label>
              <div className="ml-auto w-24">
                <Select
                  value={String(processedProps.style?.fontWeight) || 'normal'}
                  onChange={(e) => onChange({ fontWeight: e.target.value as 'normal' | 'bold' })}
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                </Select>
              </div>
            </Field>

            <Field>
              <Label>Text Color</Label>
              <ColorInput
                value={processedProps.style?.color || '#000000'}
                onChange={(value) => onChange({ color: value })}
              />
            </Field>

            <Field>
              <Label>Letter Spacing</Label>
              <NumberInput
                className="ml-auto"
                min={0}
                max={100}
                value={
                  processedProps.style?.letterSpacing === 'normal'
                    ? 0
                    : safeParseInt(String(processedProps.style?.letterSpacing).replace('px', '')) || 0
                }
                onChange={(value) => onChange({ letterSpacing: value === 0 ? 'normal' : `${value}px` })}
              />
            </Field>

            {block.type === 'text' || block.type === 'heading' ? (
              <Field>
                <Label>Text Alignment</Label>
                <div className="ml-auto w-24">
                  <Select
                    value={(processedProps.style?.textAlign as 'left' | 'center' | 'right') || 'left'}
                    onChange={(e) => onChange({ textAlign: e.target.value as 'left' | 'center' | 'right' })}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </Select>
                </div>
              </Field>
            ) : null}

            {block.type !== 'link' && block.type !== 'button' && block.type !== 'list' ? (
              <Field>
                <Label>Line Height</Label>
                <div className="ml-auto w-24">
                  <Select
                    value={(() => {
                      const lineHeight = String(processedProps.style?.lineHeight) || '120%'
                      if (lineHeight === '100%') return 'small'
                      if (lineHeight === '120%') return 'medium'
                      if (lineHeight === '180%') return 'large'
                      if (lineHeight === '200%') return 'extra-large'
                      return 'medium'
                    })()}
                    onChange={(e) => {
                      const value = e.target.value
                      let lineHeight = '120%'
                      if (value === 'small') lineHeight = '100%'
                      if (value === 'medium') lineHeight = '120%'
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
            ) : null}
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
