import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-2 rounded-lg bg-blue-50 p-4"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          {hasEmailEnd ? (
            <>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
              >
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm font-medium text-blue-600"
              >
                Email changes applied successfully
              </motion.span>
            </>
          ) : (
            <>
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="relative h-6 w-6"
              >
                <div className="absolute inset-0 rounded-full border-2 border-blue-100" />
                <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent" />
              </motion.div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-sm font-medium text-blue-600"
              >
                Applying email changes...
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
      {hasEmailEnd && textAfterEnd}
    </div>
  )
})

AssistantMessage.displayName = 'AssistantMessage'
