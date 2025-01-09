import parse from 'html-react-parser'
import { memo } from 'react'

interface AssistantMessageProps {
  content: string
}

export const AssistantMessage = memo(({ content }: AssistantMessageProps) => {
  return <div className="w-full overflow-hidden">{parse(content)}</div>
})

AssistantMessage.displayName = 'AssistantMessage'
