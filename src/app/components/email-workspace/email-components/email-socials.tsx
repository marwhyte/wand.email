import { getPhotoUrl } from '@/lib/utils/misc'

type Props = {
  block: SocialsBlock
  isEditing?: boolean
}

const EmailSocials = ({ block, isEditing = true }: Props) => {
  return (
    <div>
      {block.attributes.socialLinks.map((social) => (
        <a
          href={isEditing ? undefined : social.url}
          key={social.url}
          style={{ display: 'inline-block', padding: '0 2px' }}
        >
          <img
            style={{ height: '24px', width: '24px' }}
            src={getPhotoUrl(`${social.icon}.png`, block.attributes.folder)}
            alt={social.alt}
            title={social.title}
          />
        </a>
      ))}
    </div>
  )
}

export default EmailSocials
