import React, { ReactNode, useState } from 'react'
import { Button } from './button'

interface Step {
  name: string
}

interface StepsProps {
  onFinish: () => void
  steps: Step[]
  children: (currentStep: Step) => ReactNode
}

export const Steps: React.FC<StepsProps> = ({ steps, children, onFinish }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const currentStep = steps[currentStepIndex]

  const handlePrevious = () => {
    setCurrentStepIndex((prevIndex) => Math.max(0, prevIndex - 1))
  }

  const handleNext = () => {
    if (currentStepIndex === steps.length - 1) {
      onFinish()
    } else {
      setCurrentStepIndex((prevIndex) => Math.min(steps.length - 1, prevIndex + 1))
    }
  }

  return (
    <div>
      <nav aria-label="Progress" className="mb-6 flex items-center justify-center">
        <p className="text-sm font-medium">
          Step {currentStepIndex + 1} of {steps.length}
        </p>
        <ol role="list" className="ml-8 flex items-center space-x-5">
          {steps.map((step, index) => (
            <li key={step.name}>
              <button
                onClick={() => setCurrentStepIndex(index)}
                className={`block h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  index === currentStepIndex
                    ? 'bg-indigo-600'
                    : index < currentStepIndex
                      ? 'bg-indigo-600 hover:bg-indigo-900'
                      : 'bg-gray-200 hover:bg-gray-400'
                }`}
              >
                <span className="sr-only">{step.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mb-8">{children(currentStep)}</div>

      <div className="mx-auto flex max-w-sm justify-center gap-4">
        <Button className="w-full" onClick={handlePrevious} disabled={currentStepIndex === 0} color="grey">
          Previous
        </Button>
        <Button className="w-full" onClick={handleNext} color="purple">
          {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
