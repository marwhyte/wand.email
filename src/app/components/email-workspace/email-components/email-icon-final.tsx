'use client'

import { getBlockAttributes, getEmailAttributes, getIconProps } from '@/lib/utils/attributes'
import { Column, Row, Section, Text } from '@react-email/components'
import { Email, IconBlock, RowBlock } from '../types'

type Props = {
  block: IconBlock
  parentRow: RowBlock
  email: Email | null
}

export default function EmailIconFinal({ block, parentRow, email }: Props) {
  const blockAttributes = getBlockAttributes(block, parentRow, email)
  const blockProps = getIconProps(block, parentRow, email)
  const emailAttributes = getEmailAttributes(email)

  const { icon, title, description, size = '64', position = 'center', align = 'center' } = blockAttributes
  const theme = emailAttributes.theme

  // Use the S3 URL if available, otherwise fall back to the API URL
  const iconUrl = block.attributes.s3IconUrl || `/api/icon?icon=${icon}&theme=${theme}&size=${size}`

  return (
    <Section
      style={{
        paddingTop: block.attributes.paddingTop,
        paddingRight: block.attributes.paddingRight,
        paddingBottom: block.attributes.paddingBottom,
        paddingLeft: block.attributes.paddingLeft,
      }}
    >
      <Row>
        <Column align={align}>
          <table>
            <tbody>
              {position === 'top' || position === 'center' ? (
                <>
                  <tr>
                    <td align={align} style={{ paddingBottom: '12px' }}>
                      <img alt={`${icon} icon`} src={iconUrl} {...blockProps} />
                    </td>
                  </tr>
                  <tr>
                    <td valign="top" align={align}>
                      {title && (
                        <Text
                          style={{
                            fontWeight: 'bold',
                            marginBottom: description ? '4px' : '0',
                            fontSize: '16px',
                            textAlign: align,
                          }}
                        >
                          {title}
                        </Text>
                      )}
                      {description && (
                        <Text style={{ fontSize: '14px', color: '#666666', textAlign: align }}>{description}</Text>
                      )}
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  {position === 'left' && (
                    <td valign="top" style={{ paddingRight: '16px' }}>
                      <img alt={`${icon} icon`} src={iconUrl} {...blockProps} />
                    </td>
                  )}
                  <td valign="top">
                    {title && (
                      <Text
                        style={{
                          fontWeight: 'bold',
                          marginBottom: description ? '4px' : '0',
                          fontSize: '16px',
                          textAlign: align,
                        }}
                      >
                        {title}
                      </Text>
                    )}
                    {description && (
                      <Text style={{ fontSize: '14px', color: '#666666', textAlign: align }}>{description}</Text>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Column>
      </Row>
    </Section>
  )
}
