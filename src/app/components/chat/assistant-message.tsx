import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { memo } from 'react'

interface AssistantMessageProps {
  content: string
}

export const AssistantMessage = memo(({ content }: AssistantMessageProps) => {
  // Split content at first EMAIL tag
  const [beforeEmail, afterEmail] = content.split(/<EMAIL\s+[^>]*name=["'][^"']*["'][^>]*>/)

  // If no EMAIL tag found, show full content
  if (!afterEmail) {
    return <div className="w-full overflow-hidden">{content}</div>
  }

  // Check if there's a closing tag
  const hasEmailEnd = afterEmail.includes('</EMAIL>')

  // If closed, show content after closing tag
  const textAfterEnd = hasEmailEnd ? afterEmail.split('</EMAIL>')[1] : ''

  return (
    <div className="w-full overflow-hidden">
      {beforeEmail}
      <div className="my-2 rounded-lg bg-blue-50 p-4">
        <div className="flex flex-col items-center justify-center gap-2">
          {hasEmailEnd ? (
            <>
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
              <span className="text-sm font-medium text-blue-600">Email changes applied successfully</span>
            </>
          ) : (
            <>
              <div className="relative h-6 w-6">
                <div className="absolute inset-0 rounded-full border-2 border-blue-100" />
                <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent" />
              </div>
              <div className="text-sm font-medium text-blue-600">Applying email changes...</div>
            </>
          )}
        </div>
      </div>
      {hasEmailEnd && textAfterEnd}
    </div>
  )
})

AssistantMessage.displayName = 'AssistantMessage'
