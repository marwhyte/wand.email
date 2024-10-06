import parse from 'html-react-parser'

export function getFirstTwoInitials(name: string) {
  // Split the name by spaces
  const words = name.trim().split(/\s+/)

  // Get the first letter of the first two words
  const initials = words.slice(0, 2).map((word) => word[0].toUpperCase())

  // Join the initials
  return initials.join('')
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

type ObjectWithCreatedAt = {
  created_at: Date
}

export function sortByCreatedAt<T extends ObjectWithCreatedAt>(projects: T[]): T[] {
  return projects.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function getPhotoUrl(name: string, template: string) {
  return `https://d7fuhokyircdv.cloudfront.net/${template}/${name}`
}

export function isValidHttpUrl(string: string) {
  let url

  try {
    url = new URL(string)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

export function applyCommonAttributes(attributes: CommonAttributes) {
  const commonProps = [
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'display',
    'width',
    'maxWidth',
    'height',
    'backgroundColor',
    'borderRadius',
    'border',
    'textAlign',
    'verticalAlign',
    'fontSize',
    'lineHeight',
    'color',
    'fontWeight',
    'textDecoration',
    'textTransform',
    'whiteSpace',
    'fontStyle',
  ] as const

  return Object.fromEntries(
    commonProps.map((prop) => [prop, attributes[prop]]).filter(([_, value]) => value !== undefined)
  )
}

export function joinClassNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const renderBlock = (block: EmailBlock) => {
  if (block.type === 'text') {
    const additionalStyles = {
      margin: 0,
      fontFamily: block.attributes.fontFamily,
      letterSpacing: block.attributes.letterSpacing,
      textIndent: block.attributes.textIndent,
    }
    return `<Text style={{ ...applyCommonAttributes(${JSON.stringify(block.attributes)}), ${Object.entries(
      additionalStyles
    )
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')} }}>${parse(block.content)}</Text>`
  }
  // if (block.type === 'heading') {
  //   return `<EmailHeading block={block} />`
  // }
  // if (block.type === 'image') {
  //   return `<EmailImage block={block} />`
  // }
  // if (block.type === 'button') {
  //   return `<EmailButton block={block} isEditing={false} />`
  // }
  // if (block.type === 'link') {
  //   return `<EmailLink block={block} isEditing={false} />`
  // }
}

export function getReactEmailCode(email: Email) {
  return `
import React from 'react'
import { Body, Column, Container, Head, Html, Preview, Row, Text } from '@react-email/components'

const Email = () => {
  function applyCommonAttributes(attributes) {
    const commonProps = [
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',
      'display',
      'width',
      'maxWidth',
      'height',
      'backgroundColor',
      'borderRadius',
      'border',
      'textAlign',
      'verticalAlign',
      'fontSize',
      'lineHeight',
      'color',
      'fontWeight', 
      'textDecoration',
      'textTransform',
      'whiteSpace',
      'fontStyle',
    ] as const

    return Object.fromEntries(
      commonProps.map((prop) => [prop, attributes[prop]]).filter(([_, value]) => value !== undefined)
    )
  }

  return (
    <Html>
      <Head />
      <Preview>${email.preview}</Preview>
      <Body style={{ margin: 0, backgroundColor: '${email.bgColor}', color: '${email.color}', fontFamily: '${email.fontFamily}' }}>
        <Container width={${email.width}} style={{ maxWidth: ${email.width} }}>
          ${email.rows
            .map(
              (row) => `
            <Container
              key="${row.id}"
              style={{
                ...applyCommonAttributes(${JSON.stringify(row.container.attributes)}),
                width: ${email.width},
                maxWidth: ${email.width},
              }}
            >
              <Row align="${row.attributes.align ? row.attributes.align : 'left'}" style={{ ...applyCommonAttributes(${JSON.stringify(row.attributes)}) }}>
                ${row.columns
                  .map(
                    (column) => `
                  <Column
                    key="${column.id}"
                    valign="${column.attributes.valign ? column.attributes.valign : 'top'}"
                    align="${column.attributes.align ? column.attributes.align : 'left'}"
                    style={{
                      ...applyCommonAttributes(${JSON.stringify(column.attributes)}),
                      width: '${(column.gridColumns / 12) * 100}%',
                      borderStyle: '${column.attributes.borderStyle ? column.attributes.borderStyle : 'none'}',
                      borderWidth: '${column.attributes.borderWidth ? column.attributes.borderWidth : '0'}',
                      borderColor: '${column.attributes.borderColor ? column.attributes.borderColor : 'transparent'}',
                    }}
                  >
                    ${column.blocks
                      .map(
                        (block) => `
                      ${renderBlock(block)}
                    `
                      )
                      .join('')}
                  </Column>
                `
                  )
                  .join('')}
              </Row>
            </Container>
          `
            )
            .join('')}
        </Container>
      </Body>
    </Html>
  )
}

export default Email`
}
