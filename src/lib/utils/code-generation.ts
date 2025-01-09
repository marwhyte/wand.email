import { renderToString } from 'react-dom/server'
import {
  generateBlockProps,
  generateBodyProps,
  generateColumnProps,
  generateContainerProps,
  generateRowProps,
} from './attributes'

import parse from 'html-react-parser'

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
    case 'heading':
    case 'button':
    case 'link':
      const content = renderToString(parse(block.content))

      return `<${block.type.charAt(0).toUpperCase() + block.type.slice(1)} ${propsString}>${content}</${block.type.charAt(0).toUpperCase() + block.type.slice(1)}>`
    case 'image':
      return `<Img ${propsString} />`
    default:
      return ''
  }
}

export function getReactEmailCode(email?: Email) {
  if (!email) return

  return `
    import React from 'react'
    import { Body, Column, Container, Head, Html, Preview, Row, Text, Link, Button, Img, Heading } from '@react-email/components'
    
    const Email = () => {
      return (
        <Html>
          <Head />
          <Preview>${email.preview ? email.preview : email.name}</Preview>
          <Body ${stringifyProps(generateBodyProps(email))}>
            <Container width={"${email.width}"} style={{ maxWidth: "${email.width}"  }}>
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
                        ${stringifyProps(generateColumnProps(column, row))}
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
