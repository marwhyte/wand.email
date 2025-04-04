import { useEmailStore } from '@/lib/stores/emailStore'
import { getListProps, getSocialsProps, getSurveyProps } from '@/lib/utils/attributes'
import EmailButton from './email-components/email-button'
import EmailDivider from './email-components/email-divider'
import EmailHeading from './email-components/email-heading'
import EmailIcon from './email-components/email-icon'
import EmailImage from './email-components/email-image'
import EmailLink from './email-components/email-link'
import EmailList from './email-components/email-list'
import EmailSocials from './email-components/email-socials'
import EmailSpacer from './email-components/email-spacer'
import EmailSurvey from './email-components/email-survey'
import EmailTable from './email-components/email-table'
import EmailText from './email-components/email-text'
import { EmailBlock, RowBlock } from './types'

type Props = {
  block: EmailBlock
  parentRow: RowBlock
}

const RenderBlock = ({ block, parentRow }: Props) => {
  const { email } = useEmailStore()

  if (block.type === 'text') {
    return <EmailText block={block} parentRow={parentRow} />
  }
  if (block.type === 'heading') {
    return <EmailHeading block={block} parentRow={parentRow} />
  }
  if (block.type === 'image') {
    return <EmailImage block={block} parentRow={parentRow} />
  }
  if (block.type === 'button') {
    return <EmailButton block={block} parentRow={parentRow} email={email} />
  }
  if (block.type === 'link') {
    return <EmailLink block={block} parentRow={parentRow} />
  }
  if (block.type === 'list') {
    const attributes = getListProps(block, parentRow, email)
    return (
      <div
        style={{
          paddingTop: attributes.style?.paddingTop,
          paddingLeft: attributes.style?.paddingLeft,
          paddingRight: attributes.style?.paddingRight,
          paddingBottom: attributes.style?.paddingBottom,
        }}
      >
        <EmailList block={block} parentRow={parentRow} email={email} />
      </div>
    )
  }
  if (block.type === 'icon') {
    return <EmailIcon block={block} parentRow={parentRow} email={email} />
  }
  if (block.type === 'divider') {
    return <EmailDivider block={block} parentRow={parentRow} />
  }
  if (block.type === 'socials') {
    const attributes = getSocialsProps(block, parentRow, email)
    return (
      <div
        style={{
          paddingTop: attributes.style?.paddingTop,
          paddingLeft: attributes.style?.paddingLeft,
          paddingRight: attributes.style?.paddingRight,
          paddingBottom: attributes.style?.paddingBottom,
        }}
      >
        <EmailSocials block={block} parentRow={parentRow} email={email} />
      </div>
    )
  }
  if (block.type === 'survey') {
    const attributes = getSurveyProps(block, parentRow, email)
    return (
      <div
        style={{
          paddingTop: attributes.style?.paddingTop,
          paddingLeft: attributes.style?.paddingLeft,
          paddingRight: attributes.style?.paddingRight,
          paddingBottom: attributes.style?.paddingBottom,
        }}
      >
        <EmailSurvey block={block} parentRow={parentRow} email={email} />
      </div>
    )
  }
  if (block.type === 'table') {
    return <EmailTable block={block} parentRow={parentRow} />
  }
  if (block.type === 'spacer') {
    return <EmailSpacer block={block} parentRow={parentRow} email={email} />
  }

  return null
}

export default RenderBlock
