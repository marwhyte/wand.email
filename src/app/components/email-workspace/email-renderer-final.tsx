import { Company } from '@/lib/database/types'
import {
  generateBodyProps,
  generateColumnProps,
  generateContainerProps,
  generateRowProps,
  getBlockAttributes,
  getRowAttributes,
} from '@/lib/utils/attributes'
import { chunk } from '@/lib/utils/misc'
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
  email?: Email
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
  email?: Email
  company: Company | null
}) => {
  switch (block.type) {
    case 'text':
      const textProps = getBlockAttributes(block, parentRow, false, company, undefined)
      return <Text {...textProps}>{parse(block.content)}</Text>
    case 'heading':
      const headingProps = getBlockAttributes(block, parentRow, false, company, undefined)
      return <Heading {...headingProps}>{parse(block.content)}</Heading>
    case 'image':
      const imageProps = getBlockAttributes(block, parentRow, false, company, undefined)
      return <Img {...imageProps} />
    case 'button':
      const buttonProps = getBlockAttributes(block, parentRow, false, company, undefined)
      return <Button {...buttonProps}>{parse(block.content)}</Button>
    case 'link':
      const linkProps = getBlockAttributes(block, parentRow, false, company, email?.linkColor)
      return <Link {...linkProps}>{parse(block.content)}</Link>
    case 'divider':
      const dividerProps = getBlockAttributes(block, parentRow, false, company, undefined)
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
  const rowAttributes = getRowAttributes(row)
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
    columnSpacing > 0 && index < row.columns.length - 1 && <Column style={{ width: `${columnSpacing}px` }} />

  const renderColumnWithSpacer = (column: any, index: number, width?: string | number) => (
    <React.Fragment key={column.id}>
      <Column
        {...generateColumnProps(column, row)}
        style={{ ...generateColumnProps(column, row).style, width: width || `${columnWidth}%` }}
      >
        {renderColumnContent(column)}
      </Column>
      {renderSpacer(index)}
    </React.Fragment>
  )

  // Mobile version for two columns
  if (rowAttributes?.twoColumnsOnMobile) {
    return (
      <>
        <Row {...generateRowProps(row)} className="hide-on-mobile">
          {row.columns.map((column, index) => renderColumnWithSpacer(column, index))}
        </Row>

        <Container className="show-on-mobile">
          {chunk(row.columns, 2).map((pair, pairIndex) => (
            <Row key={pairIndex}>
              {pair.map((column, index) => (
                <React.Fragment key={column.id}>
                  <Column
                    {...generateColumnProps(column, row)}
                    style={{ ...generateColumnProps(column, row).style, width: '48%' }}
                  >
                    {renderColumnContent(column)}
                  </Column>
                  {index === 0 && pair.length > 1 && columnSpacing > 0 && <Column style={{ width: '4%' }} />}
                </React.Fragment>
              ))}
            </Row>
          ))}
        </Container>
      </>
    )
  }

  // Mobile version for stack
  if (rowAttributes?.stackOnMobile) {
    return (
      <>
        <Row {...generateRowProps(row)} className="hide-on-mobile">
          {row.columns.map((column, index) => renderColumnWithSpacer(column, index))}
        </Row>

        <Row className="show-on-mobile">{row.columns.map((column) => renderColumnWithSpacer(column, -1, '100%'))}</Row>
      </>
    )
  }

  // Default row with spacers
  return (
    <Row {...generateRowProps(row)}>{row.columns.map((column, index) => renderColumnWithSpacer(column, index))}</Row>
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
      }}
    >
      {email.rows.map((row) => (
        <Container key={row.id} {...generateContainerProps(row, email)}>
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

          p a {
            text-decoration: underline !important;
          }

          .show-on-mobile {
            display: none !important;
          }

          @media screen and (max-width: 739px) {
            .hide-on-mobile {
              display: none !important;
            }
            
            .show-on-mobile {
              display: table !important;
              width: 100% !important;
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
