import { generateTextProps } from '@/lib/utils/attributes'
import { Text } from '@react-email/components'
import parse from 'html-react-parser'
import { useSearchParams } from 'next/navigation'

type Props = {
  block: TextBlock
}

export default function EmailText({ block }: Props) {
  const searchParams = useSearchParams()
  const mobileView = searchParams.get('mobileView') === 'true'

  return <Text {...generateTextProps(block, mobileView)}>{parse(block.content)}</Text>
}
