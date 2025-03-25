import { ArrowRightIcon, StopCircleIcon } from '@heroicons/react/24/solid'
import { AnimatePresence, cubicBezier, motion } from 'motion/react'

interface SendButtonProps {
  show: boolean
  isStreaming?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const customEasingFn = cubicBezier(0.4, 0, 0.2, 1)

export function SendButton({ show, isStreaming, onClick }: SendButtonProps) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          className="transition-theme absolute right-[22px] top-[18px] flex h-[34px] w-[34px] items-center justify-center rounded-md bg-blue-500 p-1 text-white hover:brightness-95"
          transition={{ ease: customEasingFn, duration: 0.17 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onClick={(event) => {
            event.preventDefault()
            onClick?.(event)
          }}
        >
          <div className="text-lg">
            {!isStreaming ? (
              <ArrowRightIcon className="h-5 w-5 text-white" />
            ) : (
              <StopCircleIcon className="h-5 w-5 text-white" />
            )}
          </div>
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}
