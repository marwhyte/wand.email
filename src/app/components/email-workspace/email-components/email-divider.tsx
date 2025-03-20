import { useEmailStore } from '@/lib/stores/emailStore'
import { getDividerProps } from '@/lib/utils/attributes'
import { DividerBlock, RowBlock } from '../types'

type Props = {
  block: DividerBlock
  parentRow: RowBlock
}

export default function EmailDivider({ block, parentRow }: Props) {
  const { email } = useEmailStore()
  const dividerProps = getDividerProps(block, parentRow, email)

  const { style, ...restProps } = dividerProps
  const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyles } = style || {}

  const divStyle = {
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  }

  return (
    <div style={divStyle}>
      <table
        border={0}
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        width="100%"
        // @ts-ignore
        style={{ msoTableLspace: '0pt', msoTableRspace: '0pt' }}
        {...restProps}
      >
        <tbody>
          <tr>
            <td
              style={{
                fontSize: '1px',
                lineHeight: '1px',
                borderTop: `${restStyles.borderWidth} ${restStyles.borderStyle} ${restStyles.borderColor}`,
              }}
            >
              <span style={{ wordBreak: 'break-word' }}>&#8202;</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
