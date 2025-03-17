import { modificationsRegex } from '@/constants'
import parse from 'html-react-parser'

interface UserMessageProps {
  content: string
}

export function UserMessage({ content }: UserMessageProps) {
  return <div className="w-full overflow-hidden">{parse(sanitizeUserMessage(content))}</div>
}

function sanitizeUserMessage(content: string) {
  // Remove modification markers
  const withoutModifications = content.replace(modificationsRegex, '').trim()

  // Remove content wrapped in <email_changes> tags
  const withoutEmailChanges = withoutModifications.replace(/<email_changes>[\s\S]*?<\/email_changes>/g, '')

  return withoutEmailChanges
}
