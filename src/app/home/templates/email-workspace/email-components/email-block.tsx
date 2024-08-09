import EmailButton from './email-button'
import EmailColumn from './email-column'
import EmailContainer from './email-container'
import EmailHeading from './email-heading'
import EmailImage from './email-image'
import EmailLink from './email-link'
import EmailRow from './email-row'
import EmailText from './email-text'

type Props = {
  block: EmailBlock
}
export default function EmailBlock({ block }: Props) {
  if (block.type === 'row') {
    return <EmailRow block={block} />
  }

  if (block.type === 'column') {
    return <EmailColumn block={block} />
  }

  if (block.type === 'container') {
    return <EmailContainer block={block} />
  }

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
