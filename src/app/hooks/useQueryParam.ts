import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'

type QueryParamValue = string | null

export function useQueryParam<T extends QueryParamValue>(
  key: string,
  defaultValue: T,
  validator?: (value: QueryParamValue) => boolean
): [T, (newValue: T) => void] {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialValue = useRef<T | null>(null)

  // Initialize the value only once
  if (initialValue.current === null) {
    const paramValue = searchParams.get(key)
    initialValue.current =
      paramValue !== null && (!validator || validator(paramValue)) ? (paramValue as T) : defaultValue
  }

  const [value, setValue] = useState<T>(initialValue.current)

  const setParam = useCallback(
    (newValue: T) => {
      setValue(newValue)
      const newSearchParams = new URLSearchParams(searchParams)
      if (newValue === null || newValue === '') {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, newValue)
      }
      router.push(`?${newSearchParams.toString()}`, { scroll: false })
    },
    [key, router, searchParams]
  )

  return [value, setParam]
}
