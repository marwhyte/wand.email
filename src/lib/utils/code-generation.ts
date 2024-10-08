import parse from 'html-react-parser'
import {
  generateBlockProps,
  generateBodyProps,
  generateColumnProps,
  generateContainerProps,
  generateRowProps,
} from './attributes'

const stringifyProps = (props: Record<string, any>) => {
  return Object.entries(props)
    .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
    .join(' ')
}

const renderBlock = (block: EmailBlock) => {
  const props = generateBlockProps(block)
  const propsString = stringifyProps(props)

  switch (block.type) {
    case 'text':
      return `<Text ${propsString}>${parse(block.content)}</Text>`
    case 'heading':
      return `<Heading ${propsString}>${parse(block.content)}</Heading>`
    case 'image':
      return `<Img ${propsString} />`
    case 'button':
      return `<Button ${propsString}>${parse(block.content)}</Button>`
    case 'link':
      return `<Link ${propsString}>${parse(block.content)}</Link>`
    default:
      return ''
  }
}

export function getReactEmailCode(email: Email) {
  return `
    import React from 'react'
    import { Body, Column, Container, Head, Html, Preview, Row, Text, Link, Button, Img, Heading } from '@react-email/components'
    
    const Email = () => {
      return (
        <Html>
          <Head />
          <Preview>${email.preview}</Preview>
          <Body ${stringifyProps(generateBodyProps(email))}>
            <Container width={${email.width}} style={{ maxWidth: ${email.width} }}>
              ${email.rows
                .map(
                  (row) => `
                <Container
                  key="${row.id}"
                  ${stringifyProps(generateContainerProps(row, email))}
                >
                  <Row ${stringifyProps(generateRowProps(row))}>
                    ${row.columns
                      .map(
                        (column) => `
                      <Column
                        key="${column.id}"
                        ${stringifyProps(generateColumnProps(column))}
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
