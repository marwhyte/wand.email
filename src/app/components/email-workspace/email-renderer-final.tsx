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
  Html,
  Img,
  Link,
  Preview,
  Row,
  Text,
} from '@react-email/components'
import parse from 'html-react-parser'

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
    default:
      return null
  }
}

const EmailRendererFinal = ({ email }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>{email.preview}</Preview>
      <Body {...generateBodyProps(email)}>
        <Container width={email.width} style={{ maxWidth: `${email.width}px`, width: `${email.width}px` }}>
          {email.rows.map((row) => (
            <Container key={row.id} {...generateContainerProps(row, email)}>
              <Row {...generateRowProps(row)}>
                {row.columns.map((column) => {
                  return (
                    <Column key={column.id} {...generateColumnProps(column)}>
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
      </Body>
    </Html>
  )
}

export default EmailRendererFinal
