import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { getBlockAttributes, getButtonProps } from '@/lib/utils/attributes'
import { useCallback } from 'react'
import { ButtonBlock, Email, RowBlock } from '../types'
import EditableContent from './editable-content'

type Props = {
  block: ButtonBlock
  parentRow: RowBlock
  email: Email | null
}

export default function EmailButton({ block, parentRow, email }: Props) {
  const { currentBlock } = useEmailStore()
  const { company } = useChatStore()

  const buttonProps = getButtonProps(block, parentRow, company, email)
  const attributes = getBlockAttributes(block, parentRow, email)
  const { style, ...restButtonProps } = buttonProps

  const {
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    ...restStyles
  } = style || {}

  const divStyle = {
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  }

  const handleSelect = useCallback(() => {
    // The block selection is handled by the parent EmailBlock component
  }, [])

  return (
    // @ts-expect-error align is not a valid prop for the div
    <div style={divStyle} align={attributes.align}>
      <EditableContent
        block={block}
        content={block.attributes.content || ''}
        isSelected={currentBlock?.id === block.id}
        onSelect={handleSelect}
        style={{
          ...restStyles,
          textAlign: 'center',
          backgroundColor: buttonProps.style?.backgroundColor,
          borderRadius: buttonProps.style?.borderRadius,
          border: buttonProps.style?.border,
          color: buttonProps.style?.color,
          paddingTop: marginTop,
          paddingRight: marginRight,
          paddingBottom: marginBottom,
          paddingLeft: marginLeft,
        }}
      />
    </div>
  )
}
