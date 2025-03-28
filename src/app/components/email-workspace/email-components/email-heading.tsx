import { useEmailSave } from '@/app/hooks/useEmailSave'
import { useEmailStore } from '@/lib/stores/emailStore'
import { getHeadingProps } from '@/lib/utils/attributes'
import { useCallback } from 'react'
import { HeadingBlock, RowBlock } from '../types'
import EditableContent from './editable-content'

type Props = {
  block: HeadingBlock
  parentRow: RowBlock
}

export default function EmailHeading({ block, parentRow }: Props) {
  const { email, currentBlock } = useEmailStore()
  const saveEmail = useEmailSave()

  const headingProps = getHeadingProps(block, parentRow, email)
  const { style, ...restHeadingProps } = headingProps

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
