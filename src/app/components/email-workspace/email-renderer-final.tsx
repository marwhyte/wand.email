import { Company } from '@/lib/database/types'
import {
  generateBodyProps,
  generateColumnProps,
  generateContainerProps,
  generateRowProps,
  getBlockAttributes,
  getRowAttributes,
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
  switch (block.type) {
    case 'text':
      const textProps = getBlockAttributes(block, parentRow, false, company, email)
      return <Text {...textProps}>{parse(block.content)}</Text>
    case 'heading':
      const headingProps = getBlockAttributes(block, parentRow, false, company, email)
      return <Heading {...headingProps}>{parse(block.content)}</Heading>
    case 'image':
      const imageProps = getBlockAttributes(block, parentRow, false, company, email)
      return <Img {...imageProps} />
    case 'button':
      const buttonProps = getBlockAttributes(block, parentRow, false, company, email)
      return <Button {...buttonProps}>{parse(block.content)}</Button>
    case 'link':
      const linkProps = getBlockAttributes(block, parentRow, false, company, email)
      return <Link {...linkProps}>{parse(block.content)}</Link>
    case 'divider':
      const dividerProps = getBlockAttributes(block, parentRow, false, company, email)
      return <Hr {...dividerProps} />
    case 'socials':
      return <EmailSocials isEditing={false} block={block} parentRow={parentRow} />
    case 'survey':
      return <EmailSurvey block={block} parentRow={parentRow} />
    default:
      return null
  }
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
        <Container
          key={row.id}
          {...generateContainerProps(row, email)}
          style={{
            ...generateContainerProps(row, email).style,
            // @ts-ignore - MSO properties for Outlook compatibility
            msoTableLspace: '0pts',
            // @ts-ignore - MSO properties for Outlook compatibility
            msoTableRspace: '0pts',
          }}
        >
          <RenderColumns row={row} email={email} company={company} />
        </Container>
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
