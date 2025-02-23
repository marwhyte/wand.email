'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

type Props = {
  inputDisabled?: boolean
}

export function BackgroundGradients({ inputDisabled }: Props) {
  const searchParams = useSearchParams()
  const shouldShow = searchParams.get('id') === null

  // Define animation variants
  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 0.3 },
    exit: { opacity: 0 },
  }

  // Use a single condition that persists the gradient
  const showGradient = shouldShow || inputDisabled

  return (
    <AnimatePresence initial={false}>
      {showGradient && (
        <>
          <motion.div
            variants={fadeVariants}
            initial={inputDisabled ? 'animate' : 'initial'}
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
