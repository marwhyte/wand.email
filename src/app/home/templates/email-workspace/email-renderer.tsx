'use client'

import { Body, Container, Head, Html, Preview } from '@react-email/components'
import EmailBlock from './email-components/email-block'

type Props = {
  email: Email
  renderFullEmail?: boolean
  width?: '600' | '360'
}

const EmailRenderer = ({ email, renderFullEmail = false, width = '600' }: Props) => {
  const emailBlocks = email.blocks.map((block) => <EmailBlock key={block.id} block={block} />)

  if (renderFullEmail) {
    return (
      <Html>
        <Head />
        <Preview>{email.preview}</Preview>
        <Body style={{ fontFamily: email.fontFamily, margin: 0 }}>
          <Container>{emailBlocks}</Container>
        </Body>
      </Html>
    )
  }

  return (
    <div className="flex flex-grow items-start justify-center overflow-y-scroll p-4">
      <div className={`max-w-[600px] w-[${width}px]`}>{emailBlocks}</div>
    </div>
  )
}

export default EmailRenderer
