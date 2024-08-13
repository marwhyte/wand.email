import EmailButton from './email-button'
import EmailHeading from './email-heading'
import EmailImage from './email-image'
import EmailLink from './email-link'
import EmailText from './email-text'

type Props = {
  block: EmailBlock
}
export default function EmailBlock({ block }: Props) {
  if (block.type === 'text') {
    return <EmailText block={block} />
  }

  if (block.type === 'heading') {
    return <EmailHeading block={block} />
  }

  if (block.type === 'image') {
    return <EmailImage block={block} />
  }

  if (block.type === 'button') {
    return <EmailButton block={block} />
  }

  if (block.type === 'link') {
    return <EmailLink block={block} />
  }

  return null
}
