import { useEmailStore } from '@/lib/stores/emailStore'
import { generateDividerProps, getEmailAttributes } from '@/lib/utils/attributes'
import React from 'react'
import { DividerBlock, RowBlock } from '../types'

type Props = {
  block: DividerBlock
  parentRow: RowBlock
}

type EmailDividerWithoutPaddingProps = {
  attributes: React.CSSProperties
}

export const EmailDividerWithoutPadding = ({ attributes }: EmailDividerWithoutPaddingProps) => {
  return (
    <table
      border={0}
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      width="100%"
      // @ts-ignore
      style={{ msoTableLspace: '0pt', msoTableRspace: '0pt' }}
    >
      <tr>
        <td
          style={{
            fontSize: '1px',
            lineHeight: '1px',
            borderTop: `${attributes.borderWidth ?? '1'}px ${attributes.borderStyle ?? 'solid'} ${
              attributes.borderColor ?? '#dddddd'
            }`,
          }}
        >
          <span style={{ wordBreak: 'break-word' }}>&#8202;</span>
        </td>
      </tr>
    </table>
  )
}

export default function EmailDivider({ block, parentRow }: Props) {
  const { email } = useEmailStore()
  const emailAttributes = getEmailAttributes(email)
  const attributes = generateDividerProps(block, parentRow, email)

  const { style, ...restAttributes } = attributes as any
  const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyles } = style || {}

  // Combine padding values
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
