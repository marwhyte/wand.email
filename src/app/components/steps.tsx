import { CheckCircleIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useState } from 'react'
import { Button } from './button'
import { Text } from './text'

interface Step {
  name: string
}

interface StepsProps {
  onFinish: () => void
  steps: Step[]
  height?: '500px' | '450px'
  children: (currentStep: Step) => ReactNode
}

export const Steps: React.FC<StepsProps> = ({ steps, children, height = '500px', onFinish }) => {
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
    <div className={`flex ${height === '450px' ? 'min-h-[450px]' : 'min-h-[500px]'} flex-col`}>
      <nav aria-label="Progress" className="mb-6 flex items-center justify-center">
        <div className="flex items-center">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex
            const isCurrent = index === currentStepIndex
            return (
              <React.Fragment key={step.name}>
                {index > 0 && (
                  <div className="relative mx-4 h-0.5 w-24 bg-gray-300">
                    <div
                      className={`absolute left-0 top-0 h-full transition-all duration-300 ease-in-out ${
                        isCompleted ? 'w-full bg-green-500' : isCurrent ? 'animate-grow-width w-0 bg-purple-500' : 'w-0'
                      }`}
                    />
                  </div>
                )}
                <div className="flex flex-col items-center">
                  {isCompleted ? (
                    <CheckCircleIcon className="size-4 text-green-500" />
                  ) : (
                    <div className="flex h-4 w-4 items-center justify-center rounded-full">
                      <Text className={`text-base font-bold ${isCurrent ? 'text-purple-500' : ''}`}>{index + 1}</Text>
                    </div>
                  )}
                  <Text className={`text-base font-bold ${isCurrent ? 'text-purple-500' : ''}`}>{step.name}</Text>
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </nav>

      <div className="mx-8 flex flex-grow justify-center">
        <div className="w-full">{children(currentStep)}</div>
      </div>

      <div className="flex justify-center gap-4">
        {currentStepIndex > 0 && (
          <Button className="w-full" onClick={handlePrevious} disabled={currentStepIndex === 0} color="grey">
            Previous: {steps[currentStepIndex - 1].name}
          </Button>
        )}
        <Button type="submit" className="w-full" onClick={handleNext} color="purple">
          {currentStepIndex === steps.length - 1 ? 'Finish' : `Next: ${steps[currentStepIndex + 1].name}`}
        </Button>
      </div>
    </div>
  )
}
