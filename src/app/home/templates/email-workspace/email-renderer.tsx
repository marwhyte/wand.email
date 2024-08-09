'use client'

import { Body, Container, Head, Html, Preview } from '@react-email/components'
import EmailBlock from './email-components/email-block'

const EmailRenderer = ({ template, renderFullEmail = false }: { template: Email; renderFullEmail?: boolean }) => {
  const emailBlocks = template.blocks.map((block) => <EmailBlock key={block.id} block={block} />)

  if (renderFullEmail) {
    return (
      <Html>
        <Head />
        <Preview>{template.preview}</Preview>
        <Body style={{ fontFamily: template.fontFamily, margin: 0, maxWidth: '600px' }}>
          <Container width={600}>{emailBlocks}</Container>
          {emailBlocks}
        </Body>
      </Html>
    )
  }

  return <>{emailBlocks}</>
}

export default EmailRenderer
