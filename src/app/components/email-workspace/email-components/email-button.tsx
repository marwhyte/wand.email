import { useChatStore } from '@/lib/stores/chatStore'
import { getButtonProps } from '@/lib/utils/attributes'
import { getBlockAttributes } from '@/lib/utils/attributes/attributes'
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

  const buttonProps = getButtonProps(block, parentRow, company, email)

  const { style, ...restButtonProps } = buttonProps

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

  const buttonAttributes = getBlockAttributes(block, parentRow, email)

  return (
    // @ts-expect-error align is not a valid prop for the div
    <div align={buttonAttributes.align} style={divStyle}>
      <Button {...restButtonProps} style={buttonStyle} href={undefined}>
        {parse(buttonAttributes.content)}
      </Button>
    </div>
  )
}
