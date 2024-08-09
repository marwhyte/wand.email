'use client'

import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { Button } from './button'
import { Text } from './text'

interface NotificationProps {
  title: string
  description?: string
  status: 'success' | 'failure'
  duration?: number
}

export default function Notification({ title, description, status, duration = 5000 }: NotificationProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition show={show}>
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0 dark:bg-gray-800">
              <div className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {status === 'success' ? (
                      <CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-green-400" />
                    ) : (
                      <ExclamationCircleIcon aria-hidden="true" className="h-6 w-6 text-red-400" />
                    )}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <Text className="text-sm font-medium text-white dark:text-gray-200">{title}</Text>
                    {description && <Text className="mt-1 text-sm text-white dark:text-gray-200">{description}</Text>}
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <Button
                      outline
                      type="button"
                      onClick={() => {
                        setShow(false)
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon aria-hidden="true" className="h-5 w-5 !text-black dark:!text-white" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  )
}
