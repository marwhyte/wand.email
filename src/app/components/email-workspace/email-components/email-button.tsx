import { useChatStore } from '@/lib/stores/chatStore'
import { generateButtonProps } from '@/lib/utils/attributes'
import { Button } from '@react-email/components'
import parse from 'html-react-parser'
import { ButtonBlock, Email, RowBlock } from '../types'

type Props = {
  block: ButtonBlock
  parentRow: RowBlock
  email: Email | null
}

export default function EmailButton({ block, parentRow, email }: Props) {
  const { company } = useChatStore()

  const buttonProps = generateButtonProps(block, parentRow, company, email)

  // Extract align and style properties
  // @ts-expect-error
  const { align, style, ...buttonPropsWithoutAlignAndStyle } = buttonProps

  const {
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    ...restStyles
  } = style || {}

  // Create div style with padding properties
  const divStyle = {
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  }

  const buttonStyle = {
    ...restStyles,
    paddingTop: marginTop,
    paddingRight: marginRight,
    paddingBottom: marginBottom,
    paddingLeft: marginLeft,
  }

  return (
    // @ts-expect-error
    <div align={align} style={divStyle}>
      <Button {...buttonPropsWithoutAlignAndStyle} style={buttonStyle} href={undefined}>
        {parse(block.attributes.content)}
      </Button>
    </div>
  )
}
