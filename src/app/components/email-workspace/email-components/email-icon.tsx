import { useEmailSave } from '@/app/hooks/useEmailSave'
import { generateIconAction } from '@/lib/actions/iconActions'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { getBlockAttributes, getEmailAttributes, getIconProps } from '@/lib/utils/attributes'
import { Column, Row, Section } from '@react-email/components'
import { useCallback, useEffect, useRef, useState } from 'react'
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
  const { themeColor } = useChatStore()
  const saveEmail = useEmailSave()

  const { icon, title, description, size = '64', position = 'center', align = 'center', s3IconUrl } = blockAttributes

  const iconSize = parseInt(size, 10)

  // State for generated icon
  const [iconData, setIconData] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [forceRegenerate, setForceRegenerate] = useState(false)

  // Refs to track changes and prevent duplicate calls
  const prevThemeRef = useRef(themeColor)
  const prevIconRef = useRef(icon)
  const prevS3IconUrlRef = useRef(s3IconUrl)
  const generatingRef = useRef(false)
  const initialLoadCompletedRef = useRef(false)

  // Function to handle icon generation
  const generateIcon = useCallback(async () => {
    if (generatingRef.current) return

    try {
      generatingRef.current = true
      setIsLoading(true)

      const result = await generateIconAction(icon, themeColor || '#8e6ff7', iconSize)
      setIconData(result)
    } catch (error) {
      console.error('Failed to generate icon:', error)
    } finally {
      setIsLoading(false)
      generatingRef.current = false
    }
  }, [icon, themeColor, iconSize])

  // Clear s3IconUrl when icon or theme changes
  const clearS3IconUrl = useCallback(() => {
    if (!email) return

    const updatedBlock = {
      ...block,
      attributes: {
        ...block.attributes,
        s3IconUrl: undefined,
      },
    }

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
    setForceRegenerate(true)
  }, [block, email, saveEmail])

  // Theme change detection - critical effect that runs first
  useEffect(() => {
    if (themeColor !== prevThemeRef.current) {
      // Force clear s3IconUrl if theme changed and we have an s3IconUrl
      if (s3IconUrl) {
        clearS3IconUrl()
      } else {
        // If no s3IconUrl exists, we still need to regenerate the icon
        setForceRegenerate(true)
      }
    }

    // Always update the theme ref
    prevThemeRef.current = themeColor
  }, [themeColor, s3IconUrl, clearS3IconUrl, block.id])

  // Main effect to handle all icon generation scenarios
  useEffect(() => {
    // Determine what changed
    const iconChanged = icon !== prevIconRef.current
    const s3IconUrlChanged = s3IconUrl !== prevS3IconUrlRef.current
    const initialLoad = !initialLoadCompletedRef.current && !s3IconUrl

    // Skip if already generating
    if (generatingRef.current) return

    // Handle different cases
    if (initialLoad) {
      // Case: Initial load without s3IconUrl
      generateIcon()
      initialLoadCompletedRef.current = true
    } else if (iconChanged) {
      // Case: Icon changed
      if (s3IconUrl) {
        // If we have an s3IconUrl, clear it first
        clearS3IconUrl()
      } else {
        // If s3IconUrl is already cleared, generate new icon
        generateIcon()
      }
    } else if (forceRegenerate && !s3IconUrl) {
      // Case: Force regenerate (e.g., after theme change cleared s3IconUrl)
      generateIcon()
      setForceRegenerate(false)
    } else if (s3IconUrlChanged && !s3IconUrl) {
      // Handle case when s3IconUrl was cleared by another process
      generateIcon()
    }

    // Update refs for next comparison
    prevIconRef.current = icon
    prevS3IconUrlRef.current = s3IconUrl

    // Cleanup
    return () => {
      generatingRef.current = false
    }
  }, [icon, s3IconUrl, generateIcon, clearS3IconUrl, forceRegenerate, block.id])

  // Reset icon data when s3IconUrl becomes available
  useEffect(() => {
    if (s3IconUrl && iconData) {
      setIconData(null)
    }
  }, [s3IconUrl, iconData])

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

  const handleSelect = useCallback(() => {
    // The block selection is handled by the parent EmailBlock component
  }, [])

  // Reusable icon image component
  const IconImage = useCallback(() => {
    // Use s3IconUrl first, then fall back to iconData
    const src = s3IconUrl || iconData || null

    // Show loading indicator
    if (isLoading) {
      return (
        <div
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            background: '#f0f0f0',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...restStyles,
          }}
        >
          <div style={{ fontSize: '10px', color: '#666' }}>Loading...</div>
        </div>
      )
    }

    // If no src available, show placeholder instead of empty src
    if (!src) {
      return (
        <div
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            background: '#f9f9f9',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...restStyles,
          }}
        >
          <div style={{ fontSize: '10px', color: '#999' }}>No icon</div>
        </div>
      )
    }

    return <img alt={`${icon} icon`} src={src} {...blockProps} style={restStyles} />
  }, [icon, s3IconUrl, iconData, isLoading, iconSize, blockProps, restStyles])

  // Reusable content component for title and description
  const ContentBlock = useCallback(
    () => (
      <>
        {title && (
          <EditableContent
            block={block}
            content={title}
            className="email-icon-title"
            style={{
              fontWeight: 'bold',
              fontSize: '16px',
              marginBottom: description ? '4px' : '0',
            }}
            isSelected={false}
            onSelect={handleSelect}
            onChange={handleTitleChange}
          />
        )}
        {description && (
          <EditableContent
            block={block}
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
      </>
    ),
    [title, description, handleSelect, handleTitleChange, handleDescriptionChange]
  )

  // Layout renderers based on position
  const renderTopOrCenterLayout = useCallback(
    () => (
      <>
        <tr>
          <td align={align} style={{ paddingBottom: '12px' }}>
            <IconImage />
          </td>
        </tr>
        <tr>
          <td valign="top" align={align}>
            <ContentBlock />
          </td>
        </tr>
      </>
    ),
    [align, IconImage, ContentBlock]
  )

  const renderSideLayout = useCallback(
    () => (
      <tr>
        {position === 'left' && (
          <td valign="top" style={{ paddingRight: '8px' }}>
            <IconImage />
          </td>
        )}
        <td valign="top">
          <ContentBlock />
        </td>
      </tr>
    ),
    [position, align, IconImage, ContentBlock, title]
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
              {position === 'top' || position === 'center' ? renderTopOrCenterLayout() : renderSideLayout()}
            </tbody>
          </table>
        </Column>
      </Row>
    </Section>
  )
}
