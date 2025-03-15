import { useChatStore } from '@/lib/stores/chatStore'
import { useMobileViewStore } from '@/lib/stores/mobleViewStore'
import { generateButtonProps } from '@/lib/utils/attributes'
import { Button } from '@react-email/components'
import parse from 'html-react-parser'
import { ButtonBlock, RowBlock } from '../types'

type Props = {
  block: ButtonBlock
  parentRow: RowBlock
}

export default function EmailButton({ block, parentRow }: Props) {
  const { mobileView } = useMobileViewStore()
  const { company } = useChatStore()

  const buttonProps = generateButtonProps(block, parentRow, company, mobileView)

  // Extract align and style properties
  // @ts-expect-error
  const { align, style, ...buttonPropsWithoutAlignAndStyle } = buttonProps

  // Extract padding-related styles for the div
  const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyles } = style || {}

  // Create div style with padding properties
  const divStyle = {
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  }

  return (
    // @ts-expect-error
    <div align={align} style={divStyle}>
      <Button {...buttonPropsWithoutAlignAndStyle} style={restStyles} href={undefined}>
        {parse(block.attributes.content)}
      </Button>
    </div>
  )
}
