import { renderToString } from 'react-dom/server'
import {
  generateBodyProps,
  generateColumnProps,
  generateContainerProps,
  generateRowProps,
  getBlockAttributes,
  getRowAttributes,
} from './attributes'

import { Email, EmailBlock, RowBlock } from '@/app/components/email-workspace/types'
import parse from 'html-react-parser'
import { Company } from '../database/types'

const stringifyProps = (props: Record<string, any>) => {
  return Object.entries(props)
    .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
    .join(' ')
}

const renderBlock = (block: EmailBlock, parentRow: RowBlock, company: Company | null, email: Email | null) => {
  const props = getBlockAttributes(block, parentRow, false, company, email)
  const propsString = stringifyProps(props)

  switch (block.type) {
    case 'text':
    case 'heading':
    case 'button':
    case 'link':
      const content = renderToString(parse(block.attributes.content))
      return `<${block.type.charAt(0).toUpperCase() + block.type.slice(1)} ${propsString}>${content}</${block.type.charAt(0).toUpperCase() + block.type.slice(1)}>`
    case 'image':
      return `<img ${propsString} />`
    case 'divider':
      return `<Hr ${propsString} />`
    case 'socials':
      return `<EmailSocials isEditing={false} block={${JSON.stringify(block)}} parentRow={${JSON.stringify(parentRow)}} />`
    case 'survey':
      return `<EmailSurvey block={${JSON.stringify(block)}} parentRow={${JSON.stringify(parentRow)}} />`
    default:
      return ''
  }
}

export function getReactEmailCode(company: Company | null, email: Email | null) {
  if (!email) return

  return `
    import React from 'react'
    import { Body, Column, Container, Head, Html, Preview, Row, Text, Link, Button, Img, Heading, Hr } from '@react-email/components'
    import parse from 'html-react-parser'
    
    const Email = () => {
      return (
        <Html>
          <Head>
            <style>{\`
              p, h1, h2, h3, h3, h4, h5 {
                margin: 0 !important;
              }

              p a {
                text-decoration: underline !important;
              }
              
              * {
                box-sizing: border-box;
              }

              body {
                margin: 0;
                padding: 0;
              }

              a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: inherit !important;
              }

              #MessageViewBody a {
                color: inherit;
                text-decoration: none;
              }

              .desktop_hide,
              .desktop_hide table {
                mso-hide: all;
                display: none;
                max-height: 0px;
                overflow: hidden;
              }

              @media screen and (max-width: 600px) {
                .mobile_hide {
                  display: none !important;
                }

                .mobile_hide {
                  min-height: 0;
                  max-height: 0;
                  max-width: 0;
                  overflow: hidden;
                  font-size: 0px;
                }
                
                .stack .column {
                  width: 100% !important;
                  display: block !important;
                  padding-bottom: 20px !important;
                }

                .stack .spacer-column {
                  display: none !important;
                  width: 0 !important;
                }
                
                .desktop_hide,
                .desktop_hide table {
                  display: table !important;
                  max-height: none !important;
                }
              }
            \`}</style>
          </Head>
          <Preview>${email.preview}</Preview>
          <Body ${stringifyProps(generateBodyProps(email))}>
            <Container width={"${email.width}"} style={{ backgroundColor: "${email.backgroundColor}", color: "${email.color}", maxWidth: "100%", margin: "0 auto", width: "${email.width}px", msoTableLspace: "0pts", msoTableRspace: "0pts" }}>
              ${email.rows
                .map((row) => {
                  const rowAttributes = getRowAttributes(row, email)
                  const columnSpacing = rowAttributes?.columnSpacing || 0
                  const numColumns = row.columns.length
                  const numSpacers = numColumns - 1
                  const totalSpacerWidth = ((columnSpacing * numSpacers) / 600) * 100
                  const columnWidth = (100 - totalSpacerWidth) / numColumns

                  const rowClassName = rowAttributes?.stackOnMobile ? 'stack' : ''
                  const hideOnMobileClass = rowAttributes?.hideOnMobile ? 'desktop_hide' : ''
                  const combinedClassName = [rowClassName, hideOnMobileClass].filter(Boolean).join(' ')

                  return `
                <Container
                  key="${row.id}"
                  ${stringifyProps(generateContainerProps(row, email))}
                  style={{
                    ...${JSON.stringify(generateContainerProps(row, email).style)},
                    msoTableLspace: "0pts",
                    msoTableRspace: "0pts"
                  }}
                >
                  <Row 
                    ${stringifyProps(generateRowProps(row, email))}
                    className="${combinedClassName || undefined}"
                    style={{
                      ...${JSON.stringify(generateRowProps(row, email).style)},
                      msoTableLspace: "0pts",
                      msoTableRspace: "0pts"
                    }}
                  >
                    ${row.columns
                      .map(
                        (column, index) => `
                      <React.Fragment key="${column.id}">
                        <Column
                          ${stringifyProps(generateColumnProps(column, row, email))}
                          style={{
                            ...${JSON.stringify(generateColumnProps(column, row, email).style)},
                            width: "${columnWidth}%"
                          }}
                        >
                          ${column.blocks
                            .map(
                              (block) => `
                            ${renderBlock(block, row, company, email)}
                          `
                            )
                            .join('')}
                        </Column>
                        ${
                          columnSpacing > 0 && index < row.columns.length - 1
                            ? `<Column className="spacer-column" style={{ width: "${columnSpacing}px" }} />`
                            : ''
                        }
                      </React.Fragment>
                    `
                      )
                      .join('')}
                  </Row>
                </Container>
              `
                })
                .join('')}
            </Container>
          </Body>
        </Html>
      )
    }
    
    export default Email`
}
