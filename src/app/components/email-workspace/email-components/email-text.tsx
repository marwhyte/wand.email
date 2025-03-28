import { useEmailStore } from '@/lib/stores/emailStore'
import { getTextProps } from '@/lib/utils/attributes'
import { useCallback } from 'react'
import { RowBlock, TextBlock } from '../types'
import EditableContent from './editable-content'

type Props = {
  block: TextBlock
  parentRow: RowBlock
}

export default function EmailText({ block, parentRow }: Props) {
  const { email, currentBlock } = useEmailStore()

  const textProps = getTextProps(block, parentRow, email)
  const { style, ...restTextProps } = textProps

  const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyles } = style || {}

  const divStyle = {
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  }

  const handleSelect = useCallback(() => {
    // The block selection is handled by the parent EmailBlock component
  }, [])

  return (
    <div style={divStyle}>
      <EditableContent
        content={block.attributes.content || ''}
        isSelected={currentBlock?.id === block.id}
        onSelect={handleSelect}
        className="w-full"
        style={restStyles}
      />
    </div>
  )
}
