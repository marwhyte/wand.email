import { Company } from '@/lib/database/types'
import {
  generateBodyProps,
  generateColumnProps,
  generateRowProps,
  getBlockAttributes,
  getRowAttributes,
  OmitChildren,
} from '@/lib/utils/attributes'
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Text,
} from '@react-email/components'
import parse from 'html-react-parser'
import React from 'react'
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
  const blockProps = getBlockAttributes(block, parentRow, false, company, email)
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
    switch (block.type) {
      case 'text':
        const textProps = { ...blockProps, style: restStyle } as OmitChildren<React.ComponentProps<typeof Text>>
        return <Text {...textProps}>{parse(block.attributes.content)}</Text>
      case 'heading':
        const headingProps = { ...blockProps, style: restStyle } as OmitChildren<React.ComponentProps<typeof Heading>>
        return <Heading {...headingProps}>{parse(block.attributes.content)}</Heading>
      case 'image':
        const imageProps = { ...blockProps, style: restStyle } as OmitChildren<React.ComponentProps<typeof Img>>
        // Extract align property and remaining props
        const { align: imageAlign, ...imageRemainingProps } = imageProps as any
        return (
          // @ts-expect-error
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

        return (
          // @ts-expect-error
          <div align={buttonAlign}>
            <Button {...buttonRemainingProps} style={buttonStyle}>
              {parse(block.attributes.content)}
            </Button>
          </div>
        )
      case 'link':
        const linkProps = { ...blockProps, style: restStyle }
        // Extract align property and remaining props
        const { align: linkAlign, ...linkRemainingProps } = linkProps as any
        return (
          // @ts-expect-error
          <div align={linkAlign}>
            <Link {...linkRemainingProps}>{parse(block.attributes.content)}</Link>
          </div>
        )
      case 'divider':
        const dividerProps = { ...blockProps, style: restStyle } as OmitChildren<React.ComponentProps<typeof Hr>>
        const { style: dividerStyle, ...attributes } = dividerProps as any
        return <Hr {...attributes} style={{ ...dividerStyle }} />
      case 'socials':
        return <EmailSocials isEditing={false} block={block} parentRow={parentRow} />
      case 'survey':
        return <EmailSurvey block={block} parentRow={parentRow} />
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
  const rowAttributes = getRowAttributes(row, email)
  const columnSpacing = rowAttributes?.columnSpacing || 0
  const numColumns = row.columns.length
  const numSpacers = numColumns - 1
  const totalSpacerWidth = ((columnSpacing * numSpacers) / 600) * 100
  const columnWidth = (100 - totalSpacerWidth) / numColumns

  const renderColumnContent = (column: ColumnBlock) =>
    column.blocks.map((block) => (
      <RenderBlockFinal key={block.id} block={block} parentRow={row} email={email} company={company} />
    ))

  const renderSpacer = (index: number) =>
    columnSpacing > 0 &&
    index < row.columns.length - 1 && <Column className="spacer-column" style={{ width: `${columnSpacing}px` }} />

  return (
    <Row
      {...generateRowProps(row, email)}
      style={{
        ...generateRowProps(row, email).style,
        // @ts-ignore - MSO properties for Outlook compatibility
        msoTableLspace: '0pts',
        // @ts-ignore - MSO properties for Outlook compatibility
        msoTableRspace: '0pts',
      }}
    >
      {row.columns.map((column, index) => (
        <React.Fragment key={column.id}>
          <Column
            {...generateColumnProps(column, row, email)}
            style={{ ...generateColumnProps(column, row, email).style, width: `${columnWidth}%` }}
          >
            {renderColumnContent(column)}
          </Column>
          {renderSpacer(index)}
        </React.Fragment>
      ))}
    </Row>
  )
}

export const EmailContent = ({ email, company }: { email: Email; company: Company | null }) => {
  return (
    <Container
      width={email.width}
      style={{
        backgroundColor: email.bgColor,
        color: email.color,
        maxWidth: '100%',
        margin: '0 auto',
        width: `${email.width}px`,
        // @ts-ignore - MSO properties for Outlook compatibility
        msoTableLspace: '0pts',
        // @ts-ignore - MSO properties for Outlook compatibility
        msoTableRspace: '0pts',
      }}
    >
      {email.rows.map((row) => (
        // <Container
        //   key={row.id}
        //   {...generateContainerProps(row, email)}
        //   style={{
        //     ...generateContainerProps(row, email).style,
        //     // @ts-ignore - MSO properties for Outlook compatibility
        //     msoTableLspace: '0pts',
        //     // @ts-ignore - MSO properties for Outlook compatibility
        //     msoTableRspace: '0pts',
        //   }}
        // >
        <RenderColumns row={row} email={email} company={company} key={row.id} />
        // </Container>
      ))}
    </Container>
  )
}

const EmailRendererFinal = ({ email, company }: Props) => {
  if (!email) return <></>

  return (
    <Html>
      <Head>
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
      <Body {...generateBodyProps(email)}>
        <Preview>{email.preview}</Preview>
        <EmailContent email={email} company={company} />
      </Body>
    </Html>
  )
}

export default EmailRendererFinal
