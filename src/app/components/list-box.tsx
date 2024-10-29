'use client'

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useEffect, useRef, useState } from 'react'

type ComboBoxOption<T extends string = string> = {
  id: T
  label: string
  description?: string
}

type ComboBoxProps<T extends string = string> = {
  options: ComboBoxOption<T>[]
  selected: ComboBoxOption<T> | null
  setSelected: (option: ComboBoxOption<T>) => void
  label?: string
}

export default function ComboBox({ options, selected, setSelected, label }: ComboBoxProps) {
  const [query, setQuery] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [justSelected, setJustSelected] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (justSelected) {
      setTimeout(() => {
        setJustSelected(false)
      }, 100)
    }
  }, [justSelected])

  const filteredOptions =
    query === ''
      ? options
      : options.filter(
          (option) =>
            option.label.toLowerCase().includes(query.toLowerCase()) ||
            (option.description && option.description.toLowerCase().includes(query.toLowerCase()))
        )

  return (
    <Combobox
      as="div"
      value={selected}
      onChange={(option) => {
        setQuery('')
        if (option) {
          setSelected(option)
          setJustSelected(true)
          setTimeout(() => {
            inputRef.current?.blur() // Unfocus the input after a slight delay
          }, 100)
        }
      }}
    >
      <div className="relative mt-2">
        <ComboboxInput
          ref={inputRef}
          onFocus={() => {
            if (!justSelected) {
              setIsActive(true)
            }
            setJustSelected(false)
          }}
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => {
            setIsActive(false)
            setQuery('')
          }}
          displayValue={(option: ComboBoxOption) => option?.label}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </ComboboxButton>

        {filteredOptions.length > 0 && (
          <ComboboxOptions
            onSelect={() => setIsActive(false)}
            static={isActive}
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {filteredOptions.map((option) => (
              <ComboboxOption
                key={option.id}
                value={option}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                      {option.label}
                    </span>
                    {option.description && (
                      <span className={`block text-xs text-gray-500 group-data-[focus]:text-white`}>
                        {option.description}
                      </span>
                    )}
                    {selected ? (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 data-[focus]:text-white">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  )
}
