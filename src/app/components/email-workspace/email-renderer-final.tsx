import { Company } from '@/lib/database/types'
import {
  getBlockProps,
  getBodyProps,
  getColumnProps,
  getContentProps,
  getEmailAttributes,
  getRowAttributes,
  getRowProps,
  OmitChildren,
} from '@/lib/utils/attributes'
import { getBlockAttributes } from '@/lib/utils/attributes/attributes'
import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Text,
} from '@react-email/components'
import parse from 'html-react-parser'
import React from 'react'
import { Table } from '../table'
import EmailList from './email-components/email-list'
import EmailSocials from './email-components/email-socials'
import EmailSurvey from './email-components/email-survey'
import { ColumnBlock, Email, EmailBlock, RowBlock } from './types'

type Props = {
  email: Email | null
  company: Company | null
}

const RenderBlockFinal = ({
  block,
  parentRow,
  email,
  company,
}: {
  block: EmailBlock
  parentRow: RowBlock
  email: Email | null
  company: Company | null
}) => {
  const blockProps = getBlockProps(block, parentRow, company, email)
  const style = blockProps?.style || {}
  const { paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyle } = style

  // Check if all padding values are the same
  const allPaddingSame =
    paddingTop === paddingRight &&
    paddingRight === paddingBottom &&
    paddingBottom === paddingLeft &&
    paddingTop !== undefined

  // Extract padding value without 'px' for cellpadding
  const cellPaddingValue = allPaddingSame ? (paddingTop as string).replace('px', '') : undefined

  // Prepare column props
  const columnProps: any = {
    style: { width: '100%' },
  }

  // Add cellpadding to row if all padding values are the same
  if (!allPaddingSame && (paddingTop || paddingRight || paddingBottom || paddingLeft)) {
    // Add individual padding styles to column if they're different
    columnProps.style = {
      ...columnProps.style,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
    }
  }

  const content = (() => {
    const emailAttributes = getEmailAttributes(email)

    const options = {
      replace: (domNode: any) => {
        if (domNode.name === 'a' && (!domNode.attribs.style || !domNode.attribs.style.includes('color'))) {
          domNode.attribs.style = `color: ${emailAttributes.linkColor ?? '#0066CC'};`
          return domNode
        }
      },
    }

    switch (block.type) {
      case 'text':
        const textProps = { ...blockProps, style: restStyle } as OmitChildren<React.ComponentProps<typeof Text>>
        const textAttributes = getBlockAttributes(block, parentRow, email)
        return <Text {...textProps}>{parse(textAttributes.content, options)}</Text>
      case 'heading':
        const headingProps = { ...blockProps, style: restStyle } as OmitChildren<React.ComponentProps<typeof Heading>>
        const headingAttributes = getBlockAttributes(block, parentRow, email)
        return <Heading {...headingProps}>{parse(headingAttributes.content, options)}</Heading>
      case 'image':
        const imageProps = { ...blockProps, style: restStyle } as OmitChildren<React.ComponentProps<typeof Img>>
        // Extract align property and remaining props
        const { align: imageAlign, ...imageRemainingProps } = imageProps as any
        return (
          // @ts-expect-error align is not a valid prop for the div
          <div align={imageAlign}>
            <Img {...imageRemainingProps} />
          </div>
        )
      case 'button':
        const buttonProps = { ...blockProps, style: restStyle } as OmitChildren<React.ComponentProps<typeof Button>>
        // Extract align property and remaining props
        const { align: buttonAlign, ...buttonRemainingProps } = buttonProps as any

        // Extract margin values from style and remove them
        const { marginTop, marginRight, marginBottom, marginLeft, ...styleWithoutMargins } = restStyle

        // Apply directional margins as padding to the button
        const buttonStyle = {
          ...styleWithoutMargins,
          paddingTop: marginTop,
          paddingRight: marginRight,
          paddingBottom: marginBottom,
          paddingLeft: marginLeft,
        }

        const buttonAttributes = getBlockAttributes(block, parentRow, email)
        return (
          // @ts-expect-error
          <div align={buttonAlign}>
            <Button {...buttonRemainingProps} style={buttonStyle}>
              {parse(buttonAttributes.content)}
            </Button>
          </div>
        )
      case 'link':
        const linkProps = { ...blockProps, style: restStyle }
        // Extract align property and remaining props
        const { align: linkAlign, ...linkRemainingProps } = linkProps as any
        const linkAttributes = getBlockAttributes(block, parentRow, email)
        return (
          // @ts-expect-error
          <div align={linkAlign}>
            <Link {...linkRemainingProps}>{parse(linkAttributes.content)}</Link>
          </div>
        )
      case 'divider':
        return (
          <table
            border={0}
            cellPadding="0"
            cellSpacing="0"
            role="presentation"
            width="100%"
            // @ts-ignore
            style={{ msoTableLspace: '0pt', msoTableRspace: '0pt' }}
          >
            <tr>
              <td
                style={{
                  fontSize: '1px',
                  lineHeight: '1px',
                  borderTop: `${restStyle.borderWidth} ${restStyle.borderStyle} ${restStyle.borderColor}`,
                }}
              >
                <span style={{ wordBreak: 'break-word' }}>&#8202;</span>
              </td>
            </tr>
          </table>
        )
      case 'socials':
        return <EmailSocials isEditing={false} block={block} parentRow={parentRow} email={email} />
      case 'survey':
        return <EmailSurvey block={block} parentRow={parentRow} email={email} />
      case 'list':
        return <EmailList block={block} parentRow={parentRow} email={email} />
      case 'table':
        const tableProps = { ...blockProps, style: restStyle } as OmitChildren<React.ComponentProps<typeof Table>>
        const tableAttributes = getBlockAttributes(block, parentRow, email)
        return (
          <table style={{ ...restStyle }} {...tableProps}>
            {tableAttributes.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    width={`${100 / row.length}%`}
                    key={cellIndex}
                    style={{
                      padding: '10px',
                      wordBreak: 'break-word',
                      borderTop: '1px solid #dddddd',
                      borderRight: '1px solid #dddddd',
                      borderBottom: '1px solid #dddddd',
                      borderLeft: '1px solid #dddddd',
                    }}
                  >
                    {parse(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </table>
        )
      default:
        return null
    }
  })()

  return (
    <table
      width="100%"
      border={0}
      cellPadding={cellPaddingValue || '0'}
      cellSpacing="0"
      role="presentation"
      // @ts-ignore
      style={{ msoTableLspace: '0pt', msoTableRspace: '0pt', wordBreak: 'break-word' }}
    >
      <tr>
        <td {...columnProps}>{content}</td>
      </tr>
    </table>
  )
}

const RenderColumns = ({ row, email, company }: { row: RowBlock; email: Email; company: Company | null }) => {
  const emailAttributes = getEmailAttributes(email)
  const rowAttributes = getRowAttributes(row, email)
  const columnSpacing = rowAttributes?.columnSpacing || 0
  const numColumns = row.columns.length
  const numSpacers = numColumns - 1
  const totalSpacerWidth = ((columnSpacing * numSpacers) / Number(emailAttributes.width)) * 100
  const columnWidth = (100 - totalSpacerWidth) / numColumns

  const renderColumnContent = (column: ColumnBlock) =>
    column.blocks.map((block) => (
      <RenderBlockFinal key={block.id} block={block} parentRow={row} email={email} company={company} />
    ))

  const renderSpacer = (index: number) =>
    columnSpacing > 0 &&
    index < row.columns.length - 1 && (
      <Column
        className="spacer-column gap"
        style={{
          width: `${columnSpacing}px`,
          verticalAlign: 'top',
          fontWeight: 400,
          textAlign: 'left',
        }}
      >
        <table
          width={columnSpacing}
          height={columnSpacing}
          style={{
            // @ts-ignore - MSO properties for Outlook compatibility
            msoTableLspace: '0pt',
            msoTableRspace: '0pt',
            width: `${columnSpacing}px`,
            height: `${columnSpacing}px`,
          }}
        />
      </Column>
    )

  return (
    <Row
      {...getRowProps(row, email)}
      style={{
        ...getRowProps(row, email).style,
        // @ts-ignore - MSO properties for Outlook compatibility
        msoTableLspace: '0pts',
        // @ts-ignore - MSO properties for Outlook compatibility
        msoTableRspace: '0pts',
      }}
    >
      {row.columns.map((column, index) => (
        <React.Fragment key={column.id}>
          <Column
            {...getColumnProps(column, row, email)}
            style={{ ...getColumnProps(column, row, email).style, width: `${columnWidth}%` }}
          >
            {renderColumnContent(column)}
          </Column>
          {renderSpacer(index)}
        </React.Fragment>
      ))}
    </Row>
  )
}

const RenderRowSpacer = ({ height }: { height: number }) => {
  return (
    <Row
      style={{
        // @ts-ignore - MSO properties for Outlook compatibility
        msoTableLspace: '0pt',
        msoTableRspace: '0pt',
      }}
    >
      <Column style={{ padding: 0 }}>
        <div style={{ height: `${height}px`, lineHeight: `${height}px`, fontSize: '1px' }}>&#8202;</div>
      </Column>
    </Row>
  )
}

export const EmailContent = ({ email, company }: { email: Email; company: Company | null }) => {
  const emailAttributes = getEmailAttributes(email)
  return (
    <Container {...getContentProps(email)}>
      {email.rows.map((row, index) => {
        return (
          <React.Fragment key={row.id}>
            <RenderColumns row={row} email={email} company={company} />
            {index < email.rows.length - 1 &&
              emailAttributes.styleVariant === 'outline' &&
              row.attributes.type !== 'header' &&
              row.attributes.type !== 'footer' &&
              email.rows[index + 1].attributes.type !== 'header' &&
              email.rows[index + 1].attributes.type !== 'footer' && <RenderRowSpacer height={20} />}
          </React.Fragment>
        )
      })}
    </Container>
  )
}

const EmailRendererFinal = ({ email, company }: Props) => {
  if (!email) return <></>

  return (
    <Html>
      <Head>
        {email.fontFamily?.includes('Outfit') && (
          <Font
            fontFamily="Outfit"
            fallbackFontFamily="Arial"
            webFont={{
              url: 'https://fonts.gstatic.com/s/outfit/v11/QGYvz_MVcBeNP4NJtEtqUYLknw.woff2',
              format: 'woff2',
            }}
          />
        )}
        {email.fontFamily?.includes('Open Sans') && (
          <Font
            fontFamily="Open Sans"
            fallbackFontFamily="Arial"
            webFont={{
              url: 'https://fonts.gstatic.com/s/opensans/v40/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-mu0SC55I.woff2',
              format: 'woff2',
            }}
          />
        )}
        <style>{`
          p, h1, h2, h3, h3, h4, h5 {
            margin: 0 !important;
          }

          p {
            line-height: inherit
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

          .row-content {
				    width: 100% !important;
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
        `}</style>
      </Head>
      <Body {...getBodyProps(email)}>
        <Preview>{email.preview ?? 'Preview'}</Preview>
        <EmailContent email={email} company={company} />
      </Body>
    </Html>
  )
}

export default EmailRendererFinal
