import { generateSocialsProps } from '@/lib/utils/attributes/generators/blocks'
import { getPhotoUrl } from '@/lib/utils/misc'
import { RowBlock, SocialsBlock } from '../types'

type Props = {
  block: SocialsBlock
  isEditing?: boolean
  parentRow: RowBlock
}

const EmailSocials = ({ block, isEditing = true, parentRow }: Props) => {
  const socialProps = generateSocialsProps(block, parentRow)
  const { align } = socialProps

  return (
    // @ts-expect-error
    <div align={align}>
      <table
        border={0}
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        style={{
          display: 'inline-block',
          // @ts-expect-error
          msoTableLspace: '0pt',
          msoTableRspace: '0pt',
        }}
      >
        <tbody>
          <tr>
            {block.attributes.socialLinks.map((social) => (
              <td
                key={social.url === '/' || social.url === '#' ? Math.random() : social.url}
                style={{ padding: '0 4px' }}
              >
                <a href={isEditing ? undefined : social.url} target="_blank">
                  <img
                    src={getPhotoUrl(`${social.icon}.png`, block.attributes.folder)}
                    width="24"
                    height="auto"
                    alt={social.alt}
                    title={social.title}
                    style={{ display: 'block', height: 'auto', border: '0' }}
                  />
                </a>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default EmailSocials
