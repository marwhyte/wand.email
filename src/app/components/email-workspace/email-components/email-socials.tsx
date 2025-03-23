import { getSocialsProps } from '@/lib/utils/attributes'
import { getBlockAttributes } from '@/lib/utils/attributes/attributes'
import { getPhotoUrl } from '@/lib/utils/misc'
import { Email, RowBlock, SocialsBlock } from '../types'

type Props = {
  block: SocialsBlock
  isEditing?: boolean
  parentRow: RowBlock
  email: Email | null
}

const EmailSocials = ({ block, isEditing = true, parentRow, email }: Props) => {
  const socialProps = getSocialsProps(block, parentRow, email)
  const { style, ...restSocialProps } = socialProps
  const socialAttributes = getBlockAttributes(block, parentRow, email)

  const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyles } = style || {}

  return (
    // @ts-expect-error align is not a valid prop for the div
    <div align={socialAttributes.align}>
      <table
        border={0}
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        style={{
          display: 'inline-block',
          // @ts-expect-error msoTableLspace and msoTableRspace are not valid props for the table
          msoTableLspace: '0pt',
          msoTableRspace: '0pt',
          ...restStyles,
        }}
        {...restSocialProps}
      >
        <tbody>
          <tr>
            {socialAttributes.links.map((social) => (
              <td
                key={social.url === '/' || social.url === '#' ? Math.random() : social.url}
                style={{ padding: '0 4px' }}
              >
                <a href={isEditing ? undefined : social.url} target="_blank">
                  <img
                    src={getPhotoUrl(`${social.icon}.png`, socialAttributes.folder)}
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
