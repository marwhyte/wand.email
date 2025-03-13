import { useEmailStore } from '@/lib/stores/emailStore'
import { useMobileViewStore } from '@/lib/stores/mobleViewStore'
import { generateTextProps } from '@/lib/utils/attributes'
import { Text } from '@react-email/components'
import parse from 'html-react-parser'
import { RowBlock, TextBlock } from '../types'

type Props = {
  block: TextBlock
  parentRow: RowBlock
}

export default function EmailText({ block, parentRow }: Props) {
  const { mobileView } = useMobileViewStore()
  const { email } = useEmailStore()

  const options = {
    replace: (domNode: any) => {
      if (domNode.name === 'a' && (!domNode.attribs.style || !domNode.attribs.style.includes('color'))) {
        domNode.attribs.style = `color: ${email?.linkColor ?? '#0066CC'};`
        return domNode
      }
    },
  }

  return <Text {...generateTextProps(block, parentRow, mobileView, email)}>{parse(block.content, options)}</Text>
}
