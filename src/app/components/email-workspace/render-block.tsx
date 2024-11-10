import EmailButton from './email-components/email-button'
import EmailDivider from './email-components/email-divider'
import EmailHeading from './email-components/email-heading'
import EmailImage from './email-components/email-image'
import EmailLink from './email-components/email-link'
import EmailSocials from './email-components/email-socials'
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
  if (block.type === 'divider') {
    return <EmailDivider block={block} />
  }
  if (block.type === 'socials') {
    return <EmailSocials block={block} />
  }
}

export default RenderBlock
