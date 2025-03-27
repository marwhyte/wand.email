'use client'
import { AnimatePresence, motion } from 'motion/react'

type Props = {
  inputDisabled?: boolean
}

export function BackgroundGradients({ inputDisabled }: Props) {
  // Define animation variants
  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 0.6 }, // Increased opacity for right gradients
    exit: { opacity: 0 },
  }

  // Add animation variants for the gradient movement
  const gradientVariants = {
    animate: {
      scale: [1, 1.3, 0.85, 1.2, 0.9, 1],
      rotate: [0, 10, -10, 5, -5, 0],
      x: [0, 50, -50, 25, -25, 0],
      y: [0, -50, 50, -25, 25, 0],
      transition: {
        duration: 10, // Faster animation
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: 'easeInOut',
      },
    },
  }

  // Second gradient with dramatically increased movement
  const gradientVariants2 = {
    animate: {
      scale: [1, 1.4, 0.8, 1.3, 0.85, 1],
      rotate: [0, -12, 12, -8, 8, 0],
      x: [0, -80, 80, -40, 40, 0],
      y: [0, 80, -80, 40, -40, 0],
      transition: {
        duration: 12,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: 'easeInOut',
      },
    },
  }

  // Third gradient with different animation pattern and more movement
  const gradientVariants3 = {
    animate: {
      scale: [1, 1.25, 0.85, 1.2, 0.9, 1],
      rotate: [0, 8, -10, 6, -8, 0],
      x: [0, 45, -60, 35, -40, 0],
      y: [0, 60, -45, 40, -30, 0],
      transition: {
        duration: 15,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: 'easeInOut',
      },
    },
  }

  // Use a single condition that persists the gradient
  const showGradient = !inputDisabled

  return (
    <AnimatePresence initial={false}>
      {showGradient && (
        <>
          {/* First gradient - removed from left, now mid-right */}
          <motion.div
            variants={fadeVariants}
            initial={!inputDisabled ? 'animate' : 'initial'}
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
            aria-hidden="true"
            className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
          >
            <motion.div
              variants={gradientVariants}
              animate="animate"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%)] top-[calc(15%)] aspect-[1155/678] w-[36rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] sm:w-[75rem] md:left-[calc(60%+5rem)] md:w-[55rem]"
            />
          </motion.div>

          {/* Second gradient - bottom right with more purple */}
          <motion.div
            variants={fadeVariants}
            initial={!inputDisabled ? 'animate' : 'initial'}
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, delay: 0.2 }}
            aria-hidden="true"
            className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
          >
            <motion.div
              variants={gradientVariants2}
              animate="animate"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(70%)] top-[calc(50%)] aspect-[1155/678] w-[40rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] sm:w-[80rem] md:left-[calc(90%+15rem)] md:w-[60rem]"
            />
          </motion.div>

          {/* Third gradient - top right with mixed colors */}
          <motion.div
            variants={fadeVariants}
            initial={!inputDisabled ? 'animate' : 'initial'}
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, delay: 0.3 }}
            aria-hidden="true"
            className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
          >
            <motion.div
              variants={gradientVariants3}
              animate="animate"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(60%)] top-[calc(5%)] aspect-[1155/678] w-[36rem] -translate-x-1/2 bg-gradient-to-tr from-[#9089fc] to-[#ff80b5] sm:w-[75rem] md:left-[calc(95%-2rem)] md:w-[55rem]"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
