import { getPhotoUrl } from '@/lib/utils/misc'
import { RowBlock, SocialsBlock } from '../types'

type Props = {
  block: SocialsBlock
  isEditing?: boolean
  parentRow: RowBlock
}

const EmailSocials = ({ block, isEditing = true, parentRow }: Props) => {
  return (
    <>
      {block.attributes.socialLinks.map((social) => (
        <a href={isEditing ? undefined : social.url} key={social.url === '#' ? Math.random() : social.url} style={{ display: 'inline-block', padding: '0 4px' }}>
          <img style={{ height: '24px', width: '24px' }} src={getPhotoUrl(`${social.icon}.png`, block.attributes.folder)} alt={social.alt} title={social.title} />
        </a>
      ))}
    </>
  )
}

export default EmailSocials
