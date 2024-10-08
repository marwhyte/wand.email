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
  const props = generateBlockProps(block)

  switch (block.type) {
    case 'text':
      return <Text {...props}>{parse(block.content)}</Text>
    case 'heading':
      return <Heading {...props}>{parse(block.content)}</Heading>
    case 'image':
      return <Img {...props} />
    case 'button':
      return <Button {...props}>{parse(block.content)}</Button>
    case 'link':
      return <Link {...props}>{parse(block.content)}</Link>
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
        <Container width={email.width} style={{ maxWidth: email.width }}>
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
