import { useEmailStore } from '@/lib/stores/emailStore'
import { getBlockAttributes, getLinkProps } from '@/lib/utils/attributes'
import { useCallback } from 'react'
import { LinkBlock, RowBlock } from '../types'
import EditableContent from './editable-content'

type Props = {
  block: LinkBlock
  parentRow: RowBlock
}

export default function EmailLink({ block, parentRow }: Props) {
  const { email, currentBlock } = useEmailStore()

  const linkProps = getLinkProps(block, parentRow, email)
  const { style, ...restLinkProps } = linkProps
  const blockAttributes = getBlockAttributes(block, parentRow, email)

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
    // @ts-ignore
    <div style={divStyle} align={blockAttributes.align}>
      <EditableContent
        block={block}
        content={block.attributes.content || ''}
        isSelected={currentBlock?.id === block.id}
        onSelect={handleSelect}
        className="w-full"
        style={{
          ...restStyles,
          color: linkProps.style?.color,
        }}
      />
    </div>
  )
}
