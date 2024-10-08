import EmailButton from './email-components/email-button'
import EmailHeading from './email-components/email-heading'
import EmailImage from './email-components/email-image'
import EmailLink from './email-components/email-link'
import EmailText from './email-components/email-text'

type Props = {
  block: EmailBlock
}

const RenderBlock = ({ block }: Props) => {
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
}

export default RenderBlock
