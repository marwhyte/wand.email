import { useEmailSave } from '@/app/hooks/useEmailSave'
import { useEmailStore } from '@/lib/stores/emailStore'
import { getBlockAttributes, getEmailAttributes, getIconProps } from '@/lib/utils/attributes'
import { Column, Row, Section, Text } from '@react-email/components'
import { useCallback } from 'react'
import { Email, IconBlock, RowBlock } from '../types'
import EditableContent from './editable-content'

type Props = {
  block: IconBlock
  parentRow: RowBlock
  email: Email | null
}

export default function EmailIcon({ block, parentRow, email }: Props) {
  const blockAttributes = getBlockAttributes(block, parentRow, email)
  const { style, ...blockProps } = getIconProps(block, parentRow, email)
  const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyles } = style || {}

  const emailAttributes = getEmailAttributes(email)
  const { setCurrentBlock } = useEmailStore()
  const saveEmail = useEmailSave()

  const { icon, title, description, size = '64', position = 'center', align = 'center' } = blockAttributes

  const theme = emailAttributes.theme
  const ICON_CACHE_KEY = new Date().getTime()

  const iconSize = parseInt(size, 10)

  const handleSelect = useCallback(() => {
    // The block selection is handled by the parent EmailBlock component
  }, [])

  const updateBlock = useCallback(
    (updates: Partial<IconBlock['attributes']>) => {
      if (!email) return

      const updatedBlock = {
        ...block,
        attributes: {
          ...block.attributes,
          ...updates,
        },
      }

      setCurrentBlock(updatedBlock)

      // Update the email with the modified block
      const updatedEmail = {
        ...email,
        rows: email.rows.map((row) => ({
          ...row,
          columns: row.columns.map((column) => ({
            ...column,
            blocks: column.blocks.map((b) => (b.id === block.id ? updatedBlock : b)),
          })),
        })),
      }

      saveEmail(updatedEmail)
    },
    [block, email, saveEmail, setCurrentBlock]
  )

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      updateBlock({ title: newTitle })
    },
    [updateBlock]
  )

  const handleDescriptionChange = useCallback(
    (newDescription: string) => {
      updateBlock({ description: newDescription })
    },
    [updateBlock]
  )

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
                      <img
                        alt={`${icon} icon`}
                        src={`/api/icon?icon=${icon}&theme=${theme}&t=${ICON_CACHE_KEY}&size=${iconSize}`}
                        style={{
                          ...restStyles,
                        }}
                        {...blockProps}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td valign="top" align={align}>
                      {title && (
                        <EditableContent
                          content={title}
                          className="email-icon-title"
                          style={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                          }}
                          isSelected={false}
                          onSelect={handleSelect}
                          onChange={handleTitleChange}
                        />
                      )}
                      {description && (
                        <EditableContent
                          content={description}
                          className="email-icon-description"
                          style={{
                            fontSize: '14px',
                            color: '#666666',
                          }}
                          isSelected={false}
                          onSelect={handleSelect}
                          onChange={handleDescriptionChange}
                        />
                      )}
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  {position === 'left' && (
                    <td valign="top" style={{ paddingRight: '16px' }}>
                      <img
                        alt={`${icon} icon`}
                        src={`/api/icon?icon=${icon}&theme=${theme}&t=${ICON_CACHE_KEY}&size=${iconSize}`}
                        {...blockProps}
                      />
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
                        <EditableContent
                          content={title}
                          className="email-icon-title"
                          style={{
                            fontWeight: 'bold',
                            marginBottom: description ? '4px' : '0',
                            fontSize: '16px',
                          }}
                          isSelected={false}
                          onSelect={handleSelect}
                          onChange={handleTitleChange}
                        />
                      </Text>
                    )}
                    {description && (
                      <Text style={{ fontSize: '14px', color: '#666666', textAlign: align }}>
                        <EditableContent
                          content={description}
                          className="email-icon-description"
                          style={{
                            fontSize: '14px',
                            color: '#666666',
                          }}
                          isSelected={false}
                          onSelect={handleSelect}
                          onChange={handleDescriptionChange}
                        />
                      </Text>
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
