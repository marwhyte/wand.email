import { applyCommonAttributes } from '@/lib/utils/misc'
import { Body, Column, Container, Head, Html, Preview, Row } from '@react-email/components'
import RenderBlock from './render-block'

type Props = {
  email: Email
}

const EmailRendererFinal = ({ email }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>{email.preview}</Preview>
      <Body style={{ fontFamily: email.fontFamily, margin: 0, backgroundColor: email.bgColor, color: email.color }}>
        <Container>
          {email.rows.map((row) => (
            <Container
              key={row.id}
              style={{
                ...applyCommonAttributes(row.container.attributes),
              }}
            >
              <Row align={row.attributes.align} style={{ ...applyCommonAttributes(row.attributes) }}>
                {row.columns.map((column) => {
                  const width = `${(column.gridColumns / 12) * 100}%`

                  return (
                    <Column
                      key={column.id}
                      valign={column.attributes.valign}
                      align={column.attributes.align}
                      style={{
                        ...applyCommonAttributes(column.attributes),
                        width: width,
                        borderStyle: column.attributes.borderStyle,
                        borderWidth: column.attributes.borderWidth,
                        borderColor: column.attributes.borderColor,
                      }}
                    >
                      {column.blocks.map((block) => (
                        <RenderBlock key={block.id} block={block} />
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
