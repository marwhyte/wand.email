import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react'
import { Bars2Icon, Bars3Icon, BarsArrowDownIcon, BarsArrowUpIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { LineHeightControlsProps } from './types'

export const LineHeightControls = ({ lineHeight, onChange }: LineHeightControlsProps) => {
  const getLineHeightValue = () => {
    if (lineHeight === '100%') return 'small'
    if (lineHeight === '120%') return 'medium'
    if (lineHeight === '180%') return 'large'
    if (lineHeight === '200%') return 'extra-large'
    return 'medium'
  }

  const handleLineHeightChange = (value: string) => {
    let newLineHeight = '150%'
    if (value === 'small') newLineHeight = '100%'
    if (value === 'medium') newLineHeight = '120%'
    if (value === 'large') newLineHeight = '180%'
    if (value === 'extra-large') newLineHeight = '200%'
    onChange(newLineHeight)
  }

  return (
    <div className="relative ml-auto w-12">
      <Listbox value={getLineHeightValue()} onChange={handleLineHeightChange}>
        <ListboxButton className="relative w-full cursor-default rounded-lg bg-white px-3 py-2 text-center shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="flex items-center justify-center">
            {(lineHeight === '100%' || !lineHeight) && <BarsArrowDownIcon className="h-4 w-4" />}
            {lineHeight === '120%' && <Bars2Icon className="h-4 w-4" />}
            {lineHeight === '180%' && <Bars3Icon className="h-4 w-4" />}
            {lineHeight === '200%' && <BarsArrowUpIcon className="h-4 w-4" />}
          </span>
        </ListboxButton>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <ListboxOptions className="absolute z-50 mt-1 max-h-60 w-max min-w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <ListboxOption
              value="small"
              className={({ selected }) =>
                `relative cursor-default select-none py-2 pl-3 pr-4 ${
                  selected ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                }`
              }
            >
              {({ selected }) => (
                <span className={`flex items-center ${selected ? 'font-medium' : 'font-normal'}`}>
                  <BarsArrowDownIcon className="mr-2 h-4 w-4" />
                  Small
                </span>
              )}
            </ListboxOption>
            <ListboxOption
              value="medium"
              className={({ selected }) =>
                `relative cursor-default select-none py-2 pl-3 pr-4 ${
                  selected ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                }`
              }
            >
              {({ selected }) => (
                <span className={`flex items-center ${selected ? 'font-medium' : 'font-normal'}`}>
                  <Bars2Icon className="mr-2 h-4 w-4" />
                  Medium
                </span>
              )}
            </ListboxOption>
            <ListboxOption
              value="large"
              className={({ selected }) =>
                `relative cursor-default select-none py-2 pl-3 pr-4 ${
                  selected ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                }`
              }
            >
              {({ selected }) => (
                <span className={`flex items-center ${selected ? 'font-medium' : 'font-normal'}`}>
                  <Bars3Icon className="mr-2 h-4 w-4" />
                  Large
                </span>
              )}
            </ListboxOption>
            <ListboxOption
              value="extra-large"
              className={({ selected }) =>
                `relative cursor-default select-none py-2 pl-3 pr-4 ${
                  selected ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                }`
              }
            >
              {({ selected }) => (
                <span className={`flex items-center ${selected ? 'font-medium' : 'font-normal'}`}>
                  <BarsArrowUpIcon className="mr-2 h-4 w-4" />
                  XL
                </span>
              )}
            </ListboxOption>
          </ListboxOptions>
        </Transition>
      </Listbox>
    </div>
  )
}
