import { modificationsRegex } from '@/constants'
import parse from 'html-react-parser'

interface UserMessageProps {
  content: string
}

export function UserMessage({ content }: UserMessageProps) {
  return <div className="w-full overflow-hidden pt-[4px]">{parse(sanitizeUserMessage(content))}</div>
}

function sanitizeUserMessage(content: string) {
  return content.replace(modificationsRegex, '').trim()
}
