import { useMobileViewStore } from '@/lib/stores/mobleViewStore'
import { generateHeadingProps } from '@/lib/utils/attributes'
import { Heading } from '@react-email/components'
import parse from 'html-react-parser'
import { useSearchParams } from 'next/navigation'

type Props = {
  block: HeadingBlock
}

export default function EmailHeading({ block }: Props) {
  const searchParams = useSearchParams()
  const { mobileView } = useMobileViewStore()

  return <Heading {...generateHeadingProps(block, mobileView)}>{parse(block.content)}</Heading>
}
