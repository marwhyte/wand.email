import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react'
import { Bars3BottomRightIcon, Bars3CenterLeftIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { AlignmentControlsProps } from './types'

export const AlignmentControls = ({ textAlign, onChange }: AlignmentControlsProps) => {
  return (
    <div className="relative ml-auto w-12">
      <Listbox value={textAlign || 'left'} onChange={(value) => onChange(value as 'left' | 'center' | 'right')}>
        <ListboxButton className="relative w-full cursor-default rounded-lg bg-white px-3 py-2 text-center shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="flex items-center justify-center">
            {textAlign === 'left' && <Bars3CenterLeftIcon className="h-4 w-4" />}
            {textAlign === 'center' && <Bars3Icon className="h-4 w-4" />}
            {textAlign === 'right' && <Bars3BottomRightIcon className="h-4 w-4" />}
          </span>
        </ListboxButton>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <ListboxOptions className="absolute z-50 mt-1 max-h-60 w-max min-w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <ListboxOption
              value="left"
              className={({ selected }) =>
                `relative cursor-default select-none py-2 pl-3 pr-4 ${
                  selected ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                }`
              }
            >
              {({ selected }) => (
                <span className={`flex items-center ${selected ? 'font-medium' : 'font-normal'}`}>
                  <Bars3CenterLeftIcon className="mr-2 h-4 w-4" />
                  Left
                </span>
              )}
            </ListboxOption>
            <ListboxOption
              value="center"
              className={({ selected }) =>
                `relative cursor-default select-none py-2 pl-3 pr-4 ${
                  selected ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                }`
              }
            >
              {({ selected }) => (
                <span className={`flex items-center ${selected ? 'font-medium' : 'font-normal'}`}>
                  <Bars3Icon className="mr-2 h-4 w-4" />
                  Center
                </span>
              )}
            </ListboxOption>
            <ListboxOption
              value="right"
              className={({ selected }) =>
                `relative cursor-default select-none py-2 pl-3 pr-4 ${
                  selected ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                }`
              }
            >
              {({ selected }) => (
                <span className={`flex items-center ${selected ? 'font-medium' : 'font-normal'}`}>
                  <Bars3BottomRightIcon className="mr-2 h-4 w-4" />
                  Right
                </span>
              )}
            </ListboxOption>
          </ListboxOptions>
        </Transition>
      </Listbox>
    </div>
  )
}
