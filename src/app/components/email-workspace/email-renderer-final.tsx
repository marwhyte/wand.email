import {
  generateBlockProps,
  generateBodyProps,
  generateColumnProps,
  generateContainerProps,
  generateRowProps,
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
import EmailSocials from './email-components/email-socials'

type Props = {
  email: Email
}

const RenderBlockFinal = ({ block }: { block: EmailBlock }) => {
  switch (block.type) {
    case 'text':
      const textProps = generateBlockProps(block)
      return <Text {...textProps}>{parse(block.content)}</Text>
    case 'heading':
      const headingProps = generateBlockProps(block)
      return <Heading {...headingProps}>{parse(block.content)}</Heading>
    case 'image':
      const imageProps = generateBlockProps(block)
      return <Img {...imageProps} />
    case 'button':
      const buttonProps = generateBlockProps(block)
      return <Button {...buttonProps}>{parse(block.content)}</Button>
    case 'link':
      const linkProps = generateBlockProps(block)
      return <Link {...linkProps}>{parse(block.content)}</Link>
    case 'divider':
      const dividerProps = generateBlockProps(block)
      return <Hr {...dividerProps} />
    case 'socials':
      return <EmailSocials isEditing={false} block={block} />
    default:
      return null
  }
}

export const EmailContent = ({ email }: { email: Email }) => {
  return (
    <Container width={email.width} style={{ maxWidth: `${email.width}px`, width: `${email.width}px` }}>
      {email.rows.map((row) => (
        <Container key={row.id} {...generateContainerProps(row, email)}>
          <Row {...generateRowProps(row)}>
            {row.columns.map((column) => {
              return (
                <Column key={column.id} {...generateColumnProps(column, row)}>
                  {column.blocks.map((block) => (
                    <RenderBlockFinal key={block.id} block={block} />
                  ))}
                </Column>
              )
            })}
          </Row>
        </Container>
      ))}
    </Container>
  )
}

const EmailRendererFinal = ({ email }: Props) => {
  return (
    <Html>
      <Head>
        <style>{`
          .mobile-full-width {
            display: inline-block !important;
          }
          p, h1, h2, h3, h3, h4, h5 {
            margin: 0 !important;
          }

          @media screen and (max-width: 739px) {
            .mobile-full-width {
              display: inline-block !important;
              width: 100% !important;
              max-width: 100% !important;
            }

            .hide-on-mobile {
              display: none !important;
            }

            .no-side-padding-mobile {
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
          }
        `}</style>
      </Head>
      <Preview>{email.preview}</Preview>
      <Body {...generateBodyProps(email)}>
        <EmailContent email={email} />
      </Body>
    </Html>
  )
}

export default EmailRendererFinal
